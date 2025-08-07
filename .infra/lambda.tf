locals {
  api_task_handler_code_path = "${path.module}/code/api"
}

data "archive_file" "api_handler" {
  type             = "zip"
  output_file_mode = "0666"
  source_dir       = local.api_task_handler_code_path
  output_path      = "${local.api_task_handler_code_path}/packages.zip"
}

# reduce permission later
resource "aws_iam_role" "lambda_task_role" {
  name = "${var.project_name}-fz-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "policy" {
  name = "${var.branch_name}_lambda_policy"
  role = aws_iam_role.lambda_task_role.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Action = [
          "s3:GetObject",
          "s3:ListBucket",
          "s3:PutObject",
          "s3:DeleteObject",
        ]
        Resource = ["*"]
        Effect   = "Allow"
      },
      {
        Action   = ["logs:*"]
        Resource = ["*"]
        Effect   = "Allow"
      },
      {
        Action = [
          "dynamodb:Query",
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:Scan",
          "dynamodb:DeleteItem",
        ]
        Resource = ["*"]
        Effect   = "Allow"
      },
      {
        Action = [
          "sqs:SendMessage",
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:DeleteMessageBatch",
          "sqs:GetQueueAttributes",
          "sqs:SetQueueAttributes",
        ]
        Resource = ["*"]
        Effect   = "Allow"
      },
      {
        Action = [
          "lambda:*"
        ],
        Effect   = "Allow",
        Resource = ["*"]
      }
    ]
  })
}

module "task_api_handler" {
  source                  = "git@github.com:moe-ky/tf-modules.git//lambda/"
  zipped_lambda_file_path = "${local.api_task_handler_code_path}/packages.zip"
  branch_name             = var.branch_name
  function_name           = "${var.project_name}-api"
  function_iam_role_arn   = aws_iam_role.lambda_task_role.arn
  handler                 = "request_handler.handler"
  runtime                 = "python3.10"
  memory_size             = 512
  timeout                 = 300
  depends_on = [
    data.archive_file.api_handler
  ]
  environment = {
    TABLE_NAME = module.menuManager.dynamo_name
    TABLE_ARN = module.menuManager.dynamo_arn
    HOST_URL = "*"
  }
  layers      = [
    data.aws_ssm_parameter.python_shared_layer.value,
    data.aws_ssm_parameter.python_shared_layer_code.value,    
  ]
}
