import type { Network } from "./Models";
import { ethers } from "ethers";

const SWITCH_CHAIN_ERROR_CHAIN_NOT_ADDED: number = 4902;
const UNRECOGNIZED_CHAIN_ERROR: number = -32603;

export const OASIS_SAPPHIRE_TESTNET: Network = {
    name: "Oasis Sapphire Testnet",
    chainIdHex: "0x5aff",
    chainIdDecimal: 23295,
    rpcUrls: ["https://testnet.sapphire.oasis.dev"],
    blockExplorerUrls: ["https://testnet.explorer.sapphire.oasis.dev"],
    nativeCurrency: {
        name: "TEST",
        symbol: "TEST",
        decimals: 18
    }
}

function connectAccounts() {
    return window.ethereum.request({ method: 'eth_requestAccounts' });
}

function switchNetwork(chainId: string) {
    return window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }]
    });
}

function addNetwork(network: Network) {
    return window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
            chainId: network.chainIdHex,
            rpcUrls: network.rpcUrls,
            chainName: network.name,
            nativeCurrency: network.nativeCurrency,
            blockExplorerUrls: network.blockExplorerUrls
        }]
    });
}

export function connectWalletAndSwitchToNetwork(network: Network) {
    Promise.resolve(window.ethereum?.selectedAddress || connectAccounts())
    .then(getOasisNetworkConnectionStatus)
    .then(connectedToNetwork => !connectedToNetwork ? switchNetwork(network.chainIdHex) : true)
    .catch((error: { code: number; }) => {
        if (error.code === SWITCH_CHAIN_ERROR_CHAIN_NOT_ADDED ||
            error.code === UNRECOGNIZED_CHAIN_ERROR) {
            addNetwork(network);
        } else {
            throw error;
        }
    });
}

export async function getOasisNetworkConnectionStatus(): Promise<boolean> {
    try {  
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();

        if (window.ethereum.selectedAddress && network.chainId.toString() === OASIS_SAPPHIRE_TESTNET.chainIdDecimal.toString()) {
            return true;
        }
        
        return false;

    } catch { 
        return false; 
    }
}
