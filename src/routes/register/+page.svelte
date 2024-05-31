
<script lang="ts">
	import { goto } from '$app/navigation';


	// Import PBHelper
	import { PBHelper, authStore } from '$lib/pb';

	import { getToastStore } from '@skeletonlabs/skeleton';

	// Import navigate


	// Toaststore
	let toastStore = getToastStore();

	// Inputs for the form
	let username = '';
	let email = '';
	let password = '';
	let passwordConfirm = '';
	let name = '';

	// Function to register user
	const register = async () => {

		try {

			// Check if passwords match
			if(password !== passwordConfirm) {
				const t = {
					message: "Passwords do not match!",
					timeout: 15000,
				};
				toastStore.trigger(t);
				return;
			}

			// Check if email, username and name is empty
			if(email === '' || username === '' || name === '') {
				const t = {
					message: "All fields are required!",
					timeout: 15000,
				};
				toastStore.trigger(t);
				return;
			}

			// Register user
			const response = await PBHelper.register(email, password, username, name);

			// Show toast
			const t = {
				message: "You are now registered!",
			};
			toastStore.trigger(t);

			// Redirect to main page
			goto('/');

		}catch (e) {

			// Show toast
			const t = {
				message: "An error occured, try again later!",
				timeout: 15000,
			};
			toastStore.trigger(t);

			console.error(e);

		}
	

	}

</script>

<div class="flex flex-col items-center justify-center w-full gap-4">

	<h1 class="text-2xl mt-8">Registrer ny bruger</h1>

	<!-- Register form -->
	<form class="flex flex-col max-w-xl gap-2 card p-4 w-full" on:submit|preventDefault={register}>
		<input class="input rounded-md" type="text" bind:value={username} placeholder="Brugernavn" required>
		<input class="input rounded-md" type="email" bind:value={email} placeholder="Email" required>
		<input class="input rounded-md" type="password" bind:value={password} placeholder="Password" required>
		<input class="input rounded-md" type="password" bind:value={passwordConfirm} placeholder="Confirm Password" required>
		<input class="input rounded-md" type="text" bind:value={name} placeholder="Name" required>
		<button disabled={!email || !password || password != passwordConfirm || !name || !username} class="btn variant-filled" type="submit">Registrer</button>
	</form>

	<!-- Login link -->
	<a href="/login" class="btn variant-filled">Tilbage</a>

</div>