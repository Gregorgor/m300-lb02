FROM ubuntu:18.04
MAINTAINER Noah Fleischmann

RUN apt-get update
RUN apt-get -q -y install apache2 

# Konfiguration Apache
ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_LOG_DIR /var/log/apache2

RUN mkdir -p /var/lock/apache2 /var/run/apache2
RUN echo "ServerName localhost" | tee /etc/apache2/conf-available/fqdn.conf && \ a2enconf fqdn

EXPOSE 80

VOLUME /var/www/html

COPY src /var/www/html

CMD /bin/bash -c "source /etc/apache2/envvars && exec /usr/sbin/apache2 -DFOREGROUND"