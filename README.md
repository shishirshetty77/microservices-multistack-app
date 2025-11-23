# Microservices Multistack Application

A comprehensive, polyglot microservices reference architecture demonstrating modern cloud-native development practices. This project integrates five different programming languages, a modern frontend, and a complete DevOps pipeline using industry-standard tools.

## 🚀 Architecture Overview

The application simulates an e-commerce platform composed of loosely coupled microservices, each responsible for a specific domain.

### Services Stack

| Service | Technology | Port | Description |
|---------|------------|------|-------------|
| **Frontend** | React (Vite) | 3000 | Modern SPA dashboard for visualizing system status and metrics. |
| **User Service** | Go | 8001 | Manages user identities and profiles. High-performance REST API. |
| **Product Service** | Python (Flask) | 8002 | Handles product catalog and inventory management. |
| **Order Service** | Java (Spring Boot) | 8003 | Orchestrates order processing by communicating with User, Product, and Notification services. |
| **Notification Service** | Node.js (Express) | 8004 | Asynchronous notification handling and event logging. |
| **Analytics Service** | Rust (Actix) | 8005 | High-speed data aggregation and real-time system metrics. |
| **Database** | PostgreSQL | 5432 | Centralized relational storage for all services. |

### Infrastructure & DevOps

- **Containerization**: Docker
- **Orchestration**: Kubernetes (GKE)
- **Infrastructure as Code**: Terraform
- **Package Management**: Helm
- **GitOps**: ArgoCD
- **Monitoring**: Prometheus & Grafana
- **CI/CD**: GitHub Actions

## 🛠️ Prerequisites

Ensure you have the following tools installed:

- [Docker](https://www.docker.com/)
- [Kubernetes CLI (kubectl)](https://kubernetes.io/docs/tasks/tools/)
- [Helm](https://helm.sh/)
- [Terraform](https://www.terraform.io/)
- [GCloud CLI](https://cloud.google.com/sdk/docs/install) (if using GKE)

## 📦 Installation & Deployment

### 1. Infrastructure Setup (Terraform)

Initialize and apply the Terraform configuration to provision a GKE cluster.

```bash
cd terraform
terraform init
terraform apply
```

### 2. GitOps Setup (ArgoCD)

Install ArgoCD into your cluster and configure the application.

```bash
# Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml


# Get Password
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 --decode

# Access ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

### 3. Deploy Application

Apply the ArgoCD Application manifest to trigger the GitOps sync.

```bash
kubectl apply -f argocd/application.yaml
```

ArgoCD will automatically detect the Helm charts in this repository and deploy the entire stack to your cluster.

## 📊 Monitoring

The stack includes a pre-configured Prometheus and Grafana stack.

- **Grafana**: Access via LoadBalancer IP or port-forward.
- **Dashboards**: Custom dashboards are provisioned automatically to visualize service health, request latency, and error rates.

## 🤝 Contribution Guidelines

We welcome contributions from the community! Please follow these steps to contribute:

1.  **Fork the Repository**: Create your own copy of the project.
2.  **Create a Branch**: Use a descriptive name (e.g., `feat/new-analytics-metric`).
3.  **Commit Changes**: Keep commits atomic and write clear messages.
4.  **Submit a Pull Request**: Describe your changes detailedly and link any relevant issues.

### Code Standards

- **Clean Code**: Remove all debug comments and unused code before committing.
- **Documentation**: Update relevant sections in this README if you change architecture or deployment steps.
- **Testing**: Ensure all services pass their health checks locally before pushing.

## 📄 License

This project is open-source and available under the MIT License.
