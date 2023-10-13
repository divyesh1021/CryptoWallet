import React from "react";
import { BsArrowUpRightCircle, BsArrowDownLeftCircle } from "react-icons/bs";

const ShowAddress = ({ History, HashLink, currency }) => {
  return (
    <>
      <div className="">
        <div className="flex flex-col justify-center items-center gap-3">
          <h1 className="text-xl font-semibold">Account history</h1>
          {History.length != 0 ? (
            <table className="border border-gray-200 w-full">
              <thead>
                <tr className="">
                  <th>From</th>
                  <th>To</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {History &&
                  History?.map((item) => (
                    <tr className="">
                      <td className="text-center">
                        {item.from.substring(0, 6) +
                          "..." +
                          item.from.slice(-5)}
                      </td>
                      <td className="text-center">
                        {item.to.substring(0, 6) + "..." + item.to.slice(-5)}
                      </td>
                      <td className="p-1">
                        {item.Type === "send" ? (
                          <BsArrowUpRightCircle
                            className="text-2xl"
                            fill="red"
                          />
                        ) : (
                          <BsArrowDownLeftCircle
                            className="text-2xl"
                            fill="green"
                          />
                        )}
                      </td>
                      <td className="text-center">
                        {item.value / 1000000000000000000} {currency}
                      </td>
                      <td className="text-center">
                        <a
                          href={`${HashLink}${item.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:underline-offset-1 hover:text-blue-500"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <table className="border border-gray-200 w-full">
              <thead>
                <tr className="">
                  <th className="">From</th>
                  <th className="">To</th>
                  <th className="">Amount</th>
                  <th className="">View</th>
                </tr>
              </thead>
              <tbody>
                <tr className="">
                  <td className="text-center py-4" colSpan="4">
                    No Data Found!!
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default ShowAddress;
