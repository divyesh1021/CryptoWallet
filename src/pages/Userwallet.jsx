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
import AddAccount from "../components/AddAccount";
import Popup from "../components/PrivatekeyPopup";
import Transaction from "../components/Transaction";
import DownloadPhase from "../components/DownloadPhase";
import Password from "../components/Password";
import DeleteModal from "../components/DeleteModal";
import ShowAddress from "../components/TransactionHistoryData";
import EthereumLogo from "../Asset/ethereum.ico";
import BNBLogo from "../Asset/bnb.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios, { getAdapter } from "axios";
import { ethers } from "ethers";
// const ethers = require("ethers");
const bip39 = require("bip39");
const Buffer = require("buffer");

const Userwallet = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recoverData = location.state?.data || null;

  const [selectedOption, setSelectedOption] = useState("Account 1");
  const [chainNetwork, setChainNetwork] = useState("Ethereum Testnet");
  const [accountData, setAccountData] = useState({
    Public_key: "",
    Private_key: "",
    mnemonic: "",
  });
  const [isFormVisible, setFormVisibility] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [AddWalletModal,setAddWalletModal] = useState(false);
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
  const [currency,setCurrency] = useState("");
  const [HashLink, setHashLink] = useState("");
  const [History, setHistory] = useState([]);
  const [TransactionType,setTransactionType] = useState("");
  const [API, setAPI] = useState("");

  const Network = [
    {
      Network_Name: "Ethereum Testnet",
      Network_Provider:
        "https://sepolia.infura.io/v3/a000e9d4c4a84f2da055fd797eab742f",
      Explore_Hash: "https://sepolia.etherscan.io/tx/",
      Network_API:
        "https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=YOUR_ADDRESS_HERE&api-key=1b852b584c7b438589e7406db62a9e99",
      Network_Currency: "ETH",
    },
    {
      Network_Name: "Binance Testnet",
      Network_Provider: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      Explore_Hash: "https://testnet.bscscan.com/tx/",
      Network_API:
        "https://api-testnet.bscscan.com/api?module=account&action=txlist&address=YOUR_ADDRESS_HERE&tag=latest&apikey=SPFYW27G38Y7F1HHP1WV2P5E26PTFA6BEV",
      Network_Currency: "BNB",
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

  const handleLock = () => {
    setPasswordVisible(true);
  };

  const handleUnlock = () => {
    setPasswordVisible(true);
  };

  const Account = useSelector((state) => state.acc.acc1?.value);

  useEffect(() => {
    // When the component first loads, set the default option and display its data
    handleDropdownChange({ target: { value: selectedOption } });
    handleChangeChainNetwork({ target: { value: chainNetwork } });
  }, [chainNetwork]);

  useEffect(() => {
    if (accountData) {
      Transaction_history();
    }
  }, [accountData]);

  const handlePrivatekey = (privateKey) => {
    setSelectedPrivateKey(privateKey);
    setIsModalOpen(true);
  };

  const Add_Address = () => {
    setAddWalletModal(true);
  }

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
          setTimeout(()=>setCopied(false),6000);
          toast.success("copied!!");
        })
        .catch((error) => console.log(error));
    } catch (error) {
      toast.error("please select network");
    }
  };

  const handleTransaction = (publickey, privatekey) => {
    setTransaction(true);
    setSelectedPublickey(publickey);
    setSelectedPrivateKey(privatekey);
  };

  // console.log(openTransaction);

  const handleChangeChainNetwork = (event) => {
    const selectedChainNetwork = event.target.value;
    // console.log("selectedChainNetwork------->>>>>>>>", selectedChainNetwork);
    setChainNetwork(selectedChainNetwork);
  };

  const handleDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    // console.log("selectedValue------->>>>>>>>", selectedValue);
    setSelectedOption(selectedValue);

    if (selectedValue.startsWith("Account ")) {
      // console.log("selectedValue-----------------", selectedValue);
      const accountIndex = parseInt(selectedValue.replace("Account ", "")) - 1;
      // console.log("-----------------", accountIndex);
      const account = Account[accountIndex];

      try {
        const data = Network?.filter((el) => el.Network_Name === chainNetwork);
        const getTransactionAPI = data[0].Network_API;
        // const add = "12465165";
        // const api_url = getTransactionAPI.replace("YOUR_ADDRESS_HERE",add);
        console.log("getTransactionAPI---------", getTransactionAPI);
        setAPI(getTransactionAPI);
        setCurrency(data[0].Network_Currency);
        // console.log("api_url---------",api_url);

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
        // Transaction_history();
        // console.log("setAccountData 999999999", accountData);
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
    // console.log("mnemonic", mnemonic);

    // Create a new random wallet
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);
    const Private_key = wallet.privateKey;
    const Public_key = wallet.address;

    // console.log("Privatekey :", wallet.privateKey);
    // console.log("public key :", wallet.address);

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
    // console.log("fdggfjjhjk", id);
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
    // console.log("accountData==========>>>>>>>", accountData);
    // console.log("API_URL",API);
    const base_api = API.replace("YOUR_ADDRESS_HERE", accountData?.Public_key);
    // console.log(base_api);
    // const base_api = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${accountData?.Public_key}&api-key=1b852b584c7b438589e7406db62a9e99`;
    try {
      const response = await axios.get(base_api);
      const transactions = response.data.result;
      if (Array.isArray(transactions)) {
        // console.log("------------------------", transactions);
        const filter_transaction = transactions.reverse();
        const latest_transaction = [];
        for (let i = 0; i < 5; i++) {
          if (filter_transaction[i] != undefined) {
            console.log("accountData.Public_key------->>>>>>>>>>",accountData.Public_key);
            console.log("filter_transaction[i].from------->>>>>>>>>>",filter_transaction[i].from);
            const select_add = accountData.Public_key.toLowerCase();
            const add = filter_transaction[i].from;
            // console.log("Addddddddddddddd",add);
            if(select_add===add){
              console.log("inside if");
              filter_transaction[i].Type = "send";
            }
            else{
              console.log("outside if");
              filter_transaction[i].Type = "receive";
            }
            // setTransactionType()
            latest_transaction.push(filter_transaction[i]);
          }
        }
        setHistory(latest_transaction);
      } else {
        console.error("API response is not an array:", transactions);
      }

      // setHistory(transactions);
    } catch (error) {
      console.log(error);
    }
  };

  console.log("History.............", History);

  return (
    <>
      {handlelock ? (
        <div className="h-[800px] overflow-y-scroll flex flex-col gap-5 container mx-auto  border-2 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-xl p-8">
          <div className="flex justify-around font-normal gap-2 flex-wrap flex-col 2xl:flex-row xl:flex-row lg:flex-row">
            <button
              className="items-center border-2 rounded-xl p-2 text-lg"
              onClick={Add_Address}
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
          <div className="flex flex-col justify-center gap-3">
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
              <div className="flex flex-col justify-center py-5 gap-5">
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
                      <ShowAddress History={History} HashLink={HashLink} currency={currency} accountData={accountData}/>
                      {/* <div className="flex flex-col justify-center items-center gap-3">
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
                            {History &&
                              History?.map((item) => (
                                <tr>
                                  <td onMouseEnter={()=>setShowFullAddress(true)} onMouseLeave={()=>setShowFullAddress(false)}>{showFullAddress ? <ShowAddress/> :(item.from).substring(0,8)}</td>
                                  <td>{(item.to).substring(0,8)}</td>
                                  <td>{item.value}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div> */}
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {AddWalletModal ? (<AddAccount setAddWalletModal={setAddWalletModal}/>):("")}

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
              setSelectedOption={setSelectedOption}
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

// https://api-testnet.bscscan.com/api?module=account&action=balancemulti&address=0x3f349bBaFEc1551819B8be1EfEA2fC46cA749aA1,0xEadaBd3A52f0F008E1d84eEA0b597d458EA9Fe69,0x70F657164e5b75689b64B7fd1fA275F334f28e18&tag=latest&apikey=SPFYW27G38Y7F1HHP1WV2P5E26PTFA6BEV
