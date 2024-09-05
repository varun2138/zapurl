import React from "react";

const Error = ({ message }) => {
  return (
    <div>
      <p className="text-sm text-red-600 m-1 flex flex-start italic">
        {message}
      </p>
    </div>
  );
};

export default Error;
