#!/bin/bash

DOMAIN='test.com'
PORT='80'
WEB_DIR='/var/www'
USERNAME=''
PASSWORD='password'
GIT='https://github.com/holateam/library-portal.git'


apt-get -y update
apt-get -y install mc
apt-get -y install nano
apt-get -y install lynx

apt-get -y install epel-release
apt-get -y install nginx
apt-get -y install git
apt-get -y install node


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
			git clone $GIT $DOMAIN
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


	mkdir -p $WEB_DIR
	mkdir -p $WEB_DIR/$DOMAIN/html
	chmod -R 755 $WEB_DIR

mkdir /etc/nginx/sites-available
mkdir /etc/nginx/sites-enabled


grep -q -F 'include /etc/nginx/sites-enabled/*.conf' /etc/nginx/nginx.conf || sed '/http {/a include /etc/nginx/sites-enabled/*.conf;n\server_names_hash_bucket_size 64;' /etc/nginx/nginx.conf

# Create test index.html
cat > $WEB_DIR/$DOMAIN/html/index.html <<EOF
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
        <h1>Success! The $DOMAIN server is working!</h1>
</body>
</html>
EOF

# Create config file
cat > /etc/nginx/sites-available/$DOMAIN.conf <<EOF
server {
    listen   80; ## listen for ipv4; this line is default and implied
    listen   [::]:80 default ipv6only=on; ## listen for ipv6
    root $WEB_DIR/$DOMAIN/html;
    index index.html index.htm;

    server_name $DOMAIN www.$DOMAIN;
}
EOF

ln -s /etc/nginx/sites-available/$DOMAIN.conf /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

service nginx stop
service nginx start

#sed -i "127.0.0.1  $DOMAIN" /etc/hosts
#echo "127.0.0.1 $DOMAIN" >> /etc/hosts
