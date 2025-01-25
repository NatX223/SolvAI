import { type Chain, PluginBase } from "@goat-sdk/core";
import type { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { mode } from "viem/chains";
import { ContractService } from "./contract-plugin.service";

const SUPPORTED_CHAINS = [mode];

export class ContractPlugin extends PluginBase<EVMWalletClient> {
    constructor() {
        super("Contract", [new ContractService()]);
    }

    supportsChain = (chain: Chain) => chain.type === "evm" && SUPPORTED_CHAINS.some((c) => c.id === chain.id);
}

export const contract = () => new ContractPlugin();
