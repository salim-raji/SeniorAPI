const express = require('express');
const mongoose = require('mongoose');
const placeRoutes = require('./controllers/placeController');
const favoriteRoutes = require('./controllers/favoriteController');
const plannerRoutes = require('./controllers/plannerController');
const destinationRoutes = require('./controllers/destinationController');
const userDataRoutes = require('./controllers/userDataController');
const recommendationRoutes = require('./controllers/recommendationController');



const cors = require("cors");


const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const ApplicationUser = require('./models/user');
const authService = require('./services/authService');

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", methods: ["GET", "POST", "PATCH", "DELETE"], allowedHeaders: ["Content-Type", "Authorization"], credentials: true }));
// Routes
app.use('/api', recommendationRoutes);
app.use('/api/user', userDataRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/planners', plannerRoutes);
app.use('/api/destinations', destinationRoutes);
// Login Route
app.post('/api/auth/login', [
    body('email').isEmail(),
    body('password').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await ApplicationUser.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = authService.generateToken(user);
    res.json({ token, userId: user._id });
});

// Register Route
app.post('/api/auth/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new ApplicationUser({ email, passwordHash: hashedPassword });

    await user.save();
    const token = authService.generateToken(user);
    res.json({ token });
});


mongoose.connect('mongodb+srv://salimraji:1234@seniorproject.lbrtq.mongodb.net/SeniorProject?retryWrites=true&w=majority&appName=SeniorProject', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(3000, () => console.log('Server running on port 3000'));
    })
    .catch(error => console.log(error));
