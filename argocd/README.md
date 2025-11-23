# ArgoCD Setup for Microservices App

This directory contains the configuration and scripts to set up Continuous Delivery using ArgoCD.

## Prerequisites

- A running Kubernetes cluster
- `kubectl` configured to talk to your cluster
- `helm` installed

## Installation

We have provided a script to automate the installation process.

1. Make the script executable:
   ```bash
   chmod +x argocd/install.sh
   ```

2. Run the installation script:
   ```bash
   ./argocd/install.sh
   ```

## Manual Installation Steps

If you prefer to run the steps manually:

1. **Install ArgoCD:**
   ```bash
   helm repo add argo https://argoproj.github.io/argo-helm
   helm repo update
   kubectl create namespace argocd
   helm install argocd argo/argo-cd --namespace argocd --version 5.51.6
   ```

2. **Apply the Application Configuration:**
   ```bash
   kubectl apply -f argocd/application.yaml
   ```

3. **Access the UI:**
   
   Get the password:
   ```bash
   kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
   ```

   Port-forward:
   ```bash
   kubectl port-forward service/argocd-server -n argocd 8080:443
   ```

   Visit `https://localhost:8080` (User: `admin`).

## Configuration

The `application.yaml` file defines the ArgoCD Application resource. It points to the `charts/microservices-app` directory in this repository.

- **Source:** `charts/microservices-app`
- **Destination:** `default` namespace in the local cluster
- **Sync Policy:** Automated (Prune + SelfHeal)
