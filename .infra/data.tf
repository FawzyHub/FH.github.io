data "aws_ssm_parameter" "python_shared_layer" {
  name = "/shared-resources/layer/python/arn"
}

data "aws_ssm_parameter" "python_shared_layer_code" {
  name = "/shared-resources/layer/python/code/arn"
}
