import { useWeb3Contract } from 'react-moralis'
import {abi, contractAddresses} from '../constants'
import { useMoralis } from 'react-moralis'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useNotification } from 'web3uikit'

const RaffleEntrance = () => {
    const {chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const dispatch = useNotification();

    const [entranceFee, setEntranceFee] = useState("0");
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const { runContractFunction: enterRaffle, isLoading, isFetching } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee
    });

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    });
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    });
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    });

    async function updateUI() {
		setEntranceFee((await getEntranceFee()).toString());
		setNumPlayers((await getNumberOfPlayers()).toString());
		setRecentWinner((await getRecentWinner()).toString());
	}

    useEffect(() => {
      if(isWeb3Enabled) {
        updateUI();
      }
    }, [isWeb3Enabled]);

    const handleSuccess = async function (tx) {
      await tx.wait(1);
      handleNewNotification(tx);
      updateUI();
    };

    const handleNewNotification = function () {
      dispatch({
        type: "info",
        message: "Transaction Complete!",
        title: "Transaction Notification",
        position: "topR",
        icon: "bell"
      });
    };

  return (
    <div className='p-5'>
      <h1>Raffle Entrance!</h1>
      {raffleAddress ?
      <>
        <button className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-auto" onClick={async function () { await enterRaffle({
          onSuccess: handleSuccess,
          onError: (error) => console.log(error),
        }) }}
        disabled={isLoading || isFetching}
        >
          {isLoading || isFetching ? <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div> 
          : 
          <div>ENTER RAFFLE</div>
          }
        </button>
        <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
        <div>Number of Players: {numPlayers}</div>
        <div>Recent Winner: {recentWinner}</div>
        <br />
      </>
      :
      <h4>No Raffle Address Found</h4> 
      }
    </div>
  )
}

export default RaffleEntrance