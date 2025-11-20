variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "credentials_file" {
  description = "Path to GCP service account credentials JSON file"
  type        = string
  default     = ""
}

variable "region" {
  description = "GCP region for resources"
  type        = string
  default     = "us-central1"
}

variable "zones" {
  description = "List of GCP zones for GKE cluster nodes"
  type        = list(string)
  default     = ["us-central1-a", "us-central1-b", "us-central1-c"]
}

variable "network_name" {
  description = "Name of the VPC network"
  type        = string
  default     = "microservices-vpc"
}

variable "vpc_cidr_range" {
  description = "CIDR range for the VPC subnet (/20)"
  type        = string
  default     = "10.0.0.0/20"
}
