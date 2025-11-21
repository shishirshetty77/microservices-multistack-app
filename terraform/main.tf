terraform {
  required_version = ">= 1.0"
  
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project     = var.project_id
  region      = var.region
  credentials = var.credentials_file != "" ? file(var.credentials_file) : null
}

module "vpc" {
  source = "./modules/vpc"

  project_id   = var.project_id
  region       = var.region
  network_name = var.network_name
  cidr_range   = var.vpc_cidr_range
}

module "gke" {
  source = "./modules/gke"

  project_id              = var.project_id
  region                  = var.region
  zones                   = var.zones
  cluster_name            = var.cluster_name
  network_name            = module.vpc.network_name
  subnet_name             = module.vpc.subnet_name
  pods_ip_range_name      = module.vpc.pods_ip_range_name
  services_ip_range_name  = module.vpc.services_ip_range_name
  node_count              = var.gke_node_count
  min_node_count          = var.gke_min_node_count
  max_node_count          = var.gke_max_node_count
  machine_type            = var.gke_machine_type
  disk_size_gb            = var.gke_disk_size_gb
  disk_type               = var.gke_disk_type
  preemptible             = var.gke_preemptible
}
