import { ethers } from "ethers";
import { Token } from "../data.service/interfaces";
import erc20Abi from "../../abi/erc20.json";
import bridgeAbi from "../../abi/diamond.json";
import { SOLANA_CHAIN_ID } from "@/components/consts";
import bs58 from "bs58";

class EvmService {
  handleApprove = async (
    bridgeAddress: string,
    selectedToken: Token,
    amount: number,
    windowEthereum: any
  ) => {
    const provider = new ethers.BrowserProvider(windowEthereum);

    const signer = await provider.getSigner();

    const tokenContract = new ethers.Contract(
      selectedToken.address,
      erc20Abi,
      signer
    );
    const amountInWei = ethers.parseUnits(amount!.toString(), 18);

    const tx = await tokenContract.approve(bridgeAddress, amountInWei);
    await tx.wait();
  };

  handleBurn = async (
    bridgeAddress: string,
    selectedToken: Token,
    destinationChain: number,
    amount: number,
    receiver: string,
    windowEthereum: any
  ) => {
    const provider = new ethers.BrowserProvider(windowEthereum);
    const signer = await provider.getSigner();

    const bridgeContract = new ethers.Contract(
      bridgeAddress,
      bridgeAbi,
      signer
    );
    const amountInWei = ethers.parseUnits(amount.toString(), 18);

    const wrappedTokenReceiver: string = this.normalizeReceiverAddress(
      destinationChain,
      receiver
    );

    const tx = await bridgeContract.burnWrappedToken(
      amountInWei,
      selectedToken.address,
      BigInt(destinationChain),
      Buffer.from(wrappedTokenReceiver, "hex")
    );

    await tx.wait();
  };

  handleLock = async (
    bridgeAddress: string,
    selectedToken: Token,
    destinationChain: number,
    receiver: string,
    amount: number,
    windowEthereum: any
  ) => {
    const provider = new ethers.BrowserProvider(windowEthereum);
    const signer = await provider.getSigner();

    const bridgeContract = new ethers.Contract(
      bridgeAddress,
      bridgeAbi,
      signer
    );
    const amountInWei = ethers.parseUnits(amount.toString(), 18);

    const receiverAddress = this.normalizeReceiverAddress(
      destinationChain,
      receiver
    );

    const tx = await bridgeContract.lockTokens(
      amountInWei,
      selectedToken.address,
      BigInt(destinationChain),
      Buffer.from(receiverAddress, "hex")
    );

    await tx.wait();
  };

  getMinBridgeableAmount = async (
    bridgeAddress: string,
    windowEthereum: any
  ) => {
    if (!windowEthereum) {
      throw new Error("No ethereum provider found");
    }

    const provider = new ethers.BrowserProvider(windowEthereum);

    const bridgeContract = new ethers.Contract(
      bridgeAddress,
      bridgeAbi,
      provider
    );

    const minAmount =
      await bridgeContract.getMinimumBridgeableAmount.staticCall();
    const formattedAmount = ethers.formatUnits(minAmount, 18);
    return Number(formattedAmount);
  };

  private normalizeReceiverAddress = (
    destinationChain: number,
    receiver: string
  ): string => {
    if (destinationChain === SOLANA_CHAIN_ID) {
      return `${Buffer.from(bs58.decode(receiver)).toString("hex")}`;
    }
    return `${"0".repeat(24)}${receiver.slice(2)}`;
  };
}

const service = new EvmService();
export default service;
