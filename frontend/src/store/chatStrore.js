import { create } from "zustand";

export const useChatStore = create((set) => ({
  user: null,
  isConnected: false,
  onlineUsers: [],

  selectedUser: null,

  messages: {
    global: [],
    private: {},
  },

  // 🔹 Set user
  setUser: (username) => set({ user: username }),

  setConnection: (status) => set({ isConnected: status }),

  setUsers: (users) => set({ onlineUsers: users }),

  setSelectedUser: (user) => set({ selectedUser: user }),

  // 🔹 Global message
  addMessage: (msg) =>
    set((state) => ({
      messages: {
        ...state.messages,
        global: [...state.messages.global, msg],
      },
    })),

  // 🔹 Private message
addPrivateMessage: (msg) =>
  set((state) => {
    const currentUser = state.user;

    // identify correct chat partner
    const chatUser =
      msg.from === currentUser ? msg.to_user : msg.from;

    const prevMsgs = state.messages.private[chatUser] || [];

    return {
      messages: {
        ...state.messages,
        private: {
          ...state.messages.private,
          [chatUser]: [...prevMsgs, msg],
        },
      },
    };
  }),
}));