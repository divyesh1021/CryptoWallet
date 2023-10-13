import React from "react";
import { useDispatch } from "react-redux";
import { userAccount } from "../redux/features/userAcc";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RecoverAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dataReceived = JSON.parse(sessionStorage.getItem("myData"));

  const Import_account = async () => {
    dispatch(userAccount(dataReceived));
    toast.success("Account Imported Successfully");
    navigate("/");
  };

  return (
    <>
      <div className="flex flex-col gap-3 container mx-auto  border-2 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-3xl px-12 py-14 break-all">
        <div className="flex flex-col gap-3">
          <button
            className="border-none rounded-lg p-2 px-5 bg-blue-300 hover:bg-blue-400 text-lg font-medium"
            onClick={Import_account}
          >
            Import Account
          </button>
          <p className="text-red-500 text-lg font-medium">
            If you want to import this account into your wallet. So click on the
            Import Wallet button.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="font-medium">Your Account Details is here...</h1>
          <p className="rounded-xl p-3 bg-blue-300">
            <p>Public Key : </p>
            {dataReceived.Public_key}
          </p>
          <p className="rounded-xl p-3 bg-blue-300">
            <p>Private_key : </p>
            {dataReceived.Private_key}
          </p>
        </div>
      </div>
    </>
  );
};

export default RecoverAccount;
