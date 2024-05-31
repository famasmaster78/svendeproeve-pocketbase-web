
import Pocketbase from 'pocketbase';
import type { Todo } from './models/todos';
import { writable } from 'svelte/store';

// Config
export const config = {
	url: 'http://10.11.0.6:8090',
	todoCollection: 'todos',
	usersCollection: 'users'
}

// Pocketbase
export const pb = new Pocketbase(config.url); // Your Pocketbase API key

// PBFunctions
export const PBHelper = {
	login: async (email: string, password: string) => {
		const user = await pb.collection(config.usersCollection).authWithPassword(email, password);
		return user;
	},
	logout: async () => {
		await pb.authStore.clear();
	},
	getTodos: async () => {
		if (!pb.authStore.isValid) {
			throw new Error('User not logged in');
		}
		const todos = await pb.collection(config.todoCollection).getFullList() as Todo[];
		return todos;
	},
	isLoggedIn: () => {
		return pb.authStore.isValid;
	},
	pb: pb,
}

export const authStore = writable(pb.authStore);

pb.authStore.onChange((newAuthStore) => {


	authStore.set(pb.authStore);

	// Log
	console.log('pb.authStore changed', newAuthStore);
	
});

export default PBHelper;