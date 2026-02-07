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
