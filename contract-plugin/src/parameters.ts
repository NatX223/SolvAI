// File: parameters.ts

import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

// Define a class for contract address parameters
export class ContractAddressParams extends createToolParameters(
    z.object({
        contractAddress: z.string().describe("The address of the contract to be interacted with")
    }),
) {}

// Define a class for contract function details
export class ContractFunctionDetails extends createToolParameters(
    z.object({
        contractAddress: z.string().describe("The address of the contract to be interacted with"),
        functionName: z.string().describe("The name of the function to be called")
    }),
) {}

// Define a class for contract function parameters
export class ContractFunctionParams extends createToolParameters(
    z.object({
        contractAddress: z.string().describe("The address of the contract to be interacted with"),
        functionName: z.string().describe("The name of the function to be called"),
        functionParams: z.record(z.any()).describe("The functions that will be calling the function"),
    }),
) {}


//---OLD CODE----
/*import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

// export class GetContractAddressParams extends createToolParameters(z.object({})) {}

export class ContractAddressParams extends createToolParameters(
    z.object({
        contractAddress: z.string().describe("The address of the contract to be interacted with")
    }),
) {}

export class ContractFunctionDetails extends createToolParameters(
    z.object({
        contractAddress: z.string().describe("The address of the contract to be interacted with"),
        functionName: z.string().describe("The name of the function to be called")
    }),
) {}

export class ContractFunctionParams extends createToolParameters(
    z.object({
        contractAddress: z.string().describe("The address of the contract to be interacted with"),
        functionName: z.string().describe("The name of the function to be called"),
        functionParams: z.record(z.any()).describe("The functions that will be calling the function"),
    }),
) {} */
