import  { useState } from "react";

import Navbar from "./components/Navbar";
import BookList from "./components/BookList";
import Login from "./components/Login";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <div>
      {token ? (
        <>
          <Navbar />
          <BookList />
        </>
      ) : (
        <Login setToken={setToken} />
      )}
    </div>
  );
}
export default App;