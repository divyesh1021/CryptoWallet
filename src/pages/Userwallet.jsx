import { React, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { LockAccount, unLockAccount } from "../redux/features/LockUnlock";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import {
  FaWallet,
  FaLock,
  FaEthereum,
  FaRegCopy,
  FaTrashRestoreAlt,
  FaUnlock,
  FaRegCheckCircle,
} from "react-icons/fa";
import { SiBinance } from "react-icons/si";
import { ThreeDots } from "react-loader-spinner";
import { Blocks } from "react-loader-spinner";
import Form from "../components/Recoverphase";
import AddAccount from "../components/AddAccount";
import Popup from "../components/PrivatekeyPopup";
import Transaction from "../components/Transaction";
import DownloadPhase from "../components/DownloadPhase";
import Password from "../components/Password";
import DeleteModal from "../components/DeleteModal";
import ShowAddress from "../components/TransactionHistoryData";
import axios from "axios";
import { ethers } from "ethers";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const bip39 = require("bip39");
const Buffer = require("buffer");

const Userwallet = () => {
  const [selectedOption, setSelectedOption] = useState("Account 1");
  const [chainNetwork, setChainNetwork] = useState("Ethereum Testnet");
  const [accountData, setAccountData] = useState({
    Public_key: "",
    Private_key: "",
    mnemonic: "",
  });
  const [isFormVisible, setFormVisibility] = useState(false);
  const [AddWalletModal, setAddWalletModal] = useState(false);
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
  const [currency, setCurrency] = useState("");
  const [HashLink, setHashLink] = useState("");
  const [History, setHistory] = useState([]);
  const [API, setAPI] = useState("");
  const [loading, setLoading] = useState(false);

  const Network = [
    {
      Network_Name: "Ethereum Testnet",
      Network_Provider:
        "https://sepolia.infura.io/v3/a000e9d4c4a84f2da055fd797eab742f",
      Explore_Hash: "https://sepolia.etherscan.io/tx/",
      Network_API:
        "https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=YOUR_ADDRESS_HERE&api-key=5978RP4BD9WHCWEHKMAH5FJRH9Z8EHVY9E",
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
    handleDropdownChange({ target: { value: selectedOption } });
    handleChangeChainNetwork({ target: { value: chainNetwork } });
  }, [chainNetwork]);

  const Add_Address = () => {
    setAddWalletModal(true);
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
          setTimeout(() => setCopied(false), 6000);
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

  const handleChangeChainNetwork = (event) => {
    const selectedChainNetwork = event.target.value;
    setChainNetwork(selectedChainNetwork);
  };

  const handleDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    if (selectedValue.startsWith("Account ")) {
      const accountIndex = parseInt(selectedValue.replace("Account ", "")) - 1;
      const account = await Account[accountIndex];

      try {
        const data = Network?.filter((el) => el.Network_Name === chainNetwork);
        const getTransactionAPI = data[0].Network_API;
        setAPI(getTransactionAPI);
        setCurrency(data[0].Network_Currency);

        const selected_provider = data[0].Network_Provider;
        const hash = data[0].Explore_Hash;
        setNetworkProvider(selected_provider);
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
      } catch (error) {
        console.error("Error fetching balance:", error);
        setAccountData(null);
      }
    }
  };

  const handleRecoverAccoount = () => {
    setFormVisibility(!isFormVisible);
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
    // setInterval(()=>{});
    const base_api = API.replace("YOUR_ADDRESS_HERE", accountData?.Public_key);

    try {
      setLoading(true);
      const response = await axios.get(base_api);
      const transactions = response.data.result;
      if (Array.isArray(transactions)) {
        const filter_transaction = transactions.reverse();
        const latest_transaction = [];
        for (let i = 0; i < 5; i++) {
          if (filter_transaction[i] != undefined) {
            const select_add = accountData.Public_key.toLowerCase();
            const add = filter_transaction[i].from;
            if (select_add === add) {
              filter_transaction[i].Type = "send";
            } else {
              filter_transaction[i].Type = "receive";
            }
            latest_transaction.push(filter_transaction[i]);
          }
        }
        setHistory(latest_transaction);
        setLoading(false);
      }
      // else {
      //   console.error("API response is not an array:", transactions);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (accountData) {
      //setInterval(() => Transaction_history(), 3000);
      Transaction_history();
    }
  }, [accountData]);

  console.log("liofjgiofjiufhgiud", loading);

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
                              </div>
                            ) : chainNetwork === "Binance Testnet" ? (
                              <div className="flex items-center gap-2">
                                <span>Balance : {accountData?.balance}</span>
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
                        onClick={handleDelete}
                      >
                        Delete Account
                      </button>
                      {loading ? (
                        <div className="flex justify-center">
                        <RotatingLines />
                        </div>
                      ) : (
                        <ShowAddress
                          History={History}
                          HashLink={HashLink}
                          currency={currency}
                          accountData={accountData}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {AddWalletModal ? (
            <AddAccount setAddWalletModal={setAddWalletModal} />
          ) : (
            ""
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
