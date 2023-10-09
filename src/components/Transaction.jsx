import { React, useState } from "react";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Hourglass } from "react-loader-spinner";
import TrasactionHash from "./TrasactionHash";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ethers = require("ethers");

const Transaction = ({
  setTransaction,
  handleButtonClick,
  // Account,
  selectedPublickey,
  selectedPrivateKey,
}) => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://sepolia.infura.io/v3/a000e9d4c4a84f2da055fd797eab742f"
  );

  const Account = useSelector((state) => state.acc.acc1?.value);

  const [selectedOption, setSelectedOption] = useState("Account 1");
  const [amount, setAmount] = useState("");
  const [accountData, setAccountData] = useState({
    Public_key: "",
    Private_key: "",
    mnemonic: "",
  });
  const [HashModal,setHashModal] = useState(false);
  const [Hash,setHash] = useState("");
  const [loading, setLoading] = useState(false);

  const wallet = new ethers.Wallet(selectedPrivateKey, provider);

  const handleClose = () => {
    setTransaction(false);
  };

  console.log("amountamountamountamount", amount);

  const handleDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    console.log("account++++++++++++++>>>>>>>>>>>>>>>>>>>>", Account);

    if (selectedValue.startsWith("Account ")) {
      const accountIndex =
        parseInt(selectedValue.replace("Account ", ""), 10) - 1;
      const account = Account[accountIndex];

      try {
        const balance = await provider.getBalance(account.Public_key);
        const balanceInEther = ethers.utils.parseEther(balance.toString());

        setAccountData({
          Public_key: account.Public_key,
          Private_key: account.Private_key,
          mnemonic: account.mnemonic,
          balance: balanceInEther,
        });
        console.log("setAccountData 999999999", balanceInEther);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setAccountData(null); // Clear the data if there's an error
      }
    }
  };

  // const amount_eth = ethers.utils.parseEther(amount);

  const Transfer_Amount = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const tx = await wallet.sendTransaction({
        to: accountData.Public_key,
        value: ethers.utils.parseEther(amount.toString()),
      });
      await tx.wait();
      setLoading(false);
      setHashModal(true);
      setHash(tx.hash);
      toast("Transaction successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
            <div className="flex flex-col z-50 p-6 bg-white rounded-lg gap-3 break-all mx-4">
              <Hourglass />
            </div>
          </div>
        ) : (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
            <div className="flex flex-col z-50 p-6 bg-white rounded-lg gap-3 break-all mx-4">
              <div className="flex justify-end">
                <AiOutlineCloseSquare
                  className="text-4xl"
                  onClick={handleClose}
                />
              </div>
              <div className="flex flex-col gap-5">
                <select
                  value={selectedOption}
                  onChange={handleDropdownChange}
                  className="border-2 border-black rounded-lg text-xl p-2 w-auto"
                >
                  <option value="">Select an option</option>
                  {Account.map((_, index) => (
                    <option key={index} value={`Account ${index + 1}`}>
                      {`Account ${index + 1}`}
                    </option>
                  ))}
                  {/* <option value="generate">Generate Account</option>
                <option value="recover">Recover Account</option> */}
                </select>
                {/* {selectedOption === "generate" || selectedOption === "recover" ? (
                <button
                  className="border-2 border-black rounded-lg text-xl p-2 w-auto"
                  onClick={handleButtonClick}
                  // disabled={!selectedOption}
                >
                  {selectedOption === "generate"
                    ? "Generate Account"
                    : "Recover Account"}
                </button>
              ) : ( */}
                <div className="flex flex-col gap-4">
                  <p className="border-2 rounded-xl p-3 ">
                    To : {accountData?.Public_key}
                  </p>
                  <p className="border-2 rounded-xl p-3">
                    From : {selectedPublickey}
                  </p>

                  <form
                    action=""
                    className="flex flex-col gap-3"
                    onSubmit={Transfer_Amount}
                  >
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="Enter Amount"
                      className="border-2 border-black rounded-lg p-2"
                      onChange={(e) => {
                        setAmount(e.target.value);
                      }}
                    />
                    <button className="border-2 rounded-xl p-3 text-xl font-semibold">
                      Send
                    </button>
                  </form>
                  {/* <h1 className="text-xl font-bold text-center">
                  Balance: {accountData.balance} Ether
                </h1> */}
                  {/* <button className="text-4xl" onClick={handleTransaction}>
                  <span className="flex justify-center">
                    <BsFillArrowUpRightCircleFill
                      className="text-center"
                      fill="blue"
                    />
                  </span>
                </button> */}
                  {/* <button
                  className="border-2 rounded-xl p-3"
                  onClick={() => handlePrivatekey(accountData.Private_key)}
                >
                  Export Private_key
                </button> */}

                  {/* <p>Private Key: {accountData.Private_key}</p> */}
                  {/* <p>Mnemonic: {accountData.mnemonic}</p> */}
                </div>
                {/* )} */}
              </div>
            </div>
          </div>
        )}
        {HashModal ? (<TrasactionHash Hash={Hash} setHashModal={setHashModal}/>):("")}
      </div>
    </>
  );
};

export default Transaction;
