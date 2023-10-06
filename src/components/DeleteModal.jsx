import React from "react";
import { useDispatch } from "react-redux";
import { removeUser } from "../redux/features/userAcc";

const DeleteModal = ({ setopenDeleteBox, publickey }) => {
  const dispatch = useDispatch();

  const handleClose = () => {
    setopenDeleteBox(false);
  };

  const Delete_Account = (id) => {
    console.log("fdggfjjhjk", id);
    dispatch(removeUser(id));
    window.location.reload();
  };

  return (
    <>
      <div className="border-2 shadow-xl rounded-xl w-full md:mx-5">
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="flex flex-col z-50 p-2 bg-white rounded-lg shadow-2xl break-all mx-4">
            <div className="flex flex-col gap-3 w-full p-5">
              <h1 className="text-red-500">Are you sure delete this account</h1>
              <div className="flex justify-around">
                <button
                  className="border-2 border-black rounded-xl p-2 px-5"
                  onClick={() => Delete_Account(publickey)}
                >
                  Yes
                </button>
                <button
                  className="border-2 border-black rounded-xl p-2 px-5"
                  onClick={handleClose}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
