import Pleitos from "./Pleitos";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../features/common/headerSlice";
import { ethers } from "ethers";
import { useAccount, useProvider, useSigner } from "wagmi";

import { unidades, autorizarEndereco, desautorizarEndereco, desautorizarSe, sindico, retornarVotante } from "../functions/generalFunctions";
import condominioAbi from "../abi/condominio.json";
import {
  AlertFail,
  AlertInfo,
  AlertLoading,
  AlertSuccess,
} from "../functions/Sweetalerts";
import { getErrors } from "../functions/Errors";

export default function Morador() {
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
          onClick={() => changeView("autorizacao")}
        >
          Autorização
        </a>
        <a
          className={`${
            view == "transferencia" ? "bg-gray-300" : null
          } mx-3 btn btn-ghost normal-case text-xl`}
          onClick={() => changeView("condominio")}
        >
          Condomínio
        </a>
      </div>

      {view == "pleitos" ? (
        <Pleitos />
      ) : view == "autorizacao" ? (
        <>
          <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
            <p>Autorizar Endereço</p>
            <form
              className="flex flex-col"
              onSubmit={(e) => autorizarEndereco(e, signer)}
            >
              <input
                type="text"
                name="unidade"
                placeholder="Unidade"
                className="my-2 input input-bordered w-full max-w-xs"
              />
              <input
                type="text"
                name="autorizado"
                placeholder="Morador"
                className="my-2 input input-bordered w-full max-w-xs"
              />
              <button className="btn mt-2" disabled={status != 'connected'}>Autorizar</button>
            </form>
          </div>

          <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
            <p>Desautorizar Endereço</p>
            <form
              className="flex flex-col"
              onSubmit={(e) => desautorizarEndereco(e, signer)}
            >
              <input
                type="text"
                name="unidade"
                placeholder="Unidade"
                className="my-2 input input-bordered w-full max-w-xs"
              />
              <button className="btn mt-2" disabled={status != 'connected'}>Desautorizar</button>
            </form>
          </div>

          <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
            <p>Desautorizar-se</p>
            <form className="flex flex-col" onSubmit={(e) => desautorizarSe(e, signer)}>
              <input
                type="text"
                name="unidade"
                placeholder="Unidade"
                className="my-2 input input-bordered w-full max-w-xs"
              />
              <button className="btn mt-2" disabled={status != 'connected'}>Desautorizar</button>
            </form>
          </div>
        </>
      ) : view == "condominio" ? (
        <>
          <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
            <p>Retornar Votante</p>
            <form
              className="flex flex-col"
              onSubmit={(e) => retornarVotante(e, signer)}
            >
              <input
                type="text"
                name="votante"
                placeholder="Votante"
                className="my-2 input input-bordered w-full max-w-xs"
              />
              <button className="btn mt-2" disabled={status != 'connected'}>Ver votante</button>
            </form>
          </div>
          <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
            <p>Sindico</p>
            <form className="flex flex-col" onSubmit={(e) => sindico(e,address,signer)}>
              <button className="btn mt-2" disabled={status != 'connected'}>Ver Sindico</button>
            </form>
          </div>

          <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
            <p>Unidades</p>
            <form className="flex flex-col" onSubmit={(e) => unidades(e, signer)}>
              <input
                type="text"
                name="unidades"
                placeholder="Unidades"
                className="my-2 input input-bordered w-full max-w-xs"
              />
              <button className="btn mt-2" disabled={status != 'connected'}>Ver unidades</button>
            </form>
          </div>
        </>
      ) : null}
    </div>
  );
}
