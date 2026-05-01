import { useChatStore } from "../store/chatStrore";

let socket = null;

const WS_URL = import.meta.env.VITE_WS_URL
export const connectWebSocket = (username) => {
  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log("✅ Connected");
    useChatStore.getState().setConnection(true);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      const {
        addMessage,
        addPrivateMessage,
        setUsers,
      } = useChatStore.getState();

      switch (data.type) {
        case "chat":
          addMessage(data);
          break;

        case "private":
          addPrivateMessage(data);
          break;

        case "users":
          setUsers(data.users);
          break;

        default:
          console.warn("Unknown type:", data.type);
      }
    } catch (err) {
      console.error("❌ Parse error:", err);
    }
  };

  socket.onclose = () => {
    console.log("❌ Disconnected");
    useChatStore.getState().setConnection(false);
  };
};

export const sendMessage = (data) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
};