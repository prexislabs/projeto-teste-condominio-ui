import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../features/common/headerSlice'
import { catchContractError } from '../functions/generalFunctions'
import { AlertFail, AlertLoading, AlertSuccess } from '../functions/Sweetalerts'
import InfinityHashNFTAbi from '../abi/InfinityHashNFT.json'
import USDPMockAbi from '../abi/USDPMock.json'
import {ethers} from 'ethers'
import { useProvider, useSigner } from 'wagmi'

function Config(){

    const provider = useProvider()
    const { data: signer, isError, isLoading } = useSigner()    

    async function setTokenContract(e){
        e.preventDefault();
        const addressRegex = new RegExp("^0x[a-fA-F0-9]{40}$")
        if(!addressRegex.test(e.target.contract.value)) return AlertFail("Invalid contract", "")
        try{
            const contract = new ethers.Contract(process.env.REACT_APP_INFINITY_HASH_NFT, InfinityHashNFTAbi, signer);
            let res = await contract.setTokenContract(e.target.contract.value)
            AlertLoading()
            let resWait = await res.wait()
            if(resWait.status == 1){
                AlertSuccess("Token contract setted", "")
            }
        }catch(e){
            if(e.error?.data?.originalError?.data){
                const contract = new ethers.Contract(process.env.REACT_APP_INFINITY_HASH_NFT, InfinityHashNFTAbi, signer);
                let error = contract.interface.parseError(e.error.data.originalError.data)
                return catchContractError(error.name)
            }else{
                console.log(e)
            }
        }
    }

    async function setURI(e){
        e.preventDefault();
        let contract = new ethers.Contract(process.env.REACT_APP_INFINITY_HASH_NFT, InfinityHashNFTAbi, signer);
        try{
            let res = await contract.setURI(e.target.uri.value)        
            AlertLoading()
            let resWait = await res.wait()
            if(resWait.status == 1){
                AlertSuccess("URI setted","")
            }
        }catch(e){
            if(e.error?.data?.originalError?.data){
                let error = contract.interface.parseError(e.error.data.originalError.data)
                return catchContractError(error.name)
            }else{
                console.log(e)
            }
        }
    }

    async function transferOwnership(e){
        e.preventDefault()
        let contract = new ethers.Contract(process.env.REACT_APP_INFINITY_HASH_NFT, InfinityHashNFTAbi, signer);
        try{
            let res = await contract.transferOwnership(e.target.address.value)        
            AlertLoading()
            let resWait = await res.wait()
            if(resWait.status == 1){
                AlertSuccess("Ownership transfered","")
            }
        }catch(e){
            if(e.error?.data?.originalError?.data){
                let error = contract.interface.parseError(e.error.data.originalError.data)
                return catchContractError(error.name)
            }else{
                console.log(e)
            }
        }
    }

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Admin"}))
      }, [])
      
    return(
        <div className='pt-2 pl-8'>
            {/* setTokenContract */}
            <p className="text-xl">setTokenContract</p>

            <form className="form-control" onSubmit={(e) => setTokenContract(e)}>
            <label className="label-text">
                <span className="">Contract Address</span>
            </label>
            <label className="flex flex-col w-full max-w-xs">
                <input type="text" required name='contract' placeholder="" className="input input-bordered input-sm w-full max-w-xs my-2"/>
                <button className='btn btn-sm'>GO</button>
            </label>
            </form>

            <div className="divider w-full max-w-xs"></div> 
           
            {/* setURI */}
            

            <p className='text-xl'>setURI</p>
            <form className="form-control" onSubmit={(e) => setURI(e)}>
            <label className="label-text">
                <span className="">URI</span>
            </label>
            <label className="flex flex-col w-full max-w-xs">
                <input type="text" required name='uri' placeholder="" className="input input-bordered input-sm w-full max-w-xs my-2"/>
                <button className='btn btn-sm'>GO</button>
            </label>
            </form>

            <div className="divider w-full max-w-xs"></div> 
            
            <p className="text-xl">transferOwnership</p>
            <form className="form-control" onSubmit={(e) => transferOwnership(e)}>
            <label className="label-text">
                <span className="">Address</span>
            </label>
            <label className="flex flex-col w-full max-w-xs">
                <input type="text" required name='address' placeholder="" className="input input-bordered input-sm w-full max-w-xs my-2"/>
                <button className='btn btn-sm'>GO</button>
            </label>
            </form>

        </div>
    )
}

export default Config