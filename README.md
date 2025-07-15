Event Management API:

A RESTful API built using Node.js, Express, and PostgreSQL to manage events and user registrations. It allows creation
of events, user registrations, cancellation, listing upcoming events, and retrieving event statistics.

■ Setup instructions

1. Clone the repository:
 git clone https://github.com/your-username/event-management-api.git
 cd event-management-api

2. Install dependencies:
 npm install

3. Create a .env file in the root folder and add your PostgreSQL credentials:
 PORT=3000
 DATABASE_URL=postgresql://your_user:your_password@localhost:5432/eventdb

4. Create the PostgreSQL database and run these SQL commands:
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
 
5. Start the server:
 npx nodemon app.js
The server will run at http://localhost:3000

■ API Endpoints:

1. Create Event
POST /events
Creates a new event. Capacity must be between 1 and 1000.
Request Body:
{
 "title": "Tech Talk",
 "datetime": "2025-08-01T10:00:00",
 "location": "Delhi",
 "capacity": 100
}
Response:
{
 "eventId": 1
}

2. Get Event Details
GET /events/:id
Returns all event details including registered users.
Response:
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
Registers a user for the event. Prevents duplicate, full, or past registrations.
Request Body:
{
 "userId": 1
}
Response:
{
 "message": "User registered successfully."
}

4. Cancel Registration
DELETE /events/:id/cancel
Cancels a user's registration.
Request Body:
{
 "userId": 1
}
Response:
{
 "message": "Registration cancelled successfully"
}

5. List Upcoming Events
GET /events/upcoming/list
Returns all future events sorted by date and location.
Response:
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
{
 "totalRegistrations": 1,
 "remainingCapacity": 99,
 "percentageUsed": "1.00%"
}
