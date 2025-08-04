import React, { useEffect, useRef, useState } from "react";
import Inputfield from "../reuseboilerplate/form/Inputfield";
import Button from "../reuseboilerplate/form/Button";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchLoginRequest, clearLoginData } from "../features/login/userSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const {
    login: { loginData },
  } = useSelector((state) => state);
  const { message: succesMessage, status: successStatus } = loginData;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
  });

  const [isFocused, setIsFocused] = useState(false);
  const particlesRef = useRef(null);

  const HandleChange = (value, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const HandleSubmit = () => {
    dispatch(fetchLoginRequest(formData));
  };
  const HandleSubmitJarvis = () => {
    navigate("/home");
  };

  useEffect(() => {
    if (successStatus === true) {
      navigate("/home");
      dispatch(clearLoginData());
    }
  }, [successStatus]);

  // Particle animation effect
  useEffect(() => {
    if (!particlesRef.current) return;

    const colors = ["#6366f1", "#8b5cf6", "#a855f7", "#d946ef"];
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.style.position = "absolute";
      particle.style.width = `${Math.random() * 5 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = "50%";
      particle.style.opacity = Math.random() * 0.5 + 0.1;

      // Starting position
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      particle.style.left = `${startX}%`;
      particle.style.top = `${startY}%`;

      // Animation
      const duration = Math.random() * 20 + 10;
      const xMovement = (Math.random() - 0.5) * 40;
      const yMovement = (Math.random() - 0.5) * 40;

      particle.style.transition = `all ${duration}s linear`;
      particlesRef.current.appendChild(particle);

      // Animate
      setTimeout(() => {
        particle.style.transform = `translate(${xMovement}px, ${yMovement}px)`;
      }, 10);

      // Continuous animation
      setInterval(() => {
        particle.style.transition = "none";
        particle.style.transform = `translate(0, 0)`;
        setTimeout(() => {
          particle.style.transition = `all ${duration}s linear`;
          particle.style.transform = `translate(${xMovement}px, ${yMovement}px)`;
        }, 10);
      }, duration * 1000);
    }

    return () => {
      if (particlesRef.current) {
        particlesRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden relative">
      {/* Animated background particles */}
      <div
        ref={particlesRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      />

      {/* Glowing orb decoration */}
      <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-purple-600 opacity-20 filter blur-3xl" />
      <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-indigo-600 opacity-20 filter blur-3xl" />

      {/* Main login container */}
      <div
        className={`relative z-10 w-full max-w-md px-8 py-12 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-3xl border border-gray-700 shadow-2xl transition-all duration-500 ${
          isFocused ? "ring-2 ring-purple-500" : ""
        }`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >

        {/* Logo/Header done */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Please enter your credentials</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <Inputfield
            label="Login ID"
            value={formData.loginId}
            name="loginId"
            onChange={(value) => HandleChange(value, "loginId")}
            className="bg-gray-700 border-gray-600 focus:border-purple-500 focus:ring-purple-500 text-white"
            placeholder="Enter your login ID"
            labelClassName="text-gray-300"
          />

          <Inputfield
            label="Password"
            value={formData.password}
            name="password"
            type="password"
            onChange={(value) => HandleChange(value, "password")}
            className="bg-gray-700 border-gray-600 focus:border-purple-500 focus:ring-purple-500 text-white"
            placeholder="••••••••"
            labelClassName="text-gray-300"
          />

          {succesMessage && !successStatus && (
            <div className="text-red-400 text-sm -mt-4">{succesMessage}</div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              name="Sign In"
              onClick={HandleSubmit}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            />
            <Button
              name="Move To Jarvis"
              onClick={HandleSubmitJarvis}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            />
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <a href="#" className="hover:text-purple-400 transition-colors">
            Forgot password?
          </a>
          <span className="mx-2">•</span>
          <a
            href="#"
            className="hover:text-purple-400 transition-colors"
            onClick={() => navigate("/register")}
          >
            Create account
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Your Brand. All rights reserved.
      </div>
    </div>
  );
};

export default LoginPage;
