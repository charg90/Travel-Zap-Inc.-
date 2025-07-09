FROM node:18-alpine AS base
WORKDIR /app
COPY . .
RUN npm install


FROM node:18-alpine
WORKDIR /app
COPY --from=base /app .

EXPOSE 3001
CMD ["npm", "run", "start"]