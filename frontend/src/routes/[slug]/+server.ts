import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ethers } from "ethers";
import * as sapphire from '@oasisprotocol/sapphire-paratime';
import PrivatarArtifact from "$lib/contract/Privatar.json";
import contractAddress from "$lib/contract/contract-address.json";
import { OASIS_SAPPHIRE_TESTNET } from '$lib/Network';

export const GET: RequestHandler = async ({ url, params, setHeaders }) => {
    const address = params.slug;
    const privatar = new ethers.Contract(
        contractAddress.Privatar,
        PrivatarArtifact.abi,
        sapphire.wrap(new ethers.JsonRpcProvider(OASIS_SAPPHIRE_TESTNET.rpcUrls[0])));

    const profile = await privatar.getProfile(address);

	return json({ 
		name: profile.name, 
		note: profile.note, 
		photo: `https://${url.host}/avatar/${address}`
	});
};