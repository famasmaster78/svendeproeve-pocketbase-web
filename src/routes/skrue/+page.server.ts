
import type { PageServerLoad } from './$types';

// Import prisma
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get all posts
async function getAllPosts() {

	const allPosts = await prisma.post.findMany();
	return allPosts;
	
}

export const load: PageServerLoad = async ({ params }) => {
	
	return {
		allPosts: await getAllPosts()
	}

};