import { AlertFail } from "./Sweetalerts";

export function getErrors(error){    
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
        return AlertFail('Morador não pode se autorizar', '')
    }
    if(error.includes('Endereco ja autorizado')){
        return AlertFail('Endereco já autorizado', '')
    }
    if(error.includes('Somente autorizado')){
        return AlertFail('Somente autorizado', '')
    }
    if(error.includes('Pleito sem votos')){
        return AlertFail('Pleito sem votos', '')
    }
    if(error.includes('Pleito ainda nao encerrado')){
        return AlertFail('Pleito ainda não encerrado', '')
    }
    if(error.includes('Titulo invalido')){
        return AlertFail('Titulo inválido', '')
    }
    if(error.includes('Data limite invalida')){
        return AlertFail('Data limite inválida', '')
    }
    if(error.includes('Pleito encerrado')){
        return AlertFail('Pleito encerrado', '')
    }
    if(error.includes('Unidade ja votou')){
        return AlertFail('Unidade já votou', '')
    }
    if(error.includes('Votante invalido')){
        return AlertFail('Votante inválido', '')
    }
    if(error.includes('Endereco invalido')){
        return AlertFail('Endereço invalido', '')
    }
    if(error.includes('resolver or addr is not configured for ENS name')){
        return AlertFail('Endereço inválido', '')
    }

}