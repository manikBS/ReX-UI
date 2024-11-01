FROM node:18-alpine
RUN set -ex && apk --no-cache add sudo
RUN apk --no-cache add ca-certificates && update-ca-certificates
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 3000
CMD npm run dev-server