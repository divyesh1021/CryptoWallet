import React, { useState } from "react";
import { AiOutlineCloseSquare } from "react-icons/ai";
const HandleError = ({ errorVisible, setErrorVisible, errorMessage }) => {
  const handleErrorBox = () => {
    setErrorVisible(false);
  };

  console.log("errorMessage=--------------", errorMessage);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
        <div className="bg-red-500 text-white">
          <div className="flex justify-end">
            <button
              className="mt-2 px-4 rounded hover:bg-red-500 hover:text-white"
              onClick={handleErrorBox}
            >
              <AiOutlineCloseSquare className="text-4xl" />
            </button>
          </div>
          <div className="p-5 rounded shadow-lg">
            <p className="text-lg">{errorMessage}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HandleError;
