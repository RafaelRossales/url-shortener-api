# ✂️ Url Shortener 

#### 📄 [Swagger Documentation](http://localhost:3000/api)

This project is a Node.js application using NestJS and PostgreSQL. The application is containerized using Docker and Docker Compose.

## Prerequisites

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### 1. Clone the Repository 

```sh
git clone https://github.com/RafaelRossales/url-shortener-api.git
cd url-shortener-api

```

### 2. Env 

```sh
DATABASE_HOST
DATABASE_PORT
DATABASE_USER
DATABASE_PASSWORD
DATABASE_NAME
JWT_SECRET
```

### 3. RUN  

```sh
docker-compose up --build
```