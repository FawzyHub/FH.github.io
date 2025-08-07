module "menuManager" {
  source       = "git@github.com:moe-ky/tf-modules.git//dynamo/"
  table_name   = "${var.project_name}-menu-table"
  hash_key     = "hashKey"
  billing_mode = "PAY_PER_REQUEST"

  attributes = [
    {
      "name" : "hashKey"
      "type" : "S"
    },  
  ]

  global_secondary_index = []
}
