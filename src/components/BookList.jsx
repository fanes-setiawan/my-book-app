import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// eslint-disable-next-line react/prop-types
const BookList = ( {hendleLogout}) => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [editedBook, setEditedBook] = useState({});
  const [newBook, setNewBook] = useState({
    title:"",
    author:"",
    year:"",
    description:"",
    category_id:null
  });


  //pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 6;

  //fetch books from API
  const fetchBooks = async () => {
    const token = localStorage.getItem("token");
    console.log("Token:", token)
    try {
      const response = await fetch("http://127.0.0.1:5000/api/books", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response:", response); 
      console.log("Response Status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Books Data:", data);
        setBooks(data.data.books);
        return;
      }else if (response.status === 401) {
        hendleLogout();
        return;
      } 
      else {
        console.error("Failed to fetch books:", response.status, response.statusText);
        alert("Failed to fetch books. Please check the API.");
      }
    } catch (error) {
      alert("An error occurred during fetching books.");
      console.error(error);
    }
  };

  //fetch categories
  const fetchCategories = async()=>{
    const token  = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:5000/api/category",{
        headers:{
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Categories Data:", data);
      setCategories(data);
    } catch (error) {
      alert("An error occurred during fetching categories.");
      console.error(error);
      
    }
  }
  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const totalPages = Math.ceil(books.length / itemPerPage);
  const paginatedBooks = books.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //handle add book
  const handleAddBook =async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:5000/api/book",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify(newBook),
      });
      console.log("POST -> BOOK:", response);
      console.log("POST -> Status BOOK:", response.status);

      if(response.ok){
        Swal.fire({
          icon:"success",
          title:"Book Added",
          text:"Book has been added successfully",
        });
        fetchBooks();
        setNewBook(
          {
            title:"",
            author:"",
            year:"",
            category:"",
            description:"",
          }
        )
      }else{
        Swal.fire({
          icon:"error",
          title:"Failed to add book",
          text:"Failed to add book. Please try again later.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon:"error",
        title:"Failed to add book",
        text:error.message,
      });
    }
  };

  //handle edit book
 const handleEditBook = (book) => {
    setSelectedBook(book);
    setEditedBook(...book);
  };


  //handle save book
  const handleSave =async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/books/${selectedBook.id}`,
        {
          method:"PUT",
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body:JSON.stringify(editedBook),
        }
      );
      if(response.ok){
        Swal.fire({
          icon:"success",
          title:"Book Updated",
          text:"Book has been updated successfully",
        });
        fetchBooks();
        setSelectedBook(null);
      }else{
        Swal.fire({
          icon:"error",
          title:"Failed to update book",
          text:"Failed to update book. Please try again later.",
        });
      }

    } catch (error) {
      Swal.fire({
        icon:"error",
        title:"Failed to update book",
        text:error.message,
      });
      
    }
  };

  //handle delete book
  const handleDeleteBook = async (bookId) => {
    const token = localStorage.getItem("token");
    console.log("Book ID:", bookId);
    Swal.fire({
      title:"Are you sure?",
      text:"You won't be able to revert this",
      icon:"warning",
      showCancelButton:true,
      confirmButtonColor:"#3085d6",
      cancelButtonColor:"#d33",
      confirmButtonText:"Yes, delete it",
    }).then(async (result) => {
      if(result.isConfirmed){
        try {
          const response = await fetch(`http://127.0.0.1:5000/api/books/${bookId}`,
            {
            method:"DELETE",
            headers:{
              "Authorization": `Bearer ${token}`,
            },
          });
          if(response.ok){
            Swal.fire({
              icon:"success",
              title:"Book Deleted",
              text:"Book has been deleted successfully",
            });
            fetchBooks();
          }else{
            Swal.fire({
              icon:"error",
              title:"Failed to delete book",
              text:"Failed to delete book. Please try again later.",
            });
          }
        } catch (error) {
          Swal.fire({
            icon:"error",
            title:"Failed to delete book",
            text:error.message,
          });
        }
      }else{
        Swal.fire({
          icon:"error",
          title:"Failed to delete book",
          text:"Failed to delete book. Please try again later.",
        });
      }
    })
  };


  
  return (
    <div className="container mx-auto my-8">
    
      {/* Add Book Form */}
    <div className="mb-6">
        <h3 className="text-2xl font-bold mb-6">Add Book</h3>
          <form className="bg-white p-6 rounded shadow-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                />
              </div>
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  placeholder="Author"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                />
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  placeholder="Year"
                  value={newBook.year}
                  onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                />
              </div>
              <select
              value={newBook.category_id}
              onChange={(e) => setNewBook({ ...newBook, category_id: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
              </select>
              <div className="col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Description"
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                ></textarea>
              </div>
              <button
            onClick={handleAddBook}
              className="col-span-2 mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Book
            </button>
            </div>
           
          </form>

      </div>

      {/* Book List */}
      <h2 className="text-3xl font-bold mb-4">Books</h2>
      {books.length > 0 ? (
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {paginatedBooks.map((book) => (
           <div
             key={book.id}
             className="bg-white p-4 rounded showdow-md border hover:shadow-lg"
           >
             <h3 className="text-xl font-bold">{book.title}</h3>
             <p>Author      : {book.author}</p>
             <p>Years       : {book.year}</p>
             <p>Category    : {book.category_name}</p>
             <p>Description : {book.description}</p>
             <div className="flex justify-between items-center">
               <button
                 className="bg-blue-500 text-white px-4 py-2 rounded"
                 onClick={() => handleEditBook(book)}
               >
                 Edit
               </button>
               <button
                 className="bg-red-500 text-white px-4 py-2 rounded"
                 onClick={() => handleDeleteBook(book.id)}
               >
                 Delete
               </button>
             </div>
           </div>
         ))}
       </div>

      ) : (
        <p>No books available.</p>
      )}
       {/* Pagination */}
       <div className="flex justify-center items-center mt-4">
         {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
           <button
             key={pageNumber}
             className={`px-4 py-2 mx-2 rounded ${
               pageNumber === currentPage
                 ? "bg-blue-500 text-white"
                 : "bg-gray-200 text-gray-800"
             }`}
             onClick={() => handlePageChange(pageNumber)}
           >
             {pageNumber}
           </button>
         ))}
       </div>

    {/* Edit Book Model*/}
    {selectedBook && (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-4 rounded shadow-md border">
          <h3 className="text-xl font-bold mb-4">Edit Book</h3>
          <form onSubmit={handleEditBook}>
            <div className="mb-4">
              <label htmlFor="title" className="block font-bold mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={editedBook.title}
                onChange={(e) => setEditedBook({ ...editedBook, title: e.target.value })}
                className="border p-2 mb-4 w-full"
                />
                <input
                type="text"
                placeholder="Author"
                value={editedBook.author}
                onChange={(e)=>setEditedBook({...editedBook,author:e.target.value})}
                className="border p-2 mb-4 w-full"
                />
                <input
                type="number"
                placeholder="Year"
                value={editedBook.year}
                onChange={(e)=>setEditedBook({...editedBook,year:e.target.value})}
                className="border p-2 mb-4 w-full"
                />
                <input
                type="text"
                placeholder="Category"
                value={editedBook.category}
                onChange={(e)=>setEditedBook({...editedBook,category:e.target.value})}
                className="border p-2 mb-4 w-full"
                />
                <input
                type="text"
                placeholder="Description"
                value={editedBook.description}
                onChange={(e)=>setEditedBook({...editedBook,description:e.target.value})}
                className="border p-2 mb-4 w-full"
                />
                <select
                value={editedBook.category_id}
                onChange={(e)=>setEditedBook({...editedBook,category_id:e.target.value})}
                className="border p-2 mb-4 w-full"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => setSelectedBook(null)}
                  >
                    Cancel
                  </button>
                </div>
            </div>
            
          </form>
        </div>
      </div>
    )}
    </div>
   
  );
};

export default BookList;
