import { addDoc } from "firebase/firestore";

const Form = (props) => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  let handleInputChange = (event) => {
    props.setData({
      ...props.data,
      [event.target.name]: event.target.value,
    });
  };
  const onSubmitBook = async () => {
    try {
      if (!props.bookName) {
        alert("Книга должна иметь название.");
      } else if (props.bookName.length > 100) {
        alert("Название книги не может превышать 100 символов.");
      } else if (!props.authorList) {
        alert("Должен быть хотя бы один автор.");
      } else if (props.publicationYear < 1800) {
        alert("Год публикации должен быть не раньше 1800 года.");
      } else if (props.publicationYear > new Date().getFullYear()) {
        alert("Год публикации должен быть не позже текущего года.");
      } else if (
        props.bookRating >= 10 ||
        props.bookRating.includes(".") ||
        props.bookRating.includes(",")
      ) {
        alert("Рейтинг должен быть целым числом от 0 до 10.");
      } else {
        await addDoc(props.booksCollectionRef, props.data);
        props.getBookList();
        props.setData(props.initialState);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Название книги"
        onChange={handleInputChange}
        value={props.bookName}
        name="bookName"
      />
      <input
        placeholder="Год публикации"
        type="number"
        onChange={handleInputChange}
        value={props.publicationYear}
        name="publicationYear"
      />
      <input
        placeholder="Автор"
        onChange={handleInputChange}
        value={props.authorList}
        name="authorList"
      />
      <input
        placeholder="Рейтинг"
        type="number"
        onChange={handleInputChange}
        value={props.bookRating}
        name="bookRating"
      />
      <input
        placeholder="ISBN"
        onChange={handleInputChange}
        value={props.ISBN}
        name="ISBN"
      />

      <button onClick={onSubmitBook}> Добавить книгу</button>
    </form>
  );
};

export default Form;
