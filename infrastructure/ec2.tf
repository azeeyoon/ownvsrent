resource "aws_key_pair" "deployer" {
  key_name   = "ownvsrent-deployer"
  public_key = var.ssh_public_key
}

resource "aws_security_group" "api" {
  name        = "ownvsrent-api-sg"
  description = "Security group for ownvsrent API server"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH access"
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP access"
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS access"
  }

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

resource "aws_eip" "api" {
  instance = aws_instance.api.id
  domain   = "vpc"

  tags = {
    Name = "ownvsrent-api-eip"
  }
}
