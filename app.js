require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const questionRoutes = require('./routes/question');

// DB Connection
mongoose
	.connect(process.env.URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		dbName: 'lms_conv',
	})
	.then(() => {
		console.log('DB CONNECTED');
	});

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', questionRoutes);

// PORT
const port = process.env.PORT || 5000;
// Starting server
app.listen(port, () => {
	console.log(`Server up and running on http://localhost:${port}`);
});
