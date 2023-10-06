import { React, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userAccount } from "../redux/features/userAcc";
import { useNavigate } from "react-router-dom";
import Form from "../components/Recoverphase";

const ethers = require("ethers");
const bip39 = require("bip39");
const Buffer = require("buffer");

const Generatewallet = () => {

  const navigate = useNavigate();

  // const [lockWallet, unlockWallet] = useState(false);
  const [isFormVisible, setFormVisibility] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);



  const handleButtonClick = () => {
    setFormVisibility(!isFormVisible);
  };

  const Account = useSelector((state) => state.acc.acc1?.value);
  const dispatch = useDispatch();

  console.log("getting", Account);

  const get_account = () => {
    setButtonDisabled(true);
    window.Buffer = window.Buffer || require("buffer").Buffer;

    // Get the mnemonic (recovery phrase)
    const mnemonic = bip39.generateMnemonic();
    console.log("mnemonic", mnemonic);

    // Create a new random wallet
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    const Private_key = wallet.privateKey;
    const Public_key = wallet.address;

    console.log("Privatekey :", wallet.privateKey);
    console.log("public key :", wallet.address);


    const Acc = {
      mnemonic: mnemonic,
      Private_key: Private_key,
      Public_key: Public_key,
    };
    dispatch(userAccount(Acc ));
    navigate("/wallet");
  };

  

  // const data = Account?.filter((el) => el.memonic === state return el)

  return (
    <>
      <div>
        <div className="flex gap-8">
          <button
            className="border-2 border-black rounded-lg text-xl p-2 w-auto"
            onClick={() => get_account()} disabled={buttonDisabled}
          >
            Generate Account
          </button>
          <button className="border-2 border-black rounded-lg text-xl p-2 w-auto" onClick={handleButtonClick}>
            Recover Account
          </button>
        </div>
          {isFormVisible ? (<Form isFormVisible={isFormVisible} setFormVisibility={setFormVisibility}/>):("")}
      </div>
    </>
  );
};

export default Generatewallet;
