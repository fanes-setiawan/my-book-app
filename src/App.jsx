
import  { useState } from "react";
import Navbar from "./components/Navbar";
import BookList from "./components/BookList";
import Login from "./components/Login";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const hendleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div>
      {token ? (
        <>
          <Navbar />
          <BookList hendleLogout={hendleLogout}/>
        </>
      ) : (
        <Login setToken={setToken} />
      )}
    </div>
  );
}
export default App;