/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";

const Login = ({ setToken })=> {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("http://127.0.0.1:5000/api/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (data.access_token) {
            setToken(data.access_token);
            localStorage.setItem("token", data.access_token);
        } else {
            alert("Login failed!");
        }
    } catch (error) {
        alert("An error occurred during login!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
        <form
        className="bg-white p-6 rounded-lg shadow-md w-80"
        onSubmit={handleLogin}
        >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="username">
            Username
            </label>
            <input
            type="text"
            placeholder="Username"
            value={username}  
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-400 rounded-lg"
            required
            />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
            Password
            </label>
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-400 rounded-lg"
            required
            />
        </div>
        <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
        Login
        </button>
        </form>
    </div>
  )
}

export default Login;