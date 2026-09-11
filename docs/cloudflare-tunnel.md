# Cloudflare Tunnel Deployment Guide

## Method 1: Docker Compose with Tunnel Token (Recommended)

1. Create a tunnel in the Cloudflare Zero Trust Dashboard:
   - Go to **Access** > **Tunnels** > **Create a tunnel**.
   - Choose **Cloudflare Tunnel** and name it (e.g., `ce50-tunnel`).
   - Copy the Tunnel Token provided in the dashboard.

2. Run with Docker Compose:
   ```bash
   TUNNEL_TOKEN="<your-token-here>" docker compose --profile tunnel up -d
   ```

3. In Cloudflare Dashboard, configure Public Hostnames:
   - `ce50.yourdomain.com` -> Service: `HTTP`, URL: `frontend:3000`
   - `api-ce50.yourdomain.com` -> Service: `HTTP`, URL: `backend:8000`

---

## Method 2: Quick Ad-Hoc Tunnel (No Domain Required)

Using `cloudflared` CLI for instant HTTPS testing:

```bash
# Frontend
cloudflared tunnel --url http://localhost:3000

# Backend
cloudflared tunnel --url http://localhost:8000
```
