# Deployment Instructions

This guide provides step-by-step instructions to deploy the Microservices Multistack App using Terraform, ArgoCD, and Helm.

## Prerequisites

Ensure you have the following tools installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Terraform](https://www.terraform.io/downloads.html)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Helm](https://helm.sh/docs/intro/install/)
- [ArgoCD CLI](https://argo-cd.readthedocs.io/en/stable/cli_installation/) (Optional)

---

## 1. Infrastructure Provisioning (Terraform)

We use Terraform to provision the Kubernetes cluster (e.g., GKE, EKS, or local Kind/Minikube wrapper).

1.  **Navigate to the Terraform directory**:

    ```bash
    cd terraform
    ```

2.  **Initialize Terraform**:
    Downloads necessary providers and plugins.

    ```bash
    terraform init
    ```

3.  **Plan the Infrastructure**:
    Preview the changes Terraform will make.

    ```bash
    terraform plan
    ```

4.  **Apply the Configuration**:
    Provision the cluster.

    ```bash
    terraform apply --auto-approve
    ```

5.  **Configure kubectl**:
    After the cluster is created, configure `kubectl` to connect to it. (The command depends on your provider, e.g., for GKE):
    ```bash
    gcloud container clusters get-credentials <CLUSTER_NAME> --region <REGION>
    ```

---

## 2. Installing ArgoCD

We use ArgoCD for GitOps-based deployment.

1.  **Create ArgoCD Namespace**:

    ```bash
    kubectl create namespace argocd
    ```

2.  **Install ArgoCD**:

    ```bash
    kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
    ```

3.  **Access ArgoCD UI**:
    Forward the ArgoCD server port to localhost.
    ```bash
    kubectl port-forward svc/argocd-server -n argocd 8080:443
    ```
    - Open `https://localhost:8080` in your browser.
    - **Username**: `admin`
    - **Password**: Get the initial password:
      ```bash
      kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
      ```

---

## 3. Deploying the Application (GitOps)

We will use the ArgoCD Application manifest to deploy our Helm chart.

1.  **Apply the Application Manifest**:
    This tells ArgoCD to watch our Git repository and deploy the `charts/microservices-app` chart.

    ```bash
    kubectl apply -f argocd/application.yaml
    ```

2.  **Sync the Application**:

    - Go to the ArgoCD UI.
    - Click **Sync** on the `microservices-app` application.
    - Alternatively, use the CLI:
      ```bash
      argocd app sync microservices-app
      ```

3.  **Verify Deployment**:
    Check if all pods are running:
    ```bash
    kubectl get pods
    ```

---

## 4. Manual Deployment (Helm Only)

If you prefer to deploy manually without ArgoCD:

1.  **Navigate to the project root**:

    ```bash
    cd ..
    ```

2.  **Install the Chart**:

    ```bash
    helm install microservices-app ./charts/microservices-app
    ```

3.  **Upgrade the Chart**:
    If you make changes, upgrade the release:
    ```bash
    helm upgrade microservices-app ./charts/microservices-app
    ```

---

## 5. Accessing the Application

Once deployed, the application services are exposed via LoadBalancers or NodePorts (depending on your configuration).

- **Frontend**:

  ```bash
  kubectl get svc frontend
  ```

  Access via the `EXTERNAL-IP` on port `3000`.

- **API Services**:
  Each service (User, Product, Order, etc.) has its own ClusterIP. They communicate internally.

---

## Troubleshooting

- **Pods Pending?** Check if you have enough resources (CPU/Memory) in your cluster.
- **Database Connection Failed?** Ensure the `postgres` pod is running and the `InitScript` executed successfully.
- **ArgoCD Sync Failed?** Check the repo URL in `argocd/application.yaml` and ensure it's accessible.
