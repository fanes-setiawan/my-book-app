import { useEffect, useState } from "react";

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://127.0.0.1:5000/api/books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Response:", response); // Debug response
        console.log("Response Status:", response.status); // Debug response status
        if (response.ok) {
          const data = await response.json();
          console.log("Books Data:", data); // Debug data
          setBooks(data.data.books); // Perbaikan: Ambil hanya data buku
        } else {
          console.error("Failed to fetch books:", response.status, response.statusText);
          alert("Failed to fetch books. Please check the API.");
        }
      } catch (error) {
        alert("An error occurred during fetching books.");
        console.error(error);
      }
    };
    fetchBooks();
  }, []);
  
  return (
    <div className="container mx-auto my-8">
      <h2 className="text-3xl font-bold mb-4">Books</h2>
      {books.length > 0 ? (
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {books.map((book) => (
           <div
             key={book.id}
             className="bg-white p-4 rounded showdow-md border hover:shadow-lg"
           >
             <h3 className="text-xl font-bold">{book.title}</h3>
             <p>Author      : {book.author}</p>
             <p>Years       : {book.year}</p>
             <p>Category    : {book.category_name}</p>
             <p>Description : {book.description}</p>
           </div>
         ))}
       </div>

      ) : (
        <p>No books available.</p>
      )}
    </div>
  );
};

export default BookList;
