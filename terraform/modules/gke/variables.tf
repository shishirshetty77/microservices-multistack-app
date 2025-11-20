variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
}

variable "zones" {
  description = "List of zones for node pool"
  type        = list(string)
}

variable "cluster_name" {
  description = "Name of the GKE cluster"
  type        = string
}

variable "network_name" {
  description = "VPC network name"
  type        = string
}

variable "subnet_name" {
  description = "Subnet name"
  type        = string
}

variable "pods_ip_range_name" {
  description = "Secondary IP range name for pods"
  type        = string
}

variable "services_ip_range_name" {
  description = "Secondary IP range name for services"
  type        = string
}

variable "node_count" {
  description = "Number of nodes per zone"
  type        = number
  default     = 1
}

variable "machine_type" {
  description = "Machine type for nodes"
  type        = string
  default     = "e2-micro"
}

variable "disk_size_gb" {
  description = "Disk size in GB for nodes"
  type        = number
  default     = 10
}

variable "disk_type" {
  description = "Disk type for nodes"
  type        = string
  default     = "pd-standard"
}

variable "enable_autopilot" {
  description = "Enable GKE Autopilot mode (free tier friendly)"
  type        = bool
  default     = false
}
