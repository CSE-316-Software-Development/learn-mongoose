import { useState } from 'react';
import axios from 'axios';
import ViewAuthor from './authors';
import ViewBooks from './books';
import ShowStatus from './available';
import BookDetail from './bookdtls';
import AddBook from './addbook';
import makeUrl from '../utils/makeurl';

interface Content {
  data: string[];
  dtls: boolean;
}

/**
 * A function to render the content received from the server.
 * @returns The root component for the library client.
 */
export default function LibClient() {
  // The intial state for the content is an empty array.
  // The dtls is a boolean to show if the book details should be shown.
  // The book details are only shown from the book list page.
  const [content, setContent] = useState<Content>({ data: [], dtls: false });

  /**
   * The function builds the URL for the request to be sent to the server.
   * It also handles the response from the server and updates the component state.
   * Updating the component state causes the component to be re-rendered with the new data from the server response.
   * @param contentType 
   * @param bookId 
   */
  function handleContent(contentType: string, bookId: string = 'NA') {
    axios.get(makeUrl(contentType, bookId))
      .then(res => {
        let showDtls = false;
        if (contentType === 'books') {
          showDtls = true;
        }
        if (contentType === 'book_dtls') {
          const { title, author, bookInstances } = res.data;
          // Display book title and author at the top
          const headerInfo = [`Title: ${title}`, `Author: ${author}`];
          // Map book instances to display format
          const instancesInfo = bookInstances.map((instance: { imprint: string, status: string }) => {
            return `Copy: ${instance.imprint} | Status: ${instance.status}`;
          });
          // Combine header and instances information
          res.data = [...headerInfo, ...instancesInfo];
        }
        setContent({ data: res.data, dtls: showDtls });
      });
  }

  return (
    <div>
      <ol>
        {content.data.map((val, index) => (
          <li key={index}>
            {val}
            {content.dtls && <BookDetail book={val} handleContent={handleContent} />}
          </li>
        ))}
      </ol>
      <ViewAuthor handleContent={handleContent} />
      <ViewBooks handleContent={handleContent} />
      <ShowStatus handleContent={handleContent} />
      <AddBook />
    </div>
  );
}
