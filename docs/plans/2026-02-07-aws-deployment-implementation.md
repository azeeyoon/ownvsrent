# AWS Deployment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deploy ownvsrent.io to AWS with Terraform — frontend on S3+CloudFront, backend on EC2.

**Architecture:** Terraform provisions all infrastructure. Frontend static files served via CloudFront CDN with ACM SSL. Backend runs on EC2 with Nginx reverse proxy and Let's Encrypt SSL.

**Tech Stack:** Terraform, AWS (S3, CloudFront, EC2, Route 53, ACM, IAM), Nginx, Certbot

---

## Task 1: Create Terraform State Infrastructure

**Files:**
- Create: `infrastructure/state-bootstrap/main.tf`

**Step 1: Create state bootstrap directory**

```bash
cd "/Users/jun/jun/side projects/ownvsrent"
mkdir -p infrastructure/state-bootstrap
```

**Step 2: Create `infrastructure/state-bootstrap/main.tf`**

```hcl
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "ownvsrent-terraform-state"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_dynamodb_table" "terraform_locks" {
  name         = "ownvsrent-terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}

output "state_bucket" {
  value = aws_s3_bucket.terraform_state.bucket
}

output "dynamodb_table" {
  value = aws_dynamodb_table.terraform_locks.name
}
```

**Step 3: Initialize and apply state bootstrap**

```bash
cd "/Users/jun/jun/side projects/ownvsrent/infrastructure/state-bootstrap"
terraform init
terraform apply -auto-approve
```

Expected: S3 bucket and DynamoDB table created

**Step 4: Commit**

```bash
cd "/Users/jun/jun/side projects/ownvsrent"
git add infrastructure/
git commit -m "infra: add Terraform state bootstrap

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Create Main Terraform Configuration

**Files:**
- Create: `infrastructure/main.tf`
- Create: `infrastructure/variables.tf`
- Create: `infrastructure/outputs.tf`

**Step 1: Create `infrastructure/variables.tf`**

```hcl
variable "domain_name" {
  description = "Primary domain name"
  type        = string
  default     = "ownvsrent.io"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "ec2_instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "ssh_public_key" {
  description = "SSH public key for EC2 access"
  type        = string
}
```

**Step 2: Create `infrastructure/main.tf`**

```hcl
terraform {
  required_version = ">= 1.0"

  backend "s3" {
    bucket         = "ownvsrent-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "ownvsrent-terraform-locks"
    encrypt        = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Data source for Route 53 hosted zone
data "aws_route53_zone" "main" {
  name = var.domain_name
}

# Data source for latest Amazon Linux 2023 AMI
data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}
```

**Step 3: Create `infrastructure/outputs.tf`**

```hcl
output "frontend_url" {
  description = "Frontend URL"
  value       = "https://${var.domain_name}"
}

output "api_url" {
  description = "API URL"
  value       = "https://api.${var.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID for cache invalidation"
  value       = aws_cloudfront_distribution.frontend.id
}

output "s3_bucket_name" {
  description = "S3 bucket name for frontend deployment"
  value       = aws_s3_bucket.frontend.bucket
}

output "ec2_public_ip" {
  description = "EC2 public IP"
  value       = aws_eip.api.public_ip
}

output "ec2_instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.api.id
}
```

**Step 4: Commit**

```bash
cd "/Users/jun/jun/side projects/ownvsrent"
git add infrastructure/
git commit -m "infra: add main Terraform config with variables and outputs

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Create S3 and CloudFront Configuration

**Files:**
- Create: `infrastructure/s3.tf`
- Create: `infrastructure/cloudfront.tf`
- Create: `infrastructure/acm.tf`

**Step 1: Create `infrastructure/acm.tf`**

```hcl
# SSL Certificate for CloudFront (must be in us-east-1)
resource "aws_acm_certificate" "frontend" {
  domain_name               = var.domain_name
  subject_alternative_names = ["www.${var.domain_name}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "acm_validation" {
  for_each = {
    for dvo in aws_acm_certificate.frontend.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.main.zone_id
}

resource "aws_acm_certificate_validation" "frontend" {
  certificate_arn         = aws_acm_certificate.frontend.arn
  validation_record_fqdns = [for record in aws_route53_record.acm_validation : record.fqdn]
}
```

