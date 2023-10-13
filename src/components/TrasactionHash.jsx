import React from "react";

const TrasactionHash = ({ Hash, setHashModal }) => {
  const closeModal = () => {
    setHashModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
        <div className="flex flex-col z-50 p-6 bg-white rounded-lg gap-3 break-all mx-4">
          <div className="flex items-end justify-end">
            <button onClick={closeModal}>Close</button>
          </div>
          <div className="flex flex-col gap-2">
            <h1>Transaction hash : {Hash}</h1>
            <p>Explor the transaction follow this link</p>
            <a
              href={Hash}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:underline-offset-1 hover:text-blue-500"
            >
              Explore Transaction
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrasactionHash;
