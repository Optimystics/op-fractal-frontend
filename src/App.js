import logo from "./logo.svg";
import "./App.css";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { UALProvider, withUAL } from "ual-reactjs-renderer";
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// TODO: remove if you use react hooks?
import copy from "copy-to-clipboard";
import { useSearchParamsState } from 'react-use-search-params-state'
import * as objectSha from 'object-sha'
import { CSSTransition } from "react-transition-group";
import EndpointSetter from './EndpointSetter'
import Web3 from "web3";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "15px",
  boxShadow: 24,
  p: 4,
};

const inputDefaults = {
  groupnumber: { type: 'number', default: null },
  vote1: { type: 'string', default: "" },
  vote2: { type: 'string', default: "" },
  vote3: { type: 'string', default: "" },
  vote4: { type: 'string', default: "" },
  vote5: { type: 'string', default: "" },
  vote6: { type: 'string', default: "" },
}

function App() {
  let endpoint;

  const [landing, setLanding] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const [inputs, setInputs] = useSearchParamsState(inputDefaults); 
  const [accountname, setAccountName] = useState("");
  const [consensusId, setConsensusId] = useState("");
  const [open, setOpen] = React.useState(false);
  const [openendpoints, setOpenendpoints] = React.useState(false);

  const handleClose = () => setOpen(false);
  const handleCloseendpoints = () => setOpenendpoints(false);

  const nodeRef = useRef(null);



  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  const loadBlockchainData = async () => {
    const abi = [{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"address","name":"issuer_","type":"address"},{"internalType":"address","name":"executor_","type":"address"},{"internalType":"uint64","name":"ranksDelay_","type":"uint64"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"OpNotSupported","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"submitter","type":"address"},{"components":[{"internalType":"uint8","name":"groupNum","type":"uint8"},{"internalType":"address[6]","name":"ranks","type":"address[6]"}],"indexed":false,"internalType":"struct FractalInputsLogger.GroupResults","name":"results","type":"tuple"}],"name":"ConsensusSubmission","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"submitter","type":"address"},{"components":[{"internalType":"uint8","name":"groupNum","type":"uint8"},{"internalType":"address[6]","name":"ranks","type":"address[6]"},{"internalType":"address","name":"delegate","type":"address"}],"indexed":false,"internalType":"struct FractalInputsLogger.GroupResultsEF","name":"results","type":"tuple"}],"name":"ConsensusSubmissionEF","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Locked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Unlocked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"}],"name":"__Respect_init","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"TokenId","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"uint64","name":"periodCount","type":"uint64"}],"name":"earningsPerLastPeriods","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"executor","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"address","name":"issuer_","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"executor_","type":"address"},{"internalType":"uint64","name":"ranksDelay_","type":"uint64"}],"name":"initializeV2","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"address","name":"issuer_","type":"address"},{"internalType":"address","name":"executor_","type":"address"},{"internalType":"uint64","name":"ranksDelay_","type":"uint64"}],"name":"initializeV2Whole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"lastRanksTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"locked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint64","name":"value","type":"uint64"},{"internalType":"uint8","name":"mintType","type":"uint8"},{"internalType":"uint64","name":"periodNumber","type":"uint64"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[{"components":[{"internalType":"uint64","name":"periodNumber","type":"uint64"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint8","name":"mintType","type":"uint8"}],"internalType":"struct PeriodicRespect.TokenIdData","name":"value","type":"tuple"}],"name":"packTokenId","outputs":[{"internalType":"TokenId","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"periodNumber","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxiableUUID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ranksDelay","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"bool","name":"","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"baseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newExecutor","type":"address"}],"name":"setExecutor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint64","name":"ranksDelay_","type":"uint64"}],"name":"setRanksDelay","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint8","name":"groupNum","type":"uint8"},{"internalType":"address[6]","name":"ranks","type":"address[6]"}],"internalType":"struct FractalInputsLogger.GroupResults","name":"results","type":"tuple"}],"name":"submitCons","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint8","name":"groupNum","type":"uint8"},{"internalType":"address[6]","name":"ranks","type":"address[6]"},{"internalType":"address","name":"delegate","type":"address"}],"internalType":"struct FractalInputsLogger.GroupResultsEF","name":"results","type":"tuple"}],"name":"submitConsEF","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint8","name":"groupNum","type":"uint8"},{"internalType":"address[6]","name":"ranks","type":"address[6]"}],"internalType":"struct FractalRespect.GroupRanks[]","name":"allRanks","type":"tuple[]"}],"name":"submitRanks","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenExists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"tokenSupplyOfOwner","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"TokenId","name":"packed","type":"uint256"}],"name":"unpackTokenId","outputs":[{"components":[{"internalType":"uint64","name":"periodNumber","type":"uint64"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint8","name":"mintType","type":"uint8"}],"internalType":"struct PeriodicRespect.TokenIdData","name":"","type":"tuple"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"valueOfToken","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"view","type":"function"}]
    const contractAddress ="0x53C9E3a44B08E7ECF3E8882996A500eb06c0C5CC";
      try {
          // Check if MetaMask is installed
          if (window.ethereum) {
              const web3Instance = new Web3(window.ethereum);
              // Request account access
              const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
              setWeb3(web3Instance);
              setAccount(accounts[0]);

              // Parsing ABI and set Contract
              const contractInstance = new web3Instance.eth.Contract(abi, contractAddress);
              setContract(contractInstance);
          } else {
            swal_error("Please install metamask!");
          }
      } catch (error) {
          console.error("Web3 creation error", error);
          swal_error("Failed to load web3.");
        }
  };
  
  useEffect(() => {
    loadBlockchainData();
}, []);

const logout = () => {
  // Reset web3 and account state
  setWeb3(null);
  setAccount("");
  setContract(null);
};




const submitCons = async () => {
  console.log(inputs)
  console.log("vote1", inputs["vote1"])
  const data = {
    groupNum: inputs["groupnumber"],
    ranks: [
      inputs["vote1"] !=='' ? inputs["vote1"] : "0x0000000000000000000000000000000000000000",
      inputs["vote2"] !=='' ? inputs["vote2"] : "0x0000000000000000000000000000000000000000",
      inputs["vote3"] !=='' ? inputs["vote3"] : "0x0000000000000000000000000000000000000000",
      inputs["vote4"] !=='' ? inputs["vote4"] : "0x0000000000000000000000000000000000000000",
      inputs["vote5"] !=='' ? inputs["vote5"] : "0x0000000000000000000000000000000000000000",
      inputs["vote6"] !=='' ? inputs["vote6"] : "0x0000000000000000000000000000000000000000",
    ]}
  
  console.log(data)

  if (!contract || !account) {
    swal_error("Blockchain not ready.");

    return;
  }

  try {
    // Add console logs to track the execution of the transaction
    console.log("Submitting transaction...");
    const transactionParameters = {
      to: "0x53C9E3a44B08E7ECF3E8882996A500eb06c0C5CC", // Required except during contract publications.
      from: account, // must match user's active address.
      data: contract.methods.submitCons(data).encodeABI(),
    };
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });

    swal_success("Transaction submitted!");

  } catch (error) {
    console.error("An error occurred while submitting the transaction:", error);
    swal_error("Transaction failed.");
  }
};

  const handleOpen = async () => {
    const hashable = objectSha.hashable(inputs);
    const inputsHash = await objectSha.digest(hashable, 'SHA-256');
    setConsensusId(inputsHash.substring(0, 2) + " " + inputsHash.substring(2, 4) +
      " " + inputsHash.substring(4, 6) + " " + inputsHash.substring(6, 8));
    setOpen(true);
  }
  const handleOpenendpoints = () => {
    setOpenendpoints(true);
  }
  /*
  const sign = async () => {
    if (activeUser) {
      try {
        const transaction = {
          actions: [
            {
              account: "pollpollpoll",
              name: "sign",
              authorization: [
                {
                  actor: displayaccountname(), // use account that was logged in
                  permission: "active",
                },
              ],
              data: {
                signer: displayaccountname(),
              },
            },
          ],
        };
        await activeUser.signTransaction(transaction, {
          broadcast: true,
          expireSeconds: 300,
        });
        swal_success(`Successfully submitted!`);
      } catch (e) {
        swal_error(e);
      }
    }
  };
*/

  const shareLink = () => {
    const url = window.location.href;

    if (copy(url, { debug: true })) {
      swal_success("Link copied to clipboard!");
    } else {
      swal_error("Were not able to copy to clipboard.");
    }
  }
  
  const swal_success = (message) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      background: '#190087',
      showConfirmButton: false,
      timer: 8000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: "success",
      title: "<div style='color:white'>" + message + "</div>",
    });
  };

  const swal_error = (message) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      background: '#190087',
      timer: 8000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: "error",
      title: "<div style='color:white'>" + message + "</div>",
    });
  };






  /*
          <TextField
            onChange={(e) => setSubmitter(e.target.value)}
            label="Your name"
            variant="outlined"
            sx={{ width: "100%", "margin-bottom": "10px" }}
          />
          */

  return (
    <div className="App">
      {showButton &&
        <header className="App-header">

          <div class="zeos"><img src="optimism.png"/><br/>FRACTAL</div>
          <img src="symbol.png" width="15%" class="logo" />
          <button class="button-64 votebutton" role="button" onClick={() => setLanding(true)}><span class="text">Continue</span></button>
          <div class="bg-animation">
            <div id="stars"></div>
            <div id="stars2"></div>
            <div id="stars3"></div>
            <div id="stars4"></div>
          </div>
        </header>
      }
      <CSSTransition
        in={landing}
        nodeRef={nodeRef}
        timeout={300}
        classNames="alert"
        unmountOnExit
        onEnter={() => setShowButton(false)}
      >
        <div ref={nodeRef}>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
            {" "}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Please make sure submission represents consensus of a group.
            <br/><br/>
            To help with that, check with other members if they see the same character sequence here: <b>{consensusId}</b>
            <br/><br/>
            If it's the same your submissions are identical (so you're in consensus).
          </Typography>
          <br></br>
          

          <button
                      variant="contained"
                      class="button-64 button-64-varwidth"
                      //onClick={() => sign()}
                      
                      onClick={() => submitCons()}                      
                    >
                      <span>
                      Push it on chain!
                      </span>
                    </button>
        </Box>
      </Modal>

      <div class="main-menu">       
            {/**accountname == "" ? (
              <button onClick={() => loadBlockchainData()} className="menu-trigger">
                <span>Sign in</span>
              </button>
            ) : (
                <button onClick={() => logout()} className="menu-trigger">
                  <span>{account}</span>
                </button>
            )**/}
            {account ?
            <button onClick={() => logout()} className="menu-trigger">{account}</button>
            :
            <button className="menu-trigger" onClick={()=>loadBlockchainData()}>Log in</button>
            }


              
          </div>

      <header className="App-header">
         
         
          <div class="input-wrapper">
          <input
            onChange={(e) => setInputs({ groupnumber: e.target.value })}
            defaultValue={inputs.groupnumber ?? ""}
            label="Group number"
            placeholder="Group number"
            class="input-field"

          />
          </div>
          <div class="input-wrapper">
          <input
            onChange={(e) => setInputs({ vote1: e.target.value })}
            defaultValue={inputs.vote1 ?? ""}
            label="Level 6"
            placeholder="Level 6"
            class="input-field"
          />
          </div>
          <div class="input-wrapper">
          <input
            onChange={(e) => setInputs({ vote2: e.target.value })}
            defaultValue={inputs.vote2 ?? ""}
            label="Level 5"
            placeholder="Level 5"
            class="input-field"
          />
          </div>
          <div class="input-wrapper">
          <input
            onChange={(e) => setInputs({ vote3: e.target.value })}
            defaultValue={inputs.vote3 ?? ""}
            label="Level 4"
            placeholder="Level 4"
            class="input-field"
          />
          </div>
          <div class="input-wrapper">
          <input
            onChange={(e) => setInputs({ vote4: e.target.value })}
            defaultValue={inputs.vote4 ?? ""}
            label="Level 3"
            placeholder="Level 3"
            class="input-field"
          />
          </div>
          <div class="input-wrapper">
          <input
            onChange={(e) => setInputs({ vote5: e.target.value })}
            defaultValue={inputs.vote5 ?? ""}
            label="Level 2"
            placeholder="Level 2"
            class="input-field"
          />
          </div>
          <div class="input-wrapper">
          <input
            onChange={(e) => setInputs({ vote6: e.target.value })}
            defaultValue={inputs.vote6 ?? ""}
            label="Level 1"
            placeholder="Level 1"
            class="input-field"
          />
          </div>
          <button
            class="button-64"
            onClick={handleOpen}
          >
            <span class="text">
            Submit
            </span>
          </button>
          <button
            class="button-64"
            onClick={() => shareLink()}
          >
            <span class="text">
            Share
            </span>
          </button>
      </header>
      </div>
      </CSSTransition>
    </div>
    
  );
}

export default App;
