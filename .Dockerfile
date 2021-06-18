FROM 10.1.94.254:8082/nginx:stable-alpine
#COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY /build /usr/share/nginx/html
EXPOSE 80

#script for startup application
RUN printf "nginx -g 'daemon off;'" > startup
RUN chmod +x startup

## Add the wait script to the image
ADD ./wait /wait
RUN chmod +x /wait

CMD /wait && /startup
