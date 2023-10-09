import { React, useState } from "react";
import { useDispatch } from "react-redux";
import { removeUser } from "../redux/features/userAcc";
import Password from "./Password";
import { Vortex } from "react-loader-spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteModal = ({ setopenDeleteBox, publickey }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [checkPassword, setCheckPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleClose = () => {
    setopenDeleteBox(false);
  };

  const Enter_Password = () => {
    setPasswordVisible(true);
    setCheckPassword(true);
  };

  const Delete_Account = async (id) => {
    if (!passwordVisible && !checkPassword) {
      Enter_Password();
    } else {
      // console.log("fdggfjjhjk", id);
      setLoading(true);
      dispatch(removeUser(id));
      toast("Account deleted!!!");
      setTimeout(() => window.location.reload(), 5000);
    }
  };

  return (
    <>
      {loading ? (
        <div className="border-2 shadow-xl rounded-xl w-full md:mx-5">
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
            <div className="flex flex-col z-50 p-2 bg-white rounded-lg shadow-2xl break-all mx-4">
              <Vortex />
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 shadow-xl rounded-xl w-full md:mx-5">
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
            <div className="flex flex-col z-50 p-2 bg-white rounded-lg shadow-2xl break-all mx-4">
              <div className="flex flex-col gap-3 w-full p-5">
                <h1 className="text-red-500">
                  Are you sure delete this account
                </h1>
                <div className="flex justify-around">
                  <button
                    className="rounded-xl p-2 px-5 bg-red-500"
                    onClick={() => Delete_Account(publickey)}
                    // onClick={Enter_Password}
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
          {passwordVisible ? (
            <Password setPasswordVisible={setPasswordVisible} />
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
};

export default DeleteModal;
