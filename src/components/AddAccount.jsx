import { React, useState } from "react";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { userAccount } from "../redux/features/userAcc";
import DownloadPhase from "./DownloadPhase";
const bip39 = require("bip39");
const Buffer = require("buffer");

const AddAccount = ({ setAddWalletModal }) => {
  const dispatch = useDispatch();
  const [downloadPhase, setDownloadPhase] = useState(false);
  const [newAccount, setNewAccount] = useState({});

  const handleClose = () => {
    setAddWalletModal(false);
  };

  const get_account = () => {
    window.Buffer = window.Buffer || require("buffer").Buffer;

    // Get the mnemonic (recovery phrase)
    const mnemonic = bip39.generateMnemonic();

    // Create a new random wallet
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);
    const Private_key = wallet.privateKey;
    const Public_key = wallet.address;

    const Acc = {
      mnemonic: mnemonic,
      Private_key: Private_key,
      Public_key: Public_key,
    };
    dispatch(userAccount(Acc));
    setDownloadPhase(true);
    setNewAccount(Acc);
  };

  return (
    <>
      <div className="border-2 shadow-xl rounded-xl w-full md:mx-5">
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="flex flex-col z-50 p-2 bg-white rounded-lg shadow-2xl break-all mx-4">
            <div className="flex flex-col gap-3 w-full p-5">
              <h1 className="text-blue-500">Are you sure you want to add new account</h1>
              <div className="flex justify-around">
                <button
                  className="rounded-xl p-2 px-5 bg-green-500"
                  onClick={get_account}
                >
                  Yes
                </button>
                <button
                  className="border border-gray-400 rounded-xl p-2 px-5"
                  onClick={handleClose}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
        {downloadPhase ? (
          <DownloadPhase
            setDownloadPhase={setDownloadPhase}
            newAccount={newAccount}
            setAddWalletModal={setAddWalletModal}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default AddAccount;
