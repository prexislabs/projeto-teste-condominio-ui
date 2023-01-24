import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../features/common/headerSlice'
import { catchContractError } from '../functions/generalFunctions'
import { AlertFail, AlertLoading, AlertSuccess } from '../functions/Sweetalerts'
import InfinityHashNFTAbi from '../abi/InfinityHashNFT.json'
import USDPMockAbi from '../abi/USDPMock.json'
import {ethers} from 'ethers'
import { useProvider, useSigner } from 'wagmi'

function Operations(){

    const provider = useProvider()
    const { data: signer, isError, isLoading } = useSigner()    
      

    async function mint(e){
        e.preventDefault();
        const contract = new ethers.Contract(process.env.REACT_APP_INFINITY_HASH_NFT, InfinityHashNFTAbi, signer)
        const stableToken = new ethers.Contract(process.env.REACT_APP_STABLECOIN_TOKEN_ADDR, USDPMockAbi, signer);
        let decimals = await stableToken.decimals();
        try{
            let res = await contract.mint(ethers.utils.parseUnits(e.target.price.value, decimals));
            AlertLoading()
            let resWait = await res.wait()
            if(resWait.status == 1){
                AlertSuccess("Minted successfully", "")
            }
        }catch(e){
            if(e.error.message.includes("not the owner")){
                return AlertFail("Caller is not the owner", "")
            }
            if(e.error?.data?.originalError?.data){
                let error = contract.interface.parseError(e.error.data.originalError.data)
                return catchContractError(error.name)
            }
            console.log(e.error)
        }
    }

    async function removeLastBatch(e){
        e.preventDefault();
        const contract = new ethers.Contract(process.env.REACT_APP_INFINITY_HASH_NFT, InfinityHashNFTAbi, signer)
        try{
            let res = await contract.removeLastBatch();
            AlertLoading()
            let resWait = await res.wait()
            if(resWait.status == 1){
                AlertSuccess("Last batch removed", "")
            }
        }catch(e){
            if(e.error?.data?.originalError?.data){
                try{

                    let errorCode = e.error.data.originalError.data
                    console.log('errorCode', errorCode)
                    // let error = contract.interface.parseError(e.error.data.originalError.data)
                    // console.log(error)
                    return
                    // return catchContractError(error.name)
                }catch(e){
                    AlertFail("Internal error", "")
                }
            }else{
                console.log(e)
            }
        }
    }

    async function transferERC20(e){
        e.preventDefault();
        const contract = new ethers.Contract(process.env.REACT_APP_INFINITY_HASH_NFT, InfinityHashNFTAbi, signer)
        const stableCoin = new ethers.Contract(process.env.REACT_APP_STABLECOIN_TOKEN_ADDR, USDPMockAbi, signer)
        try{
            let balanceOfNft = await stableCoin.balanceOf(process.env.REACT_APP_INFINITY_HASH_NFT)
            let res = await contract.erc20Transfer(e.target.token.value,e.target.to.value, balanceOfNft)
            AlertLoading()
            let resWait = await res.wait()
            if(resWait.status == 1){
                AlertSuccess("Tokens transfered")
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


        <div className="flex flex-col w-full">
            
            <p className='text-xl'>Mint</p>
        {/* mint */}
            <form className="form-control " onSubmit={(e) => mint(e)}>
                <label className="label-text">
                    <span className="">Price</span>
                </label>
                <label className="flex flex-col w-full max-w-xs">
                    <input type="text" required name='price' placeholder="" className="input input-bordered input-sm w-full max-w-xs my-2"/>
                    <button className='btn btn-sm my-2'>GO</button>
                </label>
            </form>

        <div className="divider w-full max-w-xs"></div> 
            
            <p className='text-xl'>Remove Last Batch</p>
            {/* removeLastBatch */}
            <form className="form-control" onSubmit={(e) => removeLastBatch(e)}>
                <label className="label-text">
                    <span className=""></span>
                </label>
                <label className="">
                    <button className='btn btn-sm hover:bg-red-500'>Remove</button>
                </label>
            </form>

        <div className="divider w-full max-w-xs"></div> 

        <p className='text-xl'>Transfer ERC20</p>

            <form className="form-control" onSubmit={(e) => transferERC20(e)}>
                <label className="label-text">
                    <span className="">Token</span>
                </label>
                <label className="flex flex-col w-full max-w-xs">
                    <input type="text" required name='token' placeholder="" className="input input-bordered input-sm w-full max-w-xs my-2"/>
                    <span className="label-text">To</span>
                    <input type="text" required name='to' placeholder="" className="input input-bordered input-sm w-full max-w-xs my-2"/>
                    <button className='btn btn-sm my-2'>GO</button>
                </label>
            </form>
        </div>

    </div>
    )
}

export default Operations