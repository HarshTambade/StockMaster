# StockMaster Deployment Guide

## Prerequisites

Before deploying StockMaster, ensure you have:

1. **Node.js** (v18 or higher)
2. **PostgreSQL** (v14 or higher)
3. **pnpm** package manager

## Local Development Setup

### 1. Database Setup

```bash
# Install PostgreSQL (if not already installed)
# On Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib

# On macOS:
brew install postgresql

# Create the database
createdb stockmaster

# Or using psql:
psql -U postgres
CREATE DATABASE stockmaster;
\q
```

### 2. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your database credentials
# Update these values:
DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=stockmaster
DB_PASSWORD=your_postgres_password
DB_PORT=5432
JWT_SECRET=generate-a-secure-random-string
PORT=3001
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Start the Backend Server

```bash
# The backend will automatically initialize the database schema
node server/index.js
```

You should see:
```
Database initialized successfully
Server running on port 3001
```

### 5. Access the Application

The frontend is already running in the MGX preview environment. Simply use the preview URL provided by the platform.

## Production Deployment

### Option 1: Traditional Server Deployment

#### Backend Deployment

1. **Prepare the server**
```bash
# Install Node.js and PostgreSQL on your server
# Clone your repository
git clone <your-repo-url>
cd stockmaster
```

2. **Setup PostgreSQL**
```bash
# Create production database
sudo -u postgres createdb stockmaster_prod

# Create a dedicated database user
sudo -u postgres psql
CREATE USER stockmaster_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE stockmaster_prod TO stockmaster_user;
\q
```

3. **Configure environment**
```bash
# Create production .env file
cat > .env << EOF
DB_USER=stockmaster_user
DB_HOST=localhost
DB_NAME=stockmaster_prod
DB_PASSWORD=secure_password
DB_PORT=5432
JWT_SECRET=$(openssl rand -base64 32)
PORT=3001
NODE_ENV=production
EOF
```

4. **Install and start**
```bash
pnpm install --prod
node server/index.js
```

5. **Setup as a service (using systemd)**
```bash
sudo nano /etc/systemd/system/stockmaster.service
```

Add:
```ini
[Unit]
Description=StockMaster Backend
After=network.target postgresql.service

[Service]
Type=simple
User=your_user
WorkingDirectory=/path/to/stockmaster
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable stockmaster
sudo systemctl start stockmaster
sudo systemctl status stockmaster
```

#### Frontend Deployment

1. **Build the frontend**
```bash
pnpm run build
```

2. **Serve with Nginx**
```bash
sudo nano /etc/nginx/sites-available/stockmaster
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/stockmaster/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/stockmaster /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

3. **Setup SSL with Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 2: Docker Deployment

1. **Create Dockerfile for backend**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod

COPY server ./server

EXPOSE 3001

CMD ["node", "server/index.js"]
```

2. **Create docker-compose.yml**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: stockmaster
      POSTGRES_USER: stockmaster
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: .
    environment:
      DB_USER: stockmaster
      DB_HOST: postgres
      DB_NAME: stockmaster
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      PORT: 3001
    ports:
      - "3001:3001"
    depends_on:
      - postgres

  frontend:
    image: nginx:alpine
    volumes:
      - ./dist:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

3. **Deploy**
```bash
docker-compose up -d
```

### Option 3: Cloud Platform Deployment

#### Heroku

1. **Backend**
```bash
# Install Heroku CLI
heroku login
heroku create stockmaster-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=$(openssl rand -base64 32)

# Deploy
git push heroku main
```

2. **Frontend (Netlify/Vercel)**
```bash
# Build
pnpm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist

# Or deploy to Vercel
vercel --prod
```

#### AWS (EC2 + RDS)

1. **Setup RDS PostgreSQL instance**
2. **Launch EC2 instance**
3. **Follow traditional server deployment steps**
4. **Configure security groups for database access**

## Database Backup

### Automated Backup Script

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/stockmaster"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="stockmaster"

mkdir -p $BACKUP_DIR

pg_dump $DB_NAME > "$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete

echo "Backup completed: backup_$TIMESTAMP.sql"
```

Setup cron job:
```bash
crontab -e
# Add: Run backup daily at 2 AM
0 2 * * * /path/to/backup.sh
```

## Monitoring

### PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server/index.js --name stockmaster-backend

# Monitor
pm2 monit

# Setup startup script
pm2 startup
pm2 save
```

### Logging

```bash
# View logs
pm2 logs stockmaster-backend

# Or with systemd
journalctl -u stockmaster -f
```

## Security Checklist

- [ ] Change default JWT_SECRET to a strong random value
- [ ] Use environment variables for all sensitive data
- [ ] Enable HTTPS/SSL in production
- [ ] Setup firewall rules (allow only necessary ports)
- [ ] Regular database backups
- [ ] Keep dependencies updated
- [ ] Implement rate limiting on API endpoints
- [ ] Use strong PostgreSQL passwords
- [ ] Restrict database access to application server only
- [ ] Enable PostgreSQL SSL connections
- [ ] Regular security audits

## Performance Optimization

### Database Indexing

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_stock_levels_product ON stock_levels(product_id);
CREATE INDEX idx_stock_levels_location ON stock_levels(location_id);
CREATE INDEX idx_move_history_product ON move_history(product_id);
CREATE INDEX idx_move_history_date ON move_history(created_at);
```

### Nginx Caching

```nginx
# Add to nginx config
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Troubleshooting

### Backend won't start

1. Check PostgreSQL is running:
```bash
sudo systemctl status postgresql
```

2. Verify database exists:
```bash
psql -U postgres -l | grep stockmaster
```

3. Check logs:
```bash
pm2 logs stockmaster-backend
# or
journalctl -u stockmaster -n 50
```

### Database connection errors

1. Verify credentials in .env
2. Check PostgreSQL is accepting connections:
```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
# Ensure: listen_addresses = '*'

sudo nano /etc/postgresql/14/main/pg_hba.conf
# Add: host all all 0.0.0.0/0 md5
```

3. Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### Frontend can't connect to backend

1. Check CORS configuration in server/index.js
2. Verify API_URL in frontend components
3. Check firewall rules allow port 3001

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**: Use Nginx or AWS ELB
2. **Multiple Backend Instances**: Run multiple Node.js processes
3. **Database Connection Pooling**: Already configured in pg Pool
4. **Redis for Sessions**: Consider adding Redis for session management

### Vertical Scaling

1. **Increase PostgreSQL resources**
2. **Optimize queries with EXPLAIN ANALYZE**
3. **Add database read replicas**
4. **Implement caching layer**

## Support

For issues and questions:
- Check the main README.md
- Review logs for error messages
- Open an issue on GitHub
- Contact support team

## License

MIT License - See LICENSE file for details