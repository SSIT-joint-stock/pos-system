import { atom } from "jotai";
import { User } from "@repo/design-system/types";

export const authAtom = atom<{
    isAuthenticated: boolean;
    user: User | null;
}>({
    isAuthenticated: false,
    user: null,
});

