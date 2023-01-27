import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle, setAllPleitos, setAmountOfPleitos } from "../features/common/headerSlice";
import { useAccount, useProvider, useSigner } from "wagmi";
import Countdown from 'react-countdown';
import { getAllPleitos, vota } from "../functions/generalFunctions";

function Pleitos() {
  const provider = useProvider();
  const { data: signer, isError, isLoading } = useSigner();
  const { address } = useAccount()
  const { allPleitos, amountOfPleitos } = useSelector(state => state.header);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Pleitos" }));
  }, []);  

  useEffect(() => {
    getAllPleitos(provider, address, dispatch, setAllPleitos, setAmountOfPleitos)
  },[])


  return (
    <div className="pt-2">

    { amountOfPleitos == 'loading' || amountOfPleitos == 0 ?     
      <div className="flex justify-center"> 
        <h1 className={`${amountOfPleitos != 0 ? 'loading' : null} btn cursor-default bg-transparent border-none hover:bg-transparent text-black`}>
        { 
          amountOfPleitos == 'loading' ? "Carregando pleitos" : 
          amountOfPleitos == 0 ? "Nenhum pleito encontrado" :
          null
        }
        </h1>
      </div>
      : 
      null
    }  

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
              <button disabled={Date.now() > pleito[3] || pleito[6] == true} className="hover:scale-110 duration-150 cursor-pointer btn btn-sm" onClick={() => vota(pleito, signer, address, dispatch, setAllPleitos, setAmountOfPleitos)}>
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