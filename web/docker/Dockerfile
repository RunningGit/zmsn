FROM nginx

ENV RUN_USER nginx
ENV RUN_GROUP nginx
ENV DATA_DIR /data/web
ENV LOG_DIR /data/log/nginx
ENV LOG_DIR /data/log/nginx

RUN mkdir /data/log/nginx -p
RUN chown nginx.nginx -R /data/log/nginx

ADD dist /data/web/
ADD docker/nginx.conf /etc/nginx/nginx.conf
ADD docker/default.conf /etc/nginx/conf.d/default.conf

#GMT+8
RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo "Asia/Shanghai" > /etc/timezone

EXPOSE 80
ENTRYPOINT nginx -g "daemon off;"