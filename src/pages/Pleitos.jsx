import { useEffect, useState } from "react";
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
  const [amountOfPleitos, setAmountOfPleitos] = useState();
  const [allPleitos, setAllPleitos] = useState();

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
      setAmountOfPleitos(res)
      return res;
      // AlertInfo(
      //   "ID do Pleito",
      //   `<p className="font-mono text-3xl">${res.toString()}</p>`
      // );
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

      console.log(res)

      // AlertInfo(
      //   "Pleito",
      //   `
      //   <div className="flex flex-col text-left bg-slate-400">
      //   <p>ID: ${res[0]}</p>
      //   <p>Titulo: ${res[1]}</p>
      //   <p>Data de criação: ${dataCriacao}</p>
      //   <p>Data Limite: ${dataLimite}</p>
      //   <p>Votos Sim: ${res[4]}</p>
      //   <p>Votos Não: ${res[5]}</p>
      //   </div>
      //   `
      // );
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
  
  // new model functions

  async function getAllPleitos(){
    let amountOfPleitos = await pleitoId()
    let contract = new ethers.Contract(process.env.REACT_APP_PLEITOS_ADDRESS, pleitosAbi, provider)
    let allPleitos = []

    for(let i = 0; i < amountOfPleitos; i++){
      let res = await contract.pleitos(i)
      // id; // titulo; // dataCriacao; // dataLimite; // votosSim; // votosNao; 
      let pleito = [...res]
      pleito[0] = Number(pleito[0])
      pleito[2] = Number(pleito[2])
      pleito[3] = Number(pleito[3])
      pleito[4] = Number(pleito[4])
      pleito[5] = Number(pleito[5])    
      console.log(pleito)
      allPleitos.push(pleito)
  }
    setAllPleitos(allPleitos)
  }

  useEffect(() => {
    getAllPleitos()
  },[])

  return (
    <div className="pt-2">
      <div className="overflow-x-auto">
  <table className="table table-zebra w-full">
    <thead>
      <tr>
        <th>ID</th>
        <th>Descrição</th>
        <th>Criação</th>
        <th>Contagem</th>
        <th>Votos SIM</th>
        <th>Votos NÃO</th>
        <th>Voto</th>
        <th>Resultado</th>
      </tr>
    </thead>
    <tbody>
      {/* Para cada pleito, criar uma nova linha tr */}
      {allPleitos?.map((pleito, key) => {
        return (
          <tr key={key}>
            <th>{pleito[0]}</th>
            <td>{pleito[1]}</td>
            <td>{pleito[2]}</td>
            <td>{pleito[3]}</td>
            <td>{pleito[4]}</td>
            <td>{pleito[5]}</td>
            <td>
              <div className="hover:scale-110 duration-150 cursor-pointer">
                <img width={30} src="https://cdn-icons-png.flaticon.com/512/3468/3468573.png" alt="votar" />
              </div>
            </td>
            <td>
              <img width={30} src="https://cdn-icons-png.flaticon.com/512/4436/4436481.png" alt="aprovado" />
              {/* <img width={30} src="https://cdn-icons-png.flaticon.com/512/6711/6711656.png" alt="negado" /> */}
            </td>
          </tr>
        )
      })}
    </tbody>
  </table>
</div>
    </div>
  );
}

export default Pleitos;