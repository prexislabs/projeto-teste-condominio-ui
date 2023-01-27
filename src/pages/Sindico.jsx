import Pleitos from "./Pleitos";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../features/common/headerSlice";
import { ethers } from "ethers";
import { useAccount, useProvider, useSigner } from "wagmi";
import pleitosAbi from '../abi/pleitos.json'
import { reduceAddress, adicionarUnidade, unidades, removerUnidade, mudarSindico, novoPleito, pleitoId, getAllPleitos } from "../functions/generalFunctions";
import { setAllPleitos, setSindico } from "../features/common/headerSlice";

import condominioAbi from "../abi/condominio.json";
import {
  AlertFail,
  AlertInfo,
  AlertLoading,
  AlertSuccess,
} from "../functions/Sweetalerts";
import { getErrors } from "../functions/Errors";

export default function Sindico() {
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
          onClick={() => changeView("unidades")}
        >
          Unidades
        </a>
        <a
          className={`${
            view == "transferencia" ? "bg-gray-300" : null
          } mx-3 btn btn-ghost normal-case text-xl`}
          onClick={() => changeView("transferencia")}
        >
          Transferência
        </a>
      </div>

      {view == "pleitos" ? (
        <> 
          <Pleitos />

          <div className="divider"></div>  

          <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
            <p>Criar novo pleito</p>
            {/* e, address, dispatch, signer, setAllPleitos */}
            <form className="flex flex-col" onSubmit={(e) => novoPleito(e, address, dispatch, setAllPleitos, signer)}>
              <input type="text" name="titulo" placeholder="Titulo" className="my-2 input input-bordered w-full max-w-xs"/>
              <input type="text" name="duracao" placeholder="Duração"  className="my-2 input input-bordered w-full max-w-xs"/>
              <button className="btn mt-2" disabled={status != 'connected'}>Criar novo pleito</button>
            </form>
          </div>
          
        </>
      ) : view == "unidades" ? (
        <>
          <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
            <p>Adicionar unidade</p>
            <form
              className="flex flex-col"
              onSubmit={(e) => adicionarUnidade(e, signer)}
            >
              <input
                type="text"
                name="unidade"
                placeholder="Unidade"
                className="my-2 input input-bordered w-full max-w-xs"
              />
              <input
                type="text"
                name="morador"
                placeholder="Morador"
                className="my-2 input input-bordered w-full max-w-xs"
              />
              <button className="btn mt-2" disabled={status != 'connected'}>Adicionar</button>
            </form>
          </div>

          <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
            <p>Remover Unidade</p>
            <form className="flex flex-col" onSubmit={(e) => removerUnidade(e, signer)}>
              <input
                type="text"
                name="unidade"
                placeholder="Unidade"
                className="my-2 input input-bordered w-full max-w-xs"
              />
              <button className="btn mt-2" disabled={status != 'connected'}>Remover</button>
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
      ) : view == "transferencia" ? (
        <div>
                          <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
                <p>Mudar sindico</p>
                <form className="flex flex-col" onSubmit={(e) => mudarSindico(e, dispatch, setSindico, signer)}>
                  <input
                    type="text"
                    name="novoSindico"
                    placeholder="Novo sindico"
                    className="my-2 input input-bordered w-full max-w-xs"
                  />
                  <button className="btn mt-2" disabled={status != 'connected'}>Mudar</button>
                </form>
              </div>
        </div>
      ) : null}
    </div>
  );
}