**Step 2: Create `infrastructure/s3.tf`**

```hcl
resource "aws_s3_bucket" "frontend" {
  bucket = "ownvsrent-frontend"
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontAccess"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.frontend.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.frontend.arn
          }
        }
      }
    ]
  })
}
```

**Step 3: Create `infrastructure/cloudfront.tf`**

```hcl
resource "aws_cloudfront_origin_access_control" "frontend" {
  name                              = "ownvsrent-frontend-oac"
  description                       = "OAC for ownvsrent frontend"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases             = [var.domain_name, "www.${var.domain_name}"]
  price_class         = "PriceClass_100"

  origin {
    domain_name              = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.frontend.bucket}"
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.frontend.bucket}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  # Handle SPA routing - serve index.html for 404s
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.frontend.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  depends_on = [aws_acm_certificate_validation.frontend]
}
```

**Step 4: Commit**

```bash
cd "/Users/jun/jun/side projects/ownvsrent"
git add infrastructure/
git commit -m "infra: add S3, CloudFront, and ACM certificate config

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Create EC2 Configuration

**Files:**
- Create: `infrastructure/ec2.tf`
- Create: `infrastructure/scripts/user_data.sh`

**Step 1: Create scripts directory**

```bash
mkdir -p "/Users/jun/jun/side projects/ownvsrent/infrastructure/scripts"
```

**Step 2: Create `infrastructure/scripts/user_data.sh`**

```bash
#!/bin/bash
set -e

# Update system
dnf update -y

# Install dependencies
dnf install -y git nginx python3.12 python3.12-pip

# Install UV
curl -LsSf https://astral.sh/uv/install.sh | sh
echo 'export PATH="$HOME/.local/bin:$PATH"' >> /home/ec2-user/.bashrc

# Install Certbot
dnf install -y certbot python3-certbot-nginx

# Create application directory
mkdir -p /opt/ownvsrent
chown ec2-user:ec2-user /opt/ownvsrent

# Create systemd service for the app
cat > /etc/systemd/system/ownvsrent.service << 'SERVICEEOF'
[Unit]
Description=ownvsrent FastAPI Application
After=network.target

[Service]
User=ec2-user
Group=ec2-user
WorkingDirectory=/opt/ownvsrent/backend
Environment="PATH=/home/ec2-user/.local/bin:/usr/local/bin:/usr/bin:/bin"
ExecStart=/home/ec2-user/.local/bin/uv run uvicorn ownvsrent.main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
SERVICEEOF

# Create initial Nginx config (will be updated by Certbot)
cat > /etc/nginx/conf.d/ownvsrent.conf << 'NGINXEOF'
server {
    listen 80;
    server_name api.ownvsrent.io;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINXEOF

# Start Nginx
systemctl enable nginx
systemctl start nginx

# Reload systemd
systemctl daemon-reload

echo "User data script completed successfully"
```

**Step 3: Create `infrastructure/ec2.tf`**

```hcl
# SSH Key Pair
resource "aws_key_pair" "deployer" {
  key_name   = "ownvsrent-deployer"
  public_key = var.ssh_public_key
}

# Security Group
resource "aws_security_group" "api" {
  name        = "ownvsrent-api-sg"
  description = "Security group for ownvsrent API server"

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH access"
  }

  # HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP access"
  }

  # HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS access"
  }

  # Outbound
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ownvsrent-api-sg"
  }
}

# EC2 Instance
resource "aws_instance" "api" {
  ami           = data.aws_ami.amazon_linux_2023.id
  instance_type = var.ec2_instance_type
  key_name      = aws_key_pair.deployer.key_name

  vpc_security_group_ids = [aws_security_group.api.id]

  user_data = file("${path.module}/scripts/user_data.sh")

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  tags = {
    Name = "ownvsrent-api"
  }
}

# Elastic IP
resource "aws_eip" "api" {
  instance = aws_instance.api.id
  domain   = "vpc"

  tags = {
    Name = "ownvsrent-api-eip"
  }
}
```

**Step 4: Commit**

```bash
cd "/Users/jun/jun/side projects/ownvsrent"
git add infrastructure/
git commit -m "infra: add EC2 instance with security group and user data

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Create Route 53 DNS Records

