# Build stage
FROM registry.access.redhat.com/ubi9/nodejs-16 as builder

WORKDIR /opt/app-root/src/app

COPY package.json package-lock.json ./

USER root

RUN chmod -R u=g ./
RUN npm ci

COPY . .

# Prod stage
FROM registry.access.redhat.com/ubi9/nodejs-16

WORKDIR /opt/app-root/src/app

COPY package.json package-lock.json server.js ./
COPY src ./src

COPY --from=builder /opt/app-root/src/app/ ./

USER root

RUN chmod -R u=g ./ && \
    chown -R 0:0 ./

RUN npm prune --production

EXPOSE 8080

CMD npm start