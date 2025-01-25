// File: contract-plugin.service.ts

import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { parseUnits, encodeAbiParameters } from "viem";
import { ContractAddressParams, ContractFunctionParams, ContractFunctionDetails } from "./parameters";

// Define an interface for contract methods
interface Method {
    inputs: Array<{ internalType?: string; name: string; type: string }>;
    method_id: string;
    name: string;
    names: string[];
    outputs: Array<{ type: string; value: string | number; internalType?: string; name?: string }>;
    stateMutability: "view" | "pure" | "nonpayable" | "payable";
    type: "function" | "constructor" | "event" | "fallback" | "receive";
}

export class ContractService {
    // Helper function to make API calls
    private async fetchApi(endpoint: string) {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }
        return response.json();
    }

    @Tool({
        name: "contract_details",
        description: "Returns information about a contract",
    })
    async getContractDetails(parameters: ContractAddressParams) {
        const contractAddress = parameters.contractAddress;
        const data = await this.fetchApi(`https://explorer-mode-mainnet-0.t.conduit.xyz/api/v2/smart-contracts/${contractAddress}`);
        return {
            is_verified: data.is_verified,
            name: data.name,
        };
    }

    @Tool({
        name: "contract_read_methods",
        description: "Returns information on the read methods of a contract",
    })
    async getReadMethods(parameters: ContractAddressParams) {
        const contractAddress = parameters.contractAddress;
        const contractData = await this.fetchApi(`https://explorer-mode-mainnet-0.t.conduit.xyz/api/v2/smart-contracts/${contractAddress}`);

        if (contractData.has_methods_read) {
            const readMethodsData = await this.fetchApi(`https://explorer-mode-mainnet-0.t.conduit.xyz/api/v2/smart-contracts/${contractAddress}/methods-read`);
            return readMethodsData.map((method: Method) => method.name).filter((name: string) => name !== undefined);
        } else {
            throw new Error("No read methods found for the given contract.");
        }
    }

    @Tool({
        name: "contract_write_methods",
        description: "Returns information on the write methods of a contract",
    })
    async getWriteMethods(parameters: ContractAddressParams) {
        const contractAddress = parameters.contractAddress;
        const contractData = await this.fetchApi(`https://explorer-mode-mainnet-0.t.conduit.xyz/api/v2/smart-contracts/${contractAddress}`);

        if (contractData.has_methods_write) {
            const writeMethodsData = await this.fetchApi(`https://explorer-mode-mainnet-0.t.conduit.xyz/api/v2/smart-contracts/${contractAddress}/methods-write`);
            return writeMethodsData.map((method: Method) => method.name).filter((name: string) => name !== undefined);
        } else {
            throw new Error("No write methods found for the given contract.");
        }
    }

    @Tool({
        name: "method_params",
        description: "Returns the params of a method/function",
    })
    async getMethodParams(parameters: ContractFunctionDetails) {
        const { contractAddress, functionName } = parameters;
        const contractData = await this.fetchApi(`https://explorer-mode-mainnet-0.t.conduit.xyz/api/v2/smart-contracts/${contractAddress}`);

        const allMethods = [...(await this.fetchApi(`https://explorer-mode-mainnet-0.t.conduit.xyz/api/v2/smart-contracts/${contractAddress}/methods-write`)), 
                            ...(await this.fetchApi(`https://explorer-mode-mainnet-0.t.conduit.xyz/api/v2/smart-contracts/${contractAddress}/methods-read`))];

        const method = allMethods.find((m: Method) => m.name === functionName);
        if (!method) {
            throw new Error(`Method ${functionName} not found in contract methods.`);
        }

        return method.inputs.map((input) => input.name);
    }

    @Tool({
        name: "method_caller",
        description: "Calls a smart contract method",
    })
    async callFunction(walletClient: EVMWalletClient, parameters: ContractFunctionParams): Promise<string> {
        const { contractAddress, functionName, functionParams } = parameters;
        const functionArgs = Object.values(functionParams);

        try {
            const contractData = await this.fetchApi(`https://explorer-mode-mainnet-0.t.conduit.xyz/api/v2/smart-contracts/${contractAddress}`);

            if (!contractData.abi || !Array.isArray(contractData.abi)) {
                throw new Error("Contract ABI not found or invalid.");
            }

            const methodInAbi = contractData.abi.find((method: any) => method.name === functionName && method.type === "function");

            if (!methodInAbi) {
                throw new Error(`Function ${functionName} not found in contract ABI.`);
            }

            const transactionHash = await walletClient.sendTransaction({
                to: contractAddress,
                abi: contractData.abi,
                functionName,
                args: functionArgs,
            });

            return transactionHash.hash;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to call contract method: ${errorMessage}`);
        }
    }
}


//---OLD CODE---
/*import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { parseUnits } from "viem";
import { encodeAbiParameters } from "viem";
import {
    ContractAddressParams, ContractFunctionParams, ContractFunctionDetails
} from "./parameters";

interface Method {
    inputs: Array<{
        internalType?: string;
        name: string;
        type: string;
    }>;
    method_id: string;
    name: string;
    names: string[];
    outputs: Array<{
        type: string;
        value: string | number;
        internalType?: string;
        name?: string;
    }>;
    stateMutability: "view" | "pure" | "nonpayable" | "payable";
    type: "function" | "constructor" | "event" | "fallback" | "receive";
}

export class ContractService {
    @Tool({
        name: "contract_details",
        description: "Returns information about a contract",
    })
    async getContractDetails(parameters: ContractAddressParams) {
        const contractAddress = parameters.contractAddress;

        // Make an API call to the endpoint
        const response = await fetch(`https://explorer-mode-mainnet-0.t.conduit.xyz/api/v2/smart-contracts/${contractAddress}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch contract details: ${response.statusText}`);
        }

        const data = await response.json();
        const returnData = {
            "is_verified": data.is_verified,
            "name": data.name
        }
        return returnData;
    }

    @Tool({
        name: "contract_read_methods",
        description: "Returns information on the read methods of a contract",
    })
    async getReadmethods(parameters: ContractAddressParams) {
        const contractAddress = parameters.contractAddress;

        // Make an API call to the endpoint
        const contractResponse = await fetch(`https://explorer-mode-mainnet-0.t.conduit.xyz/api/v2/smart-contracts/${contractAddress}`);
        if (contractResponse.ok) {
            const contractData = await contractResponse.json();

            if(contractData.has_methods_read == true) {
                const readMethodsResponse = await fetch(`https://explorer-mode-mainnet-0.t.conduit.xyz/api/v2/smart-contracts/${contractAddress}/methods-read`);
                if (!readMethodsResponse.ok) {
                    throw new Error(`Failed to fetch contract details: ${readMethodsResponse.statusText}`);
                }
                const readMethodsData = await readMethodsResponse.json();

                const methodNames = (readMethodsData as Method[])
                .map((method) => method.name)
                .filter((name): name is string => name !== undefined);

                return methodNames;
            }
        }
    }

    @Tool({
        name: "contract_write_methods",
        description: "Returns information on the write methods of a contract",
    })
    async getWritemethods(parameters: ContractAddressParams) {
        const contractAddress = parameters.contractAddress;

        // Make an API call to the endpoint
        const contractResponse = await fetch(`https://explorer-mode-mainnet-0.t.conduit.xyz/api/v2/smart-contracts/${contractAddress}`);
        if (contractResponse.ok) {
            const contractData = await contractResponse.json();

            if(contractData.has_methods_write == true) {
                const writeMethodsResponse = await fetch(`https://explorer-mode-mainnet-0.t.conduit.xyz/api/v2/smart-contracts/${contractAddress}/methods-write`);
                if (!writeMethodsResponse.ok) {
                    throw new Error(`Failed to fetch contract details: ${writeMethodsResponse.statusText}`);
                }
                const writeMethodsData = await writeMethodsResponse.json();

                const methodNames = (writeMethodsData as Method[])
                .map((method) => method.name)
                .filter((name): name is string => name !== undefined);

                return methodNames;
            }
        }
    }

    @Tool({
        name: "method_params",
        description: "Returns the params of a method/function",
    })
    async getMethodParams(parameters: ContractFunctionDetails) {
        const contractAddress = parameters.contractAddress;
        const methodName = parameters.functionName;
    
        // Make an API call to the endpoint
        const contractResponse = await fetch(
            `https://explorer-mode-mainnet-0.t.conduit.xyz/api/v2/smart-contracts/${contractAddress}`
        );
        if (contractResponse.ok) {
            const contractData = await contractResponse.json();
    
            if (contractData.has_methods_write || contractData.has_methods_read) {
                const writeMethodsResponse = await fetch(
                    `https://explorer-mode-mainnet-0.t.conduit.xyz/api/v2/smart-contracts/${contractAddress}/methods-write`
                );
                const readMethodsResponse = await fetch(
                    `https://explorer-mode-mainnet-0.t.conduit.xyz/api/v2/smart-contracts/${contractAddress}/methods-read`
                );
    
                if (!writeMethodsResponse.ok && !readMethodsResponse.ok) {
                    throw new Error(`Failed to fetch contract details: ${writeMethodsResponse.statusText}`);
                }
    
                const writeMethodsData = await writeMethodsResponse.json();
                const readMethodsData = await readMethodsResponse.json();
    
                // Combine write and read methods
                const allMethods = [...(writeMethodsData as Method[]), ...(readMethodsData as Method[])];
    
                // Find the method by name and extract input names
                const method = allMethods.find((m) => m.name === methodName);
                if (!method) {
                    throw new Error(`Method ${methodName} not found in contract methods.`);
                }
    
                // Get the `name` fields from the `inputs` array
                const inputNames = method.inputs.map((input) => input.name);
    
                return inputNames; // Return the array of input names
            }
        } else {
            throw new Error(`Failed to fetch contract: ${contractResponse.statusText}`);
        }
    }

    @Tool({
        name: "method_caller",
        description: "Calls a smart contract method",
    })
    async callFunction(
        walletClient: EVMWalletClient,
        parameters: ContractFunctionParams,
    ): Promise<string> {
        const { contractAddress, functionName, functionParams } = parameters;
    
        // Extract the function arguments from `functionParams`
        const functionArgs = Object.values(functionParams);
    
        try {
            // Fetch contract metadata
            const contractResponse = await fetch(
                `https://explorer-mode-mainnet-0.t.conduit.xyz/api/v2/smart-contracts/${contractAddress}`
            );
    
            if (!contractResponse.ok) {
                throw new Error(`Failed to fetch contract metadata: ${contractResponse.statusText}`);
            }
    
            const contractData = await contractResponse.json();
    
            // Ensure the ABI is present
            if (!contractData.abi || !Array.isArray(contractData.abi)) {
                throw new Error(`Contract ABI not found or invalid.`);
            }
    
            // Validate the function name exists in the ABI
            const methodInAbi = contractData.abi.find(
                (method: any) => method.name === functionName && method.type === "function"
            );
    
            if (!methodInAbi) {
                throw new Error(`Function ${functionName} not found in contract ABI.`);
            }
    
            // Perform the transaction
            const transactionHash = await walletClient.sendTransaction({
                to: contractAddress,
                abi: contractData.abi,
                functionName: functionName,
                args: functionArgs,
            });
    
            return transactionHash.hash;
        } catch (error) {
            // Enhance error message for better debugging
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to call contract method: ${errorMessage}`);
        }
    }
    
}*/
