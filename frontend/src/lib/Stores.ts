import { derived, readable, type Readable } from "svelte/store";
import { getOasisNetworkConnectionStatus } from "./Network";
import { ethers } from "ethers";
import * as sapphire from '@oasisprotocol/sapphire-paratime';
import PrivatarArtifact from "$lib/contract/Privatar.json";
import contractAddress from "$lib/contract/contract-address.json";

export const connected = readable<boolean>(false, set => {
    const interval = setInterval(async () => set( await getOasisNetworkConnectionStatus() ), 1000);

    return function stop() {
        clearInterval(interval); 
    }
});

export const signerAddress = readable<string>('', set => {
    const interval = setInterval(async () => {
        if (window?.ethereum) {
            set(window.ethereum.selectedAddress);
        }
    }, 1000);

    return function stop() {
        clearInterval(interval); 
    }
});

export const privatarContract: Readable<ethers.Contract|undefined> = derived([connected, signerAddress], ([$connected], set) => {
    if ($connected) {     
        let wrapped = sapphire.wrap(window.ethereum);
        new ethers.BrowserProvider(wrapped)
            .getSigner()
            .then(signer => {
                set(new ethers.Contract(
                    contractAddress.Privatar,
                    PrivatarArtifact.abi,
                    signer
                ))
            });
    } else {
        set(undefined);
    }
});

export const privatarContractUnsigned: Readable<ethers.Contract|undefined> = derived([connected, signerAddress], ([$connected], set) => {
    if ($connected) {
        set(new ethers.Contract(
            contractAddress.Privatar,
            PrivatarArtifact.abi,
            sapphire.wrap(new ethers.BrowserProvider(window.ethereum))));
    } else {
        set(undefined);
    }
});