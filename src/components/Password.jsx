import { React, useState } from "react";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { userPassword } from "../redux/features/SetPassword";
import { LockAccount, unLockAccount } from "../redux/features/LockUnlock";
import Popup from "./PrivatekeyPopup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Password = ({
  setPasswordVisible,
  setIsModalOpen,
  isModalOpen,
  selectedPrivateKey,
}) => {
  const [newPassword, setPassword] = useState();

  const checkPassword = useSelector((state) => state.acc.pwd.password);

  const dispatch = useDispatch();

  const handleClose = () => {
    setPasswordVisible(false);
  };
  const set_password = (e) => {
    e.preventDefault();
    if (!checkPassword) {
      dispatch(userPassword(newPassword));
    } else if (checkPassword === newPassword && isModalOpen === false) {
      setIsModalOpen(true);
      setPasswordVisible(false);
    } else if (checkPassword === newPassword) {
      dispatch(unLockAccount(true));
      setPasswordVisible(false);
    } else {
      toast.error("Enter valid password");
      console.error();
    }
  };

  return (
    <>
      <div className="border-2 shadow-xl rounded-xl w-full md:mx-5">
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="flex flex-col z-50 p-2 bg-white rounded-lg shadow-2xl break-all mx-4">
            <div className="flex justify-end">
              <AiOutlineCloseSquare
                className="text-4xl"
                onClick={handleClose}
              />
            </div>
            <div className="flex flex-col gap-2 p-5">
              <p>Enter Wallet Password</p>
              <form
                action=""
                className="flex flex-col gap-4"
                onSubmit={set_password}
              >
                <input
                  type="password"
                  name=""
                  id=""
                  placeholder="Enter Password"
                  className="p-2 border-2"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <button className="border-2 rounded-xl p-2" type="submit">
                  Submit
                </button>
              </form>
            </div>
          </div>
          {isModalOpen ? (
            <Popup
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              privateKey={selectedPrivateKey}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default Password;
