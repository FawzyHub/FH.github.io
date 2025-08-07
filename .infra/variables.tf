variable "project_name" {
  type        = string
  description = "name of the current branch"
  default     = "fz"
}

variable "branch_name" {
  type        = string
  description = "name of the branch for global resources"
}

variable "aws_region" {
  type    = string
  default = "eu-west-1"
}

variable "aws_account_number" {
  type    = string
  default = "726154875244"
}
