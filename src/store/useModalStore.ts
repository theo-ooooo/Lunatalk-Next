import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
  openModal: (params: { title: string; content: React.ReactNode; footer?: React.ReactNode }) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  title: '',
  content: null,
  footer: null,
  openModal: ({ title, content, footer }) => set({ isOpen: true, title, content, footer }),
  closeModal: () => set({ isOpen: false, title: '', content: null, footer: null }),
}));

