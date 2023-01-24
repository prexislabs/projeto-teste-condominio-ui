import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../features/common/headerSlice'
import { ethers } from 'ethers';
import { useAccount, useProvider, useSigner } from 'wagmi';
import { AlertLoading, AlertQuestion, AlertSuccess } from '../functions/Sweetalerts';


function Mocktoken(){  

    const provider = useProvider()
    const { data: signer, isError, isLoading } = useSigner()    

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Pleitos"}))
      }, [])


    // Functions
    
      
    return(        
      <div className='pt-2 pl-8'>     
          
      </div>
        

    )
}

export default Mocktoken