export default function InternalLinks(props){
    return (
        <a target="_blank" href={`https://goerli.etherscan.io/address/${props.address}`} className="pl-3 py-3 my-2 hover:bg-gray-300 duration-150 max-w-xs flex">
        <img src="https://cdn-icons-png.flaticon.com/512/3214/3214674.png" alt="link"  width={30}/>
        <p className="ml-4">
           {props.name}: {props.minimalAddress}
        </p>
        </a>
    )
}