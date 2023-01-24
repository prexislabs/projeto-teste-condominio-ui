import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../features/common/headerSlice'

function Default(){

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Default Page"}))
      }, [])
      
    return(
        <div>Default Page</div>
    )
}

export default Default