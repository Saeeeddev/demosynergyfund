FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# NEXT_PUBLIC_* vars are baked in at build time, not read at runtime — they
# must be present here, not just in the container's environment later.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_PLATFORM_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_PLATFORM_URL=$NEXT_PUBLIC_PLATFORM_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN npm run build

EXPOSE 3001
CMD ["npm", "start", "--", "-p", "3001"]
