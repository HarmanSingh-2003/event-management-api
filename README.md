# Event Management API

A RESTful API built using Node.js, Express, and PostgreSQL to manage events and user registrations. It allows creation of events, user registrations, cancellation, listing upcoming events, and retrieving event statistics.

---

## 📦 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/HarmanSingh-2003/event-management-api.git
   cd event-management-api
Install dependencies

bash
Copy
Edit
npm install
Create a .env file and add:

env
Copy
Edit
PORT=3000
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/eventdb
Create the PostgreSQL tables

sql
Copy
Edit
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
Start the server

bash
Copy
Edit
npx nodemon app.js
Server will run at: http://localhost:3000

📌 API Endpoints
1. Create Event
POST /events
Creates a new event. Capacity must be between 1 and 1000.

Request Body:

json
Copy
Edit
{
  "title": "Tech Talk",
  "datetime": "2025-08-01T10:00:00",
  "location": "Delhi",
  "capacity": 100
}
Response:

json
Copy
Edit
{
  "eventId": 1
}
2. Get Event Details
GET /events/:id
Returns all event details including registered users.

Response:

json
Copy
Edit
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
3. Register for Event
POST /events/:id/register
Registers a user. Prevents duplicate, full, or past registrations.

Request Body:

json
Copy
Edit
{
  "userId": 1
}
Response:

json
Copy
Edit
{
  "message": "User registered successfully."
}
4. Cancel Registration
DELETE /events/:id/cancel
Cancels a user's registration.

Request Body:

json
Copy
Edit
{
  "userId": 1
}
Response:

json
Copy
Edit
{
  "message": "Registration cancelled successfully"
}
5. List Upcoming Events
GET /events/upcoming/list
Returns all future events sorted by date and location.

Response:

json
Copy
Edit
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
6. Event Stats
GET /events/:id/stats
Returns total registrations, remaining capacity, and percentage used.

Response:

json
Copy
Edit
{
  "totalRegistrations": 1,
  "remainingCapacity": 99,
  "percentageUsed": "1.00%"
}