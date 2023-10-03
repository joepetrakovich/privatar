<script lang="ts">
    import { OASIS_SAPPHIRE_TESTNET, connectWalletAndSwitchToNetwork } from "$lib/Network";
    import { connected, signerAddress } from "$lib/Stores";
    import { onMount } from "svelte";

    const handleConnectToSapphire = () => {
       connectWalletAndSwitchToNetwork(OASIS_SAPPHIRE_TESTNET);
    };

    function truncateWithCenterEllipses(str: string, maxLength: number) {
        if (!str) {
            return '';
        }
        
        if (str.length <= maxLength) {
            return str;
        }

        const ellipsis = '...';
        const ellipsisLength = ellipsis.length;
        const charsToShowBeforeEllipsis = Math.floor((maxLength - ellipsisLength) / 2);
        const charsToShowAfterEllipsis = maxLength - charsToShowBeforeEllipsis - ellipsisLength;

        const truncatedString =
            str.substr(0, charsToShowBeforeEllipsis) +
            ellipsis +
            str.substr(str.length - charsToShowAfterEllipsis);

        return truncatedString;
    }

    let providerFound: boolean = false;

    onMount(() => {
        providerFound = window?.ethereum;
    });
</script>

<div>
    {#if $connected}
        <span class="connected">
            <img src="/avatar/{$signerAddress}" alt="Avatar" height="32" width="32"/>
            {truncateWithCenterEllipses($signerAddress, 15)}
        </span>
    {:else if !providerFound}
        <a href="https://metamask.io/" target="_blank" rel="noreferrer">Install MetaMask</a>
    {:else}
        <button on:click={handleConnectToSapphire}>Connect to Sapphire</button>
    {/if}
</div>

<style>
    span {
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
        max-width: 200px;
    }
</style>