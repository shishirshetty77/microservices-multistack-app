output "vpc_network_name" {
  description = "The name of the VPC network"
  value       = module.vpc.network_name
}

output "vpc_network_id" {
  description = "The ID of the VPC network"
  value       = module.vpc.network_id
}

output "vpc_subnet_name" {
  description = "The name of the subnet"
  value       = module.vpc.subnet_name
}

output "vpc_subnet_cidr" {
  description = "The CIDR range of the subnet"
  value       = module.vpc.subnet_cidr
}

output "vpc_self_link" {
  description = "The self link of the VPC network"
  value       = module.vpc.network_self_link
}

# GKE Outputs
output "gke_cluster_name" {
  description = "GKE cluster name"
  value       = module.gke.cluster_name
}

output "gke_cluster_endpoint" {
  description = "GKE cluster endpoint"
  value       = module.gke.cluster_endpoint
  sensitive   = true
}

output "gke_cluster_ca_certificate" {
  description = "GKE cluster CA certificate"
  value       = module.gke.cluster_ca_certificate
  sensitive   = true
}

output "gke_cluster_location" {
  description = "GKE cluster location"
  value       = module.gke.cluster_location
}

output "configure_kubectl" {
  description = "Command to configure kubectl"
  value       = "gcloud container clusters get-credentials ${module.gke.cluster_name} --region ${var.region} --project ${var.project_id}"
}
