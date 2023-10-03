import type { RequestHandler } from './$types';
import { ethers } from "ethers";
import * as sapphire from '@oasisprotocol/sapphire-paratime';
import basicUserAvatar from "$lib/images/default-avatar-96x96.png";
import PrivatarArtifact from "$lib/contract/Privatar.json";
import contractAddress from "$lib/contract/contract-address.json";
import { OASIS_SAPPHIRE_TESTNET } from '$lib/Network';

export const GET: RequestHandler = async ({ params, setHeaders, fetch }) => {
    const address = params.slug;
    const privatar = new ethers.Contract(
        contractAddress.Privatar,
        PrivatarArtifact.abi,
        sapphire.wrap(new ethers.JsonRpcProvider(OASIS_SAPPHIRE_TESTNET.rpcUrls[0])));

    let avatarBase64;
    try {
        avatarBase64 = await privatar.getAvatar(address);
    } catch {
        const response = await fetch(basicUserAvatar);
        avatarBase64 = Buffer.from(await response.arrayBuffer()).toString('base64');
    }

    const imageBytes = Buffer.from(avatarBase64, 'base64');

    setHeaders({
        'Content-Type': 'image/jpeg'
    });

    return new Response(imageBytes);
};