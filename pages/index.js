import Web3Modal from "web3modal";
import {useRef,useEffect,useState} from "react";
import {ethers,providers} from "ethers";
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home(){
  //state variable for wallet 
  const [walletConnected,setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const [ens, setENS] = useState("");
  // Save the address of the currently connected contract
  const [address, setAddress] = useState("");

  const setENSOrAddress = async (address, web3Provider) => {
    // Lookup the ENS related to the given address
    var _ens = await web3Provider.lookupAddress(address);
    // If the address has an ENS set the ENS or else just set the address
    if (_ens) {
      setENS(_ens);
    } else {
      setAddress(address);
    }
  };

  const connectWallet = async()=>{
    try{
      await getProviderOrSigner();
      setWalletConnected(true);
    }
    catch(err){
      console.log(err);
    }
  }

  const renderButton = () => {
    if (walletConnected) {
      <div>Wallet connected</div>;
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  const getProviderOrSigner = async()=>{
    const provider = await web3ModalRef.current.connect();
    const web3Provider =  new providers.Web3Provider(provider);
    const {chainId} = await web3Provider.getNetwork();
    if(chainId!==4){
      alert("please connect to rinkeby network");
      return;
    }
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    await setENSOrAddress(address, web3Provider);
    return signer;
  }

  useEffect(()=>{
    try{
       if(!walletConnected){
          web3ModalRef.current =  new Web3Modal({
           network:"rinkeby",
           providerOptions:{},
           disableInjectedProvider:false
         });
         connectWallet();
       }
    }
    catch(err){
      console.log(err);
    }
  },[walletConnected])


  
  return(
    <div>
     <Head>
      <title>ENS Name Reader</title>
      <meta name="description" content="ENS Dapp"/>
      <link rel="icon" href="/favicon.ico" />
     </Head>
     <div className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to LearnWeb3 Punks {ens ? ens : address}!
          </h1>
          <div className={styles.description}>
            Its an NFT collection for LearnWeb3 Punks.
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./learnweb3punks.png" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by LearnWeb3 Punks
      </footer>
    </div>
  )
}