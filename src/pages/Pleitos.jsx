import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle, setAllPleitos } from "../features/common/headerSlice";
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

import { reduceAddress, adicionarUnidade, unidades, removerUnidade, mudarSindico, novoPleito, pleitoId, getAllPleitos, vota } from "../functions/generalFunctions";

function Pleitos() {
  const provider = useProvider();
  const { data: signer, isError, isLoading } = useSigner();
  const { address } = useAccount()
  const [amountOfPleitos, setAmountOfPleitos] = useState();
  const [loadingLabel, setLoadingLabel] = useState('Carregando pleitos...');
  const { allPleitos } = useSelector(state => state.header);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Pleitos" }));
  }, []);  

  useEffect(() => {
    getAllPleitos(provider, address, dispatch, setAllPleitos)
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
              <button disabled={Date.now() > pleito[3] || pleito[6] == true} className="hover:scale-110 duration-150 cursor-pointer btn btn-sm" onClick={() => vota(pleito, signer)}>
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