module "api_gateway" {
  source              = "git@github.com:moe-ky/tf-modules.git//api-gateway/"
  api_gateway_name    = "fawzy-server-api"
  protocol_type       = "HTTP"
  allow_headers       = ["*"]
  allow_methods       = ["GET", "PUT", "POST", "OPTIONS"]
  allow_origins       = var.branch_name == "master" ? local.prod_host : local.dev_host
  max_age             = 3000
  allow_credentials   = true
  stage_name          = "v1"
  api_enable_domain   = false
  auto_deploy         = true
  api_certificate_arn = null
  zone_id             = null
  api_domain_name     = null
  cw_log_group_name   = "/aws/vendedlogs/api-gw/fawzy-server-api/logs"
  access_log_format   = "$context.identity.sourceIp,$context.requestTime,$context.httpMethod,$context.routeKey,$context.protocol,$context.status,$context.responseLength,$context.requestId,$context.resourcePath,$input.body,$context.authorizer.error,$context.domainName"
}

variable "routes" {
  description = "Map of route paths to their respective descriptions."
  type = map(object({
    description = string
    method      = string
  }))
  default = {
    "list/items" = {
      description = "get list of items",
      method      = "POST",
    },
    "save/item" = {
      description = "save a menu item",
      method      = "POST",
    },
  }
}

module "api_routes" {
  source                    = "git@github.com:moe-ky/tf-modules.git//api-gateway-integration/"
  for_each                  = var.routes
  api_gateway_id            = module.api_gateway.gateway_id
  description               = each.value.description
  integration_method        = each.value.method
  lambda_invoke_arn         = module.task_api_handler.invoke_arn
  route_path                = each.key
  lambda_arn                = module.task_api_handler.arn
  api_gateway_execution_arn = module.api_gateway.execution_arn
  authorizer_id             = ""
  use_api_authorizer        = false
}
