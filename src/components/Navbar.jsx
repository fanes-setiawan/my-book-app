// import React from "react";
const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold">Book App</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}  
      >
        Logout
      </button>
      </div>
    </nav>
  );
};

export default Navbar;
