const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Route to create a new event
router.post('/', eventController.createEvent);

// Route to fetch event details by ID
router.get('/:id', eventController.getEventDetails);

// Route to register a user for an event
router.post('/:id/register', eventController.registerUser);

// Route to cancel a user’s registration from an event
router.delete('/:id/cancel', eventController.cancelRegistration);

// Route to list all upcoming events with sorting
router.get('/upcoming/list', eventController.getUpcomingEvents);

// Route to get event registration stats
router.get('/:id/stats', eventController.getEventStats);

module.exports = router;
