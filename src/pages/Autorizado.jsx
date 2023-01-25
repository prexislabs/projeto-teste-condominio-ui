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

export default function Autorizado() {
  const [view, setView] = useState("pleitos");
  const provider = useProvider();
  const { address, status } = useAccount();
  const { data: signer, isError, isLoading } = useSigner();
  const dispatch = useDispatch();

  function changeView(view) {
    setView(view);
  }

  async function autorizarEndereco(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    try {
      const res = await contract.autorizarEndereco(
        e.target.unidade.value,
        e.target.autorizado.value
      );
      AlertLoading("Autorizando...");
      const resWait = await res.wait();
      if (resWait.status == 1) {
        AlertSuccess("Autorizado", "");
      }
      console.log(resWait.status);
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }

  async function desautorizarEndereco(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    try {
      const res = await contract.desautorizarEndereco(e.target.unidade.value);
      AlertLoading("Desautorizando");
      const resWait = await res.wait();
      if (resWait.status == 1) {
        AlertSuccess("Desautorizado", "");
      }
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }

  async function desautorizarSe(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    try {
      const res = await contract.desautorizarSe(e.target.unidade.value);
      AlertLoading("Desautorizando-se");
      const resWait = await res.wait();
      if (resWait.status == 1) {
        AlertSuccess("Desautorizado", "");
      }
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }

  async function retornarVotante(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    try {
      const res = await contract.retornaVotante(e.target.votante.value);
      AlertInfo("Votante", res);
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }

  async function sindico(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    try {
      const res = await contract.sindico();
      AlertInfo("Sindico", res == address ? "Você é o sindico" : "");
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

  async function desautorizarEndereco(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    try {
      const res = await contract.desautorizarEndereco(e.target.unidade.value);
      AlertLoading("Desautorizando");
      const resWait = await res.wait();
      if (resWait.status == 1) {
        AlertSuccess("Desautorizado", "");
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
                <p>Desautorizar Endereço</p>
                <form
                  className="flex flex-col"
                  onSubmit={(e) => desautorizarEndereco(e)}
                >
                  <input
                    type="text"
                    name="unidade"
                    placeholder="Unidade"
                    className="my-2 input input-bordered w-full max-w-xs"
                  />
                  <button className="btn mt-2">Desautorizar</button>
                </form>
              </div>
        </>
      ) : null}
    </div>
  );
}
