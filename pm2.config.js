module.exports = {
  apps: [
    {
      name: 'payload-portfolio',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        // Override these in .env on the server:
        // DATABASE_URL=file:/home/USERNAME/data/portfolio.db
        // PAYLOAD_SECRET=your-secret-here
        // PAYLOAD_MEDIA_DIR=/home/USERNAME/data/media
        // NEXT_PUBLIC_SERVER_URL=https://yourdomain.ee
      },
    },
  ],
}
