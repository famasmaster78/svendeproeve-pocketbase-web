
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
	// Register a new user
	register: async (email: string, password: string, username:string, name:string) => {
		const newUser = await pb.collection(config.usersCollection).create({ email, password, passwordConfirm: password, name, username });
		return newUser;
	},
	getTodos: async () => {
		if (!pb.authStore.isValid) {
			throw new Error('User not logged in');
		}
		const todos = await pb.collection(config.todoCollection).getFullList() as Todo[];
		return todos;
	},
	createTodo: async (title:string, checked:boolean, owner:string) => {
		if (!pb.authStore.isValid) {
			throw new Error('User not logged in');
		}
		const newTodo = await pb.collection(config.todoCollection).create({ title, checked, owner });
		return newTodo;
	},
	updateTodo: async (todo: Todo) => {
		if (!pb.authStore.isValid) {
			throw new Error('User not logged in');
		}
		const updatedTodo = await pb.collection(config.todoCollection).update(todo.id, todo);
		return updatedTodo;
	},
	deleteTodo: async (todo: Todo) => {
		if (!pb.authStore.isValid) {
			throw new Error('User not logged in');
		}
		await pb.collection(config.todoCollection).delete(todo.id);
	},
	// Update checked state
	updateChecked: async (todoId:string, newState:boolean) => {
		if (!pb.authStore.isValid) {
			throw new Error('User not logged in');
		}
		const updatedTodo = await pb.collection(config.todoCollection).update(todoId, { checked: newState });
		return updatedTodo;
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