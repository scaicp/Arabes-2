# Usa una imagen de Apache ligera (sin PHP)
FROM httpd:2.4-alpine

# Copia tus archivos al directorio donde Apache sirve contenido
# Supongamos que tu HTML está en /htmls, y ahí tienes login.html
COPY ./htmls/ /usr/local/apache2/htdocs/

# Renombra login.html a index.html para que Apache lo sirva como inicio
RUN mv /usr/local/apache2/htdocs/login.html /usr/local/apache2/htdocs/index.html

# Opcional: copia también tus scripts y estilos si están en carpetas aparte
COPY ./js/ /usr/local/apache2/htdocs/js/
COPY ./style/ /usr/local/apache2/htdocs/style/

# Expone el puerto 80
EXPOSE 80
