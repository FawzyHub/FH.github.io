module "fawzy-ui" {
  source                 = "git@github.com:moe-ky/tf-modules.git//ui-infra/"
  domain_name            = "fawzy-server.com"
  s3_origin_name         = "fawzy-server"
  branch_name            = var.branch_name
}

output "main_ui_aws_cloudfront_distribution_id" {
  value = module.fawzy-ui.aws_cloudfront_distribution_id
}
