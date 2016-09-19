#!/bin/bash

DOMAIN='test.com'
PORT='80'
WEB_DIR='/var/www'
USERNAME=''
PASSWORD='password'
GIT='https://github.com/dmaliarenko/nodejs-basics.git'


apt-get -y update
apt-get -y install mc
apt-get -y install nano
apt-get -y install lynx

apt-get -y install epel-release
apt-get -y install nginx
apt-get -y install git
apt-get -y install node
ln -s /usr/bin/nodejs /usr/local/bin/node
apt-get -y install npm
#npm install forever -g

usage()
{
cat << EOF
usage: $0 options

This script expand the database.

OPTIONS:
   -d   domain name
   -u   username
   -p   user password
   -g	git for clone
EOF
}

mkdir -p $WEB_DIR

#mkdir -p $WEB_DIR/$DOMAIN/html
#chmod -R 755 $WEB_DIR


while getopts “hd:u:p:g:v” OPTION
do
	case $OPTION in
		h)
			usage
			exit 1
			;;
		u)
            USERNAME=$OPTARG
            ;;
		p)
            PASSWORD=$OPTARG
            ;;
		g)
			cd $WEB_DIR
			git init
			git clone $OPTARG $DOMAIN
			chmod -R 755 $WEB_DIR
            ;;
		v)
            VERBOSE=1
            ;;
		?)
            usage
            exit
            ;;
	esac
done

cd $WEB_DIR
git init
git clone $GIT $DOMAIN
chmod -R 755 $WEB_DIR

cd $WEB_DIR/$DOMAIN

npm install
chown -R $(whoami) ~/.npm

#forever start index.js
# Create config file
cat > /etc/init/$DOMAIN.conf <<EOF
#!upstart
 
start on runlevel [2345]
stop on shutdown
respawn
 
script
#    export HOME="/root"
 
    echo $$ > /var/run/$DOMAIN.pid
    chdir $WEB_DIR/$DOMAIN
    exec node index.js >> /var/log/$DOMAIN.log 2>&1 
end script
 
pre-start script
    # Формат даты тот же, что и у (new Date()).toISOString(), а не отсебятина
    echo "[`date -u +%Y-%m-%dT%T.%3NZ`] (sys) Starting" >> /var/log/$DOMAIN.log
end script
 
pre-stop script
    rm /var/run/$DOMAIN.pid
    echo "[`date -u +%Y-%m-%dT%T.%3NZ`] (sys) Stopping" >> /var/log/$DOMAIN.log
end script
EOF

start $DOMAIN

mkdir /etc/nginx/sites-available
mkdir /etc/nginx/sites-enabled

#grep -q -F 'include /etc/nginx/sites-enabled/*.conf' /etc/nginx/nginx.conf || sed -i '/# Settings/i include /etc/nginx/sites-enabled/*.conf;' /etc/nginx/nginx.conf
#grep -q -F 'include /etc/nginx/sites-enabled/*.conf' /etc/nginx/nginx.conf || sed -i '/# Settings/i server_names_hash_bucket_size 64;' /etc/nginx/nginx.conf

# Create config file
cat > /etc/nginx/sites-available/$DOMAIN.conf <<EOF

# Add to nginx.conf http section
map \$http_upgrade \$connection_upgrade {
    default upgrade;
    ''      close;
}

upstream some_upsteram_com {
    server 127.0.0.1:3015;
    keepalive 15;
}

server {
	listen 80 default_server;
	listen [::]:80 default_server ipv6only=on;

	root $WEB_DIR/$DOMAIN;
	index index.html index.htm;
	
	server_name .$DOMAIN;

	location / {
            proxy_pass http://127.0.0.1:3015;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_cache_bypass \$http_upgrade;
        }
	

	location /socket\.io {

            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header Host \$http_host;
            proxy_set_header X-NginX-Proxy true;
            proxy_pass http://127.0.0.1:3015;
            proxy_redirect off;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection "upgrade";
         }
}
EOF

ln -s /etc/nginx/sites-available/$DOMAIN.conf /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

service nginx stop
service nginx start

#sed -i "127.0.0.1  $DOMAIN" /etc/hosts
echo "127.0.0.1 $DOMAIN" >> /etc/hosts
