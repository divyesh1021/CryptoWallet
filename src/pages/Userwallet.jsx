import { React, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userAccount } from "../redux/features/userAcc";
import { LockAccount, unLockAccount } from "../redux/features/LockUnlock";
import { useNavigate, useLocation } from "react-router-dom";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { FaWallet } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaEthereum } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { FaTrashRestoreAlt } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa";
import { removeUser } from "../redux/features/userAcc";
import Form from "../components/Recoverphase";
import Popup from "../components/PrivatekeyPopup";
import Transaction from "../components/Transaction";
import DownloadPhase from "../components/DownloadPhase";
import Password from "../components/Password";
import DeleteModal from "../components/DeleteModal";

const ethers = require("ethers");
const bip39 = require("bip39");
const Buffer = require("buffer");

const Userwallet = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recoverData = location.state?.data || null;

  const [selectedOption, setSelectedOption] = useState("Account 1");
  const [accountData, setAccountData] = useState({
    Public_key: "",
    Private_key: "",
    mnemonic: "",
  });
  const [isFormVisible, setFormVisibility] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [accountBalances, setAccountBalances] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrivateKey, setSelectedPrivateKey] = useState("");
  const [selectedPublickey, setSelectedPublickey] = useState("");
  const [copied, setCopied] = useState(false);
  const [downloadPhase, setDownloadPhase] = useState(false);
  const [openTransaction, setTransaction] = useState(false);
  const [newAccount, setNewAccount] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [openDeleteBox,setopenDeleteBox ] = useState(false);

  const provider = new ethers.providers.JsonRpcProvider(
    "https://sepolia.infura.io/v3/a000e9d4c4a84f2da055fd797eab742f"
  );

  // const handleButtonClick = () => {
  //   setFormVisibility(!isFormVisible);
  // };

  const handlelock = useSelector((state) => state.acc.auth.check);
  const GetPassword = useSelector((state) => state.acc.pwd.password);
  const dispatch = useDispatch();
  console.log("GetPassword------->>>>>>>", GetPassword);

  const handleLock = () => {
    setPasswordVisible(true);
    // dispatch(LockAccount(false));
  };

  const handleUnlock = () => {
    setPasswordVisible(true);
    // dispatch(unLockAccount(true));
  };

  const Account = useSelector((state) => state.acc.acc1?.value);
  // const dispatch = useDispatch();

  useEffect(() => {
    // When the component first loads, set the default option and display its data
    handleDropdownChange({ target: { value: selectedOption } });
  }, []);

  console.log("getting", Account);

  const handlePrivatekey = (privateKey) => {
    setSelectedPrivateKey(privateKey);
    setIsModalOpen(true);
  };

  const unlockPrivatekey = (privateKey) => {
    setSelectedPrivateKey(privateKey);
    setPasswordVisible(true);
  };

  const copy_text = () => {
    const text = accountData.Public_key;
    navigator.clipboard
      .writeText(text)
      .then(() => setCopied(true))
      .catch((error) => console.log(error));
  };

  const handleTransaction = (publickey, privatekey) => {
    setTransaction(true);
    setSelectedPublickey(publickey);
    setSelectedPrivateKey(privatekey);
  };

  console.log(openTransaction);

  const handleDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    if (selectedValue.startsWith("Account ")) {
      const accountIndex =
        parseInt(selectedValue.replace("Account ", ""), 10) - 1;
      const account = Account[accountIndex];

      try {
        const balance = await provider.getBalance(account.Public_key);
        const balanceInEther = ethers.utils.formatEther(balance);

        setAccountData({
          Public_key: account.Public_key,
          Private_key: account.Private_key,
          mnemonic: account.mnemonic,
          balance: balanceInEther,
        });
        console.log("setAccountData 999999999", accountData);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setAccountData(null); // Clear the data if there's an error
      }
    }
  };

  const get_account = () => {
    setButtonDisabled(true);
    window.Buffer = window.Buffer || require("buffer").Buffer;

    // Get the mnemonic (recovery phrase)
    const mnemonic = bip39.generateMnemonic();
    console.log("mnemonic", mnemonic);

    // Create a new random wallet
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);
    const Private_key = wallet.privateKey;
    const Public_key = wallet.address;

    console.log("Privatekey :", wallet.privateKey);
    console.log("public key :", wallet.address);

    const Acc = {
      mnemonic: mnemonic,
      Private_key: Private_key,
      Public_key: Public_key,
    };
    dispatch(userAccount(Acc));
    setDownloadPhase(true);
    setNewAccount(Acc);
    // navigate("/");
  };

  const handleButtonClick = () => {
    if (selectedOption === "generate") {
      // Handle Generate Account logic
      get_account();
    } else if (selectedOption === "recover") {
      // Handle Recover Account logic
      // For example, set isFormVisible to true to show the form
      setFormVisibility(!isFormVisible);
    }
  };

  const handleRecoverAccoount = () => {
    setFormVisibility(!isFormVisible);
  };

  const Delete_Account = (id) => {
    console.log("fdggfjjhjk", id);
    dispatch(removeUser(id));
    window.location.reload();
  };

  const handleDelete = () => {
    setopenDeleteBox(true);
  }

  const handleLockUnlock = () => {
    if (!GetPassword) {
      handleLock();
    } else {
      dispatch(LockAccount(false));
    }
  };

  return (
    <>
      {handlelock ? (
        // <div className="h-[550px] border-2 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-xl p-8">
        <div className=" container mx-auto  border-2 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-xl p-8">
          <div
            className="flex justify-around font-normal gap-2 flex-wrap flex-col 2xl:flex-row xl:flex-row lg:flex-row
          "
          >
            <button
              className="items-center border-2 rounded-xl p-2 text-lg"
              onClick={get_account}
            >
              <span className="flex gap-2 items-center">
                <FaWallet className="text-lg" />
                ADD Wallet
              </span>
            </button>
            <button
              className="border-2  rounded-xl p-2 text-lg"
              onClick={handleRecoverAccoount}
            >
              <span className="flex gap-2 items-center">
                <FaTrashRestoreAlt className="text-lg" />
                Recover Account
              </span>
            </button>
            <button
              className="border-2 rounded-xl p-2 text-lg"
              onClick={handleLockUnlock}
            >
              <span className="flex gap-2 items-center">
                <FaLock className="text-lg" />
                Lock Wallet
              </span>
            </button>
          </div>
          <div className="flex flex-col justify-center py-10 gap-5">
            <select
              value={selectedOption}
              onChange={handleDropdownChange}
              className="border-2 rounded-lg text-xl p-2 w-auto"
            >
              <option value="">Select an option</option>
              {Account.map((_, index) => (
                <option key={index} value={`Account ${index + 1}`}>
                  {`Account ${index + 1}`}
                </option>
              ))}
              <option value="generate">Generate Account</option>
              <option value="recover">Recover Account</option>
            </select>
            {selectedOption === "generate" || selectedOption === "recover" ? (
              <button
                className="border-2 rounded-lg text-xl p-2 w-auto"
                onClick={handleButtonClick}
              >
                {selectedOption === "generate"
                  ? "Generate Account"
                  : "Recover Account"}
              </button>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="flex justify-between border-2 rounded-xl p-3 bg-blue-300 gap-3">
                  <span className="flex gap-2 break-all">
                    <FaEthereum className="text-2xl" />
                    {accountData.Public_key}
                  </span>
                  <span>
                    <FaRegCopy className="text-xl" onClick={copy_text} />
                  </span>
                </p>
                <h1 className="text-xl font-bold text-center">
                  Balance: {accountData.balance} ETH
                </h1>
                <button
                  className="text-lg font-semibold"
                  onClick={() =>
                    handleTransaction(
                      accountData.Public_key,
                      accountData.Private_key
                    )
                  }
                >
                  <span className="flex justify-center">
                    <BsFillArrowUpRightCircleFill
                      className="text-center text-4xl"
                      fill="rgb(96 165 250)"
                    />
                  </span>
                  send
                </button>
                <button
                  className="border-2 rounded-xl p-3"
                  onClick={() => unlockPrivatekey(accountData.Private_key)}
                >
                  Export Private_key
                </button>
                <button
                  className="border-2 rounded-xl p-3"
                  // onClick={() => Delete_Account(accountData.Public_key)}
                  onClick={handleDelete}
                >
                  Delete Account
                </button>
              </div>
            )}
          </div>
          {/* <div className="flex flex-col gap-5 bg-blue-100 items-center py-10">
            <div className="flex justify-around w-full">
              <h1 className="text-5xl">Goerli testnet</h1>
              <form className="flex gap-4" action="">
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="enter account address"
                  className="border-2 rounded-lg p-2"
                />
                <button className="border-2 border-black rounded-lg text-xl p-2">
                  Send ETH
                </button>
              </form>
            </div>
            <div className="flex justify-around w-full">
              <h1 className="text-5xl">Polygon testnet</h1>
              <form className="flex gap-4" action="">
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="enter account address"
                  className="border-2 rounded-lg p-2"
                />
                <button className="border-2 border-black rounded-lg text-xl p-2">
                  Send Matic
                </button>
              </form>
            </div>
          </div> */}
          {isFormVisible ? (
            <Form
              isFormVisible={isFormVisible}
              setFormVisibility={setFormVisibility}
              accountData={accountData}
            />
          ) : (
            ""
          )}

          {isModalOpen ? (
            <Popup
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              privateKey={selectedPrivateKey}
            />
          ) : (
            ""
          )}

          {openTransaction ? (
            <Transaction
              setTransaction={setTransaction}
              handleButtonClick={handleButtonClick}
              Account={Account}
              selectedPrivateKey={selectedPrivateKey}
              selectedPublickey={selectedPublickey}
            />
          ) : (
            ""
          )}

          {passwordVisible ? (
            <Password setPasswordVisible={setPasswordVisible} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} selectedPrivateKey={selectedPrivateKey} />
          ) : (
            ""
          )}

          {downloadPhase ? (
            <DownloadPhase
              setDownloadPhase={setDownloadPhase}
              newAccount={newAccount}
            />
          ) : (
            ""
          )}
          
          {openDeleteBox?(<DeleteModal setopenDeleteBox={setopenDeleteBox} publickey={accountData.Public_key} />):("")}
        </div>
      ) : (
        <div className="h-[550px] w-[550px] border-2 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-xl p-8">
          <button
            className="border-2 rounded-xl p-2 text-lg font-semibold "
            onClick={handleUnlock}
          >
            <span className="flex items-center gap-2">
              <FaUnlock />
              Unlock Wallet
            </span>
          </button>

          {passwordVisible ? (
            <Password setPasswordVisible={setPasswordVisible} selectedPrivateKey={selectedPrivateKey} />
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
};

export default Userwallet;
