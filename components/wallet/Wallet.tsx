"use client";

import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi";
import { injected } from "wagmi/connectors";
import { Button } from "../ui/button";

const Wallet = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  if (isConnected)
    return (
      <div className="flex flex-col justify-center items-center">
        <Button
          className=" px-4 py-2 bg-primary text-white rounded"
          onClick={() => disconnect()}
        >
          Disconnect {address?.slice(0, 6)}...{address?.slice(-4)}
        </Button>
        {chainId && <h3 className="mt-2 text-primary text-3xl">{chainId}</h3>}
      </div>
    );

  return (
    <div>
      <Button
        className="px-4 hover:cursor-pointer hover:text-primary hover:bg-gray-900 border-2 border-gray-900 hover:border-primary  py-2 bg-primary text-white rounded"
        onClick={() => connect({ connector: injected() })}
      >
        Connect Wallet
      </Button>
    </div>
  );
};

export default Wallet;
