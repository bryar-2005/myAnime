# MyAnime Deployment Guide

This guide describes how to deploy the MyAnime application to a production server using Docker.

## Prerequisites
- A Linux server (recommended: Ubuntu 22.04+)
- Docker & Docker Compose installed
- A domain name pointing to your server IP

## Step 1: Clone and Environment Setup
1. Clone your repository: `git clone <your-repo-url>`
2. Copy `.env.example` to `.env` in the `backend/` directory.
3. Update production values (DB_PASSWORD, APP_URL, VITE_API_URL).

## Step 2: Build and Launch
Run the build script:
```bash
bash build.sh
```
Or manually using Docker Compose:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

## Step 3: Database Migrations
Run the following within the app container:
```bash
docker-compose exec app php artisan migrate --force
docker-compose exec app php artisan db:seed --class=DatabaseSeeder --force
```

## Step 4: SSL Configuration
Use Certbot to obtain an SSL certificate:
```bash
sudo certbot --nginx -d yourdomain.com
```

## Step 5: Post-Deployment Optimizations
```bash
docker-compose exec app php artisan config:cache
docker-compose exec app php artisan route:cache
docker-compose exec app php artisan view:cache
```

## Step 6: Testing the CI/CD Pipeline
To verify that your automation is working correctly:
1. **Push a Change**: Make a small change (e.g., change a text label in `Home.jsx`) and push it to the `main` branch.
2. **Check GitHub Actions**: Go to your repository on GitHub and click the **Actions** tab. You should see a workflow titled "Deploy MyAnime" running.
3. **Monitor Progress**: Click on the running workflow to see the logs. It will show the Docker build and the SSH deployment steps.
4. **Verify on Site**: Once the workflow finishes (green checkmark), refresh your website to see the change live!

> [!TIP]
> If the "Deploy to Server" step fails, check that your `SERVER_SSH_KEY` is added to the GitHub Secrets and that the user (e.g., `root`) has permissions to run `docker-compose` on the server.
