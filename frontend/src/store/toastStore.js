import { create } from 'zustand';
let timer;
export const useToastStore = create((set) => ({
    message: '',
    visible: false,
    show: (msg) => {
        clearTimeout(timer);
        set({ message: msg, visible: true });
        timer = setTimeout(() => set({ visible: false }), 2600);
    },
}));
