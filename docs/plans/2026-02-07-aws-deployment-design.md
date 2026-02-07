# Design: AWS Deployment for ownvsrent.io

**Date:** 2026-02-07
**Status:** Approved

## Summary

Deploy ownvsrent.io to AWS using Terraform for infrastructure management. Frontend on S3 + CloudFront, backend on EC2.

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| IaC Tool | Terraform | User preference, widely used, cloud-agnostic |
| Frontend Hosting | S3 + CloudFront | Static files with global CDN, HTTPS via ACM |
| Backend Hosting | EC2 t3.micro | Low latency, no cold starts, free tier eligible |
| SSL (Frontend) | ACM Certificate | Free, auto-renewed by AWS |
| SSL (Backend) | Let's Encrypt + Certbot | Free, auto-renewed via cron |
| DNS | Route 53 | Domain already registered there |
| Environment | Production only | Simpler, can add staging later |

---

## Architecture

```
                    ┌─────────────────────────────────────────────────────────┐
                    │                      Route 53                           │
                    │         ownvsrent.io → CloudFront                       │
                    │     api.ownvsrent.io → EC2 Elastic IP                   │
                    └─────────────────────────────────────────────────────────┘
                                          │
                    ┌─────────────────────┴─────────────────────┐
                    │                                           │
                    ▼                                           ▼
    ┌───────────────────────────────┐         ┌───────────────────────────────┐
    │         CloudFront            │         │           EC2                 │
    │    (CDN + HTTPS termination)  │         │     t3.micro (free tier)      │
    │              │                │         │                               │
    │              ▼                │         │   ┌─────────────────────┐     │
    │       S3 Bucket               │         │   │   Nginx (reverse    │     │
    │   (React static files)        │         │   │   proxy + SSL)      │     │
    │                               │         │   └──────────┬──────────┘     │
    └───────────────────────────────┘         │              │                │
                                              │              ▼                │
                                              │   ┌─────────────────────┐     │
                                              │   │   Uvicorn           │     │
                                              │   │   (FastAPI app)     │     │
                                              │   └─────────────────────┘     │
                                              └───────────────────────────────┘
```

---

## Terraform Structure

```
ownvsrent/
└── infrastructure/
    ├── main.tf              # Provider config, backend state
    ├── variables.tf         # Input variables
    ├── outputs.tf           # Outputs (URLs, IPs)
    ├── s3.tf                # S3 bucket for frontend
    ├── cloudfront.tf        # CloudFront distribution
    ├── acm.tf               # SSL certificate for CloudFront
    ├── ec2.tf               # EC2 instance + security group
    ├── route53.tf           # DNS records
    ├── iam.tf               # IAM roles/policies
    ├── terraform.tfvars     # Variable values (gitignored)
    └── scripts/
        └── user_data.sh     # EC2 bootstrap script
```

### State Management

Remote state stored in S3 with DynamoDB locking:
- S3 bucket: `ownvsrent-terraform-state`
- DynamoDB table: `ownvsrent-terraform-locks`

### Variables

```hcl
variable "domain_name" {
  default = "ownvsrent.io"
}

variable "aws_region" {
  default = "us-east-1"  # Required for ACM + CloudFront
}

variable "ec2_instance_type" {
  default = "t3.micro"
}
```

---

## EC2 Configuration

### Bootstrap Script (user_data.sh)

Installs:
- Amazon Linux 2023 extras
- Python 3.12
- UV package manager
- Nginx
- Certbot (Let's Encrypt)
- Git

Creates:
- `/opt/ownvsrent` - Application directory
- Systemd service `ownvsrent.service` for uvicorn
- Nginx config as reverse proxy

### Security Group

| Port | Source | Purpose |
|------|--------|---------|
| 22 | Your IP | SSH access |
| 80 | 0.0.0.0/0 | HTTP (redirects to HTTPS) |
| 443 | 0.0.0.0/0 | HTTPS |

### Systemd Service

```ini
[Unit]
Description=ownvsrent FastAPI
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/opt/ownvsrent/backend
ExecStart=/home/ec2-user/.local/bin/uv run uvicorn ownvsrent.main:app --host 127.0.0.1 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

---

## Deployment Workflows

### Backend Deployment

```bash
# SSH to EC2
ssh ec2-user@api.ownvsrent.io

# Deploy
cd /opt/ownvsrent
git pull origin main
cd backend
uv sync --all-extras
sudo systemctl restart ownvsrent
```

### Frontend Deployment

```bash
# Build locally
cd frontend
npm run build

# Deploy to S3
aws s3 sync dist/ s3://ownvsrent-frontend --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_DIST_ID \
  --paths "/*"
```

---

## SSL Certificates

### Frontend (CloudFront)

- **Provider:** AWS Certificate Manager (ACM)
- **Domain:** ownvsrent.io, www.ownvsrent.io
- **Renewal:** Automatic by AWS
- **Validation:** DNS validation via Route 53

### Backend (EC2)

- **Provider:** Let's Encrypt via Certbot
- **Domain:** api.ownvsrent.io
- **Renewal:** Automatic via cron (certbot renew)
- **Nginx:** Configured to use certificates from `/etc/letsencrypt/live/`

---

## DNS Records (Route 53)

| Record | Type | Value |
|--------|------|-------|
| ownvsrent.io | A (Alias) | CloudFront distribution |
| www.ownvsrent.io | A (Alias) | CloudFront distribution |
| api.ownvsrent.io | A | EC2 Elastic IP |

---

## Estimated Costs

| Service | Monthly Cost | Notes |
|---------|--------------|-------|
| EC2 t3.micro | $0 / ~$8.50 | Free tier first 12 months |
| S3 | ~$0.50 | Static file storage |
| CloudFront | ~$1-5 | 1TB free tier |
| Route 53 | ~$0.50 | Hosted zone + queries |
| Elastic IP | $0 | Free when attached |
| ACM | $0 | Free for CloudFront |
| **Year 1 Total** | **~$2-6/mo** | With free tier |
| **After Year 1** | **~$10-15/mo** | Without free tier |

---

## Implementation Steps

1. Create S3 bucket for Terraform state
2. Create DynamoDB table for state locking
3. Write Terraform configuration files
4. Run `terraform init` and `terraform plan`
5. Run `terraform apply` to provision infrastructure
6. SSH to EC2, clone repo, start application
7. Run Certbot to obtain SSL certificate
8. Deploy frontend to S3
9. Verify both endpoints work with HTTPS
10. Update CORS in FastAPI for production domain

---

## Future Enhancements

- **CI/CD:** GitHub Actions for automated deployments
- **Monitoring:** CloudWatch alarms for EC2 health
- **Backups:** Automated EC2 snapshots
- **Staging:** Separate environment for testing
- **Lambda Migration:** Move backend to Lambda when ready
