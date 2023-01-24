import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../features/common/headerSlice'

function Admin(){

    const [currentPage, setCurrentPage] = useState('operations')
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Admin"}))
      }, [])
      
    return(
        <div>
            <div className='flex p-2 bg-zinc-50 rounded-lg justify-center'>


            <div className="navbar bg-base-100">
                <div className="">
                    <a className="btn btn-ghost normal-case text-md" onClick={() => setCurrentPage('operations')}>Operations</a>
                </div>
                <div className="">
                    <a className="btn btn-ghost normal-case text-md" onClick={() => setCurrentPage('config')}>Config</a>
                </div>
            </div>


                {/* <button className={`mx-2 hover:border-b-4 duration-100 p-2 rounded-lg text-xl ${ currentPage == 'operations' ? 'border-b-4 border-blue-500' : ''}`} onClick={() => setCurrentPage('operations')}>Operations</button>
                <button className={`mx-2 hover:border-b-4 duration-100 p-2 rounded-lg text-xl ${ currentPage == 'config' ? 'border-b-4 border-blue-500' : ''}`} onClick={() => setCurrentPage('config')}>Config</button> */}
            </div>
        </div>
    )
}

export default Admin