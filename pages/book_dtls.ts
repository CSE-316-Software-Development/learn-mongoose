import express from 'express';
import Book from '../models/book';

const router = express.Router();

/**
 * @route GET /book_dtls
 * @query id - The ID of the book to retrieve details for
 * @returns An object containing the book title, author name, and book instances with imprint and status
 * @description Retrieves detailed information about a specific book by its ID
 */
router.get('/', async (req, res) => {
  try {
    const bookId = req.query.id as string;
    
    if (!bookId) {
      return res.status(400).send({ error: 'Book ID is required' });
    }
    
    const bookDetails = await Book.getBookDetails(bookId);
    
    if (!bookDetails) {
      return res.status(404).send({ error: 'Book not found' });
    }
    
    res.status(200).send(bookDetails);
  } catch (error) {
    console.error('Error in book details route:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

export default router;