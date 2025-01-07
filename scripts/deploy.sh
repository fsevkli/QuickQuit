# deploy.sh
git pull origin main
cd backend && npm install
pm2 restart all
