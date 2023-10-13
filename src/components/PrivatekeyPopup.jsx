import { React, useState } from "react";
import { useSelector } from "react-redux";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { FaRegCopy } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Popup = ({ setIsModalOpen, privateKey }) => {
  const Account = useSelector((state) => state.acc.acc1.value);

  const [copied, setCopied] = useState(false);

  const handleSidebar = () => {
    setIsModalOpen(false);
  };

  const copy_text = () => {
    const text = privateKey;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 6000);
        toast.success("copied!!");
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div className="border-2 shadow-xl rounded-xl w-full md:mx-5">
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="flex flex-col z-50 p-2 bg-white rounded-lg shadow-2xl break-all mx-4">
            <div className="flex justify-end">
              <AiOutlineCloseSquare
                className="text-4xl"
                onClick={handleSidebar}
              />
            </div>
            <h1 className="text-xl text-center">Private_key</h1>
            <div className="mt-2">
              <p className="flex justify-between gap-3">
                <span className="flex breal-all gap-3">{privateKey}</span>
                <span>
                  {copied ? (
                    <FaRegCheckCircle
                      className="text-xl"
                      fill="green"
                      onClick={copy_text}
                    />
                  ) : (
                    <FaRegCopy className="text-xl" onClick={copy_text} />
                  )}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Popup;
