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

# GKE Variables
variable "cluster_name" {
  description = "Name of the GKE cluster"
  type        = string
  default     = "microservices-cluster"
}

variable "gke_node_count" {
  description = "Initial number of nodes in the GKE node pool"
  type        = number
  default     = 2
}

variable "gke_min_node_count" {
  description = "Minimum number of nodes for autoscaling"
  type        = number
  default     = 2
}

variable "gke_max_node_count" {
  description = "Maximum number of nodes for autoscaling"
  type        = number
  default     = 4
}

variable "gke_machine_type" {
  description = "Machine type for GKE nodes"
  type        = string
  default     = "e2-standard-2"
}

variable "gke_disk_size_gb" {
  description = "Disk size in GB for GKE nodes"
  type        = number
  default     = 30
}

variable "gke_disk_type" {
  description = "Disk type for GKE nodes"
  type        = string
  default     = "pd-standard"
}

variable "gke_preemptible" {
  description = "Use preemptible nodes for cost savings"
  type        = bool
  default     = true
}
