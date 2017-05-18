FROM nginx:alpine

MAINTAINER Tim Boyce

COPY dist/ /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
