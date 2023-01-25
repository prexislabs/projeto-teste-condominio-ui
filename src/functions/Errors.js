import { AlertFail } from "./Sweetalerts";

export function getErrors(error){
    console.log('texto do erro', error)
    
    if(error.includes('Somente sindico')){
        return AlertFail('Somente sindicos podem executar essa ação', '')
    }
    if(error.includes('Unidade invalida')){
        return AlertFail('Unidade inválida', '')
    }
    if(error.includes('Morador invalido')){
        return AlertFail('Morador inválido', '')
    }
    if(error.includes('Unidade existente')){
        return AlertFail('Unidade existente', '')
    }
    if(error.includes('Unidade inexistente')){
        return AlertFail('Unidade inexistente', '')
    }
    if(error.includes('Somente morador')){
        return AlertFail('Somente morador', '')
    }
    if(error.includes('Endereço invalido')){
        return AlertFail('Endereço inválido', '')
    }
    if(error.includes('Morador nao pode se autorizar')){
        return AlertFail('Morador nao pode se autorizar', '')
    }
    if(error.includes('Endereco ja autorizado')){
        return AlertFail('Endereco ja autorizado', '')
    }
    if(error.includes('Somente autorizado')){
        return AlertFail('Somente autorizado', '')
    }
    return AlertFail('Erro interno', '')

}
