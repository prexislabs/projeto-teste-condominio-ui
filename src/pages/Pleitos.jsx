import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../features/common/headerSlice'
import { ethers } from 'ethers';
import { useAccount, useProvider, useSigner } from 'wagmi';
import InfinityHashNFTAbi from '../abi/InfinityHashNFT.json'
import USDPMockAbi from '../abi/USDPMock.json'
import { AlertLoading, AlertQuestion, AlertSuccess } from '../functions/Sweetalerts';
import { catchContractError, increaseAllowance } from '../functions/generalFunctions';

function Mocktoken(){  

    const provider = useProvider()
    const { data: signer, isError, isLoading } = useSigner()    


    async function mintToMe(e){
        e.preventDefault();
        const contract = new ethers.Contract(process.env.REACT_APP_STABLECOIN_TOKEN_ADDR, USDPMockAbi, signer)
        let res = await contract.mintToMe(ethers.utils.parseUnits(e.target.amount.value, 6))
        AlertLoading('Minting, please wait...')
        let resWait = await res.wait()
        if(resWait.status == 1){
            AlertSuccess(`${e.target.amount.value} tokens transfered to your wallet`)
        }
    }

    async function addTokenToWallet(){
        try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            const wasAdded = await window.ethereum.request({
              method: 'wallet_watchAsset',
              params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                  address: process.env.REACT_APP_STABLECOIN_TOKEN_ADDR, // The address that the token is at.
                  symbol: 'USDP', // A ticker symbol or shorthand, up to 5 chars.
                  decimals: 6, // The number of decimals in the token
                  image: 'https://www.coinlore.com/img/pax-dollar.png', // A string url of the token logo
                },
              },
            });
          
            if (wasAdded) {
              AlertSuccess('Token was added', "");
            }
          } catch (error) {
            console.log(error);
          }
    }

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Mock Token"}))
      }, [])
      
    return(
        
      <div className='pt-2 pl-8'>     
      <div>
        <label className="label">Add token to you wallet</label>
        <button className="btn btn-sm w-44" onClick={() => addTokenToWallet()}>ADD NOW</button> 
      </div>

      <div className="divider w-full max-w-xs"></div> 
      {/* Mint to me */}
      <p className='text-xl'>Mint to me</p>
      <form className="form-control " onSubmit={(e) => mintToMe(e)}>
          <label className="label-text">
              <span className="">Amount</span>
          </label>
          <label className="flex flex-col w-full max-w-xs">
              <input type="text" required name='amount' placeholder="" className="input input-bordered input-sm w-full max-w-xs my-2"/>
              <button className='btn btn-sm my-2'>GO</button>
          </label>
      </form>
      
</div>
        

    )
}

export default Mocktoken