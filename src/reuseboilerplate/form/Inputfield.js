import React from "react";

const Inputfield = ({ value, type = "text", onChange, name, label }) => {
  return (
    <div>
      <label>
        <i>
          <b>
        <span className="text-gray-500 transition duration-300 ease-in-out hover:text-gray-700">{label}</span>
          </b>
        </i>
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        name={name}
        className="p-2 border rounded w-full"
      />
    </div>
  );
};

export default Inputfield;
