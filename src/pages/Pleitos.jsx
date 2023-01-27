import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import Countdown from 'react-countdown';
import Swal from 'sweetalert2';

// ABI
import condominioAbi from "../abi/condominio.json";
import pleitosAbi from "../abi/pleitos.json";
import { getErrors } from "../functions/Errors";

function Pleitos() {
  const provider = useProvider();
  const { data: signer, isError, isLoading } = useSigner();
  const { address } = useAccount()
  const [amountOfPleitos, setAmountOfPleitos] = useState();
  const [allPleitos, setAllPleitos] = useState([]);
  const [loadingLabel, setLoadingLabel] = useState('Carregando pleitos...');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Pleitos" }));
  }, []);


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
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }

  async function vota(pleito) {
    // e.preventDefault();

    const inputOptions = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          'true': 'Sim',
          'false': 'Não'
        })
      }, 1000)
    })
    
    const { value: votoEscolhido } = await Swal.fire({
      title: 'Selecione seu voto:',
      input: 'radio',
      inputOptions: inputOptions,
      inputValidator: (value) => {
        if (!value) {
          return 'Você precisa selecionar uma opção de voto!'
        }
      }
    })

    if(votoEscolhido == undefined) return

    const contract = new ethers.Contract(
      process.env.REACT_APP_PLEITOS_ADDRESS,
      pleitosAbi,
      signer 
    );
    try {
      // PleitoID, unidade, voto
      const res = await contract.vota(pleito[0], Number(pleito[7]), votoEscolhido == 'true' ? true : false);
      AlertLoading("Computando voto");
      const resWait = await res.wait();
      if (resWait.status == 1) { 
        AlertSuccess("Voto computado","");
        getAllPleitos();
      }
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }
  
  // new model functions

  async function getAllPleitos(){
    let amountOfPleitos = await pleitoId()
    let contract = new ethers.Contract(process.env.REACT_APP_PLEITOS_ADDRESS, pleitosAbi, provider) 
    let condominio = new ethers.Contract(process.env.REACT_APP_CONDOMINIO_ADDRESS, condominioAbi, provider)
    let allPleitos = []



    for(let i = 0; i < amountOfPleitos; i++){
      let res = await contract.pleitos(i)

      // id; // titulo; // dataCriacao; // dataLimite; // votosSim; // votosNao; 
      let pleito = [...res]
      pleito[0] = Number(pleito[0])
      let data = new Date(pleito[2] * 1000)
      data = data.toLocaleTimeString('pt-br')
      pleito[2] = data
      pleito[3] = Number(pleito[3])
      pleito[4] = Number(pleito[4])
      pleito[5] = Number(pleito[5])

      let enderecoUsuario = await condominio.enderecos(address)
      pleito[6] = await contract.votou(pleito[0],Number(enderecoUsuario[1]))
      pleito[7] = Number(enderecoUsuario[1])

      allPleitos.push(pleito) 
  }
     if(allPleitos.length == 0) setLoadingLabel('Nenhum pleito criado')
      setAllPleitos(allPleitos)
  }

  useEffect(() => {
    getAllPleitos()
  },[])

  return (
    <div className="pt-2">

    <div className="flex justify-center"> 
    { 
      allPleitos?.length == 0 ?
      <h1 className={`${loadingLabel.includes('Carregando') ? 'loading' : null} btn bg-transparent border-none text-black`}>{loadingLabel}</h1>
      :
      null
    }
    </div>

    {
      allPleitos?.length == 0 ? null :      
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
            <td>
              <Countdown date={pleito[3]}>
                <p className="">Finalizado</p>
              </Countdown>
            </td>
            <td>{pleito[4]}</td>
            <td>{pleito[5]}</td>
            <td>
              <button disabled={Date.now() > pleito[3] || pleito[6] == true} className="hover:scale-110 duration-150 cursor-pointer btn btn-sm" onClick={() => vota(pleito)}>
                {pleito[6] == true ? 'Votado' : 'Votar'}
              </button>
            </td>
            <td>
              {
                Date.now() < pleito[3] ? 
                <img width={30} src="https://cdn-icons-png.flaticon.com/512/4394/4394939.png"/> :
                pleito[4] == pleito[5] ? 
                <img width={30} src="https://cdn-icons-png.flaticon.com/512/4604/4604814.png"/> :
                pleito[4] > pleito[5] ? 
                <img width={30} src="https://cdn-icons-png.flaticon.com/512/4436/4436481.png" alt="aprovado" /> : 
                <img width={30} src="https://cdn-icons-png.flaticon.com/512/6711/6711656.png" alt="negado" /> 
              }
            </td>
          </tr>
        )
      })}
    </tbody>
  </table>
</div>
    }


    </div>
  );
}

export default Pleitos;