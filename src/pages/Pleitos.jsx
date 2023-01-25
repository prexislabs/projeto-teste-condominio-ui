import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../features/common/headerSlice";
import { ethers } from "ethers";
import { useAccount, useProvider, useSigner } from "wagmi";
import {
  AlertFail,
  AlertInfo,
  AlertLoading,
  AlertQuestion,
  AlertSuccess,
} from "../functions/Sweetalerts";

// ABI
import condominioAbi from "../abi/condominio.json";
import pleitosAbi from "../abi/pleitos.json";
import { getErrors } from "../functions/Errors";

function Pleitos() {
  const provider = useProvider();
  const { data: signer, isError, isLoading } = useSigner();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Pleitos" }));
  }, []);

  // Functions
  async function condominio() {
    const contract = new ethers.Contract(
      process.env.REACT_APP_PLEITOS_ADDRESS,
      pleitosAbi,
      provider
    );
    try {
      const res = await contract.condominio();
      AlertInfo(
        "Endereço do condominio",
        `<p className="text-sm font-mono">${res}</p>`
      );
      console.log(res);
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }

  async function pleitoId() {
    const contract = new ethers.Contract(
      process.env.REACT_APP_PLEITOS_ADDRESS,
      pleitosAbi,
      provider
    );
    try {
      const res = Number(await contract.pleitoId());
      AlertInfo(
        "ID do Pleito",
        `<p className="font-mono text-3xl">${res.toString()}</p>`
      );
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }

  async function pleitos(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_PLEITOS_ADDRESS,
      pleitosAbi,
      provider
    );
    try {
      const res = await contract.pleitos(e.target.id.value);

      if (res[1] == "") return AlertInfo("Não encontrado");

      let dataCriacao = Number(res[2]) * 1000;
      dataCriacao = new Date(dataCriacao);
      dataCriacao = dataCriacao.toLocaleString("pt-br");

      let dataLimite = Number(res[3]) * 1000;
      dataLimite = new Date(dataLimite);
      dataLimite = dataLimite.toLocaleString("pt-br");

      AlertInfo(
        "Pleito",
        `
        <div className="flex flex-col text-left bg-slate-400">
        <p>ID: ${res[0]}</p>
        <p>Titulo: ${res[1]}</p>
        <p>Data de criação: ${dataCriacao}</p>
        <p>Data Limite: ${dataLimite}</p>
        <p>Votos Sim: ${res[4]}</p>
        <p>Votos Não: ${res[5]}</p>
        </div>
        `
      );
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }

  async function resultado(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_PLEITOS_ADDRESS,
      pleitosAbi,
      provider
    );
    try {
      const res = await contract.resultado(Number(e.target.id.value));
      console.log(res);
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
    try {
      const res = await contract.novoPleito(
        e.target.titulo.value,
        Number(e.target.duracao.value)
      );
      AlertLoading("Adicionando...", "");
      const resWait = await res.wait();
      if (resWait.status == 1) {
        AlertSuccess("Adicionado", "");
      }
      console.log(resWait);
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }

  async function vota(e) {
    e.preventDefault();

    const contract = new ethers.Contract(
      process.env.REACT_APP_PLEITOS_ADDRESS,
      pleitosAbi,
      signer
    );
    try {
      const res = await contract.vota(
        e.target.pleitoId.value,
        Number(e.target.unidade.value),
        e.target.voto.value
      );
      AlertLoading("Criando votação");
      const resWait = await res.wait();
      if (resWait.status == 1) {
        AlertSuccess("Votação criada");
      }
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }

  return (
    <div className="pt-2">
      <div className="my-5 p-4 bg-gray-300 max-w-xs rounded-lg">
        <p>Endereço do condominio</p>
        <button className="btn w-full" onClick={() => condominio()}>
          Endereço do condominio
        </button>
      </div>

      <div className="my-5 p-4 bg-gray-300 max-w-xs rounded-lg">
        <p>Pleito ID</p>
        <button className="btn w-full" onClick={() => pleitoId()}>
          Pleito ID
        </button>
      </div>

      <div className="my-5 p-4 bg-gray-300 max-w-xs rounded-lg">
        <form onSubmit={(e) => resultado(e)}>
          <p>Resultado</p>
          <input
            type="text"
            name="id"
            placeholder="ID"
            className="my-2 input input-bordered w-full max-w-xs input-sm"
          />
          <button className="btn w-full">Resultado</button>
        </form>
      </div>

      <div className="my-5 p-4 bg-gray-300 max-w-xs rounded-lg">
        <p>Pleitos</p>
        <form className="flex flex-col max-w-xs" onSubmit={(e) => pleitos(e)}>
          <input
            type="text"
            name="id"
            placeholder="ID"
            className="my-2 input input-bordered w-full max-w-xs input-sm"
          />
          <button className="my-2 btn">GO</button>
        </form>
      </div>

      <div className="my-5 p-4 bg-gray-300 max-w-xs rounded-lg">
        <p>Novo pleito</p>
        <form onSubmit={(e) => novoPleito(e)} className="flex flex-col">
          <input
            type="text"
            placeholder="Titulo"
            name="titulo"
            className="input input-bordered w-full max-w-xs input-sm my-1"
          />
          <input
            type="text"
            placeholder="Duração"
            name="duracao"
            className="input input-bordered w-full max-w-xs input-sm my-1"
          />
          <button className="btn mt-3">GO</button>
        </form>
      </div>

      <div className="my-5 p-4 bg-gray-300 max-w-xs rounded-lg">
        <p>Votação</p>
        <form className="flex flex-col" onSubmit={(e) => vota(e)}>
          <input
            type="text"
            placeholder="ID do pleito"
            name="pleitoId"
            className="input input-bordered w-full max-w-xs input-sm my-1"
          />
          <input
            type="text"
            placeholder="Unidade"
            name="unidade"
            className="input input-bordered w-full max-w-xs input-sm my-1"
          />
          <div className="flex my-3 justify-evenly">
            <div>
              <p>Sim</p>
              <input
                type="radio"
                value={true}
                name="voto"
                className="radio radio-info"
              />
            </div>
            <div>
              <p>Não</p>
              <input
                type="radio"
                value={false}
                name="voto"
                className="radio radio-error"
              />
            </div>
          </div>
          <button className="btn">GO</button>
        </form>
      </div>
    </div>
  );
}

export default Pleitos;