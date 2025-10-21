# ====== Stage 1: Build ======
FROM node:22-alpine AS builder

# Define diretório de trabalho
WORKDIR /app

# 1) Copia package.json
COPY package.json ./

# 2) Instala dependências
RUN npm install 

# 3) Copia todos os tsconfig e o vite.config
COPY tsconfig*.json vite.config.ts ./
COPY pwa-assets.config.ts ./

# 4) Copia código-fonte e assets
COPY src ./src
COPY public ./public
COPY index.html ./

# 5) Gera build de produção
RUN npm run build


# ====== Stage 2: Runtime ======
FROM nginx:stable-alpine

# Ajusta variável de ambiente padrão para Cloud Run
ARG PORT=8080
ENV PORT=${PORT}

# Remove configuração default e adiciona uma customizada
RUN rm /etc/nginx/conf.d/default.conf
RUN printf "\
server {\n\
    listen ${PORT} default_server;\n\
    listen [::]:${PORT} default_server;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    # Para index.html: instrui navegador e CDN a não cachear ou revalidar sempre.\n\
    location = /index.html {\n\
        add_header Cache-Control 'no-cache, no-store, must-revalidate';\n\
        try_files \$uri /index.html =404;\n\
    }\n\
\n\
    # Para sw.js (Service Worker): também não deve ser cacheado agressivamente.\n\
    location = /sw.js { \n\
        add_header Cache-Control 'no-cache, no-store, must-revalidate';\n\
        try_files \$uri =404;\n\
    }\n\
\n\
    # Para todas as outras requisições (rotas da SPA e assets estáticos)\n\
    location / {\n\
        try_files \$uri \$uri/ /index.html;\n\
    }\n\
}\n" > /etc/nginx/conf.d/custom.conf

# Copia os arquivos gerados pelo build
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta (o Cloud Run irá respeitar $PORT)
EXPOSE ${PORT}

# Inicia o nginx em primeiro plano
CMD ["nginx", "-g", "daemon off;"]