import { useState, useEffect } from "react";
import { useQuery, useApolloClient, useSubscription } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Recommendations from "./components/Recommendations";
import Login from "./components/Login";

import { ME, BOOK_ADDED, ALL_BOOKS } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("");
  const client = useApolloClient();

  const { data: userData, loading: userLoading } = useQuery(ME);
  const favoriteGenre = userData?.me?.favoriteGenre;

  const bookResult = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
  });

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      //   const addedBook = data.data.bookAdded;
      alert("New book added!");

      bookResult.refetch();
    },
  });

  useEffect(() => {
    const localUserToken = localStorage.getItem("app-user-token");
    if (localUserToken) {
      setToken(localUserToken);
    }
  }, []);

  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem("app-user-token", token);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage("authors");
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  if (userLoading) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={handleLogout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <Authors show={page === "authors"} />
      <Books
        show={page === "books"}
        selectedGenre={selectedGenre}
        handleGenreChange={handleGenreChange}
      />
      {favoriteGenre && (
        <Recommendations
          show={page === "recommend"}
          favoriteGenre={favoriteGenre}
        />
      )}
      <NewBook show={page === "add"} favoriteGenre={favoriteGenre} />
      <Login show={page === "login"} handleLogin={handleLogin} />
    </div>
  );
};

export default App;
