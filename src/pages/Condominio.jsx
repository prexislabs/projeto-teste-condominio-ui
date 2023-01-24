import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../features/common/headerSlice";
import { ethers } from "ethers";
import { useAccount, useProvider, useSigner } from "wagmi";
import InfinityHashNFTAbi from "../abi/InfinityHashNFT.json";
import MockTokenAbi from "../abi/USDPMock.json";
import InfinityHashTokenAbi from '../abi/InfinityHashToken.json'
import {
  AlertFail,
  AlertLoading,
  AlertQuestion,
  AlertSuccess,
} from "../functions/Sweetalerts";
import {
  catchContractError,
  increaseAllowance,
} from "../functions/generalFunctions";

import Countdown from "react-countdown";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Redux
import { setUserBalance } from '../features/common/headerSlice'

function User() {
  // Hooks
  const provider = useProvider();
  const { address, status } = useAccount();
  const { data: signer, isError, isLoading } = useSigner();
  const dispatch = useDispatch();

  const [currentSelected, setCurrentSelected] = useState("purchase");
  const [allBatches, setAllBatches] = useState([]);
  const [haveBatch, setHaveBatch] = useState(true);
  const [labelPurchaseText, setLabelPurchaseText] = useState("Loading...");

  // Functions

  async function verifyAllowance(id, e) {
    let qty = window.document.getElementById("qty" + id).value;
    if(!qty){
      AlertFail("Quantity is Empty", "")
      window.document.getElementById("qty" + id).classList.add(`border-blue-500`)
      window.document.getElementById("qty" + id).classList.add(`border-2`)
      window.document.getElementById("qty" + id).focus()
      return
    }
    let amount = window.document.getElementById("id" + id).innerHTML;
    let mockTokenContract = new ethers.Contract(
      process.env.REACT_APP_STABLECOIN_TOKEN_ADDR,
      MockTokenAbi,
      signer
    );

    try {
      let currentAllowance = ethers.utils.formatUnits(
        await mockTokenContract.allowance(
          address,
          process.env.REACT_APP_INFINITY_HASH_NFT
        ),
        6
      );
      if (
        Number(currentAllowance) >= Number(amount) &&
        e.target.innerHTML == "Approve"
      ) {
        e.target.innerHTML = "Buy";
        return;
      }

      if (Number(currentAllowance) < Number(amount)) {
        await increaseAllowance(
          amount,
          process.env.REACT_APP_INFINITY_HASH_NFT,
          signer
        );
        e.target.innerHTML = "Buy";
      } else {
        await purchase(id, qty);
        e.target.innerHTML = "Approve";
      }
    } catch (error) {
      e.target.innerHTML = "Approve";
      console.log(error);
    }
  }

  async function transfer(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_INFINITY_HASH_NFT,
      InfinityHashNFTAbi,
      signer
    );
    try {
      let res = await contract.safeTransferFrom(
        e.target.from.value,
        e.target.to.value,
        e.target.id.value,
        e.target.amount.value,
        ""
      );
      AlertLoading();
      let resWait = await res.wait();
      if (resWait.status == 1) {
        getAllBatches();
        AlertSuccess("Transfered " + e.target.amount.value, "");
      }
    } catch (e) {
      if (e.error?.data?.originalError?.data) {
        let error = contract.interface.parseError(
          e.error.data.originalError.data
        );
        return catchContractError(error.name);
      }
      console.log(e.message);
      AlertFail(e.message);
    }
  }

  async function redeem(id, amount) {
    let contract = new ethers.Contract(
      process.env.REACT_APP_INFINITY_HASH_NFT,
      InfinityHashNFTAbi,
      signer
    );
    try {
      let res = await contract.redeem(id, amount);
      AlertLoading();
      let resWait = await res.wait();
      if (resWait.status == 1) {
        AlertSuccess("Successfully redeemed", "");
        await getAllBatches();
        await getTokenBalance();
      }
    } catch (e) {
      if (e.error?.data?.originalError?.data) {
        let error = contract.interface.parseError(
          e.error.data.originalError.data
        );
        return catchContractError(error.name);
      }
      console.log(e);
    }
  }

  async function getAllBatches() {
    if (status != "connected") return;

    setAllBatches([]);
    setLabelPurchaseText("Loading...");

    let contract = new ethers.Contract(
      process.env.REACT_APP_INFINITY_HASH_NFT,
      InfinityHashNFTAbi,
      provider
    );

    try {
      let res = await contract.batchIdCounter();
      let numberOfBatches = Number(res);
      let batchesArray = [];
      let buyedArray = [];
      for (let batch = 0; batch < numberOfBatches; batch++) {
        let currentBatch = await contract.batches(batch);
        let allBatches = [...currentBatch];
        // Formating values
        allBatches[0] = ethers.utils.formatUnits(allBatches[0], 6); // Price
        allBatches[1] = Number(allBatches[1]); // Timelock
        allBatches[2] = Number(allBatches[2]); // initialSupply
        allBatches[3] = Number(allBatches[3]); // Sold
        allBatches[4] = Number(allBatches[4]); // redeemed
        allBatches[5] = batch;
        allBatches[6] = Number(await contract.balanceOf(address, batch));
        if (allBatches[6] > 0) buyedArray.push(true);
        batchesArray.push(allBatches);
      }

      if (buyedArray.length == 0) {
        setHaveBatch(false);
      }else{
        setHaveBatch(true)
      }
      setAllBatches(batchesArray);
      if (batchesArray.length == 0) setLabelPurchaseText("No Batches Minted");
    } catch (e) {
      console.log("Error", e);
    }
  }

  async function purchase(id, qty) {
    let contract = new ethers.Contract(
      process.env.REACT_APP_INFINITY_HASH_NFT,
      InfinityHashNFTAbi,
      signer
    );

    try {
      let res = await contract.purchase(id, qty);
      AlertLoading();
      let resWait = await res.wait();
      if (resWait.status == 1) {
        window.document.getElementById("qty" + id).value = "";
        AlertSuccess("Successfully purchased", "");
        await getAllBatches();
      }
    } catch (e) {
      if (e.error?.data?.originalError?.data) {
        let error = contract.interface.parseError(
          e.error.data.originalError.data
        );
        return catchContractError(error.name);
      }
      console.log(e);
    }
  }

  async function getTokenBalance(){
    if(status != 'connected') return
    let contract = new ethers.Contract(process.env.REACT_APP_INFINITY_HASH, InfinityHashTokenAbi, provider)
    let res = ethers.utils.formatEther(await contract.balanceOf(address))
    dispatch(setUserBalance((res)))
  }

  useEffect(() => {
    dispatch(setPageTitle({ title: "User" }));
    getAllBatches();
  }, []);

  useEffect(() => {
    getAllBatches();
  }, [address, status]);

  return (
    <div className="pt-2 pl-8">
      <div className="navbar bg-base-100">
        <div className="">
          <a
            className="btn btn-ghost normal-case text-md"
            onClick={() => setCurrentSelected("purchase")}
          >
            Purchase
          </a>
        </div>
        <div className="">
          <a
            className="btn btn-ghost normal-case text-md"
            onClick={() => setCurrentSelected("transfer")}
          >
            NFT
          </a>
        </div>
      </div>

      <div className="mt-5">
        {currentSelected == "purchase" ? (
          <div className="overflow-x-auto">
            {status != "connected" ? (
              <div className="flex justify-center overflow-hidden">
                <ConnectButton />
              </div>
            ) : status == "connected" && allBatches.length == 0 ? (
              <div className="flex justify-center">
                <p className="font-bold text-xl">{labelPurchaseText}</p>
              </div>
            ) : (
              <table className="table w-full border-">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Supply</th>
                    <th>Sold</th>
                    <th>Redeemed</th>
                    <th>Remain</th>
                    <th>Time Lock</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Buy</th>
                  </tr>
                </thead>
                <tbody>
                  {allBatches.map((batch, key) => {
                    return (
                      <tr key={key}>
                        <th>{key}</th>
                        <td>{batch[2]}</td>
                        <td>{batch[3]}</td>
                        <td>{batch[4]}</td>
                        <td>{batch[2] - batch[3]}</td>
                        <td>
                          <Countdown date={batch[1] * 1000}>
                            <p>Redeemable</p>
                          </Countdown>
                        </td>
                        <td>{batch[0]}</td>
                        <td className="w-32">
                          <input
                            type="text"
                            id={`qty${key}`}
                            placeholder="Qty"
                            className="input input-sm input-bordered w-full max-w-xs"
                            onChange={(e) => {
                              e.target.classList.remove('border-blue-500')
                              e.target.classList.remove('border-2')
                              
                              document.getElementById(
                                "buttonPurchase" + key
                              ).innerHTML = "Approve";
                              if (isNaN(Number(e.target.value))) {
                                e.target.value = "";
                                document.getElementById("id" + key).innerHTML =
                                  "0";
                                return;
                              }
                              window.document.getElementById(
                                "id" + key
                              ).innerHTML = Number(e.target.value * batch[0]);
                            }}
                          />
                        </td>
                        <td id={`id${key}`}>0</td>
                        <td>
                          <button
                            id={`buttonPurchase${key}`}
                            className="btn btn-sm btn-outline w-full"
                            onClick={(e) => verifyAllowance(key, e)}
                          >
                            Approve
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        ) : currentSelected == "transfer" ? ( // NFT
          <div>
            <div className="overflow-x-auto">
              {status != "connected" ? (
                <div className="flex justify-center overflow-hidden">
                  <ConnectButton />
                </div>
              ) : status == "connected" && haveBatch == false ? (
                <div>
                  <p className="text-center font-bold text-xl">
                    No Batches Buyed
                  </p>
                </div>
              ) : (
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tokens</th>
                      <th>Time lock</th>
                      <th>Redeem</th>
                    </tr>
                  </thead>

                  <tbody>
                    {allBatches.length > 0 && status == "connected" ? (
                      allBatches.map((batch, key) => {
                        if (batch[6] == 0) return;
                        return allBatches && allBatches.length > 0 ? (
                          <tr key={key}>
                            <th>{batch[5]}</th>
                            <td>{batch[6]}</td>
                            <td>
                              <Countdown date={batch[1] * 1000}>
                                <p>Finished</p>
                              </Countdown>
                            </td>
                            <td>
                              <Countdown
                                date={batch[1] * 1000}
                                renderer={({
                                  hours,
                                  minutes,
                                  seconds,
                                  completed,
                                }) => {
                                  if (completed) {
                                    return (
                                      <button
                                        className={`btn btn-sm`}
                                        onClick={() =>
                                          redeem(batch[5], batch[6])
                                        }
                                      >
                                        Redeem
                                      </button>
                                    );
                                  } else {
                                    return (
                                      <button className={`btn btn-sm`} disabled>
                                        Redeem
                                      </button>
                                    );
                                  }
                                }}
                              ></Countdown>
                            </td>
                          </tr>
                        ) : (
                          <tr>
                            <th>-</th>
                            <td>-</td>
                            <td>
                              <Countdown date={0}>
                                <p>- - -</p>
                              </Countdown>
                            </td>
                            <td>
                              <button className={`btn btn-sm`} disabled>
                                Redeem
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <th>-</th>
                        <td>-</td>
                        <td>
                          <Countdown date={0}>
                            <p>- - -</p>
                          </Countdown>
                        </td>
                        <td>
                          <button className={`btn btn-sm`} disabled>
                            Redeem
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {status != "connected" ? null : (
              <>
                <div className="divider"></div>

                <div>
                  <p className="text-xl">Transfer</p>
                  <form className="form-control" onSubmit={(e) => transfer(e)}>
                    <label className="label-text text-md">From</label>
                    <label className="flex flex-col w-1/4">
                      <input
                        type="text"
                        required
                        name="from"
                        placeholder=""
                        className="input input-bordered input-sm w-full max-w-xs my-2"
                      />
                      <label className="label-text text-md">To</label>
                      <input
                        type="text"
                        required
                        name="to"
                        placeholder=""
                        className="input input-bordered input-sm w-full max-w-xs my-2"
                      />
                      <label className="label-text text-md">ID</label>
                      <input
                        type="text"
                        required
                        name="id"
                        placeholder=""
                        className="input input-bordered input-sm w-full max-w-xs my-2"
                      />
                      <label className="label-text text-md">Amount</label>
                      <input
                        type="text"
                        required
                        name="amount"
                        placeholder=""
                        className="input input-bordered input-sm w-full max-w-xs my-2"
                      />
                      <button className="btn btn-sm w-full max-w-xs my-2">
                        GO
                      </button>
                    </label>
                  </form>
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default User;
