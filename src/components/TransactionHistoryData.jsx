import React from "react";

const ShowAddress = ({ History }) => {
  return (
    <>
      <div className="">
        <div className="flex flex-col justify-center items-center gap-3">
          <h1 className="text-xl font-semibold">Account history</h1>
          <table className="border border-gray-200 w-full">
            <thead>
              <tr>
                <th className="">From</th>
                <th className="">To</th>
                <th className="">Amount</th>
                <th className="">View</th>
              </tr>
            </thead>
            <tbody>
              {History &&
                History?.map((item) => (
                  <tr>
                    <td className="text-center">{item.from.substring(0, 8)}</td>
                    <td className="text-center">{item.to.substring(0, 8)}</td>
                    <td className="text-center">
                      {item.value / 1000000000000000000} ETH
                    </td>
                    <td className="text-center">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${item.hash}`}
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
        </div>
      </div>
    </>
  );
};

export default ShowAddress;
