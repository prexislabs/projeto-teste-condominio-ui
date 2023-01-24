import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../features/common/headerSlice";
import { ethers } from "ethers";
import { useAccount, useProvider, useSigner } from "wagmi";

import condominioAbi from "../abi/condominio.json";

function User() {
  // Hooks
  const provider = useProvider();
  const { address, status } = useAccount();
  const { data: signer, isError, isLoading } = useSigner();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Condominio" }));
  }, []);

  // Functions

  async function adicionarUnidade(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    const res = await contract.adicionarUnidade(
      e.target.unidade.value,
      e.target.morador.value
    );
    const resWait = await res.wait();
    console.log(resWait.status);
  }

  async function atualizarMorador(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    const res = await contract.atualizarMorador(
      e.target.unidade.value,
      e.target.morador.value
    );
    const resWait = await res.wait();
    console.log(resWait.status);
  }

  async function autorizarEndereco(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    const res = await contract.autorizarEndereco(
      e.target.unidade.value,
      e.target.autorizado.value
    );
    const resWait = await res.wait();
    console.log(resWait.status);
  }

  async function desautorizarEndereco(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    const res = await contract.desautorizarEndereco(e.target.unidade.value);
    const resWait = await res.wait();
    console.log(resWait.status);
  }

  async function desautorizarSe(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    const res = await contract.desautorizarSe(e.target.unidade.value);
    const resWait = await res.wait();
    console.log(resWait.status);
  }

  async function mudarSindico(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    const res = await contract.mudarSindico(e.target.novoSindico.value);
    const resWait = await res.wait();
    console.log(resWait.status);
  }

  async function removerUnidade(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    const res = await contract.removerUnidade(e.target.unidade.value);
    const resWait = await res.wait();
    console.log(resWait.status);
  }

  // View

  async function retornarVotante(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    const res = await contract.retornarVotante(e.target.votante.value);
    console.log(res);
  }

  async function sindico(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    const res = await contract.sindico();
    console.log(res);
  }

  async function unidades(e) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    const res = await contract.unidades(e.target.unidades.value);
    console.log(res);
  }

  return (
    <div className="pt-2 pl-8">

      <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
        <p>Retornar Votante</p>
        <form className="flex flex-col" onSubmit={(e) => autorizarEndereco(e)}>
          <input
            type="text"
            name="unidade"
            placeholder="Unidade"
            className="my-2 input input-bordered w-full max-w-xs"
          />
          <button className="btn mt-2">Ver votante</button>
        </form>
      </div>

      <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
        <p>Sindico</p>
        <form className="flex flex-col" onSubmit={(e) => autorizarEndereco(e)}>
          <input
            type="text"
            name="unidade"
            placeholder="Unidade"
            className="my-2 input input-bordered w-full max-w-xs"
          />
          <button className="btn mt-2">Sindico</button>
        </form>
      </div>

      <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
        <p>Unidades</p>
        <form className="flex flex-col" onSubmit={(e) => autorizarEndereco(e)}>
          <input
            type="text"
            name="unidade"
            placeholder="Unidade"
            className="my-2 input input-bordered w-full max-w-xs"
          />
          <button className="btn mt-2">Ver unidades</button>
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
            name="morador"
            placeholder="Morador"
            className="my-2 input input-bordered w-full max-w-xs"
          />
          <button className="btn mt-2">Autorizar</button>
        </form>
      </div>

      <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
        <p>Desautorizar Endereço</p>
        <form className="flex flex-col" onSubmit={(e) => desautorizarEndereco(e)}>
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
          <button className="btn mt-2">Desautorizar</button>
        </form>
      </div>

      <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
        <p>Desautorizar-se</p>
        <form className="flex flex-col" onSubmit={(e) => desautorizarSe(e)}>
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
          <button className="btn mt-2">Desautorizar</button>
        </form>
      </div>

      <div className="my-5 bg-slate-200 p-5 rounded-lg max-w-xs">
        <p>Mudar sindico</p>
        <form className="flex flex-col" onSubmit={(e) => mudarSindico(e)}>
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
          <button className="btn mt-2">Mudar</button>
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
          <input
            type="text"
            name="morador"
            placeholder="Morador"
            className="my-2 input input-bordered w-full max-w-xs"
          />
          <button className="btn mt-2">Remover</button>
        </form>
      </div>

    </div>
  );
}

export default User;
