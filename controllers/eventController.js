const pool = require('../db/db');

// Create a new event
exports.createEvent = async (req, res) => {
  const { title, datetime, location, capacity } = req.body;

  if (!title || !datetime || !location || !capacity) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  if (capacity <= 0 || capacity > 1000) {
    return res.status(400).json({ error: 'Capacity should be between 1 and 1000.' });
  }

  try {
    const insertQuery = `
      INSERT INTO events (title, datetime, location, capacity)
      VALUES ($1, $2, $3, $4) RETURNING id
    `;
    const result = await pool.query(insertQuery, [title, datetime, location, capacity]);
    res.status(201).json({ eventId: result.rows[0].id });
  } catch (error) {
    console.error('Failed to create event:', error.message);
    res.status(500).json({ error: 'Server error while creating event.' });
  }
};

// Fetch event with registered users
exports.getEventDetails = async (req, res) => {
  const eventId = req.params.id;

  try {
    const eventQuery = 'SELECT * FROM events WHERE id = $1';
    const eventRes = await pool.query(eventQuery, [eventId]);

    if (eventRes.rowCount === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const event = eventRes.rows[0];

    const attendeesQuery = `
      SELECT users.id, users.name, users.email
      FROM registrations
      JOIN users ON users.id = registrations.user_id
      WHERE registrations.event_id = $1
    `;
    const userRes = await pool.query(attendeesQuery, [eventId]);

    res.status(200).json({
      id: event.id,
      title: event.title,
      datetime: event.datetime,
      location: event.location,
      capacity: event.capacity,
      registrations: userRes.rows
    });
  } catch (error) {
    console.error('Error retrieving event info:', error.message);
    res.status(500).json({ error: 'Server error while fetching event details.' });
  }
};

// Register a user for an event
exports.registerUser = async (req, res) => {
  const eventId = req.params.id;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId must be provided.' });
  }

  try {
    const eventRes = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);

    if (eventRes.rowCount === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const event = eventRes.rows[0];
    if (new Date(event.datetime) < new Date()) {
      return res.status(400).json({ error: 'Cannot register for a past event.' });
    }

    const countRes = await pool.query(
      'SELECT COUNT(*) FROM registrations WHERE event_id = $1',
      [eventId]
    );
    const registrationCount = parseInt(countRes.rows[0].count);
    if (registrationCount >= event.capacity) {
      return res.status(400).json({ error: 'Event is already full.' });
    }

    const duplicateCheck = await pool.query(
      'SELECT 1 FROM registrations WHERE user_id = $1 AND event_id = $2',
      [userId, eventId]
    );
    if (duplicateCheck.rowCount > 0) {
      return res.status(400).json({ error: 'User already registered for this event.' });
    }

    await pool.query(
      'INSERT INTO registrations (user_id, event_id) VALUES ($1, $2)',
      [userId, eventId]
    );

    res.status(200).json({ message: 'User registered successfully.' });

  } catch (error) {
    console.error('Registration failed:', error.message);
    res.status(500).json({ error: 'Error during registration.' });
  }
};

// Cancel a user's registration
exports.cancelRegistration = async (req, res) => {
  const eventId = req.params.id;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required.' });
  }

  try {
    const checkRes = await pool.query(
      'SELECT 1 FROM registrations WHERE user_id = $1 AND event_id = $2',
      [userId, eventId]
    );

    if (checkRes.rowCount === 0) {
      return res.status(400).json({ error: 'User was not registered for this event.' });
    }

    await pool.query(
      'DELETE FROM registrations WHERE user_id = $1 AND event_id = $2',
      [userId, eventId]
    );

    res.status(200).json({ message: 'Registration cancelled successfully.' });

  } catch (error) {
    console.error('Cancellation failed:', error.message);
    res.status(500).json({ error: 'Error while cancelling registration.' });
  }
};

// List future events sorted by date & location
exports.getUpcomingEvents = async (req, res) => {
  try {
    const upcomingQuery = `
      SELECT * FROM events
      WHERE datetime > NOW()
      ORDER BY datetime ASC, location ASC
    `;
    const result = await pool.query(upcomingQuery);
    res.status(200).json({ upcomingEvents: result.rows });
  } catch (error) {
    console.error('Failed to retrieve upcoming events:', error.message);
    res.status(500).json({ error: 'Server error while fetching events.' });
  }
};

// Show event stats (registrations, capacity, usage %)
exports.getEventStats = async (req, res) => {
  const eventId = req.params.id;

  try {
    const capRes = await pool.query('SELECT capacity FROM events WHERE id = $1', [eventId]);
    if (capRes.rowCount === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const capacity = capRes.rows[0].capacity;

    const countRes = await pool.query(
      'SELECT COUNT(*) FROM registrations WHERE event_id = $1',
      [eventId]
    );

    const registered = parseInt(countRes.rows[0].count);
    const remaining = capacity - registered;
    const percentUsed = ((registered / capacity) * 100).toFixed(2);

    res.status(200).json({
      totalRegistrations: registered,
      remainingCapacity: remaining,
      percentageUsed: `${percentUsed}%`
    });
  } catch (error) {
    console.error('Stats retrieval error:', error.message);
    res.status(500).json({ error: 'Error while getting event stats.' });
  }
};
