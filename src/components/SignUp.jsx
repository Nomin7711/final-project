import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config/api";
import Loader from "./Loader";

const Signup = () => {
    const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const filename = encodeURIComponent(file.name);
      const contentType = file.type;
      
      const response = await axios.post(BASE_URL + "user/signup", {...formData, profileImageName : filename, contentType});

      const { uploadURL } = response.data;
      if (!uploadURL) {
        setError("Failed to get upload URL");
        return;
      }
      const uploadResponse = await axios.put(uploadURL, file, {
        headers: { "Content-Type": file.type }});
      console.log(uploadResponse);
      setLoading(false);
      navigate("/login", { state: { message: "Signup successful! Please login using your email and password." } });
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div className="mb-4">
                <label
                    htmlFor="password"
                    className="block text-gray-700 font-medium"
                >
                    Profile picture
                </label>
                <div className="flex flex-col w-full  border border-gray-300 rounded-lg"> 
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className=" file:bg-gray-200 file:text-black file:py-2 file:px-4 file:rounded-lg file:border-0"
                    />
                </div>
            </div>
           
            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Log in
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Signup;
