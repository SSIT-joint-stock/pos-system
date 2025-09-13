import { atomWithStorage } from 'jotai/utils';
import { User } from '@repo/design-system/types';
import { Store } from '../types/store';

export const currentUserAtom = atomWithStorage<User | null>('user', null);
//TODO : CO THE XOA BO
export const accessTokenAtom = atomWithStorage<string | null>('accessToken', null);

export const storesAtom = atomWithStorage<Store[]>('stores', []);

// TODO : CO THE XOA BO
export const currentStoreAtom = atomWithStorage<Store | null>('currentStore', null);
