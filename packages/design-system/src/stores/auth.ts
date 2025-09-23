import { atomWithStorage } from 'jotai/utils';
import { User } from '@repo/design-system/types';
import { Store } from '../types/store';
import { atom } from 'jotai';
// set persit to get data from local storage and save authenticated

export const currentUserAtom = atomWithStorage<User | null>('currentUser', null);
export const currentStoreAtom = atomWithStorage<Store | null>('currentStore', null);
export const accessTokenAtom = atomWithStorage<string | null>('accessToken', null);

// save in memory only
export const storesAtom = atom<Store[]>([]);
