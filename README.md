# Meetup Service

Этот сервис предоставляет API для управления митапами.

## 🧑‍💻 Реализовано следующее:
  Meetup-service:
     ➡️ Nest.js CRUD контроллеры;
     ➡️ Joi валидация данных;
     ➡️ DTO схема для структурированной передачи данных;
     ➡️ Подключение проекта к PostgreSQL, используя Docker image, предоставляющий базу данных и ORM Prisma;
     ➡️ Сборка проекта в docker-compose файле.
     
## 🚀 Как запустить

### 1️⃣ Убедитесь, что установлен Docker и Docker Compose  
Скачать Docker: https://www.docker.com/get-started

### 2️⃣ Клонируйте репозиторий  
```
git clone https://github.com/He0rhi/Modsen_practice_2025/
cd meetup-service
```
### 3️⃣ Запустите контейнеры
```
docker-compose up --build
```
### 4️⃣ Проверка
После запуска API будет доступно по адресу:
http://localhost:3000

-GET
http://localhost:3000/meetups

-GET 
http://localhost:3000/meetups/id

-POST 
http://localhost:3000/meetups/

JSON:
```
{
  "title": "NestJS + ElasticSearch",
  "location": "MINSK",
  "date": "2024-02-20"
}
```

-PATCH 
http://localhost:3000/meetups/id

JSON:
```
{
  "title": "NestJS + ElasticSearch",
  "location": "UPDATE_MINSK",
  "date": "2024-02-20"
}
```

-DELETE 
http://localhost:3000/meetups/id

-SWAGGER DOCUMENTATION
http://localhost:3000/swagger/

## 🧑‍💻 Текущий стаус микросервиса митапов:
![изображение](https://github.com/user-attachments/assets/38db4386-12ca-41e8-9dbe-4dc2e9da08f5)

## 🧑‍💻 Текущий стаус микросервиса авторизации:
![изображение](https://github.com/user-attachments/assets/e9343566-bd63-4a0d-82c7-7cd59575e5ac)
