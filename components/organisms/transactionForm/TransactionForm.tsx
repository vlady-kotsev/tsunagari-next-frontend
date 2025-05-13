"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Network, Token } from "@/services/data.service/interfaces";
import { Label } from "../../atoms/label";
import { Input } from "../../atoms/input";
import { Button } from "../../atoms/button";
import { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { toast } from "sonner";
import { InputContent } from "@/sanity/lib/types";
import { SOLANA_CHAIN_ID } from "@/components/consts";
import { useWallet } from "@solana/wallet-adapter-react";
import { getChains } from "wagmi/actions";
import { providerConfig } from "@/app/providers/evm";

import evmService from "@/services/evm.service/evm.service";
import solanaService from "@/services/solana.service/solana.service";

const TransactionForm = ({
  content,
  networks,
  tokens,
}: {
  content: InputContent;
  networks: Map<number, Network>;
  tokens: Token[];
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destinationChain, setDestinationChain] = useState<number | null>(null);
  const [originChain, setOriginChain] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [deactivateInput, setDeactivateInput] = useState(false);
  const [amount, setAmount] = useState<number | "">("");
  const [receiver, setReceiver] = useState<string | "">("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { isConnected } = useAccount();
  const metamaskChainId = useChainId();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { wallet, connected, publicKey } = useWallet();
  const chains = getChains(providerConfig);

  useEffect(() => {
    if (error) {
      toast(error as string);
      resetState();
    }
  }, [error]);

  const getChainName = (): string => {
    return chains.find((c) => c.id === metamaskChainId)?.name ?? "";
  };

  const handleDestinationChange = (value: string) => {
    setDestinationChain(Number(value));
  };

  const handleOriginChange = (value: string) => {
    setOriginChain(value);
    console.log(value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value ? Number(event.target.value) : "");
  };

  const handleReceiverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReceiver(event.target.value ? event.target.value : "");
  };

  const handleTokenChange = (name: string) => {
    const token = tokens.find((t) => t.name === name);
    setSelectedToken(token || null);
  };

  const resetState = () => {
    setSelectedToken(null);
    setDestinationChain(null);
    setAmount("");
    setDeactivateInput(false);
    setError(null);
    setIsProcessing(false);
    setIsLoading(false);
    setReceiver("");
  };

  /**
   * Handles locking of native tokens for cross-chain transfer.
   * @throws {Error} If the lock operation fails or required parameters are missing
   */
  const handleLock = async (bridgeAddress: string) => {
    if (!selectedToken || destinationChain === null || !amount || !receiver) {
      return;
    }

    try {
      if (Number(originChain) === SOLANA_CHAIN_ID) {
        if (!window.solana) {
          throw new Error("Solana wallet no found");
        }
        await solanaService.handleLock(
          selectedToken,
          receiver,
          amount,
          destinationChain,
          window.solana
        );
      } else {
        if (!window.ethereum) {
          throw new Error("EVM wallet no found");
        }
        await evmService.handleLock(
          bridgeAddress,
          selectedToken,
          destinationChain,
          receiver,
          amount,
          window.ethereum
        );
      }
    } catch {
      throw new Error("Failed to lock tokens");
    }
  };

  const handleBurn = async (bridgeAddress: string) => {
    if (!selectedToken || destinationChain === null || !amount || !receiver) {
      return;
    }
    try {
      if (Number(originChain) === SOLANA_CHAIN_ID) {
        if (!window.solana) {
          throw new Error("Solana wallet no found");
        }
      
        await solanaService.handleBurn(
          selectedToken,
          receiver,
          amount,
          destinationChain,
          window.solana
        );
      } else {
        if (!window.ethereum) {
          throw new Error("EVM wallet no found");
        }
        await evmService.handleBurn(
          bridgeAddress,
          selectedToken,
          destinationChain,
          amount,
          receiver,
          window.ethereum
        );
      }
    } catch {
      throw new Error("Failed to burn tokens");
    }
  };

  /**
   * Initiates the transfer process, including approval and either lock or burn operations.
   * Handles error states and success notifications.
   */
  const handleTransfer = async () => {
    if (!selectedToken || destinationChain === null || !amount) {
      return;
    }

    try {
      setIsProcessing(true);
      setDeactivateInput(true);
      setError(null);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts available");
      }
      const bridgeAddress = networks.get(Number(originChain))?.bridgeAddress;
      if (!bridgeAddress) {
        throw new Error("Bridge address not found");
      }

      if (Number(originChain) !== SOLANA_CHAIN_ID) {
        if (!window.ethereum) {
          throw new Error("EVM wallet no found");
        }
        const minBridgeableAmount = await evmService.getMinBridgeableAmount(
          bridgeAddress,
          window.ethereum
        );

        if (!minBridgeableAmount) {
          throw new Error("Failed to get minimum bridgeable amount");
        }
        if (amount < minBridgeableAmount) {
          throw new Error("Amount is less than the minimum bridgeable amount");
        }
        await evmService.handleApprove(
          bridgeAddress,
          selectedToken,
          amount,
          window.ethereum
        );
      }

      if (selectedToken.isNative) {
        await handleLock(bridgeAddress);
      } else {
        await handleBurn(bridgeAddress);
      }

      if (!error) {
        toast("Transfer successful!");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.length > 50) {
        setError(`${err.message.slice(0, 50)}...`);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setIsProcessing(false);
      setDeactivateInput(false);
    }
  };

  /**
   * Checks if the transfer button should be enabled based on current state.
   * @returns {boolean} True if transfer is enabled, false otherwise
   */
  const isTransferEnabled = () => {
    return (
      originChain !== "" &&
      !isLoading &&
      selectedToken !== null &&
      destinationChain !== null &&
      amount !== "" &&
      amount !== 0 &&
      !isProcessing &&
      window.ethereum !== undefined
    );
  };

  return (
    <form className="w-full">
      <div className="flex flex-col md:flex-row gap-4 md:gap-4 lg:gap-5 justify-center items-stretch md:items-end mb-10 w-full">
        <div className="w-full md:w-auto flex flex-col items-center">
          <Label
            id="destination"
            className="text-primary flex justify-center text-lg mb-1 self-center md:self-auto"
          >
            Origin chain
          </Label>
          <Select
            name="origin"
            value={originChain?.toString() ?? ""}
            onValueChange={handleOriginChange}
            disabled={deactivateInput}
          >
            <SelectTrigger className="w-full max-w-xs md:max-w-none md:w-[170px] lg:w-[180px]">
              <SelectValue placeholder="Origin chain" />
            </SelectTrigger>
            <SelectContent>
              {connected && (
                <SelectItem key={0} value={"0"}>
                  Solana
                </SelectItem>
              )}
              {isConnected && (
                <SelectItem
                  key={metamaskChainId}
                  value={metamaskChainId?.toString()}
                >
                  {getChainName()}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-auto flex flex-col items-center">
          <Label
            id="destination"
            className="text-primary flex justify-center text-lg mb-1 self-center md:self-auto"
          >
            {content.chainInput}
          </Label>
          <Select
            name="destination"
            value={destinationChain?.toString() ?? ""}
            onValueChange={handleDestinationChange}
            disabled={deactivateInput}
          >
            <SelectTrigger className="w-full max-w-xs md:max-w-none md:w-[170px] lg:w-[180px]">
              <SelectValue placeholder={content.chainInput} />
            </SelectTrigger>
            <SelectContent>
              {Array.from(networks.values())
                .filter(
                  (chain: Network) => chain.chainId !== Number(originChain)
                )

                .map((network: Network) => (
                  <SelectItem
                    key={network.id}
                    value={network.chainId.toString()}
                  >
                    {network.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-auto flex flex-col items-center">
          <Label
            id="amount"
            className="text-primary flex justify-center text-lg mb-1 self-center md:self-auto"
          >
            Receiver
          </Label>
          <Input
            className="text-primary focus:border-primary focus:border-1 border-primary placeholder:text-primary w-full max-w-xs md:max-w-none md:w-[170px] lg:w-[180px]"
            type="text"
            onChange={handleReceiverChange}
            value={receiver}
            disabled={deactivateInput}
            placeholder="Receiver address"
          />
        </div>
        <div className="w-full md:w-auto flex flex-col items-center">
          <Label
            id="token"
            className="text-primary flex justify-center text-lg mb-1 self-center md:self-auto"
          >
            {content.tokenInput}
          </Label>
          <Select
            name="token"
            value={selectedToken?.name ?? ""}
            onValueChange={handleTokenChange}
            disabled={deactivateInput}
          >
            <SelectTrigger className="w-full max-w-xs md:max-w-none md:w-[170px] lg:w-[180px]">
              <SelectValue placeholder={content.tokenInput} />
            </SelectTrigger>
            <SelectContent>
              {tokens
                .filter((token: Token) =>
                  token.isNative
                    ? token.chainId === Number(originChain)
                    : token.origin === destinationChain &&
                      token.chainId === Number(originChain)
                )
                .map((token: Token) => (
                  <SelectItem key={token.id} value={token.name}>
                    {token.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-auto flex flex-col items-center">
          <Label
            id="amount"
            className="text-primary flex justify-center text-lg mb-1 self-center md:self-auto"
          >
            {content.amountInput}
          </Label>
          <Input
            className="text-primary focus:border-primary focus:border-1 border-primary placeholder:text-primary w-full max-w-xs md:max-w-none md:w-[170px] lg:w-[180px]"
            type="number"
            onChange={handleAmountChange}
            value={amount}
            disabled={deactivateInput}
            placeholder="0"
          />
        </div>
        <div className="w-full md:w-auto flex justify-center md:self-end pt-4 md:pt-0">
          <Button
            disabled={!isTransferEnabled()}
            className="text-gray-900 w-full max-w-xs md:max-w-none md:w-auto px-6 md:px-4 mt-4 md:mt-0"
            onClick={handleTransfer}
          >
            {content.inputButton}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TransactionForm;
