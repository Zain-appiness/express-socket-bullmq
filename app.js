var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors'); // Import createError for handling 404
const db = require('./models'); // Sequelize models
const authRoutes = require('./public/routes/auth'); // Authentication routes

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);

// Database Connection
db.sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err.message || err);
  });

// Sync the models with the database
db.sequelize.sync({ alter: true }) // Use `force: true` for dropping and recreating tables (for dev only)
  .then(() => {
    console.log('Database and tables synced successfully!');
  })
  .catch((error) => {
    console.error('Sync error:', error.message || error);
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // send the error as a response
    res.status(err.status || 500).json({
        error: res.locals.message,
        stack: res.locals.error.stack,
    });
});

module.exports = app;