**Files:**
- Create: `infrastructure/route53.tf`

**Step 1: Create `infrastructure/route53.tf`**

```hcl
# Frontend DNS - apex domain
resource "aws_route53_record" "frontend_apex" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.frontend.domain_name
    zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id
    evaluate_target_health = false
  }
}

# Frontend DNS - www subdomain
resource "aws_route53_record" "frontend_www" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.frontend.domain_name
    zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id
    evaluate_target_health = false
  }
}

# API DNS
resource "aws_route53_record" "api" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "api.${var.domain_name}"
  type    = "A"
  ttl     = 300
  records = [aws_eip.api.public_ip]
}
```

**Step 2: Commit**

```bash
cd "/Users/jun/jun/side projects/ownvsrent"
git add infrastructure/
git commit -m "infra: add Route 53 DNS records for frontend and API

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Create terraform.tfvars and .gitignore

**Files:**
- Create: `infrastructure/terraform.tfvars`
- Create: `infrastructure/.gitignore`

**Step 1: Get SSH public key**

```bash
cat ~/.ssh/id_rsa.pub || cat ~/.ssh/id_ed25519.pub
```

Copy the output for the next step.

**Step 2: Create `infrastructure/terraform.tfvars`**

```hcl
domain_name       = "ownvsrent.io"
aws_region        = "us-east-1"
ec2_instance_type = "t3.micro"
ssh_public_key    = "YOUR_SSH_PUBLIC_KEY_HERE"
```

Replace `YOUR_SSH_PUBLIC_KEY_HERE` with the actual public key.

**Step 3: Create `infrastructure/.gitignore`**

```gitignore
# Terraform
*.tfstate
*.tfstate.*
.terraform/
.terraform.lock.hcl
crash.log
crash.*.log

# Sensitive files
terraform.tfvars
*.auto.tfvars

# Override files
override.tf
override.tf.json
*_override.tf
*_override.tf.json
```

**Step 4: Commit .gitignore only (tfvars is gitignored)**

```bash
cd "/Users/jun/jun/side projects/ownvsrent"
git add infrastructure/.gitignore
git commit -m "infra: add Terraform .gitignore

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Initialize and Apply Terraform

**Step 1: Initialize Terraform**

```bash
cd "/Users/jun/jun/side projects/ownvsrent/infrastructure"
terraform init
```

Expected: Successful initialization with S3 backend

**Step 2: Validate configuration**

```bash
terraform validate
```

Expected: "Success! The configuration is valid."

**Step 3: Plan the deployment**

```bash
terraform plan -out=tfplan
```

Expected: Shows resources to be created (S3, CloudFront, EC2, Route 53, ACM)

**Step 4: Apply the deployment**

```bash
terraform apply tfplan
```

Expected: All resources created successfully. Note the outputs:
- `cloudfront_distribution_id`
- `s3_bucket_name`
- `ec2_public_ip`

**Step 5: Wait for ACM certificate validation**

The ACM certificate needs DNS validation. This can take 5-30 minutes.

```bash
aws acm describe-certificate --certificate-arn $(terraform output -raw acm_certificate_arn 2>/dev/null || echo "check-console") --query 'Certificate.Status'
```

Wait until status is "ISSUED".

---

## Task 8: Deploy Backend to EC2

**Step 1: Get EC2 IP and SSH in**

```bash
cd "/Users/jun/jun/side projects/ownvsrent/infrastructure"
EC2_IP=$(terraform output -raw ec2_public_ip)
echo "EC2 IP: $EC2_IP"
ssh -o StrictHostKeyChecking=no ec2-user@$EC2_IP
```

**Step 2: On EC2 - Clone repository and install dependencies**

```bash
cd /opt/ownvsrent
git clone https://github.com/YOUR_USERNAME/ownvsrent.git . || git pull origin main
cd backend
/home/ec2-user/.local/bin/uv sync --all-extras
```

**Step 3: On EC2 - Start the application**

