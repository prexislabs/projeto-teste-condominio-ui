import { themeChange } from 'theme-change'
import React, {  useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Bars3Icon  from '@heroicons/react/24/outline/Bars3Icon'
import MoonIcon from '@heroicons/react/24/outline/MoonIcon'
import SunIcon from '@heroicons/react/24/outline/SunIcon'
import { openRightDrawer } from '../features/common/rightDrawerSlice';
import { RIGHT_DRAWER_TYPES } from '../utils/globalConstantUtil'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers'

import { useAccount, useProvider } from 'wagmi'
import { AlertSuccess } from '../functions/Sweetalerts'
import { setUserBalance } from '../features/common/headerSlice'

function Header(){

    const dispatch = useDispatch()
    const {pageTitle, userBalance} = useSelector(state => state.header)
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme"))

    const provider = useProvider()
    const { address, status } = useAccount() 


    useEffect(() => {
        themeChange(false)
        if(currentTheme === null){
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ) {
                setCurrentTheme("dark")
            }else{
                setCurrentTheme("light")
            }
        }
      }, [])

    useEffect(() => {
        // getTokenBalance()
    }, [address, status])

    const openNotification = () => {
        dispatch(openRightDrawer({header : "Notifications", bodyType : RIGHT_DRAWER_TYPES.NOTIFICATION}))
    }

    async function addTokenToWallet(){
        try {            
            const wasAdded = await window.ethereum.request({
              method: 'wallet_watchAsset',
              params: {
                type: 'ERC20', 
                options: {
                  address: process.env.REACT_APP_INFINITY_HASH, 
                  symbol: 'IFH', 
                  decimals: 6, 
                  image: '', 
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

    

    return(
        <>
            <div className="navbar  flex justify-between bg-base-100  z-10 shadow-md ">

                {/* Menu toogle for mobile view or small screen */}
                <div className="">
                    <label htmlFor="left-sidebar-drawer" className="btn btn-primary drawer-button lg:hidden">
                    <Bars3Icon className="h-5 inline-block w-5"/></label>
                    <h1 className="text-2xl font-semibold ml-2">{pageTitle}</h1>
                </div>

                

                <div className="order-last">


                {/* Light and dark theme selection toogle **/}
                <label className="swap swap-rotate">
                    <input type="checkbox"/>
                    <SunIcon data-set-theme="light" data-act-classname="activeclass" className={"fill-current w-6 h-6 "+(currentTheme === "dark" ? "swap-on" : "swap-off")}/>
                    <MoonIcon data-set-theme="dark" data-act-classname="activeclass" className={"fill-current w-6 h-6 "+(currentTheme === "light" ? "swap-on" : "swap-off")} />
                </label>


                    {/* Profile icon, opening menu on click */}
                    <div className="ml-4 flex">
                        <ConnectButton showBalance={false}/>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Header