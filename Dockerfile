FROM nginx
MAINTAINER Javier Rubio

#RUN apt-get -y install vim

USER root
COPY nginx.conf /etc/nginx/nginx.conf
COPY /html/index.html /data/www/index.html
COPY /javascript /data/www/javascript
COPY /styles /data/www/styles
COPY /images /data/www/images
