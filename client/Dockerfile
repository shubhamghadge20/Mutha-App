# Build stage
FROM node:20-alpine as builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# Production stage
FROM nginx:alpine

# 🔥 Add this line to copy your custom nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built app
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
