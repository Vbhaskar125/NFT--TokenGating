import React from 'react'

const networkArray=["ropsten","kovan","mumbai"];


function Network({submitreqhandler,getEAreqhandler}) {
  return (
<>
    
  {/* <div>
        <div className="input-group mb-3  input-group-sm network">
            <span className="input-group-text" id="inputGroup-sizing-default">Network</span>
            <input type="text" className="form-control " id='network' aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
        </div>
        <div className="input-group mb-3 input-group-sm contractAddress">
            <span className="input-group-text" id="inputGroup-sizing-default">ContractAddress</span>
            <input type="text" className="form-control " id='contractAddress' aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
        </div>
        <div className="input-group mb-3 input-group-sm abiPaste">
            <span className="input-group-text" id="inputGroup-sizing-default">abi of the contract</span>
            <input type="text" className="form-control " id='abiPaste' aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
        </div>

  </div>*/}
  <div style={{display:"flex", justifyContent:"space-around"}}>
  {/* <div className="input-group mb-3 input-group-sm contractAddress">
            <span className="input-group-text" id="inputGroup-sizing-default">ContractAddress</span>
            <input type="text" className="form-control " id='contractAddress' aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
        </div> */}
 
        <button type='submit' className=' btn btn-light btn-sm' onClick={submitreqhandler}>Fetch NFT</button>
        <button type='submit' className=' btn btn-light btn-sm' onClick={getEAreqhandler}>Fetch EarlyAccess NFT</button>
    </div>


    

</>
  )
}

export default Network