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

function User() {
  // Hooks
  const provider = useProvider();
  const { address, status } = useAccount();
  const { data: signer, isError, isLoading } = useSigner();
  const dispatch = useDispatch();

  const [view, setView] = useState('morador');

  useEffect(() => {
    dispatch(setPageTitle({ title: "Condominio" }));
  }, []);

  // Functions

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

  async function atualizarMorador(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    try {
      const res = await contract.atualizarMorador(
        e.target.unidade.value,
        e.target.morador.value
      );
      AlertLoading("Atualizando...");
      const resWait = await res.wait();
      if (resWait.status == 1) {
        AlertSuccess("Atualizado ", "");
      }
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
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
        AlertSuccess("Desautorizado","");
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

  // View

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


  function changeView(view){
    setView(view)
  }

  return (

    <div className="pt-2 pl-8">

      {/* Navbar */}
    <div className="navbar bg-base-100 rounded-lg flex">
      <a className={`${view == 'morador' ? 'bg-gray-300' : null} mx-3 btn btn-ghost normal-case text-xl`} onClick={() => changeView('morador')}>Morador</a>
      <a className={`${view == 'sindico' ? 'bg-gray-300' : null} mx-3 btn btn-ghost normal-case text-xl`} onClick={() => changeView('sindico')}>Sindico</a>
      <a className={`${view == 'autorizado' ? 'bg-gray-300' : null} mx-3 btn btn-ghost normal-case text-xl`} onClick={() => changeView('autorizado')}>Autorizado</a>
    </div>

      {
        view == 'morador' ? (
          <>
            

            <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-3 grid-cols-2">

              <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
                <p>Retornar Votante</p>
                <form className="flex flex-col" onSubmit={(e) => retornarVotante(e)}>
                  <input
                    type="text"
                    name="votante"
                    placeholder="Votante"
                    className="my-2 input input-bordered w-full max-w-xs"
                  />
                  <button className="btn mt-2">Ver votante</button>
                </form>
              </div>

              <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
                <p>Autorizar Endereço</p>
                <form className="flex flex-col" onSubmit={(e) => autorizarEndereco(e)}>
                  <input
                    type="text"
                    name="unidade"
                    placeholder="Unidade"
                    className="my-2 input input-bordered w-full max-w-xs"
                  />
                  <input
                    type="text"
                    name="autorizado"
                    placeholder="Morador"
                    className="my-2 input input-bordered w-full max-w-xs"
                  />
                  <button className="btn mt-2">Autorizar</button>
                </form>
              </div>

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

              <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
                <p>Sindico</p>
                <form className="flex flex-col" onSubmit={(e) => sindico(e)}>
                  <button className="btn mt-2">Ver Sindico</button>
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

            </div>



          </>
        ) : 
        view == 'sindico' ? (
          <>

          <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-3 grid-cols-2">
           
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

              <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
                <p>Adicionar unidade</p>
                <form className="flex flex-col" onSubmit={(e) => adicionarUnidade(e)}>
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
                <p>Atualizar Morador</p>
                <form className="flex flex-col" onSubmit={(e) => atualizarMorador(e)}>
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
                  <button className="btn mt-2">Atualizar</button>
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

          </div>  


          </>
        ) :
        view == 'autorizado' ? (
          <>            

            <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-3 grid-cols-2">


            <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
              <p>Desautorizar-se</p>
              <form className="flex flex-col" onSubmit={(e) => desautorizarSe(e)}>
                <input
                  type="text"
                  name="unidade"
                  placeholder="Unidade"
                  className="my-2 input input-bordered w-full max-w-xs"
                />
                <button className="btn mt-2">Desautorizar</button>
              </form>
            </div> 

            <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
              <p>Sindico</p>
              <form className="flex flex-col" onSubmit={(e) => sindico(e)}>
                <button className="btn mt-2">Ver Sindico</button>
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

            </div>


          </>
        ) :
        null
      }




    </div>

  );
}

export default User;