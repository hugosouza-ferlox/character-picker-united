# Cloudflare Tunnel Setup Guide

This guide will help you set up a Cloudflare Tunnel using Docker to expose your local Next.js application.

## Prerequisites

- Docker and Docker Compose installed
- Cloudflare account with domain `16022001.xyz` already configured
- Your Next.js app running locally (default: `http://localhost:3000`)

## Step-by-Step Setup

### Step 1: Create a Cloudflare Tunnel

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your domain
3. Navigate to **Zero Trust** → **Networks** → **Tunnels**
4. Click **Create a tunnel**
5. Choose **Cloudflared** as the connector
6. Give your tunnel a name (e.g., `character-picker-tunnel`)
7. Click **Save tunnel**

### Step 2: Get Your Tunnel Token

1. After creating the tunnel, you'll see a **Quick Start** section
2. Copy the **Token** (it looks like: `eyJhIjoi...`)
3. Save this token - you'll need it for the Docker setup

### Step 3: Configure the Tunnel

1. In the Cloudflare dashboard, click on your newly created tunnel
2. Go to the **Public Hostname** tab
3. Click **Add a public hostname**
4. Configure:
   - **Subdomain**: `united`
   - **Domain**: Select `16022001.xyz`
   - **Service**: `http://app:3000` (this connects to the Next.js container)
   - **Path**: Leave empty (or add a path if needed)
5. Click **Save hostname**

   Your app will be accessible at: **https://united.16022001.xyz**

### Step 4: Set Up Docker Configuration

1. Create a `.env` file in the `cloudflare-tunnel` directory:
   ```bash
   cd cloudflare-tunnel
   ```

2. Create `.env` file with your tunnel token:
   ```
   TUNNEL_TOKEN=your_tunnel_token_here
   ```

   Replace `your_tunnel_token_here` with the token you copied in Step 2.

### Step 5: Build and Start Everything

1. Navigate to the cloudflare-tunnel directory:
   ```bash
   cd cloudflare-tunnel
   ```

2. Build and start both the Next.js app and Cloudflare Tunnel:
   ```bash
   docker-compose up -d --build
   ```

   This will:
   - Build the Next.js app Docker image
   - Start the Next.js app container
   - Start the Cloudflare Tunnel container
   - Run everything in detached mode (background)

   **Note**: The first build may take a few minutes as it installs dependencies and builds the app.

### Step 6: Verify It's Working

1. Check the tunnel logs:
   ```bash
   docker-compose logs -f cloudflared
   ```

2. You should see messages indicating the tunnel is running and connected

3. Visit **https://united.16022001.xyz** in your browser to test your app

## Managing the Services

### Start everything (app + tunnel):
```bash
docker-compose up -d
```

### Stop everything:
```bash
docker-compose down
```

### View logs (all services):
```bash
docker-compose logs -f
```

### View logs (specific service):
```bash
# Next.js app logs
docker-compose logs -f app

# Cloudflare tunnel logs
docker-compose logs -f cloudflared
```

### Restart everything:
```bash
docker-compose restart
```

### Rebuild and restart (after code changes):
```bash
docker-compose up -d --build
```

### Stop and remove everything (including volumes):
```bash
docker-compose down -v
```

## Troubleshooting

### If the tunnel can't connect to your app:

1. Check if the app container is running:
   ```bash
   docker-compose ps
   ```

2. Check the app logs for errors:
   ```bash
   docker-compose logs app
   ```

3. Verify the service URL in Cloudflare dashboard is set to `http://app:3000`
4. Make sure both containers are on the same Docker network (they should be with the current setup)

### If the app won't start:

1. Check the build logs:
   ```bash
   docker-compose logs app
   ```

2. Try rebuilding:
   ```bash
   docker-compose up -d --build --force-recreate
   ```

3. Make sure you have enough disk space and memory allocated to Docker

### If you need to change the port:

1. Update the service URL in Cloudflare dashboard
2. Or modify the docker-compose.yml to use a different port mapping

### To update the tunnel token:

1. Edit the `.env` file with the new token
2. Restart the container: `docker-compose restart`

## Notes

- Both the Next.js app and Cloudflare tunnel run in Docker containers
- The containers communicate via Docker's internal network (`app-network`)
- The tunnel will automatically reconnect if it disconnects
- After code changes, rebuild with `docker-compose up -d --build`
- The app container exposes port 3000, but it's only accessible internally via the tunnel
- Make sure `.env` is in `.gitignore` to keep your token secure
- The Dockerfile uses Next.js standalone output for optimal Docker performance

