const RandomBook = (props) => {
  const getRandomGoodBook = () => {
    const bookRatingArr = props.bookList.map((el) => Number(el.bookRating));

    const filteredArray = props.bookList.filter((elem) => {
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
    <div className="recommended-book">
      <strong>Рекомендованная книга:</strong> {getRandomGoodBook()}
    </div>
  );
};

export default RandomBook;