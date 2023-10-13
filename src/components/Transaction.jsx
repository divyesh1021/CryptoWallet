import { React, useState } from "react";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Hourglass } from "react-loader-spinner";
import TrasactionHash from "./TrasactionHash";
import { Blocks } from "react-loader-spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ethers = require("ethers");

const Transaction = ({
  HashLink,
  networkProvider,
  setTransaction,
  selectedPublickey,
  selectedPrivateKey,
}) => {
  const provider = new ethers.providers.JsonRpcProvider(networkProvider);

  const Account = useSelector((state) => state.acc.acc1?.value);

  const [selectedOption, setSelectedOption] = useState("Account 1");
  const [amount, setAmount] = useState("");
  const [accountData, setAccountData] = useState({
    Public_key: "",
    Private_key: "",
    mnemonic: "",
  });
  const [HashModal, setHashModal] = useState(false);
  const [Hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [AddressLoading, setAddressLoading] = useState("");

  const wallet = new ethers.Wallet(selectedPrivateKey, provider);

  const handleClose = () => {
    setTransaction(false);
  };

  const handleDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    if (selectedValue.startsWith("Account ")) {
      const accountIndex =
        parseInt(selectedValue.replace("Account ", ""), 10) - 1;
      const account = Account[accountIndex];

      try {
        setAddressLoading(true);

        const balance = await provider.getBalance(account.Public_key);
        const balanceInEther = ethers.utils.parseEther(balance.toString());

        setAccountData({
          Public_key: account.Public_key,
          Private_key: account.Private_key,
          mnemonic: account.mnemonic,
          balance: balanceInEther,
        });
        setAddressLoading(false);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setAccountData(null);
      }
    }
  };

  const Transfer_Amount = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const tx = await wallet.sendTransaction({
        to: accountData.Public_key,
        value: ethers.utils.parseEther(amount.toString()),
        gasPrice: ethers.utils.parseUnits("5", "gwei"),
        gasLimit: 21000,
      });
      await tx.wait();
      setLoading(false);
      setHashModal(true);
      const H = `${HashLink}${tx.hash}`;
      setHash(H);
      toast.success("Transaction successfully");
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
                </select>

                <div className="flex flex-col gap-4">
                  <p className="border-2 rounded-xl p-3 ">
                    {AddressLoading ? (
                      <Blocks borderColor="" width="60" height="30" />
                    ) : (
                      `To : ${accountData?.Public_key}`
                    )}
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
                </div>
              </div>
            </div>
          </div>
        )}
        {HashModal ? (
          <TrasactionHash
            Hash={Hash}
            networkHashLink={HashLink}
            setHashModal={setHashModal}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Transaction;