```bash
sudo systemctl enable ownvsrent
sudo systemctl start ownvsrent
sudo systemctl status ownvsrent
```

Expected: Service is running

**Step 4: On EC2 - Set up SSL with Certbot**

```bash
sudo certbot --nginx -d api.ownvsrent.io --non-interactive --agree-tos --email your-email@example.com
```

Expected: SSL certificate obtained and Nginx configured

**Step 5: On EC2 - Verify API is working**

```bash
curl https://api.ownvsrent.io/health
```

Expected: `{"status":"healthy"}`

**Step 6: Exit EC2**

```bash
exit
```

---

## Task 9: Deploy Frontend to S3

**Step 1: Update frontend API URL for production**

Create `frontend/.env.production`:

```bash
cd "/Users/jun/jun/side projects/ownvsrent/frontend"
echo "VITE_API_URL=https://api.ownvsrent.io" > .env.production
```

**Step 2: Build frontend**

```bash
cd "/Users/jun/jun/side projects/ownvsrent/frontend"
npm run build
```

**Step 3: Deploy to S3**

```bash
cd "/Users/jun/jun/side projects/ownvsrent/infrastructure"
BUCKET=$(terraform output -raw s3_bucket_name)
aws s3 sync ../frontend/dist/ s3://$BUCKET --delete
```

**Step 4: Invalidate CloudFront cache**

```bash
DIST_ID=$(terraform output -raw cloudfront_distribution_id)
aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"
```

**Step 5: Commit production env file**

```bash
cd "/Users/jun/jun/side projects/ownvsrent"
git add frontend/.env.production
git commit -m "feat: add production environment config

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 10: Update Backend CORS for Production

**Files:**
- Modify: `backend/src/ownvsrent/main.py`

**Step 1: Update CORS in main.py**

Update the CORS middleware to include production domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",      # Vite dev server
        "https://ownvsrent.io",       # Production
        "https://www.ownvsrent.io",   # Production www
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Step 2: Commit**

```bash
cd "/Users/jun/jun/side projects/ownvsrent"
git add backend/
git commit -m "feat: add production domains to CORS config

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

**Step 3: Deploy updated backend to EC2**

```bash
EC2_IP=$(cd infrastructure && terraform output -raw ec2_public_ip)
ssh ec2-user@$EC2_IP "cd /opt/ownvsrent && git pull origin main && cd backend && /home/ec2-user/.local/bin/uv sync && sudo systemctl restart ownvsrent"
```

---

## Task 11: Final Verification

**Step 1: Test frontend**

Open in browser: https://ownvsrent.io

Expected: Shows the styled "ownvsrent.io" header page

**Step 2: Test API health**

```bash
curl https://api.ownvsrent.io/health
```

Expected: `{"status":"healthy"}`

**Step 3: Test API docs**

Open in browser: https://api.ownvsrent.io/docs

Expected: Swagger UI loads

**Step 4: Test CORS (frontend calling API)**

Open browser dev console on https://ownvsrent.io and run:

```javascript
fetch('https://api.ownvsrent.io/health').then(r => r.json()).then(console.log)
```

Expected: `{status: "healthy"}` without CORS errors

**Step 5: Commit any final changes**

```bash
cd "/Users/jun/jun/side projects/ownvsrent"
git status
# If there are changes:
git add .
git commit -m "chore: deployment complete

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Summary

After completing all tasks:

| Endpoint | URL | Status |
|----------|-----|--------|
| Frontend | https://ownvsrent.io | Live |
| Frontend (www) | https://www.ownvsrent.io | Live |
| API | https://api.ownvsrent.io | Live |
| API Docs | https://api.ownvsrent.io/docs | Live |

**Deployment commands for future updates:**

```bash
# Frontend
cd frontend && npm run build
cd ../infrastructure
aws s3 sync ../frontend/dist/ s3://$(terraform output -raw s3_bucket_name) --delete
aws cloudfront create-invalidation --distribution-id $(terraform output -raw cloudfront_distribution_id) --paths "/*"

# Backend
ssh ec2-user@api.ownvsrent.io "cd /opt/ownvsrent && git pull && cd backend && uv sync && sudo systemctl restart ownvsrent"
```
