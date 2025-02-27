/* eslint-disable react/prop-types */
import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ALL_GENRES } from "../queries";

const Books = ({ show, selectedGenre, handleGenreChange }) => {
  const bookResult = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
  });
  const getGenres = useQuery(ALL_GENRES);

  if (!show) {
    return null;
  }

  if (bookResult.loading || getGenres.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {bookResult.data.allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      {getGenres.data.allGenres.length > 0 && (
        <div>
          <label>
            select
            <select value={selectedGenre} onChange={handleGenreChange}>
              <option value={""}>all</option>
              {getGenres.data.allGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  );
};

export default Books;
