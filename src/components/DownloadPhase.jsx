import {React,useState} from "react";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { FaRegCopy } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DownloadPhase = ({ setDownloadPhase, newAccount, setAddWalletModal }) => {
  const [copied, setCopied] = useState(false);

  const handleClose = () => {
    setDownloadPhase(false);
    setAddWalletModal(false);
  };

  const copy_text = () => {
    const text = newAccount.mnemonic;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(()=>setCopied(false),6000)
    toast.success("copied!!");
  };

  const downloadTextAsFile = () => {
    const textToDownload = newAccount.mnemonic;
    const fileName = "mnemonic.txt";

    const blob = new Blob([textToDownload], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    setDownloadPhase(false);
    setAddWalletModal(false);
  };

  return (
    <>
      <div className="border-2 shadow-xl rounded-xl w-full md:mx-5">
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="flex flex-col z-50 p-2 bg-white rounded-lg shadow-2xl break-all mx-4 gap-2">
            <div className="flex justify-end">
              <AiOutlineCloseSquare
                className="text-4xl"
                onClick={handleClose}
              />
            </div>
            <h1 className="text-xl text-center">Mnmonic Key</h1>
            <p>Secure and download this key.</p>
            <div className="mt-2">
              <p className="flex justify-between gap-3">
                <span className="flex breal-all gap-3">
                  {newAccount.mnemonic}
                </span>
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
            <button
              className="border-2 bg-blue-300 text-xl font-medium p-2 rounded-lg"
              onClick={downloadTextAsFile}
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadPhase;
