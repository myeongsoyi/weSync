import {create} from 'zustand';

interface LoginState {
  isLoggedIn: boolean;
  setIsLogin: (isLogin: boolean) => void;
  getIsLogin: () => boolean;
}

export const useLoginStore = create<LoginState>((set, get) => ({
    isLoggedIn: true,
  setIsLogin: (isLoggedIn) => set({isLoggedIn}),
  getIsLogin: () => {
    return get().isLoggedIn;
  },
}));