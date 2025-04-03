import { writable, type Writable } from "svelte/store";

const linkStore: Writable<string | null> = writable<string | null>(null);

export { linkStore };
