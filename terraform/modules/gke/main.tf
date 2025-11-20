resource "google_container_cluster" "primary" {
  name     = var.cluster_name
  location = var.zones[0]  # ZONAL cluster for free tier (not regional)
  project  = var.project_id

  # Zonal cluster - no need for node_locations (it's already in the zone)
  # node_locations = []  # Not needed for zonal clusters

  # We can't create a cluster with no node pool defined, but we want to only use
  # separately managed node pools. So we create the smallest possible default
  # node pool and immediately delete it.
  remove_default_node_pool = true
  initial_node_count       = 1

  # Network configuration
  network    = var.network_name
  subnetwork = var.subnet_name

  # IP allocation policy for pods and services
  ip_allocation_policy {
    cluster_secondary_range_name  = var.pods_ip_range_name
    services_secondary_range_name = var.services_ip_range_name
  }

  # Disable features to reduce costs
  addons_config {
    http_load_balancing {
      disabled = false
    }
    horizontal_pod_autoscaling {
      disabled = false
    }
    network_policy_config {
      disabled = true
    }
  }

  # Maintenance window
  maintenance_policy {
    daily_maintenance_window {
      start_time = "03:00"
    }
  }

  # Enable Workload Identity
  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }

  # Release channel
  release_channel {
    channel = "REGULAR"
  }

  # Networking mode
  networking_mode = "VPC_NATIVE"

  # Disable Cloud Logging and Monitoring to reduce costs (optional)
  logging_config {
    enable_components = ["SYSTEM_COMPONENTS"]
  }

  monitoring_config {
    enable_components = ["SYSTEM_COMPONENTS"]
    managed_prometheus {
      enabled = false
    }
  }

  # Enable Shielded Nodes
  enable_shielded_nodes = true

  # Binary Authorization
  binary_authorization {
    evaluation_mode = "DISABLED"
  }
}

# Separately managed node pool
resource "google_container_node_pool" "primary_nodes" {
  name       = "${var.cluster_name}-node-pool"
  location   = var.zones[0]  # Must match cluster location (zonal for free tier)
  cluster    = google_container_cluster.primary.name
  project    = var.project_id
  
  # No node_locations needed for zonal cluster
  # node_locations = []
  
  # Minimal node count for free tier
  node_count = var.node_count

  # Autoscaling disabled for free tier
  autoscaling {
    min_node_count = var.node_count
    max_node_count = var.node_count
  }

  # Node configuration
  node_config {
    # Smallest machine type
    machine_type = var.machine_type
    
    # Minimum disk size
    disk_size_gb = var.disk_size_gb
    disk_type    = var.disk_type

    # OAuth scopes
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]

    # Metadata
    metadata = {
      disable-legacy-endpoints = "true"
    }

    # Shielded instance config
    shielded_instance_config {
      enable_secure_boot          = true
      enable_integrity_monitoring = true
    }

    # Workload Identity
    workload_metadata_config {
      mode = "GKE_METADATA"
    }

    # Labels
    labels = {
      environment = "dev"
      managed-by  = "terraform"
    }

    # Tags
    tags = ["gke-node", "${var.cluster_name}-node"]

    # Preemptible nodes for cost savings (optional)
    preemptible  = true
    spot         = false
  }

  # Upgrade settings
  upgrade_settings {
    max_surge       = 1
    max_unavailable = 0
  }

  # Management
  management {
    auto_repair  = true
    auto_upgrade = true
  }
}
