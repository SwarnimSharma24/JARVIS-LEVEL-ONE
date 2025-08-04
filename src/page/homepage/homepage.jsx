import React, { useEffect, useRef, useState } from "react";

const HomePage = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [jarvisText, setJarvisText] = useState("JARVIS");
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const particlesRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports the Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn("Speech recognition not supported in this browser");
      return;
    }

    // Create speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    // Event handlers
    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setJarvisText("Listening...");
    };

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setRecognizedText(finalTranscript || interimTranscript);
      
      // Update JARVIS text with what we heard
      if (finalTranscript) {
        setJarvisText(finalTranscript);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      setJarvisText("Error occurred");
      setTimeout(() => setJarvisText("JARVIS"), 2000);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      if (jarvisText === "Listening...") {
        setJarvisText("JARVIS");
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Toggle listening state
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setRecognizedText("");
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Couldn't start recognition:", error);
      }
    }
  };

  // Particle animation effect (same as before)
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

      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      particle.style.left = `${startX}%`;
      particle.style.top = `${startY}%`;

      const duration = Math.random() * 20 + 10;
      const xMovement = (Math.random() - 0.5) * 40;
      const yMovement = (Math.random() - 0.5) * 40;

      particle.style.transition = `all ${duration}s linear`;
      particlesRef.current.appendChild(particle);

      setTimeout(() => {
        particle.style.transform = `translate(${xMovement}px, ${yMovement}px)`;
      }, 10);

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

      {/* Main container */}
      <div 
        className="cursor-pointer text-center"
        onClick={toggleListening}
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={() => setIsFocused(false)}
      >
        <span className={`text-green-50 text-4xl font-bold tracking-wider transition-all duration-300 ${isListening ? "text-indigo-300 animate-pulse" : ""}`}>
          {jarvisText}
        </span>
        <p className="text-gray-400 mt-2 text-sm">
          {isListening ? "Listening... Speak now" : (isFocused ? "Click to speak" : "Click here to speak")}
        </p>
        {recognizedText && (
          <div className="mt-4 p-3 bg-gray-800 rounded-lg max-w-md mx-auto">
            <p className="text-gray-300 text-sm">I heard:</p>
            <p className="text-indigo-200">{recognizedText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;