import Pleitos from "./Pleitos";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../features/common/headerSlice";
import { ethers } from "ethers";
import { useAccount, useProvider, useSigner } from "wagmi";
import pleitosAbi from '../abi/pleitos.json'
import { reduceAddress } from "../functions/generalFunctions";

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

  const addressZero = '0x0000000000000000000000000000000000000000'

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
      if(res[0] == addressZero) return AlertInfo("Unidade não existe")
      AlertInfo(
        "Unidades",
        `
        <div className="flex flex-col text-left">
        <p>Morador: ${reduceAddress(res[0])}</p>
      <p>Autorizado: ${res[1] == addressZero ? 'Não cadastrado' : res[1]}</p>
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

  async function novoPleito(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_PLEITOS_ADDRESS,
      pleitosAbi,
      signer
    );    

    let tempo = Math.floor(Date.now() / 1000) + Number(e.target.duracao.value)

    try {
      const res = await contract.novoPleito(e.target.titulo.value,tempo * 1000);
      AlertLoading("Criando novo pleito...", "");
      const resWait = await res.wait();
      if (resWait.status == 1) AlertSuccess("Pleito criado", "");
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
        <> 
          <Pleitos />

          <div className="divider"></div>  

          <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
            <p>Criar novo pleito</p>
            <form className="flex flex-col" onSubmit={(e) => novoPleito(e)}>
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
              <button className="btn mt-2" disabled={status != 'connected'}>Adicionar</button>
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
              <button className="btn mt-2" disabled={status != 'connected'}>Remover</button>
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
              <button className="btn mt-2" disabled={status != 'connected'}>Ver unidades</button>
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
                  <button className="btn mt-2" disabled={status != 'connected'}>Mudar</button>
                </form>
              </div>
        </div>
      ) : null}
    </div>
  );
}
