import Pleitos from "./Pleitos";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../features/common/headerSlice";
import { ethers } from "ethers";
import { useAccount, useProvider, useSigner } from "wagmi";

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

  async function adicionarUnidade(e) {
    e.preventDefault();
    console.log(e.target.unidade.value, e.target.morador.value);
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    try {
      const res = await contract.adicionarUnidade(
        e.target.unidade.value,
        e.target.morador.value
      );
      AlertLoading("Adicionando...");
      const resWait = await res.wait();
      if (resWait.status == 1) {
        AlertSuccess("Adicionado ", "");
      }
      console.log(resWait.status);
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }

  async function unidades(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    try {
      const res = await contract.unidades(e.target.unidades.value);
      AlertInfo(
        "Unidades",
        `
        <div className="flex flex-col text-left">
        <p>Morador: ${res[0]}</p>
      <p>Autorizado: ${res[1]}</p>
      </div>
      `
      );
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }

  async function removerUnidade(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    try {
      const res = await contract.removerUnidade(e.target.unidade.value);
      AlertLoading("Removendo...");
      const resWait = await res.wait();
      if (resWait.status == 1) {
        AlertSuccess("Removido", "");
      }
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }

  async function mudarSindico(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    try {
      const res = await contract.mudarSindico(e.target.novoSindico.value);
      AlertLoading("Mudando sindico...");
      const resWait = await res.wait();
      if (resWait.status == 1) {
        AlertSuccess("Novo sindico adicionado", "");
      }
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
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
        <Pleitos />
      ) : view == "unidades" ? (
        <>
          <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
            <p>Adicionar unidade</p>
            <form
              className="flex flex-col"
              onSubmit={(e) => adicionarUnidade(e)}
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
              <button className="btn mt-2">Adicionar</button>
            </form>
          </div>

          <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
            <p>Remover Unidade</p>
            <form className="flex flex-col" onSubmit={(e) => removerUnidade(e)}>
              <input
                type="text"
                name="unidade"
                placeholder="Unidade"
                className="my-2 input input-bordered w-full max-w-xs"
              />
              <button className="btn mt-2">Remover</button>
            </form>
          </div>

          <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
            <p>Unidades</p>
            <form className="flex flex-col" onSubmit={(e) => unidades(e)}>
              <input
                type="text"
                name="unidades"
                placeholder="Unidades"
                className="my-2 input input-bordered w-full max-w-xs"
              />
              <button className="btn mt-2">Ver unidades</button>
            </form>
          </div>


        </>
      ) : view == "transferencia" ? (
        <div>
                          <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
                <p>Mudar sindico</p>
                <form className="flex flex-col" onSubmit={(e) => mudarSindico(e)}>
                  <input
                    type="text"
                    name="novoSindico"
                    placeholder="Novo sindico"
                    className="my-2 input input-bordered w-full max-w-xs"
                  />
                  <button className="btn mt-2">Mudar</button>
                </form>
              </div>
        </div>
      ) : null}
    </div>
  );
}
