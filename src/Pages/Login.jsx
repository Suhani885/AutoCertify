import React, { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const instance = axios.create({
    withCredentials: true,
    baseURL: "https://10.21.98.8:8000",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);

    try {
      const response = await instance.post(
        "/my_app/login/",
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.length > 0) {
        navigate("/main");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login Failed");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-100 via-blue-300 to-indigo-400 p-5">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-indigo-50 rounded-3xl shadow-2xl">
        <div className="md:w-1/2 p-8 flex items-center justify-center">
          <DotLottieReact
            src="https://lottie.host/3e82e3cf-46d8-485f-b7a2-5efa9b8b4d9a/8nyHYEEZ7a.lottie"
            className="w-full h-full"
            loop
            autoplay
          />
        </div>

        <div className="md:w-1/2 py-16 px-10">
          <div className="flex justify-center mb-3">
            <img
              src="src/assets/certLogo.png"
              alt="Logo"
              className="max-h-20 object-contain"
            />
          </div>
          <p className="text-center text-indigo-400 mb-7">
            Please log in to your account
          </p>
          <form className="mb-5" onSubmit={handleSubmit}>
            <div className="mb-5">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-4 text-center py-2 bg-white border border-purple-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300"
                placeholder="EMAIL"
                required
              />
            </div>
            <div className="mb-8 relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,16}"
                className="mt-1 block text-center w-full px-4 py-2 bg-white border border-purple-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300"
                placeholder="PASSWORD"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-4 flex items-center text-purple-400 focus:outline-none"
              >
                {/* {showPassword ? <FaEyeSlash /> : <FaEye />} */}
              </button>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 font-semibold text-lg text-white bg-gradient-to-r from-purple-200 via-violet-400 to-indigo-600 rounded-full shadow-2xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
