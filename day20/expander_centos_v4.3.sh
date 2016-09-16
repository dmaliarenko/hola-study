#!/bin/bash

DOMAIN='test.com'
PORT='80'
WEB_DIR='/var/www'
USERNAME=''
PASSWORD='password'
GIT='https://github.com/dmaliarenko/nodejs-basics.git'

yum -y update
yum -y install mc
yum -y install nano
yum -y install lynx

yum -y install epel-release
yum -y install nginx
yum -y install git
yum -y install nodejs npm

ln -s /usr/bin/nodejs /usr/local/bin/node

npm install forever -g


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

forever start index.js

mkdir /etc/nginx/sites-available
mkdir /etc/nginx/sites-enabled

sed -i '/# Settings/i include /etc/nginx/sites-enabled/*.conf;' /etc/nginx/nginx.conf
sed -i '/# Settings/i server_names_hash_bucket_size 64;' /etc/nginx/nginx.conf

# Create config file
cat > /etc/nginx/sites-available/$DOMAIN.conf <<EOF

upstream socket_nodes {
    ip_hash;
    server localhost:3015;
}

#map \$http_upgrade \$connection_upgrade {
#    default upgrade;
#    ''      close;
#}

server {
    server_name .$DOMAIN;
    location / {
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_http_version 1.1;
	proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header Host \$host;
        proxy_pass http://socket_nodes;
    }
}

EOF

ln -s /etc/nginx/sites-available/$DOMAIN.conf /etc/nginx/sites-enabled/
#rm /etc/nginx/sites-enabled/default

service nginx stop
service nginx start

#sed -i "127.0.0.1  $DOMAIN" /etc/hosts
echo "127.0.0.1 $DOMAIN" >> /etc/hosts


