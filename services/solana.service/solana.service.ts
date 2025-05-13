import { Connection } from "@solana/web3.js";
import { Token } from "../data.service/interfaces";
import { AnchorProvider, BN, Program, web3 } from "@coral-xyz/anchor";
import IDL from "@/idl/bridge_solana.json";
import pdaDeriver from "./pda-deriver";
import {
  getAssociatedTokenAddress,
  getMint,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { BridgeSolana } from "@/idl/bridge_solana";

class SolanaService {
  private connection: Connection;
  constructor() {
    this.connection = new web3.Connection(web3.clusterApiUrl("devnet"), {
      commitment: "finalized",
    });
  }

  handleLock = async (
    selectedToken: Token,
    receiver: string,
    amount: number,
    destinationChain: number,
    windowSolana: any
  ) => {

    const wallet = {
      publicKey: windowSolana.publicKey,
      signTransaction: windowSolana.signTransaction.bind(windowSolana),
      signAllTransactions: windowSolana.signAllTransactions?.bind(windowSolana),
      signMessage: windowSolana.signMessage?.bind(windowSolana),
    };

    const provider = new AnchorProvider(this.connection, wallet, {
      commitment: "finalized",
    });

    const bridgeProgram: Program<BridgeSolana> = new Program(IDL, provider);

    const nativeTokenMint = new web3.PublicKey(selectedToken?.address);

    const vaultPDA = pdaDeriver.splVault(bridgeProgram.programId);
    const vaultAtaPDA = await getAssociatedTokenAddress(
      nativeTokenMint,
      vaultPDA,
      true
    );
    const authority = new web3.PublicKey(wallet.publicKey);

    const userAta = await getAssociatedTokenAddress(nativeTokenMint, authority);

    const bridgeConfigPDA = pdaDeriver.bridgeConfig(bridgeProgram.programId);

    const tokenDetailsPDA = pdaDeriver.tokenDetails(
      nativeTokenMint,
      bridgeProgram.programId
    );

    const decimals = (await getMint(this.connection, nativeTokenMint)).decimals;

    const adjustedAmount = amount * 10 ** decimals;

    const ix = await bridgeProgram.methods
      .lock({
        tokenMint: nativeTokenMint,
        amount: new BN(adjustedAmount),
        destinationChain: destinationChain,
        destinationAddress: receiver,
      })
      .accounts({
        payer: wallet.publicKey,
        //@ts-expect-error IDL types
        tokenDetails: tokenDetailsPDA,
        mint: nativeTokenMint,
        splVault: vaultPDA,
        from: userAta,
        to: vaultAtaPDA,
        bridgeConfig: bridgeConfigPDA,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction();

    const latestBlockhash = await this.connection.getLatestBlockhash();
    const transaction = new web3.Transaction({
      feePayer: wallet.publicKey,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    });

    transaction.add(ix);

    const signedTransaction = await wallet.signTransaction(transaction);

    const signature = await this.connection.sendRawTransaction(
      signedTransaction.serialize()
    );

    // Wait for confirmation
    const confirmation = await this.connection.confirmTransaction({
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    });

    if (confirmation.value.err) {
      throw new Error(
        `Transaction failed: ${confirmation.value.err.toString()}`
      );
    }
  };
}

const service = new SolanaService();

export default service;