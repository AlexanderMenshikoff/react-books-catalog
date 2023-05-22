import { useEffect, useState } from "react";

import { db } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

const App = () => {
  const [bookList, setBookList] = useState([]);

  // New book States
  const [newBookName, setNewBookName] = useState("");
  const [newPublicationYear, setNewPublicationYear] = useState(0);
  const [newAuthorName, setNewAuthorName] = useState("");
  const [newBookRating, setNewBookRating] = useState(0);
  const [newBookISBN, setNewBookISBN] = useState("");

  // Update Title State
  const [updatedBookName, setUpdatedBookName] = useState("");
  const [updatedPublicationYear, setUpdatedPublicationYear] = useState(0);
  const [updatedAuthorName, setUpdatedAuthorName] = useState("");
  const [updatedBookRating, setUpdatedBookRating] = useState(0);
  const [updatedBookISBN, setUpdatedBookISBN] = useState("");

  const booksCollectionRef = collection(db, "books");

  const getBookList = async () => {
    try {
      const data = await getDocs(booksCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setBookList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getBookList();
    console.log("useEffect");
  }, []);

  const onSubmitBook = async () => {
    try {
      await addDoc(booksCollectionRef, {
        bookName: newBookName,
        publicationYear: newPublicationYear,
        authorList: newAuthorName,
        bookRating: newBookRating,
        ISBN: newBookISBN,
      });
      getBookList();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBook = async (id) => {
    const bookDoc = doc(db, "books", id);
    await deleteDoc(bookDoc);
  };

  const updateBookTitle = async (id) => {
    const bookDoc = doc(db, "books", id);
    await updateDoc(bookDoc, {
      bookName: updatedBookName,
      publicationYear: updatedPublicationYear,
      authorList: updatedAuthorName,
      bookRating: updatedBookRating,
      ISBN: updatedBookISBN,
    });
  };

  const maxSortedYearArray = bookList.map((book) => book.publicationYear);
  maxSortedYearArray.sort((a, b) => b - a);
  const maxSortedYearArrayWithoutRepeats = maxSortedYearArray.filter(
    (item, index) => maxSortedYearArray.indexOf(item) === index
  );
  const groupedByYearFilteredArr = maxSortedYearArrayWithoutRepeats.map(
    (el) => {
      return {
        year: el,
        books: bookList.filter((book) => book.publicationYear === el),
      };
    }
  );

  const getRandomGoodBook = () => {
    const bookRatingArr = bookList.map((el) => el.bookRating);

    const filteredArray = bookList.filter((elem) => {
      return (
        new Date().getFullYear() - elem.publicationYear >= 3 &&
        elem.publicationYear > 0 &&
        elem.bookRating === Math.max.apply(null, bookRatingArr)
      );
    });

    const filteredBookNameArray = filteredArray.map((el) => {
      return el.bookName;
    });

    const randomIndex = Math.floor(
      Math.random() * filteredBookNameArray.length
    );
    return filteredBookNameArray[randomIndex];
  };

  return (
    <div className="App">
      <div>
        <input
          placeholder="book title..."
          onChange={(e) => setNewBookName(e.target.value)}
        />
        <input
          placeholder="Publication year"
          type="number"
          onChange={(e) => setNewPublicationYear(Number(e.target.value))}
        />
        <input
          placeholder="Author name"
          onChange={(e) => setNewAuthorName(e.target.value)}
        />
        <input
          placeholder="book rating"
          type="number"
          onChange={(e) => setNewBookRating(Number(e.target.value))}
        />
        <input
          placeholder="ISBN"
          onChange={(e) => setNewBookISBN(e.target.value)}
        />

        <button onClick={onSubmitBook}> Submit book</button>
      </div>
      <h1>Рекомендованная книга: {getRandomGoodBook()}</h1>

      <div>
        {groupedByYearFilteredArr.map((book) => (
          <div key={book.id}>
            <h1>{book.year > 0 || book.year ? book.year : "Год неизвестен"}</h1>
            {book.books.map((el) => {
              return (
                <div>
                  <h2>{el.bookName ? el.bookName : "Нет названия"} </h2>
                  <p>
                    Author:{el.authorList ? el.authorList : "Автор неизвестен"}{" "}
                  </p>
                  <p>
                    Book rating:{" "}
                    {el.bookRating || el.bookRating > 0
                      ? el.bookRating
                      : "Нет рейтинга"}
                  </p>
                  <p>ISBN: {el.ISBN ? el.ISBN : "Нет ISBN"}</p>
                  <input
                    placeholder="new title..."
                    onChange={(e) => setUpdatedBookName(e.target.value)}
                  />
                  <input
                    placeholder="new publication year"
                    onChange={(e) =>
                      setUpdatedPublicationYear(Number(e.target.value))
                    }
                  />
                  <input
                    placeholder="new author name"
                    onChange={(e) => setUpdatedAuthorName(e.target.value)}
                  />
                  <input
                    placeholder="new book rating"
                    onChange={(e) => setUpdatedBookRating(e.target.value)}
                  />
                  <input
                    placeholder="new ISBN"
                    onChange={(e) => setUpdatedBookISBN(e.target.value)}
                  />
                  <button onClick={() => updateBookTitle(el.id)}>
                    Update Title
                  </button>
                  <button onClick={() => deleteBook(el.id)}>
                    {" "}
                    Delete book
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
