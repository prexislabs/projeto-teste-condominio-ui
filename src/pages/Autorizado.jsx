import Pleitos from "./Pleitos";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../features/common/headerSlice";
import { ethers } from "ethers";
import { useAccount, useProvider, useSigner } from "wagmi";
import { desautorizarSe } from "../functions/generalFunctions";

import condominioAbi from "../abi/condominio.json";
import {
  AlertFail,
  AlertInfo,
  AlertLoading,
  AlertSuccess,
} from "../functions/Sweetalerts";
import { getErrors } from "../functions/Errors";

export default function Autorizado() {
  const [view, setView] = useState("pleitos");
  const provider = useProvider();
  const { address, status } = useAccount();
  const { data: signer, isError, isLoading } = useSigner();
  const dispatch = useDispatch();

  function changeView(view) {
    setView(view);
  }


  return (
    <div className="pt-2 pl-8">
      <div className="navbar bg-base-100 rounded-lg flex">
        <a
          className={`${
            view == "pleitos" ? "bg-gray-300" : null
          } mx-3 btn btn-ghost normal-case text-xl`}
          onClick={() => changeView("pleitos")}
        >
          Pleitos
        </a>
        <a
          className={`${
            view == "unidades" ? "bg-gray-300" : null
          } mx-3 btn btn-ghost normal-case text-xl`}
          onClick={() => changeView("desautorizarse")}
        >
          Desautorizar-se
        </a>
      </div>

      {view == "pleitos" ? (
        <Pleitos />
      ) : view == "desautorizarse" ? (
        <>
                        <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
                <p>Desautorizar-se</p>
                <form
                  className="flex flex-col"
                  onSubmit={(e) => desautorizarSe(e, signer)}
                >
                  <input
                    type="text"
                    name="unidade"
                    placeholder="Unidade"
                    className="my-2 input input-bordered w-full max-w-xs"
                  />
                  <button className="btn mt-2" disabled={status != 'connected'}>Desautorizar-se</button>
                </form>
              </div>
        </>
      ) : null}
    </div>
  );
}
