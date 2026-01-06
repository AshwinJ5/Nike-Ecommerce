import { create } from "zustand";
import { IUser } from "@/types/auth";

interface AuthState {
    token: string | null;
    user: IUser | null;
    isAuthenticated: boolean;
    login: (token: string, user?: IUser) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    isAuthenticated: false,

    login: (token, user) => {
        set({ token, user, isAuthenticated: true });
    },

    logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
    },
}));
