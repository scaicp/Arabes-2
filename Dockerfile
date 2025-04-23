# Usa nginx como base
FROM nginx:alpine

# Elimina la configuración por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copia tus archivos al directorio donde nginx los sirve
COPY ./public /usr/share/nginx/html

# Expone el puerto por defecto de nginx
EXPOSE 80

# nginx ya se ejecuta por defecto como ENTRYPOINT en esta imagen
