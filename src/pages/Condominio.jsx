import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../features/common/headerSlice";
import { ethers } from "ethers";
import { useAccount, useProvider, useSigner } from "wagmi";

function User() {
  // Hooks
  const provider = useProvider();
  const { address, status } = useAccount();
  const { data: signer, isError, isLoading } = useSigner();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title : "Condominio"}))
  }, [])

  // Functions


  return (
    <div className="pt-2 pl-8">
      
    </div>
  );
}

export default User;
