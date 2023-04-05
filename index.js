require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
const logoutRoute = require('./routes/logout');
const resetRoute = require('./routes/reset');
const dashboardRoute = require('./routes/dashboard');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use('/api/signup', signupRoute);
app.use('/api/login', loginRoute);
app.use('/api/logout', logoutRoute);
app.use('/api/reset', resetRoute);
app.use('/api/dashboard', dashboardRoute);

database.on('error', (error) => {
    console.log(error)
})
database.once('connected', () => {
    console.log('Database connected!');
})

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});