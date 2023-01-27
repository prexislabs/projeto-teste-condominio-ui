import { ethers } from 'ethers';
import condominioAbi from '../abi/condominio.json'
import pleitosAbi from '../abi/pleitos.json'
import { AlertLoading, AlertSuccess, AlertInfo } from '../functions/Sweetalerts'
import { getErrors } from '../functions/Errors'
import Swal from 'sweetalert2'

const addressZero = '0x0000000000000000000000000000000000000000'  

export function reduceAddress(address){
    if(!address) return
    let firstPart = address.substr(0, 6)
    let secondPart = address.substr(37,42)
    return firstPart + '...' + secondPart
}

export async function adicionarUnidade(e, signer) {
    e.preventDefault()
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
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }

export async function unidades(e, signer) {
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
      <p>Autorizado: ${res[1] == addressZero ? 'Não cadastrado' : reduceAddress(res[1])}</p>
      </div>
      ` 
      );
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }

export async function removerUnidade(e, signer) {
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

export async function mudarSindico(e, dispatch, setSindico, signer) {
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
        dispatch(setSindico(e.target.novoSindico.value))
      }
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }

export async function novoPleito(e, address, dispatch,setAllPleitos, setAmountOfPleitos, signer) {
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
      getAllPleitos(signer, address, dispatch, setAllPleitos, setAmountOfPleitos);
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }
  
export async function pleitoId(provider) {

    let customHttpProvider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');

    const contract = new ethers.Contract(
      process.env.REACT_APP_PLEITOS_ADDRESS,
      pleitosAbi,
      provider ? provider : customHttpProvider
    );
    try {
      const res = Number(await contract.pleitoId());
      return res;
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }

export async function getAllPleitos(provider, address, dispatch, setAllPleitos, setAmountOfPleitos){
      
    let customHttpProvider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');
    let amountOfPleitos = await pleitoId(provider)

    let contract = new ethers.Contract(process.env.REACT_APP_PLEITOS_ADDRESS, pleitosAbi, provider ? provider : customHttpProvider) 
    let condominio = new ethers.Contract(process.env.REACT_APP_CONDOMINIO_ADDRESS, condominioAbi, provider ? provider : customHttpProvider)
    let allPleitos = []

    for(let i = 0; i < amountOfPleitos; i++){
      let res = await contract.pleitos(i)
      // id; 0
      // titulo;1 
      // dataCriacao;2 
      // dataLimite; 3
      // votosSim; 4
      // votosNao; 5
      // votou; 6
      // unidade; 7

      let pleito = [...res]
      pleito[0] = Number(pleito[0])
      let data = new Date(pleito[2] * 1000)
      data = data.toLocaleTimeString('pt-br')
      pleito[2] = data
      pleito[3] = Number(pleito[3])
      pleito[4] = Number(pleito[4])
      pleito[5] = Number(pleito[5])

      let enderecoUsuario = await condominio.enderecos(address)
      pleito[6] = await contract.votou(pleito[0],Number(enderecoUsuario))
      pleito[7] = Number(enderecoUsuario)

      allPleitos.push(pleito) 
  }
      dispatch(setAllPleitos(allPleitos))
      if(allPleitos.length == 0){
        dispatch(setAmountOfPleitos(0))
      }else{
        dispatch(setAmountOfPleitos(allPleitos.length))
      }
  }

export async function vota(pleito, signer, address, dispatch, setAllPleitos, setAmountOfPleitos) {
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
        getAllPleitos(signer, address, dispatch, setAllPleitos, setAmountOfPleitos, );
      }
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }

export async function autorizarEndereco(e, signer) {
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
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }

export async function desautorizarEndereco(e, signer) {
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

export async function desautorizarSe(e, signer) {
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

export async function retornarVotante(e, signer) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    try {
      const res = await contract.retornaVotante(e.target.votante.value);
      AlertInfo(res == addressZero ? "Não existem votantes nesta unidade" : reduceAddress(res), "")
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }

export async function sindico(e, address, signer) {
    e.preventDefault();
    const contract = new ethers.Contract(
      process.env.REACT_APP_CONDOMINIO_ADDRESS,
      condominioAbi,
      signer
    );
    try {
      const res = await contract.sindico();
      AlertInfo("Sindico", res == address ? "Você é o sindico" : reduceAddress(res));
    } catch (err) {
      if (err.reason) getErrors(err.reason);
    }
  }