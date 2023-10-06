import { React, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HandleError from "./HandleError";
import { AiOutlineCloseSquare } from "react-icons/ai";
const ethers = require("ethers");

const Recoverphase = ({ isFormVisible, setFormVisibility }) => {
  const [phase, setPhase] = useState("");
  // const [isFormVisible, setFormVisibility] = useState(true);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const Account = useSelector((state) => state.acc.acc1?.value);
  console.log("Account+++++++++++", Account);

  const handleFormSubmit = () => {
    setFormVisibility(false);
  };

  console.log("phase", phase);

  // const handleCloseError = () => {
  //   setClose(false);
  // };

  const RecoverAccount = (e) => {
    e.preventDefault();
    const recover_phase = phase;
    // console.log(phase)
    // const data = Account?.filter((el) => el.memonic === state return el)
    const data = Account?.filter((el) => el.mnemonic === phase);

    //console.log("data!!!!!!!!", data[0].mnemonic);
    console.log("phase-----------------", phase);
    if (data && phase === data[0]?.mnemonic && data.length > 0) {
      try {
        console.log("----------------");
        window.alert("Your account is already exits");
        navigate("/wallet");
      } catch (error) {
        setErrorVisible(true);
        if (phase == "") {
          setErrorMessage("Enter your mnmonic key!");
        } else {
          setErrorMessage(
            "Your mnmonic key is not curret, enter a valid mnmonic key"
          );
        }
      }
    } else {
      try {
        const mnemonic_key = phase;
        const wallet = ethers.Wallet.fromMnemonic(mnemonic_key);

        // console.log("Privatekey :", wallet.privateKey);
        // console.log("public key :", wallet.address);
        const sendRecoverData = {
          mnemonic: mnemonic_key,
          Private_key: wallet.privateKey,
          Public_key: wallet.address,
        };
        console.log("sendRecoverData", sendRecoverData);
        sessionStorage.setItem("myData", JSON.stringify(sendRecoverData));
        window.location.href = "/recoveraccount";
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  return (
    <>
      <div>
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="flex flex-col z-50 bg-white rounded-lg shadow-lg mx-4">
            <div className="flex justify-end p-3">
              <button
                className="absolute text-black hover:text-gray-800 p-2 rounded-lg"
                onClick={handleFormSubmit}
              >
                <AiOutlineCloseSquare className="text-4xl" />
              </button>
            </div>
            <div className="my-16 p-5">
              <form
                className="flex flex-col gap-3"
                action=""
                onSubmit={RecoverAccount}
              >
                <h3 className="text-center text-lg font-light">
                  Recover account
                </h3>
                <input
                  type="text"
                  placeholder="Enter your recovery phase"
                  className="text-center p-3 border-2 border-black"
                  onChange={(e) => {
                    setPhase(e.target.value);
                  }}
                />
                <button
                  className="border-2 border-black p-3 rounded-lg"
                  type="submit"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
        {/* {errorVisible ? (
          <HandleError
            errorMessage={errorMessage}
            errorVisible={errorVisible}
            setErrorVisible={setErrorVisible}
          />
        ) : (
          ""
        )} */}
      </div>
    </>
  );
};

export default Recoverphase;
