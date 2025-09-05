# FLY.IO USAGE GUIDE

This document provides information about Fly.io usage, free tier limitations, and recommendations to avoid unexpected charges.

## Free Tier Limitations

Fly.io offers a generous free tier that includes:

- **Compute**: 2x shared-cpu-1x VMs with 256MB RAM
- **Storage**: 3GB of volume storage
- **Bandwidth**: 160GB of outbound data transfer per month
- **Networking**: Free IPv6 addresses and shared IPv4 addresses
- **Security**: Free TLS certificates

## Cost-Saving Recommendations

Follow these recommendations to stay within the free tier:

1. **Limit Machine Count**: Keep to a maximum of 2 machines to stay within the free tier
2. **Use Auto-Stop**: Configure `auto_stop_machines = true` in your fly.toml
3. **Set Minimum Machines to Zero**: Configure `min_machines_running = 0` in your fly.toml
4. **Avoid Dedicated IPv4**: Don't allocate dedicated IPv4 addresses ($2/month each)
5. **Monitor Usage**: Regularly check your app status and machine count

## Common Commands for Cost Management

### Check App Status
```bash
flyctl status
```

### Scale Down to Save Costs
```bash
# Scale to one machine
flyctl scale count 1

# Scale to zero machines (completely stop app)
flyctl scale count 0
```

### Check IP Addresses
```bash
flyctl ips list
```

### Release a Dedicated IP (if accidentally allocated)
```bash
flyctl ips release <IP_ADDRESS>
```

### Monitor App Metrics
```bash
flyctl monitor
```

## Recommended fly.toml Configuration

Ensure your fly.toml contains these cost-saving settings:

```toml
[http_service]
  auto_stop_machines = true
  min_machines_running = 0
```

## What Incurs Charges?

- **Dedicated IPv4 Addresses**: $2/month per address
- **More than 2 Machines**: Additional machines beyond the free 2
- **Larger Machine Sizes**: Anything beyond shared-cpu-1x, 256MB RAM
- **Volumes**: Storage beyond 3GB
- **Bandwidth**: Outbound data transfer beyond 160GB/month

## Using the Monitoring Script

Run the provided monitoring script periodically to check your usage:

```bash
python monitor_fly_usage.py
```

The script will:
1. Check your current machine count
2. Verify IP address allocation
3. Check volume usage
4. Provide cost-saving recommendations

## Additional Resources

- [Fly.io Pricing Page](https://fly.io/docs/about/pricing/)
- [Fly.io Dashboard](https://fly.io/dashboard)
- [Fly.io Documentation](https://fly.io/docs/)
