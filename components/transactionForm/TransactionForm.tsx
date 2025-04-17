"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import DataService from "@/services/data.service/data.service";
import { Network, Token } from "@/services/data.service/interfaces";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { toast } from "sonner";
import { ethers } from "ethers";
import bridgeAbi from "./abi/diamond.json";
import erc20Abi from "./abi/erc20.json";
import { InputContent } from "@/sanity/lib/types";

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
  const [originChain, setOriginChain] = useState<number>(0);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [deactivateInput, setDeactivateInput] = useState(false);
  const [amount, setAmount] = useState<number | "">("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { isConnected } = useAccount();
  const metamaskChainId = useChainId();

  useEffect(() => {
    resetState();

    setOriginChain(metamaskChainId);
  }, [metamaskChainId, isConnected]);

  useEffect(() => {
    if (error) {
      toast(error as string);
      resetState();
    }
  }, [error]);

  const handleDestinationChange = (value: string) => {
    setDestinationChain(Number(value));
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value ? Number(event.target.value) : "");
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
  };

  /**
   * Handles the burning of wrapped tokens for cross-chain transfer.
   * @throws {Error} If the burn operation fails or required parameters are missing
   */
  const handleBurn = async () => {
    if (!selectedToken || !destinationChain || !amount || !window.ethereum) {
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const bridgeAddress = networks.get(originChain)?.bridgeAddress;

      if (!bridgeAddress) {
        throw new Error("Bridge address not found");
      }

      const bridgeContract = new ethers.Contract(
        bridgeAddress,
        bridgeAbi,
        signer
      );
      const amountInWei = ethers.parseUnits(amount.toString(), 18);

      const tx = await bridgeContract.burnWrappedToken(
        amountInWei,
        selectedToken.address,
        BigInt(destinationChain)
      );

      await tx.wait();
    } catch {
      throw new Error("Failed to burn tokens");
    }
  };

  /**
   * Handles token approval for the bridge contract.
   * @throws {Error} If the approval operation fails or required parameters are missing
   */
  const handleApprove = async () => {
    if (!selectedToken || !window.ethereum) {
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      const signer = await provider.getSigner();

      const bridgeAddress = networks.get(originChain)?.bridgeAddress;
      if (!bridgeAddress) {
        throw new Error("Bridge address not found");
      }

      const tokenContract = new ethers.Contract(
        selectedToken.address,
        erc20Abi,
        signer
      );
      const amountInWei = ethers.parseUnits(amount!.toString(), 18);

      const tx = await tokenContract.approve(bridgeAddress, amountInWei);
      await tx.wait();
    } catch {
      throw new Error("Failed to approve tokens");
    }
  };

  /**
   * Handles locking of native tokens for cross-chain transfer.
   * @throws {Error} If the lock operation fails or required parameters are missing
   */
  const handleLock = async () => {
    if (!selectedToken || !destinationChain || !amount || !window.ethereum) {
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const bridgeAddress = networks.get(originChain)?.bridgeAddress;

      if (!bridgeAddress) {
        throw new Error("Bridge address not found");
      }

      const bridgeContract = new ethers.Contract(
        bridgeAddress,
        bridgeAbi,
        signer
      );
      const amountInWei = ethers.parseUnits(amount.toString(), 18);

      const tx = await bridgeContract.lockTokens(
        amountInWei,
        selectedToken.address,
        BigInt(destinationChain)
      );

      await tx.wait();
    } catch {
      throw new Error("Failed to lock tokens");
    }
  };

  /**
   * Initiates the transfer process, including approval and either lock or burn operations.
   * Handles error states and success notifications.
   */
  const handleTransfer = async () => {
    if (!selectedToken || !destinationChain || !amount || !window.ethereum) {
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
      const minBridgeableAmount = await getMinBridgeableAmount();

      if (!minBridgeableAmount) {
        throw new Error("Failed to get minimum bridgeable amount");
      }
      if (amount < minBridgeableAmount) {
        throw new Error("Amount is less than the minimum bridgeable amount");
      }

      await handleApprove();
      if (selectedToken.isNative) {
        await handleLock();
      } else {
        await handleBurn();
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
    //console.log(isLoading, selectedToken, destinationChain, amount, isProcessing, window.ethereum);
    return (
      !isLoading &&
      selectedToken !== null &&
      destinationChain !== 0 &&
      amount !== "" &&
      amount !== 0 &&
      !isProcessing &&
      window.ethereum !== undefined
    );
  };

  /**
   * Retrieves the minimum bridgeable amount from the bridge contract.
   * @returns {Promise<number>} The minimum amount that can be bridged
   * @throws {Error} If the operation fails or no provider is available
   */
  const getMinBridgeableAmount = async () => {
    if (!window.ethereum) {
      throw new Error("No ethereum provider found");
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const bridgeAddress = networks.get(originChain)?.bridgeAddress;

      if (!bridgeAddress) {
        throw new Error("Bridge address not found");
      }

      const bridgeContract = new ethers.Contract(
        bridgeAddress,
        bridgeAbi,
        provider
      );

      const minAmount =
        await bridgeContract.getMinimumBridgeableAmount.staticCall();
      const formattedAmount = ethers.formatUnits(minAmount, 18);
      return Number(formattedAmount);
    } catch {
      throw new Error("Failed to get minimum bridgeable amount");
    }
  };
  return (
    <form className="w-full">
      <div className="flex flex-col md:flex-row gap-4 md:gap-4 lg:gap-5 justify-center items-stretch md:items-end mb-10 w-full">
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
                .filter((chain: Network) => chain.chainId !== metamaskChainId)
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
                .filter((token: Token) => token.chainId === metamaskChainId)
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
