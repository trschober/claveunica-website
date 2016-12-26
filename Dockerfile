FROM nginx

COPY ./docker/nginx.crt /etc/nginx/ssl/nginx.crt
COPY ./docker/nginx.key /etc/nginx/ssl/nginx.key
COPY ./docker/default.conf /etc/nginx/conf.d/default.conf

COPY dist /usr/share/nginx/html
