# Terraform GKE Infrastructure

This Terraform configuration creates the infrastructure for deploying the microservices application on Google Kubernetes Engine (GKE).

## Architecture

### VPC Network
- **CIDR Range**: 10.0.0.0/20 (Primary subnet)
- **Secondary Ranges**:
  - GKE Pods: 10.1.0.0/16
  - GKE Services: 10.2.0.0/20

### Components
- Custom VPC network with regional routing
- Regional subnet with private Google access
- Cloud Router and Cloud NAT for outbound internet access
- Firewall rules for internal communication and SSH access

## Prerequisites

1. **Google Cloud SDK**: Install and authenticate
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Terraform**: Version >= 1.0
   ```bash
   terraform version
   ```

3. **Enable Required APIs**:
   ```bash
   gcloud services enable compute.googleapis.com
   gcloud services enable container.googleapis.com
   gcloud services enable servicenetworking.googleapis.com
   ```

## Usage

### 1. Configure Variables

Copy the example tfvars file and update with your values:
```bash
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:
```hcl
project_id     = "your-gcp-project-id"
region         = "us-central1"
network_name   = "microservices-vpc"
vpc_cidr_range = "10.0.0.0/20"
```

### 2. Initialize Terraform

```bash
terraform init
```

### 3. Plan Infrastructure

```bash
terraform plan
```

### 4. Apply Configuration

```bash
terraform apply
```

### 5. Destroy Infrastructure (when needed)

```bash
terraform destroy
```

## Module Structure

```
terraform/
├── main.tf                    # Root module configuration
├── variables.tf               # Root module variables
├── outputs.tf                 # Root module outputs
├── terraform.tfvars.example   # Example variables file
├── .gitignore                # Git ignore patterns
└── modules/
    └── vpc/
        ├── main.tf           # VPC resources
        ├── variables.tf      # VPC module variables
        └── outputs.tf        # VPC module outputs
```

## Outputs

After successful apply, you'll get:
- `vpc_network_name`: Name of the VPC network
- `vpc_network_id`: ID of the VPC network
- `vpc_subnet_name`: Name of the subnet
- `vpc_subnet_cidr`: CIDR range of the subnet
- `vpc_self_link`: Self link of the VPC network

## Next Steps

After VPC creation, you can extend this configuration to add:
- GKE cluster
- Cloud SQL instances
- Load balancers
- Additional networking components
