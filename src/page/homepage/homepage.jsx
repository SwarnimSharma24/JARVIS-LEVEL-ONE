import React, { useEffect, useRef, useState } from "react";

const HomePage = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [isFocused, setIsFocused] = useState(false);
  const [jarvisText, setJarvisText] = useState("JARVIS");
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const particlesRef = useRef(null);
  const recognitionRef = useRef(null);

  // Fetch answer from backend
  const personalInfo = {
    name: "Jarvis",
    creator: "Swarnim Sharma",
    location: "Faridabad, India",
    lover: "Kannu",
    kannu: "Manager at astroscience and technologies and curretly she is 25 years old and looking for a guy like swarnim"
  };

  const fetchAIResponse = async (question) => {
    try {
      // Show loading state
      setAiResponse("Searching for answer...");

      // Convert question to lowercase for easier matching
      const lowerQuestion = question.toLowerCase();

      // Handle personal questions first
      if (
        lowerQuestion.includes("your name") ||
        lowerQuestion.includes("who are you")
      ) {
        const answer = `My name is ${personalInfo.name}.`;
        setAiResponse(answer);
        speakText(answer);
        return;
      }

      // Handle personal questions first
      if (
        lowerQuestion.includes("your lover") ||
        lowerQuestion.includes("who loves swarnim")
      ) {
        const answer = `${personalInfo.lover}.`;
        setAiResponse(answer);
        speakText(answer);
        return;
      }

            // Handle personal questions first
            if (
              lowerQuestion.includes("who is kannu") ||
              lowerQuestion.includes("who is kryshna rajput")
            ) {
              const answer = `She is ${personalInfo.kannu}.`;
              setAiResponse(answer);
              speakText(answer);
              return;
            }

      if (
        lowerQuestion.includes("who made you") ||
        lowerQuestion.includes("who created you") ||
        lowerQuestion.includes("who is your father")
      ) {
        const answer = `I was created by ${personalInfo.creator}.`;
        setAiResponse(answer);
        speakText(answer);
        return;
      }

      if (
        lowerQuestion.includes("where do you live") ||
        lowerQuestion.includes("your location")
      ) {
        const answer = `I live in ${personalInfo.location}.`;
        setAiResponse(answer);
        speakText(answer);
        return;
      }

      // For non-personal questions, call the API
      const res = await fetch(`${API_BASE_URL}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      // Process answer
      let finalAnswer = data.answer;
      if (data.source) {
        finalAnswer += `\n\n(Source: ${data.source})`;
      }

      setAiResponse(finalAnswer);
      speakText(data.answer); // Speak without source info
    } catch (err) {
      console.error("Fetch error:", err);
      const errorMsg = err.message.includes("500")
        ? "Server is having issues. Try again later."
        : "Couldn't connect to the server.";

      setAiResponse(errorMsg);
      speakText(errorMsg);
    }
  };

  // Speak text aloud
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  // Speech recognition setup
  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      console.warn("Speech recognition not supported in this browser");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    let localJarvisText = jarvisText;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setJarvisText("Listening...");
      localJarvisText = "Listening...";
    };

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const recognized = finalTranscript || interimTranscript;
      setRecognizedText(recognized);

      if (finalTranscript) {
        setJarvisText(finalTranscript);
        localJarvisText = finalTranscript;
        fetchAIResponse(finalTranscript);
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
      if (localJarvisText === "Listening...") {
        setJarvisText("JARVIS");
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Toggle listening
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setRecognizedText("");
      setAiResponse("");
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Couldn't start recognition:", error);
      }
    }
  };

  // Particle animation
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
      <div
        ref={particlesRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      />
      <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-purple-600 opacity-20 filter blur-3xl" />
      <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-indigo-600 opacity-20 filter blur-3xl" />

      <div
        className="cursor-pointer text-center"
        onClick={toggleListening}
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={() => setIsFocused(false)}
      >
        <span
          className={`text-green-50 text-4xl font-bold tracking-wider transition-all duration-300 ${
            isListening ? "text-indigo-300 animate-pulse" : ""
          }`}
        >
          {jarvisText}
        </span>
        <p className="text-gray-400 mt-2 text-sm">
          {isListening
            ? "Listening... Speak now"
            : isFocused
            ? "Click to speak"
            : "Click here to speak"}
        </p>

        {recognizedText && (
          <div className="mt-4 p-3 bg-gray-800 rounded-lg max-w-md mx-auto">
            <p className="text-gray-300 text-sm">I heard:</p>
            <p className="text-indigo-200">{recognizedText}</p>
          </div>
        )}

        {aiResponse && (
          <div className="mt-4 p-3 bg-gray-700 rounded-lg max-w-md mx-auto">
            <p className="text-gray-300 text-sm">JARVIS says:</p>
            <p className="text-green-200">{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
