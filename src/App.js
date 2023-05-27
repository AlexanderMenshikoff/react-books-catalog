import { useEffect, useState } from "react";
import { db } from "./config/firebase";
import { getDocs, collection, updateDoc, doc } from "firebase/firestore";
import "./styles/main.css";
import Form from "./components/Form";
import AvailableBookList from "./components/AvailableBookList";
import BookDisplay from "./components/BooksDisplay";
import RandomBook from "./components/RandomBook";

const App = () => {
  const [bookList, setBookList] = useState([]);

  const booksCollectionRef = collection(db, "books");

  const initialState = {
    bookName: "",
    publicationYear: "",
    authorList: "",
    bookRating: "",
    ISBN: "",
  };

  const [data, setData] = useState(initialState);

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

  return (
    <div className="App">
      <RandomBook bookList={bookList} />

      <main>
        <BookDisplay bookList={bookList} setBookList={setBookList} />
      </main>
      <aside>
        <Form
          bookName={data.bookName}
          publicationYear={data.publicationYear}
          authorList={data.authorList}
          bookRating={data.bookRating}
          ISBN={data.ISBN}
          setData={setData}
          data={data}
          booksCollectionRef={booksCollectionRef}
          getBookList={getBookList}
          initialState={initialState}
        />
        <AvailableBookList bookList={bookList} />
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
