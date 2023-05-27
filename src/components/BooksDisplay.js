import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { db } from "../config/firebase";
import { deleteDoc, updateDoc, doc } from "firebase/firestore";

const BookDisplay = (props) => {
  const deleteBook = async (id) => {
    const bookDoc = doc(db, "books", id);
    await deleteDoc(bookDoc);
    props.setBookList(props.bookList.filter((obj) => obj.id !== id));
  };
  // const updateBook = async (id) => {
  //   const bookDoc = doc(db, "books", id);
  //   await updateDoc(bookDoc, data);
  // };

  const maxSortedYearArray = props.bookList.map((book) => book.publicationYear);
  maxSortedYearArray.sort((a, b) => b - a);
  const maxSortedYearArrayWithoutRepeats = maxSortedYearArray.filter(
    (item, index) => maxSortedYearArray.indexOf(item) === index
  );
  const groupedByYearFilteredArr = maxSortedYearArrayWithoutRepeats.map(
    (el) => {
      return {
        year: el,
        books: props.bookList
          .filter((book) => book.publicationYear === el)
          .sort((x, y) => x.bookName.localeCompare(y.bookName)),
      };
    }
  );

  return groupedByYearFilteredArr.map((book, index) => (
    <div key={index}>
      <h1 className="book-grouped-year">
        {book.year > 0 || book.year ? book.year : "Год неизвестен"}
      </h1>
      {book.books.map((el) => {
        return (
          <div className="book-block" key={el.id}>
            <AiOutlineDelete
              onClick={() => deleteBook(el.id)}
              className="delete-icon"
            />
            {/* <AiOutlineEdit onClick={() => } className="edit-icon" /> */}

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
  ));
};

export default BookDisplay;
