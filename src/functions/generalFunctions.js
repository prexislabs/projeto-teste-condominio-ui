import { ethers } from "ethers";
import USDPMockAbi from '../abi/USDPMock.json'
import { AlertFail, AlertLoading, AlertSuccess } from "./Sweetalerts";


export function catchContractError(error){
    switch (error) {
        case 'BatchSold':
            return AlertFail("Batch Already Sold", "")
        case 'ZeroPrice':
            return AlertFail("Zero Price", "")
        case 'BatchNotExists':
            return AlertFail("Batch Not Exist", "")
        case 'NoBatches':
            return AlertFail("No Batches Available")
        case 'TokenAlreadySet':
            return AlertFail("Token Already Setted")
        case 'TooSoon':
            return AlertFail("Too Soon to redeem")
        case 'ZeroAddress':
            return AlertFail("Invalid Address")
        case 'ZeroAmount':
            return AlertFail("Insert valid amount")
        case 'ZeroSupply':
            return AlertFail("Zero Supply")
        default:
            return AlertFail("Internal Error")
    }
}

export async function increaseAllowance(amount, address, signer){
    const contract = new ethers.Contract(process.env.REACT_APP_STABLECOIN_TOKEN_ADDR, USDPMockAbi,signer)
    let res = await contract.approve(address, ethers.utils.parseUnits(amount, 6));
    AlertLoading("Approving, please wait...")
    let resWait = await res.wait()
    if(resWait.status == 1){
        return AlertSuccess("Approved", "")
    }
}