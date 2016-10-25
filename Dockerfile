FROM nginx
MAINTAINER Javier Rubio

COPY nginx.conf /etc/nginx/nginx.conf
COPY /html /data/www
COPY /javascript /data/www
COPY /styles /data/www
COPY /images /data/www
