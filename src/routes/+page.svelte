<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->
<script lang="ts">
	import type { Todo } from '$lib/models/todos';

	
	import PBHelper, { pb, authStore } from '$lib/pb';

	// Import icons
	import { IconTrash, IconPlus } from '@tabler/icons-svelte';

	// Import pb
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	
	// Skeleton toasts
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	// Get toast store
	const toastStore = getToastStore();

	// Todos
	let todos:Todo[] = [];

	// Inputs for login
	let email = '';
	let password = '';

	// Inputs for new todo
	let todoTitle = '';
	let todoChecked = false;

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

	// Function to get todos
	const getTodos = async () => {
		try {

			// If not logged in, skip
			if(!$authStore.isValid) return;

			todos = await PBHelper.getTodos();
		}catch (e:any)
		{
			// Show toast
			const t: ToastSettings = {
				message: "Der er sket en fejl, kunne ikke hente dine todos!",
				timeout: 15000,
			};
			toastStore.trigger(t);

			console.error(e);
		}
	}

	// Function to create todo
	const createTodo = async () => {
		try {
			await PBHelper.createTodo(todoTitle, todoChecked, $authStore.model?.id);
			// Show toast
			const t: ToastSettings = {
				message: "Todo er blevet oprettet!",
			};
			toastStore.trigger(t);

			// Clear inputs
			todoTitle = '';
			todoChecked = false;

			// Get todos
			getTodos();

		}catch (e:any)
		{
			// Show toast
			const t: ToastSettings = {
				message: "Der er sket en fejl, kunne ikke oprette din todo!",
				timeout: 15000,
			};
			toastStore.trigger(t);

			console.error(e);
		}
	}

	// Function to delete todo
	const deleteTodo = async (todo:Todo) => {
		try {
			await PBHelper.deleteTodo(todo);
			// Show toast
			const t: ToastSettings = {
				message: "Todo er blevet slettet!",
			};
			toastStore.trigger(t);

			// Get todos
			getTodos();

		}catch (e:any)
		{
			// Show toast
			const t: ToastSettings = {
				message: "Der er sket en fejl, kunne ikke slette din todo!",
				timeout: 15000,
			};
			toastStore.trigger(t);

			console.error(e);
		}
	}

	// onMount gettodos
	onMount(() => {
		getTodos();
	});

</script>

<div class="container h-full mx-auto flex flex-col p-8 gap-5 justify-center items-center">

	<h1>Denne side kan du logge ind og tilføje todos</h1>

	<!-- If user is logged in -->
	{#if $authStore.isValid}
	
	
		<div class="card p-4 variant-filled flex flex-col items-center gap-4 justify-center">
			<p>Du er logget ind som {$authStore.model?.username} ({$authStore.model?.email})</p>
			<button class="btn variant-filled-warning" on:click={() => PBHelper.logout()}>Log ud</button>
		</div>
	
		<!-- Button to get todos -->
		<button class="btn variant-filled" on:click={getTodos}>Genopfrisk todos</button>


		<!-- Responsive Container (recommended) -->
		<div class="table-container max-w-2xl">	
			<!-- Native Table Element -->
			<table class="table table-hover">
				<thead>
					<tr>
						<th>Titel</th>
						<th>Fuldført</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each todos as row, i}
						<tr>
							<td>{row.title}</td>
							<td>
								<input class="checkbox" type="checkbox" checked={row.checked} on:change={(e) => PBHelper.updateChecked(row.id, !row.checked)} />
							</td>
							<td>
								<button class="btn variant-filled-error" on:click={() => deleteTodo(row)}><IconTrash /></button>
							</td>
						</tr>
					{/each}
					<tr>
						<td>
							<input class="input rounded-md" type="text" bind:value={todoTitle} placeholder="Todo title" />
						</td>
						<td>
							<input type="checkbox" class="checkbox" bind:checked={todoChecked} />
						</td>
						<td>
							<button disabled={!todoTitle || todoChecked == undefined} class="btn variant-filled" on:click={createTodo}><IconPlus /></button>
						</td>
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<th colspan="2">Antal todos</th>
						<td>{todos.length}</td>
					</tr>
				</tfoot>
			</table>
		</div>
	
	{:else}
		<div class="flex flex-col gap-4 items-center justify-center">

			<!-- If user is not logged in -->
			<form on:submit|preventDefault={() => login(email, password)} class="flex flex-col gap-3">
				<input class="input rounded-md" type="text" bind:value={email} placeholder="Email" />
				<input class="input rounded-md" type="password" bind:value={password} placeholder="Password" />
				<button class="btn variant-filled" type="submit">Log ind</button>
			</form>

			<span>- Eller -</span>

			<!-- Register user -->
			<a href="/register" class="btn variant-filled">Opret bruger</a>

		</div>
	{/if}

</div>
