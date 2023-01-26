import routes from '../routes/sidebar'
import { NavLink,  Routes, Link , useLocation} from 'react-router-dom'
import { ethers } from 'ethers';
import SidebarSubmenu from './SidebarSubmenu';
import condominioAbi from '../abi/condominio.json';
import { useProvider, useAccount } from 'wagmi'
import {useState, useEffect} from 'react'


function LeftSidebar(){
    const location = useLocation();
    const provider = useProvider();
    const { status } = useAccount()

    const [sindico, setSindico] = useState();
    const [condominio, setCondominio] = useState();
    const [pleitos, setpleitos] = useState();

    function reduceAddress(address){
        if(!address) return
        let firstPart = address.substr(0, 6)
        let secondPart = address.substr(37,42)
        return firstPart + '...' + secondPart
    }

    async function getAllAddressess(){
        let contract = new ethers.Contract(process.env.REACT_APP_CONDOMINIO_ADDRESS, condominioAbi, provider);
        let res = await contract.sindico();      
        setSindico((res))
        setCondominio((process.env.REACT_APP_CONDOMINIO_ADDRESS))
        setpleitos((process.env.REACT_APP_PLEITOS_ADDRESS))
    }

    useEffect(() => {
        getAllAddressess()
    },[])

    return(
        <div className="drawer-side ">
            <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label> 
            <ul className="menu  pt-2 w-80 bg-base-100 text-base-content">
                <li className="mb-2 font-semibold text-xl">
                    
                    <div>
                        <div className='flex items-center'>
                            <img className="mask w-10" src="/prexisLogo.png" alt="Prexis Logo"/> 
                            <p className='ml-3 font-light'>
                                Prëxis Labs
                            </p>
                        </div>
                    </div> 
                    </li>
                {
                    routes.map((route, k) => {
                        return(
                            <li className="" key={k}>
                                {
                                    route.submenu ? 
                                        <SidebarSubmenu {...route}/> : 
                                    (<NavLink
                                        end
                                        to={route.path}
                                        className={({isActive}) => `${isActive ? 'font-semibold  bg-base-200 ' : 'font-normal'}`} >
                                           {route.icon} {route.name}
                                            {
                                                location.pathname === route.path ? (<span className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary "
                                                aria-hidden="true"></span>) : null
                                            }
                                    </NavLink>)
                                }
                                
                            </li>
                        )
                    })
                }

                

            </ul>
                <div className="flex flex-col justify-end"> 
                    <a target="_blank" href={`https://goerli.etherscan.io/address/${sindico}`} className="pl-10 py-3 my-2 hover:bg-gray-300 duration-150 max-w-xs">
                        Síndico: {reduceAddress(sindico)}
                    </a>
                    <a target="_blank" href={`https://goerli.etherscan.io/address/${condominio}`} className="pl-10 py-3 my-2 hover:bg-gray-300 duration-150 max-w-xs">
                        Condomínio: {reduceAddress(condominio)}
                    </a>
                    <a target="_blank" href={`https://goerli.etherscan.io/address/${pleitos}`} className="pl-10 py-3 my-2 hover:bg-gray-300 duration-150 max-w-xs">
                        Pleitos: {reduceAddress(pleitos)}
                    </a>
                </div>
        </div>
    )
}

export default LeftSidebar