variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
}

variable "network_name" {
  description = "Name of the VPC network"
  type        = string
}

variable "cidr_range" {
  description = "CIDR range for the primary subnet"
  type        = string
  validation {
    condition     = can(cidrhost(var.cidr_range, 0))
    error_message = "Must be a valid CIDR range."
  }
}
