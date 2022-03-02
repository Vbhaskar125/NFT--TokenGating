
import React from 'react';
import './components/style.css'
import { useState,useEffect } from 'react';
import ConnectButton from './components/ConnectButton';
import Network from './components/Network';
import Web3 from 'web3/dist/web3.min';
import playGround from './components/TokenGating.json'


const web3 = new Web3(window.ethereum);




  function App() {
  const [connectionStatus, setconnectionStatus] = useState("Not Connected");
  const [walletAddress, setWalletAddress] = useState(0);
  const[isConnected, setIsConnected] = useState(false)
   const [nftMetadata,setNftMetadata] = useState([]); // 
  // const [contractSelected,setContractSelected] = useState(); //contract address
  var nftArray;
  const tokengatingcontracr="0x6A9C6de35B94c60560F7B646B1b32804a0e9bCdb"; // change the contract address to your deployed address
 


  let myEtherscanApiKey = "";
  let abi_= playGround.abi;

  useEffect(()=>{ 
    if(isConnected){
// further imporovement

  }},[nftMetadata]);


const displayOnConnection ={
    display: isConnected? "flex" : "none",
  }


const getNftUrlArray = (async(tokencount, contract)=>{
  let nftArr = [];

  for(let i =0; i<tokencount ; i++){
    let tokenid_ = await contract.methods.tokenOfOwnerByIndex(walletAddress,i).call()
    let nftUrl_ = await contract.methods.tokenURI(tokenid_).call()
    console.log(nftUrl_)
    nftArr.push(nftUrl_);
    
  }
  return nftArr;

});

const getEANftURLArray = (async(EAArray, contract)=>{
  let str=[];
  for(let EAnft of EAArray){
    str.push(await contract.methods.tokenURI(EAnft).call());
  }
  return str;
});



//0xEa477DDD9cd1FE53665E0d3Ef9E79ca0659F5c5A
const submitreqhandler =(async()=>{
 // const contractAdd= document.getElementById('contractAddress').value;
  //console.log(contractAdd);
  const contract = new web3.eth.Contract(abi_, tokengatingcontracr); // change the contract address to your deployed address
  const addressArr = await window.ethereum.request({method: "eth_requestAccounts",});
  contract.defaultAccount = addressArr[0];
  let myAcc = addressArr[0];
//   const totalNumberOfTokens= await contract.methods.getTokenCount().call();
//   console.log(totalNumberOfTokens)
const ownedTokensCount = await contract.methods.balanceOf(myAcc).call();
console.log("total number of nfts owned by "+myAcc+" is "+ ownedTokensCount)
  
nftArray= await getNftUrlArray(ownedTokensCount, contract);
let metaObj = await getMetadata(nftArray);
console.log(metaObj)
  setNftMetadata(metaObj);  

});

const getMetadata = (async(nftarr)=>{
  let str=[];
  for(let link_ of nftarr){
    // console.log(link_ +"  metadata func");
    try{
     let jsna_ = await fetch(link_.toString()); //,{mode:'cors'}
    let jsn_= await jsna_.json();
    console.log("json data : "+ jsn_);
   str.push(jsn_);
    }catch(e){

    }
  }
  console.log(str)

 return str;

})



  const connectWallet =(async()=>{
    if(window.ethereum){
      try{
        const addressArr = await window.ethereum.request({method: "eth_requestAccounts",});
        if(addressArr.length>0){
          setWalletAddress(addressArr[0])
          setconnectionStatus("connected : "+ addressArr[0] )
          setIsConnected(true)
        }else{
          setWalletAddress(0)
          setconnectionStatus("try connecting manually");
        }
      }catch(err){
        setconnectionStatus(err.message);
      }

    }else{
      setconnectionStatus("install Metamask/ wallet")
    }
  });

  const getEAreqhandler = (async()=>{
    const contract = new web3.eth.Contract(abi_, tokengatingcontracr); // change the contract address to your deployed address
  const addressArr = await window.ethereum.request({method: "eth_requestAccounts",});
  contract.defaultAccount = addressArr[0];
  let myAcc = addressArr[0];
    console.log("inside EA handler");
    let ownedColl = await contract.methods.getOwnedCollection(myAcc).call();
    let allPromos = await contract.methods.getAllPromos().call();
    let promocount = allPromos.length;
    let allEAPromos =new Set();
    
    for(let promos of allPromos){
      let EligColl = promos.eligibleCollections; //string[] of eligible collec
      for(let collecs of ownedColl){ //string[] of collection names
          //search if any item of ownedcoll is in eligcoll
          for(let coll of EligColl){
              if(coll == collecs) allEAPromos.add(promos)
              
          }
          
      }
  }

  console.log("EA collections eligible for the visitor are  :"+ allEAPromos.size);
   
  let EAtokenArr =[];
  for(let obj of allEAPromos){
      let EAcolls= obj.earlyAccessCollections;
      
      for(let colname of EAcolls){
          let tokenarr= await contract.methods.getCollection(colname).call();
          for(let tokId of tokenarr){
          EAtokenArr.push(tokId); 
          }           
      }
      console.log(EAtokenArr);
   
    }
    
    let NftUrlArray  = await getEANftURLArray(EAtokenArr, contract);
    console.log(NftUrlArray);
    let metaObj = await getMetadata(NftUrlArray);
    console.log(metaObj.size);
    setNftMetadata(metaObj);



  })


    return (
      <div style={{backgroundImage: `url("https://mdbootstrap.com/img/new/fluid/city/018.jpg")`}}>
        <div style={displayOnConnection} className='inputBox'>
        
            <div className='network'>
              <Network submitreqhandler={submitreqhandler} getEAreqhandler={getEAreqhandler}/>
            </div>   
          
            
        </div>
       
        
       

        <div style={{display:"flex", justifyContent:"space-around"}}>
        {nftMetadata.map((element,index)=>{
          return (<div style={{border:"1px solid white",display:"flex", flexDirection:"column", width:"14rem", color:"white"} } key={index}>
            <div>{element.name}</div>
            <div style={{display:"flex", justifyContent:"center"}} >
              <img src={element.image} style={{height:"8rem", width:"8rem", }}></img>
            </div>
            <div style={{color:"white"}}>{element.description}</div>
          </div>)
        })}

        </div>
  
      
  

      <div style={{backgroundColor:"red", display:"inline"}}>
          <ConnectButton callback={connectWallet} iswalletconnected={isConnected}/>
        </div>
        <div  style={displayOnConnection} style={{display:"flex",float:"right", position:"absolute",right:"0",bottom:"0"}}>
          <p style={{backgroundColor:"peachpuff"}}>{connectionStatus}</p>
        </div>

        </div>
    );
}

export default App;
