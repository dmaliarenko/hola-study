
#!/bin/bash

DOMAIN=''
PORT='80'
WEB_DIR='/var/www'
USERNAME=''
PASSWORD='password'
GIT='https://github.com/holateam/library-portal.git'


yum -y update
yum -y install mc
yum -y install nano
yum -y install lynx

yum -y install epel-release
yum -y install nginx
yum -y install git
yum -y install node


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

if [ $USERNAME != "" ]
then
	useradd -m -d $WEB_DIR/$DOMAIN/ -U $USERNAME -p $PASSWORD

	chown -R $USERNAME:$USERNAME $WEB_DIR/$DOMAIN
	chmod -R 755 $WEB_DIR
fi

if [ $GIT = "" ]
then
	mkdir -p /var/www/$DOMAIN
fi


systemctl enable nginx.service
systemctl start nginx


mkdir /etc/nginx/sites-available
mkdir /etc/nginx/sites-enabled

grep -q -F 'include /etc/nginx/sites-enabled/*.conf' /etc/nginx/nginx.conf || sed '/http {/a include /etc/nginx/sites-enabled/*.conf;  \nserver_names_hash_bucket_size 64;' /etc/nginx/nginx.conf

# Create test index.html
cat > $WEB_DIR/$DOMAIN/index.html <<EOF
<html>
    <head>
        <title>Welcome to $DOMAIN!</title>
    </head>
    <body>
        <h1>Success! The $DOMAIN server is working!</h1>
    </body>
</html>
EOF

# Create config file
cat > /etc/nginx/sites-available/$DOMAIN.conf <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server ipv6only=on;

    root /$WEB_DIR/$DOMAIN;
    index index.html index.htm;

    server_name $DOMAIN www.$DOMAIN;

    location / {
        try_files $uri $uri/ =404;
    }
}
EOF

ln -s /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
systemctl restart nginx

sed -i "127.0.0.1  $DOMAIN" /etc/hosts
#echo "127.0.0.1 $DOMAIN" >> /etc/hosts
