import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../features/common/headerSlice";
import { ethers } from "ethers";
import { useAccount, useProvider, useSigner } from "wagmi";
import {
  AlertLoading,
  AlertQuestion,
  AlertSuccess,
} from "../functions/Sweetalerts";

// ABI
import condominioAbi from "../abi/condominio.json";
import pleitosAbi from "../abi/pleitos.json";

function Mocktoken() {
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
    const res = await contract.condominio();
    console.log(res);
  }

  async function pleitoId() {
    const contract = new ethers.Contract(
      process.env.REACT_APP_PLEITOS_ADDRESS,
      pleitosAbi,
      provider
    );
    const res = await contract.pleitoId();
    console.log(Number(res));
  }

  async function pleitos(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_PLEITOS_ADDRESS,
      pleitosAbi,
      provider
    );
    const res = await contract.pleitos(e.target.id.value);
    console.log(res);
  }

  async function resultado(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_PLEITOS_ADDRESS,
      pleitosAbi,
      provider
    );
    const res = await contract.resultado(Number(e.target.id.value));
    console.log(res);
  }

  async function novoPleito(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_PLEITOS_ADDRESS,
      pleitosAbi,
      signer
    );
    const res = await contract.novoPleito(e.target.titulo.value, Number(e.target.duracao.value));
    const resWait = await res.wait();
    console.log(resWait);
  }

  return (
    <div className="pt-2 pl-8">
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
          <button className="btn w-full">
            Resultado
          </button>
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
        <form className="flex flex-col">
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
              <input type="radio" name="radio-7" className="radio radio-info" />
            </div>
            <div>
              <p>Não</p>
              <input
                type="radio"
                name="radio-7"
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

export default Mocktoken;
