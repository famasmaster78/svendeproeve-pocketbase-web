
<script lang="ts">
	import type { PageData } from "./$types";


	export let data: PageData;

</script>

<h1 class="m-4 text-center">All posts</h1>

<div class="flex gap-3 card p-4 items-center justify-center flex-col">

	{#each data.allPosts as post}

		<div class="card p-4 variant-ghost-primary flex flex-col gap-2 max-w-xl w-full">
			<p>{post.title}</p>
			<em>{post.car_brand} {post.car_model}</em>
		</div>

	{/each}

</div>

