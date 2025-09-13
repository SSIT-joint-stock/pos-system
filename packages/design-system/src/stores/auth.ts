import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { User } from '@repo/design-system/types';
import { Store } from '../types/store';

export const userAtom = atom<{
  isAuthenticated: boolean;
  user: User | null;
}>({
  isAuthenticated: false,
  user: null,
});
//TODO : CO THE XOA BO
export const accessTokenAtom = atomWithStorage<string | null>('accessToken', null);

export const storesAtom = atomWithStorage<Store[]>('stores', []);

// TODO : CO THE XOA BO

export const currentStoreAtom = atomWithStorage<Store | null>('currentStore', null);
