# GKE Cluster Upgrade Summary

## Upgrade Details

### Previous Configuration (Free Tier)
- **Machine Type**: e2-micro (0.25 vCPU, 1GB RAM)
- **Node Count**: 1 node
- **Total Resources**: 0.25 vCPU, 1GB RAM
- **Disk**: 15GB per node
- **Autoscaling**: Disabled
- **Cost**: ~$1-2/month (preemptible)

### New Configuration (Production Optimized)
- **Machine Type**: e2-standard-2 (2 vCPU, 8GB RAM)
- **Initial Nodes**: 2 nodes
- **Autoscaling**: Enabled (2-4 nodes)
- **Total Resources**: 
  - Minimum: 4 vCPU, 16GB RAM (2 nodes)
  - Maximum: 8 vCPU, 32GB RAM (4 nodes)
- **Disk**: 30GB per node
- **Preemptible**: Enabled (80% cost savings)
- **Estimated Cost**: ~$20-40/month (preemptible nodes)

## Workload Requirements Analysis

### Current Microservices Deployment
Based on K8s manifests analysis:

| Service | Replicas | CPU Request | Memory Request | CPU Limit | Memory Limit |
|---------|----------|-------------|----------------|-----------|--------------|
| user-service | 2 | 100m | 128Mi | 200m | 256Mi |
| product-service | 2 | 100m | 128Mi | 200m | 256Mi |
| order-service | 2 | 100m | 128Mi | 200m | 256Mi |
| notification-service | 2 | 100m | 128Mi | 200m | 256Mi |
| analytics-service | 2 | 100m | 128Mi | 200m | 256Mi |
| frontend | 2 | 100m | 128Mi | 200m | 256Mi |
| postgres | 1 | 200m | 256Mi | 500m | 512Mi |
| **TOTAL** | **13 pods** | **1,400m** | **1,792Mi** | **2,900m** | **3,584Mi** |

### Resource Capacity

**New Cluster Capacity (2 nodes minimum):**
- Total CPU: 4,000m (4 vCPUs)
- Total Memory: 16,384Mi (16GB)
- Available after system overhead (~20%):
  - CPU: ~3,200m
  - Memory: ~13,000Mi

**Headroom:**
- CPU: 3,200m available vs 1,400m requested = **128% headroom**
- Memory: 13,000Mi available vs 1,792Mi requested = **625% headroom**

This provides excellent capacity for:
- All current workloads
- Burst traffic (up to limits)
- Future scaling
- System components (kubelet, kube-proxy, etc.)

## Key Features Enabled

### Autoscaling Configuration
```terraform
autoscaling {
  min_node_count = 2  # Always maintain 2 nodes
  max_node_count = 4  # Scale up to 4 nodes under load
}
```

### Benefits:
1. **High Availability**: Minimum 2 nodes ensures pods can be distributed
2. **Auto-scaling**: Automatically adds nodes when CPU/Memory pressure increases
3. **Cost Optimization**: Scales down to minimum when demand is low
4. **Preemptible Nodes**: 80% cost savings while maintaining reliability

### Cluster Features:
- ✅ VPC-native networking
- ✅ Workload Identity enabled
- ✅ Horizontal Pod Autoscaling enabled
- ✅ HTTP Load Balancing enabled
- ✅ Auto-repair enabled
- ✅ Auto-upgrade enabled
- ✅ Shielded nodes (secure boot + integrity monitoring)
- ✅ Daily maintenance window (03:00 UTC)

## Cost Comparison

### Monthly Cost Estimate (Mumbai Region - asia-south1)

**Previous (Free Tier):**
- 1 × e2-micro preemptible: ~$1-2/month
- Cluster management fee: $0 (zonal cluster)
- **Total: ~$1-2/month**

**New (Production):**
- 2 × e2-standard-2 preemptible: ~$18-20/month
- Cluster management fee: $0 (zonal cluster)
- Network egress: ~$5-10/month (varies)
- Disk (2×30GB): ~$3/month
- **Total: ~$26-33/month (2 nodes)**
- **Peak: ~$52-66/month (4 nodes if autoscaled)**

*Note: Costs are approximate. Preemptible nodes provide 80% savings over regular nodes.*

## Deployment Steps

1. **Review the plan:**
   ```bash
   cd terraform
   terraform plan
   ```

2. **Apply the upgrade:**
   ```bash
   terraform apply
   ```

3. **Configure kubectl:**
   ```bash
   gcloud container clusters get-credentials microservices-cluster \
     --zone asia-south1-a \
     --project cloud-explore-478521
   ```

4. **Verify cluster:**
   ```bash
   kubectl get nodes
   kubectl top nodes
   ```

5. **Deploy workloads:**
   ```bash
   kubectl apply -f ../k8s/
   ```

## Monitoring Recommendations

After deployment, monitor:
- Node utilization: `kubectl top nodes`
- Pod distribution: `kubectl get pods -o wide`
- Autoscaling events: `kubectl get events --sort-by='.lastTimestamp'`
- Cluster autoscaler logs: `kubectl logs -n kube-system -l app=cluster-autoscaler`

## Rollback Plan

If needed to rollback to free tier:
1. Update `terraform.tfvars`:
   ```hcl
   gke_node_count = 1
   gke_min_node_count = 1
   gke_max_node_count = 1
   gke_machine_type = "e2-micro"
   gke_disk_size_gb = 15
   ```
2. Run: `terraform apply`

Note: You'll need to reduce replica counts in K8s manifests to fit on e2-micro.
