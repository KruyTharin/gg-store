import { create } from 'zustand';

interface Action {
  onShow: (data: State) => void;
  onClose: () => void;
  _onAccept: () => void;
}

interface State {
  text: string;
  isOpen?: boolean;
  onAccept?: () => void;
}

export const useDeleteAlertStore = create<State & Action>((set, get) => ({
  isOpen: false,
  text: '',
  onAccept: undefined,

  onClose: () => set({ isOpen: false, onAccept: undefined }),
  onShow: (data) =>
    set({
      isOpen: true,
      text: data.text,
      onAccept: data.onAccept,
    }),

  _onAccept: () => {
    const onAcceptCallback = get().onAccept;
    if (onAcceptCallback !== undefined) {
      onAcceptCallback();
    }
    get().onClose();
  },
}));
