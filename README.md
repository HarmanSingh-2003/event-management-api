# Event Management API

A RESTful API built using Node.js, Express, and PostgreSQL to manage events and user registrations. It allows creation of events, user registrations, cancellation, listing upcoming events, and retrieving event statistics.

---

## 📦 Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HarmanSingh-2003/event-management-api.git
   cd event-management-api
   
2. **Install dependencies:**
   ```bash
   npm install

3. **Create a .env file and add:**
   ```env
   PORT=3000
   DATABASE_URL=postgresql://your_user:your_password@localhost:5432/eventdb

4. **Create the PostgreSQL tables:**
   ```sql
   CREATE TABLE users (
   id SERIAL PRIMARY KEY,
   name VARCHAR(100) NOT NULL,
   email VARCHAR(100) UNIQUE NOT NULL
   );
   
   CREATE TABLE events (
   id SERIAL PRIMARY KEY,
   title VARCHAR(255) NOT NULL,
   datetime TIMESTAMP NOT NULL,
   location VARCHAR(100),
   capacity INTEGER CHECK (capacity > 0 AND capacity <= 1000)
   );

   CREATE TABLE registrations (
   user_id INTEGER REFERENCES users(id),
   event_id INTEGER REFERENCES events(id),
   PRIMARY KEY (user_id, event_id)
   );

5. **Start the server:**
   ```bash
   npx nodemon app.js

## 📘 API Description

| Method | Endpoint                | Description                                    |
|--------|-------------------------|------------------------------------------------|
| POST   | `/events`              | Create a new event                             |
| GET    | `/events/:id`          | Get event details including registered users   |
| POST   | `/events/:id/register` | Register a user for an event                   |
| DELETE | `/events/:id/cancel`   | Cancel a user’s registration                   |
| GET    | `/events/upcoming/list`| List all upcoming events                       |
| GET    | `/events/:id/stats`    | Get event statistics                           |

## 📥 Example Requests/Responses

### a. Create Event

**`POST /events`**

**Request Body:**
```json
{
  "title": "Tech Talk",
  "datetime": "2025-08-01T10:00:00",
  "location": "Delhi",
  "capacity": 100
}
```
**Response:**
```json
{
  "eventId": 1
}
```

### b. Get Event Details

**`GET /events/:id`**

**Response:**
```json
{
  "id": 1,
  "title": "Tech Talk",
  "datetime": "2025-08-01T10:00:00.000Z",
  "location": "Delhi",
  "capacity": 100,
  "registrations": [
    {
      "id": 1,
      "name": "Harman Singh",
      "email": "harman@example.com"
    }
  ]
}
```
### c. Register for Event

**`POST /events/:id/register`**

**Request Body:**
```json
{
  "userId": 1
}
```
**Response:**
```json
{
  "message": "User registered successfully."
}
```

### d. Cancel Registration

**`DELETE /events/:id/cancel`**

**Request Body:**
```json
{
  "userId": 1
}
```
**Response:**
```json
{
  "message": "Registration cancelled successfully"
}
```

### e. List Upcoming Events

**`GET  /events/upcoming/list`**

**Response:**
```json
{
  "upcomingEvents": [
    {
      "id": 1,
      "title": "Tech Talk",
      "datetime": "2025-08-01T04:30:00.000Z",
      "location": "Delhi",
      "capacity": 100
    }
  ]
}
```

### f. Event Stats

**`GET  /events/:id/stats`**

**Response:**
```json
{
  "totalRegistrations": 1,
  "remainingCapacity": 99,
  "percentageUsed": "1.00%"
}
```

