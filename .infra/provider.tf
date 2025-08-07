provider "aws" {
  region = "eu-west-1"
}
provider "aws" {
  alias  = "us-profile"
  region = "us-east-1"
}
