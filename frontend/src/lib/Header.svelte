<script lang="ts">
    import WalletConnection from "$lib/WalletConnection.svelte";

    const handleSubmit = () => {};
</script>

<header>
    Privatar
    <WalletConnection />   
</header>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>

