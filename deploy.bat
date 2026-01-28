@echo off
echo Deploying APM Portal to VPS...

ssh root@13.55.23.245 "cd /var/www/apm-portal && rm -rf * .[^.]* 2>/dev/null || true"
ssh root@13.55.23.245 "cd /var/www/apm-portal && git clone https://github.com/sitaurs/APM.git ."
ssh root@13.55.23.245 "cd /var/www/apm-portal && npm install"
ssh root@13.55.23.245 "cd /var/www/apm-portal && npm run build"

echo Done!