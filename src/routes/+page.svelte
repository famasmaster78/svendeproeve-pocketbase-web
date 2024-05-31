<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->
<script lang="ts">
	import PBHelper, { pb, authStore } from '$lib/pb';

	// Import pb
	import type { ToastSettings } from '@skeletonlabs/skeleton';

	// Skeleton toasts
	import { getToastStore } from '@skeletonlabs/skeleton';

	// Get toast store
	const toastStore = getToastStore();

	// Inputs for login
	let email = '';
	let password = '';

	// Function to login user
	const login = async (email:string, password:string) => {
		try {
			const response = await PBHelper.login(email, password);
			// Show toast
			const t: ToastSettings = {
				message: "Du er nu logget ind!",
			};
			toastStore.trigger(t);
		}catch (e:any)
		{
			// Check if error is 

			// Show toast
			const t: ToastSettings = {
				message: "Der er sket en fejl, kunne ikke logge dig ind!",
				timeout: 15000,
			};
			toastStore.trigger(t);

			console.error(e);
		}
	}

</script>

<div class="container h-full mx-auto flex flex-col p-8 gap-5 justify-center items-center">

	<h1>Denne side kan du logge ind og tilføje todos</h1>

	<!-- If user is logged in -->
	{#if $authStore.isValid}
	
	
		<p>Du er logget ind som {$authStore.model?.username} ({$authStore.model?.email})</p>
		<button class="btn variant-filled" on:click={() => PBHelper.logout()}>Log ud</button>
	
	
	
	{:else}
		<!-- If user is not logged in -->
		<form on:submit|preventDefault={() => login(email, password)} class="flex flex-col gap-3">
			<input class="input rounded-md" type="text" bind:value={email} placeholder="Email" />
			<input class="input rounded-md" type="password" bind:value={password} placeholder="Password" />
			<button class="btn variant-filled" type="submit">Log ind</button>
		</form>
	{/if}

</div>
