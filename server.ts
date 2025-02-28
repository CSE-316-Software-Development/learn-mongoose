import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import homeRouter from './pages/home';
import availableRouter from './pages/books_status';
import bookRouter from './pages/books';
import authorRouter from './pages/authors';
import createBookRouter from './pages/create_book';
import bookDetailsRouter from './pages/book_dtls';

// Create express app
const app = express();
// Setup server port
const port = 8000;
// setup the server to listen on the given port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const mongoDB = 'mongodb://127.0.0.1:27017/my_library_db';
mongoose.connect(mongoDB);
const db = mongoose.connection;

// Bind database connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// when successfully connected log a message
db.on('connected', () => {
  console.log('Connected to database');
});

/**
 * Middleware to specify cors policy.
 * This will intercept every request.
 * This is unsafe because it trusts all origins.
 * Do not use this in production.
 */
app.use(cors());

// setup the router middleware for this server
app.use('/home', homeRouter);

app.use('/available', availableRouter);

app.use('/books', bookRouter);

app.use('/authors', authorRouter);

app.use('/newbook', createBookRouter);

app.use('/book_dtls', bookDetailsRouter);
