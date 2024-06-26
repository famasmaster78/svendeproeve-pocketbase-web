
// Import
import { type RecordModel } from 'pocketbase';

// Todos model
export interface Todo extends RecordModel {
  title: string;
  checked: boolean;
  owner: string;
}