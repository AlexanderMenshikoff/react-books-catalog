const AvailableBookList = (props) => {
  return (
    <div className="book__list_container">
      <h2>Список книг, доступных в системе:</h2>
      <div className="book__list_block-container">
        {props.bookList.map((el, index) => {
          return (
            <div className="book__list-item">{`${index + 1}. "${
              el.bookName
            }"`}</div>
          );
        })}
      </div>
    </div>
  );
};

export default AvailableBookList;
