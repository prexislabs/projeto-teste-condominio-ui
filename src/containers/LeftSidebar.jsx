import routes from '../routes/sidebar'
import { NavLink,  Routes, Link , useLocation} from 'react-router-dom'
import { ethers } from 'ethers';
import SidebarSubmenu from './SidebarSubmenu';
import condominioAbi from '../abi/condominio.json';
import { useProvider, useAccount } from 'wagmi'
import {useState, useEffect} from 'react'
import InternalLinks from '../components/InternalLinks'
import { reduceAddress } from '../functions/generalFunctions'
import { useSelector, useDispatch } from 'react-redux'
import { setSindico } from '../features/common/headerSlice'

function LeftSidebar(){
    const location = useLocation();
    const provider = useProvider();
    const { status } = useAccount()
    const dispatch = useDispatch();

    const { sindicoAddress, condominioAddress, pleitosAddress } = useSelector(state => state.header)



    async function getAllAddressess(){
        let contract = new ethers.Contract(process.env.REACT_APP_CONDOMINIO_ADDRESS, condominioAbi, provider);
        let res = await contract.sindico();      
        dispatch(setSindico(res))
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
                    <InternalLinks name="Sindico" address={sindicoAddress} minimalAddress={reduceAddress(sindicoAddress)}/>
                    <InternalLinks name="Condominio" address={process.env.REACT_APP_CONDOMINIO_ADDRESS} minimalAddress={reduceAddress(process.env.REACT_APP_CONDOMINIO_ADDRESS)}/>
                    <InternalLinks name="Pleitos" address={process.env.REACT_APP_PLEITOS_ADDRESS} minimalAddress={reduceAddress(process.env.REACT_APP_PLEITOS_ADDRESS)}/>
                </div>
        </div>
    )
}

export default LeftSidebar