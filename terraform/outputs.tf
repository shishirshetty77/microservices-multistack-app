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
