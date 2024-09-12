ARG CI_REGISTRY=

FROM $CI_REGISTRY/node:20.12.0 AS builder
WORKDIR /app
COPY package*.json .npmrc ./
RUN npm install --force
COPY . .
ENV DEPLOY_STAGE="k8s"
ENV BASE_URL=/fullpath_placeholder/
RUN npm run build

FROM $CI_REGISTRY/deploy.images/nginx-unprivileged
COPY --chown=nginx 40-setup-env-vars.sh /docker-entrypoint.d/
COPY --chown=nginx --from=builder /app/build /app
RUN chmod +x /docker-entrypoint.d/40-setup-env-vars.sh
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
