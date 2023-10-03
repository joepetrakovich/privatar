<script lang="ts">
    import Header from '$lib/Header.svelte';
    import placeholder from "$lib/images/placeholder-150x150.png";
    import { privatarContract, signerAddress } from '$lib/Stores';
    import { onDestroy } from 'svelte';

    let files: FileList,
        name: string, 
        note: string, 
        enabled: boolean = true,
        submitting: boolean,
        tx: Promise<any>;
    
    let image: HTMLImageElement;

    const toBase64 = (file: File) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            let dataUrl = reader.result;
            let base64 = '';
            if (typeof dataUrl === 'string') {
                base64 = dataUrl.substring(dataUrl.indexOf(',') + 1);
                base64 = base64 + Array((4 - base64.length % 4) % 4 + 1).join('=');
                console.log(base64);
            } 
            resolve(base64);
        }
        reader.onerror = reject;
    });

    const handleSubmit = async (event: Event) => {
        submitting = true;
        const avatarBase64 = files ? await toBase64(files[0]) : '';
        $privatarContract
            ?.updateProfile(name, note, avatarBase64, enabled, { gasLimit: 20_000_000 })
            .then(receipt => {
                tx = receipt.wait(); 
                (event.target as HTMLFormElement).reset(); 
                enabled = true; 
                image.src = placeholder; 
            })
            .catch(console.log)
            .finally(() => submitting = false);
    }

    let signature;
    const handleRefresh = async () => {
        try {
            const profile = await $privatarContract?.getProfile($signerAddress)
            name = profile.name;
            note = profile.note;
            enabled = profile.enabled

            if (!files) {
                image.src = `/avatar/${$signerAddress}`
            }
        } catch {}
    }
</script>

<Header />

<form on:submit|preventDefault={handleSubmit}>
    <label>
        <img bind:this={image} src="{files ? URL.createObjectURL(files[0]) : placeholder}" alt="New Avatar" />
        <input accept="image/png, image/jpeg" bind:files id="avatar" name="avatar" type="file" />
        Upload avatar
    </label>

    <input type="text" placeholder="Name" bind:value={name} />
    <input type="text" placeholder="Note" bind:value={note} />
    <label>
        <input id="enabled" type="checkbox" bind:checked={enabled} />
        Enabled
    </label>
    <button>Update Profile</button>
    <button on:click={handleRefresh}>Refresh</button>
    {#await tx}
    <span>Transaction pending...</span>
{/await}
</form>


<style>
    form {
        margin: 0 auto;
        margin-top: 24px;
    }
    form, label:first-child {
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-width: 300px;
    }
    label:first-child {
        cursor: pointer;
        align-items: center;
    }
    label:first-child input {
        display: none;
    }
    img {
        height: 150px;
        width: 150px;
        border: 1px solid black;
    }
    span {
        animation: flash linear 1.25s infinite;
    }
    @keyframes flash {
        0% { opacity: 1; } 
        50% { opacity: 0; } 
        100% { opacity: 1; } 
    }
</style>