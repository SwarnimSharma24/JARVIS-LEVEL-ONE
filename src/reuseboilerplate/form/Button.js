import React from "react";

const Button = ({ name, onClick }) => {
  return (
    <div>
      <button
        onClick={onClick}
        className="border bg-purple-300 text-gray-700 border-purple-600 p-2 rounded-full min-w-[150px]"
      >
        <i><b>{name}</b></i>
      </button>
    </div>
  );
};

export default Button;
