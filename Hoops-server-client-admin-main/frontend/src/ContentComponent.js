import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import axios from "axios";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, API_URL } from "./config";
import React, { useEffect, useState } from "react";

import "./index.css";

import { Contract } from "../src/contract";

const ContentComponent = () => {
  const [counter, setCounter] = useState(0); //mint count upto 10

  const [current, setCurrent] = useState(0); // current unix date

  const [unixDB, setUnixDB] = useState(0); // unix DB date

  const [status, setStatus] = useState(0); //isBlocked DB

  const [errorBlock, setErrorBlock] = useState("");

  const [showAlert, setShowAlert] = React.useState(true);

  const [isGreen, setIsGreen] = useState(false);

  const { ethereum } = window;

  const { activate, deactivate, library, account } = useWeb3React();
  const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 97],
  });

  const onConnectClicked = async () => {
    try {
      await activate(injected);
      responseMintCount();
    } catch (ex) {
      console.log(ex);
    }
  };

  const onDisconnectClicked = () => {
    try {
      deactivate();
    } catch (ex) {
      console.log(ex);
    }
  };

  const onMetamaskSignClicked = async () => {
    const message = ethers.utils.solidityKeccak256(
      ["address", "address"],
      [CONTRACT_ADDRESS, account]
    );
    const arrayifyMessage = ethers.utils.arrayify(message);
    const flatSignature = await library
      .getSigner()
      .signMessage(arrayifyMessage);
    const response = await axios.post(`${API_URL}/new-request`, {
      signature: flatSignature,
      address: account,
    });
    // alert(response.data.msg);
    setErrorBlock(response.data.msg);
  };
  //counter condition
  const responseMintCount = async () => {
    // console.log("!----accc ----!",account)
    const { data } = await axios.get(`${API_URL}/get-data?address=${account}`);
    console.log("DB1 - mintCounter : ", data.counter); //getting DB Counts
    setCounter(data.counter);

    console.log("DB2 --------unixDate : ", data.unixDate); //getting DB Unixdate for mint till date condition
    setUnixDB(data.unixDate);

    //getting isBlocked true or false
    console.log("DB3 --------isBlocked : ", data.isBlocked);
    setStatus(data.isBlocked);

    //to get current
    var currentUnix = Math.round(new Date().getTime() / 1000);
    // console.log("new date --unix current---", currentUnix);   //getting current date and time in unix
    setCurrent(currentUnix);
  };

  useEffect(() => {
    account && responseMintCount();
  }, [account]);
  //

  // console.log("--Counter useState: ", counter)

  //condition for more than 10 count
  const mintMax = () => {
    if (status) {
      // alert("You are Blocked")
      setErrorBlock("You are Blocked");
    } else if (unixDB < current) {
      // alert("Your Mint Time is Over")
      setErrorBlock("Your Mint Time is Over");
    } else if (counter >= 10) {
      // console.log("---mintMax Counter: " ,counter)
      // alert("You have used Maximum Mint Limit")
      setErrorBlock("You have used Maximum Mint Limit");
    } else {
      mintNFT();
      setErrorBlock("");
    }
  };
  //

  //try catch mintmax
  // const mintMax = async() => {
  //   console.log("!----accc ----!Try: ",account)

  //   const {data} = await axios.get(`${API_URL}/get-data?address=${account}`);
  //   setCounter(data.counter)
  //   console.log("mintCounter ------Try: ",data.counter) //getting DB Counts

  //   if(counter !== 0)
  //   try {
  //     mintNFT()
  //   } catch (error) {
  //     alert(error.message);

  //   } else {
  //     alert("You have used Maximum Mint Limit")

  //   }
  //   return false;
  // }
  //

  const mintNFT = async () => {
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();
    const contract = new ethers.Contract(
      Contract.address,
      Contract.abi,
      signer
    );
    const quantity = 1;
    let mint;

    const responseUser = await axios.get(
      `${API_URL}/get-signature?address=${account}`
    );
    // console.log("----account: ", responseUser)

    if (responseUser.data.signature) {
      let amountInEther = "0.088";
      try {
        const options = { value: ethers.utils.parseEther(amountInEther) };
        mint = parseInt(
          (
            await contract.mint(quantity, responseUser.data.signature, options)
          ).toString()
        );
        //counter
        const responseCounter = await axios.patch(`${API_URL}/counter`, {
          address: account,
        });
        // console.log(responseCounter)

        const countMintDB = counter + 1; //to update Mint state
        // alert(
        //   `Transaction successful.You have used ${countMintDB} Times Mint out of 10.`
        // );
        setErrorBlock(`Transaction successful.You have used ${countMintDB} Times Mint out of 10.`);  //red button
        setIsGreen(true)
      } catch (error) {
        alert(error.message);
      }
    } else {
      // alert("Please raise a Request or wait for approval");
      setErrorBlock("Please raise a Request or wait for approval")
    }
    return false;
  };

  return (
    <div className="flex flex-col items-center pt-10 space-y-3">
      <div className="flex flex-row space-x-3">
        <button
          onClick={onConnectClicked}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Connect Wallet
        </button>
        <button
          onClick={onDisconnectClicked}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Disconnect Wallet
        </button>
      </div>
      <div>Account: {account || "NOT CONNECTED"}</div>
      <div className="flex flex-row space-x-3">
        <button
          onClick={onMetamaskSignClicked}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Request
        </button>
      </div>
      <div className="flex flex-row space-x-3">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            mintMax();
            setShowAlert(true);
          }}
          // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          // onClick={() => (count > 9 ? alert("You Reached Maximum Limit"): mintNFT(setCount(count + 1))) }
        >
          Mint
        </button>
      </div>
      {console.log("errorblock: ", errorBlock)}
      {console.log("showAlert: ", showAlert)}

      {/* {errorBlock && showAlert ? (
        <div role="alert">
          <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
            Alert!

            <button
              className="bg-transparent hover:bg-red-300 text-white-700 font-semibold hover:text-white py-2 px-4 border border-white-500 hover:border-transparent rounded ml-20"
              onClick={() => {setShowAlert(false); setErrorBlock("")}}
            >
              <span>×</span>
            </button>
            
          </div>
          <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
            <p>{errorBlock}</p>
          </div>
          
        </div>
      ) : null} */}
      {/* modal alert */}

      {errorBlock && showAlert ? (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Alert!
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{errorBlock}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              {!isGreen ? <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowAlert(false);
                    setErrorBlock("");
                  }}
                >
                  Close
                </button> :
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowAlert(false);
                    setErrorBlock("");
                  }}
                >
                  Close
                </button> }
               
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* //end */}
    </div>
  );
};
export default ContentComponent;
