import { React, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userAccount } from "../redux/features/userAcc";
import { LockAccount, unLockAccount } from "../redux/features/LockUnlock";
import { useNavigate, useLocation } from "react-router-dom";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { FaWallet } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaEthereum } from "react-icons/fa";
import { SiBinance } from "react-icons/si";
import { FaRegCopy } from "react-icons/fa";
import { FaTrashRestoreAlt } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import { removeUser } from "../redux/features/userAcc";
import { ThreeDots } from "react-loader-spinner";
import { ProgressBar } from "react-loader-spinner";
import { Blocks } from "react-loader-spinner";
import Form from "../components/Recoverphase";
import Popup from "../components/PrivatekeyPopup";
import Transaction from "../components/Transaction";
import DownloadPhase from "../components/DownloadPhase";
import Password from "../components/Password";
import DeleteModal from "../components/DeleteModal";
import EthereumLogo from "../Asset/ethereum.ico";
import BNBLogo from "../Asset/bnb.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ethers = require("ethers");
const axios = require("axios");
const bip39 = require("bip39");
const Buffer = require("buffer");

const Userwallet = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recoverData = location.state?.data || null;

  const [selectedOption, setSelectedOption] = useState("Account 1");
  const [chainNetwork, setChainNetwork] = useState("");
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
  const [openDeleteBox, setopenDeleteBox] = useState(false);
  const [BalanceLoading, setBalanceLoading] = useState(false);
  const [AddressLoading, setAddressLoading] = useState(false);
  const [networkProvider, setNetworkProvider] = useState("");
  const [HashLink, setHashLink] = useState("");
  const [History, setHistory] = useState([]);

  const Network = [
    {
      Network_Name: "Ethereum Testnet",
      Network_Provider:
        "https://sepolia.infura.io/v3/a000e9d4c4a84f2da055fd797eab742f",
      Explore_Hash: "https://sepolia.etherscan.io/tx/",
    },
    {
      Network_Name: "Binance Testnet",
      Network_Provider: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      Explore_Hash: "https://testnet.bscscan.com/tx/",
    },
  ];

  // const provider = new ethers.providers.JsonRpcProvider(
  //   "https://sepolia.infura.io/v3/a000e9d4c4a84f2da055fd797eab742f"
  // );

  // const provider = new ethers.providers.JsonRpcProvider(
  //   "https://data-seed-prebsc-1-s1.binance.org:8545/"
  // );

  // try {
  //   const data = Network?.filter((el) => el.Network_Name === chainNetwork);
  //   const selected_provider = data[0].Network_Provider;
  //   const provider = new ethers.providers.JsonRpcProvider(selected_provider);
  // } catch (error) {
  //   console.log("select your network");
  // }

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
    handleChangeChainNetwork({ target: { value: chainNetwork } });
    // Get_Transaction();
  }, [chainNetwork]);

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
    try {
      const text = accountData.Public_key;
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(true);
          toast("Text copid!!");
        })
        .catch((error) => console.log(error));
    } catch (error) {
      toast("please select network");
    }
  };

  const handleTransaction = (publickey, privatekey) => {
    setTransaction(true);
    setSelectedPublickey(publickey);
    setSelectedPrivateKey(privatekey);
  };

  console.log(openTransaction);

  const handleChangeChainNetwork = (event) => {
    const selectedChainNetwork = event.target.value;
    console.log("selectedChainNetwork------->>>>>>>>", selectedChainNetwork);
    setChainNetwork(selectedChainNetwork);
  };

  const handleDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    console.log("selectedValue------->>>>>>>>", selectedValue);
    setSelectedOption(selectedValue);

    if (selectedValue.startsWith("Account ")) {
      console.log("selectedValue-----------------", selectedValue);
      const accountIndex = parseInt(selectedValue.replace("Account ", "")) - 1;
      console.log("-----------------", accountIndex);
      const account = Account[accountIndex];

      try {
        const data = Network?.filter((el) => el.Network_Name === chainNetwork);
        const selected_provider = data[0].Network_Provider;
        const hash = data[0].Explore_Hash;
        setNetworkProvider(selected_provider);
        // console.log("hash-------------000000000000000",hash);
        setHashLink(hash);
        const provider = new ethers.providers.JsonRpcProvider(
          selected_provider
        );
        setBalanceLoading(true);
        setAddressLoading(true);
        const balance = await provider.getBalance(account.Public_key);
        const balanceInEther = ethers.utils.formatEther(balance);
        setBalanceLoading(false);
        setAccountData({
          Public_key: account.Public_key,
          Private_key: account.Private_key,
          mnemonic: account.mnemonic,
          balance: balanceInEther,
        });
        setAddressLoading(false);
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
  };

  const handleLockUnlock = () => {
    if (!GetPassword) {
      handleLock();
    } else {
      dispatch(LockAccount(false));
    }
  };

  const Transaction_history = async () => {
    await axios
      .get(
        `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${accountData?.Public_key}&api-key=a000e9d4c4a84f2da055fd797eab742f`
      )
      .then((response) => {
        const transactions = response.data.result;
        const transactionHistory = transactions.map((tx) => ({
          From: tx.from,
          To: tx.to,
          value: tx.value,
        }));
        setHistory(transactionHistory);
      });
  };

  // console.log("Account------------->>>>>>>>.", Account[0].mnemonic);

  console.log(
    "chainNetwork-accountData------------>>>>>>>>.",
    Network[0].Network_img
  );

  return (
    <>
      {/* <img src={Network[0].Network_img} alt="" /> */}
      {handlelock ? (
        // <div className="h-[550px] border-2 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-xl p-8">
        <div className="flex flex-col gap-5 container mx-auto  border-2 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-xl p-8">
          <div className="flex justify-around font-normal gap-2 flex-wrap flex-col 2xl:flex-row xl:flex-row lg:flex-row">
            <button
              className="items-center border-2 rounded-xl p-2 text-lg"
              onClick={get_account}
            >
              <span className="flex gap-2 items-center">
                <FaWallet className="text-lg" />
                ADD Account
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
          <div className="flex flex-col justify-center gap-5">
            <h1 className="text-xl font-medium">Select Your Chain</h1>
            <select
              value={chainNetwork}
              onChange={handleChangeChainNetwork}
              className="border-2 rounded-lg text-xl p-2 w-auto"
            >
              <option value="">Select Chain</option>
              {Network &&
                Network.map((value, index) => (
                  <>
                    <option key={index} value={value.Network_Name}>
                      {value.Network_Name}
                    </option>
                  </>
                ))}
            </select>
          </div>
          {/* <img src={EthereumLogo} alt="" /> */}
          {chainNetwork === "" ? (
            ""
          ) : (
            <>
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
                </select>
                <div className="flex flex-col gap-4">
                  {chainNetwork === "" ? (
                    ""
                  ) : (
                    <>
                      <p className="flex justify-between border-2 rounded-xl p-3 bg-blue-300 gap-3">
                        <span className="flex gap-2 break-all">
                          {AddressLoading ? (
                            <Blocks borderColor="" width="60" height="25" />
                          ) : (
                            <span className="flex gap-2">
                              {chainNetwork === "Ethereum Testnet" ? (
                                <>
                                  <FaEthereum className="text-2xl" />
                                </>
                              ) : chainNetwork === "Binance Testnet" ? (
                                <SiBinance className="text-2xl" />
                              ) : (
                                ""
                              )}
                              {accountData?.Public_key}
                            </span>
                          )}
                        </span>
                        <span>
                          {copied ? (
                            <FaRegCheckCircle
                              className="text-xl"
                              fill="green"
                              onClick={copy_text}
                            />
                          ) : (
                            <FaRegCopy
                              className="text-xl"
                              onClick={copy_text}
                            />
                          )}
                        </span>
                      </p>

                      <div className="flex justify-center text-xl font-medium">
                        {BalanceLoading ? (
                          <ThreeDots className="" height="18" color="black" />
                        ) : (
                          <span>
                            {chainNetwork === "Ethereum Testnet" ? (
                              <div className="flex items-center gap-2">
                                <span>Balance : {accountData?.balance}</span>
                                ETH
                                {/* <FaEthereum className="text-2xl" /> */}
                              </div>
                            ) : chainNetwork === "Binance Testnet" ? (
                              <div className="flex items-center gap-2">
                                <span>Balance : {accountData?.balance}</span>
                                BNB
                                {/* <SiBinance
                                  fill="#F3BA2F"
                                  className="text-2xl"
                                /> */}
                              </div>
                            ) : (
                              ""
                            )}
                          </span>
                        )}
                      </div>
                      <button className="text-lg font-semibold">
                        <span className="flex justify-center">
                          <BsFillArrowUpRightCircleFill
                            className="text-center text-4xl"
                            fill="rgb(96 165 250)"
                            onClick={() =>
                              handleTransaction(
                                accountData.Public_key,
                                accountData.Private_key
                              )
                            }
                          />
                        </span>
                        send
                      </button>
                      <button
                        className="border-2 rounded-xl p-3"
                        onClick={() =>
                          unlockPrivatekey(accountData.Private_key)
                        }
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
                      <div className="flex flex-col justify-center items-center gap-3">
                        <h1 className="text-xl font-semibold">
                          Account history
                        </h1>
                        <table className="border border-gray-200 w-full">
                          <thead>
                            <tr>
                              <th className="">From</th>
                              <th className="">To</th>
                              <th className="">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

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
              HashLink={HashLink}
              networkProvider={networkProvider}
              setTransaction={setTransaction}
              selectedPrivateKey={selectedPrivateKey}
              selectedPublickey={selectedPublickey}
            />
          ) : (
            ""
          )}

          {passwordVisible ? (
            <Password
              setPasswordVisible={setPasswordVisible}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              selectedPrivateKey={selectedPrivateKey}
            />
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

          {openDeleteBox ? (
            <DeleteModal
              setopenDeleteBox={setopenDeleteBox}
              publickey={accountData.Public_key}
            />
          ) : (
            ""
          )}
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
            <Password
              setPasswordVisible={setPasswordVisible}
              selectedPrivateKey={selectedPrivateKey}
            />
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
};

export default Userwallet;
