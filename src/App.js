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
import "./styles/main.css";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

const App = () => {
  const [bookList, setBookList] = useState([]);

  const booksCollectionRef = collection(db, "books");

  const initialState = {
    bookName: "",
    publicationYear: "",
    authorList: "",
    bookRating: 0,
    ISBN: "",
  };

  const [data, setData] = useState(initialState);

  let handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  console.log(data);

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
      if (!data.bookName) {
        alert("Книга должна иметь название");
      } else if (data.bookName.length > 100) {
        alert("Название книги не может превышать 100 символов");
      } else if (!data.authorList) {
        alert("Должен быть хотя бы один автор");
      } else if (data.publicationYear < 1800) {
        alert("Год публикации должен быть не раньше 1800 года");
      } else if (data.bookRating >= 10 || !Number.isInteger(data.bookRating)) {
        alert("Рейтинг должен быть целым числом от 0 до 10");
      } else {
        await addDoc(booksCollectionRef, data);
        getBookList();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBook = async (id) => {
    const bookDoc = doc(db, "books", id);
    await deleteDoc(bookDoc);
  };

  const updateBook = async (id) => {
    const bookDoc = doc(db, "books", id);
    await updateDoc(bookDoc, data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
        books: bookList
          .filter((book) => book.publicationYear === el)
          .sort((x, y) => x.bookName.localeCompare(y.bookName)),
      };
    }
  );

  const getRandomGoodBook = () => {
    const bookRatingArr = bookList.map((el) => Number(el.bookRating));

    const filteredArray = bookList.filter((elem) => {
      return (
        new Date().getFullYear() - elem.publicationYear >= 3 &&
        elem.publicationYear > 0 &&
        Number(elem.bookRating) === Math.max.apply(null, bookRatingArr)
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
      <div className="recommended-book">
        <strong>Рекомендованная книга:</strong> {getRandomGoodBook()}
      </div>

      <main>
        {groupedByYearFilteredArr.map((book) => (
          <div key={book.id}>
            <h1 className="book-grouped-year">
              {book.year > 0 || book.year ? book.year : "Год неизвестен"}
            </h1>
            {book.books.map((el) => {
              return (
                <div className="book-block">
                  <AiOutlineDelete
                    onClick={() => deleteBook(el.id)}
                    className="delete-icon"
                  />
                  {/* <AiOutlineEdit
                    onClick={() => updateBook(el.id)}
                    className="edit-icon"
                  /> */}

                  <h2 className="book-name">
                    {el.bookName ? el.bookName : "Нет названия"}{" "}
                  </h2>
                  <p className="book-block__item">
                    Автор: {el.authorList ? el.authorList : "неизвестен"}{" "}
                  </p>
                  <p className="book-block__item">
                    Рейтинг:{" "}
                    {el.bookRating || el.bookRating > 0
                      ? el.bookRating
                      : "Нет рейтинга"}
                  </p>
                  <p className="book-block__item">
                    ISBN: {el.ISBN ? el.ISBN : "Нет ISBN"}
                  </p>
                </div>
              );
            })}
          </div>
        ))}
      </main>
      <aside>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Название книги"
            onChange={handleInputChange}
            value={data.bookName}
            name="bookName"
          />
          <input
            placeholder="Год публикации"
            type="text"
            onChange={handleInputChange}
            value={data.publicationYear}
            name="publicationYear"
          />
          <input
            placeholder="Автор"
            onChange={handleInputChange}
            value={data.authorList}
            name="authorList"
          />
          <input
            placeholder="Рейтинг"
            type="number"
            onChange={handleInputChange}
            value={data.bookRating}
            name="bookRating"
          />
          <input
            placeholder="ISBN"
            onChange={handleInputChange}
            value={data.ISBN}
            name="ISBN"
          />

          <button onClick={onSubmitBook}> Submit book</button>
        </form>
        <div className="book__list_container">
          <h2>Список книг, доступных в системе:</h2>
          <div className="book__list_block-container">
            {bookList.map((el, index) => {
              return (
                <div className="book__list-item">{`${index + 1}. "${
                  el.bookName
                }"`}</div>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default App;

{
  /* <input
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
                  </button> */
}
