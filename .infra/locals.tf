locals {
  api_name = "${var.project_name}-api"

  dev_host = [
    "http://localhost:5173",
    "https://127.0.0.1:5173",
    "http://192.168.1.101:5173"
  ]

  prod_host = [
    "https://fawzyhotels.com",
    "https://dzfy060h0r7es.cloudfront.net"
  ]
}
