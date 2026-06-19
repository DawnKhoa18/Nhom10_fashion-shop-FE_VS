const CHAT_SOCKET_URL = 'ws://localhost:8080/ws/chat';

export const createChatSocket = ({ role, userId, name, onEvent, onStatus }) => {
  let socket;
  let retryTimer;
  let closedByUser = false;

  const connect = () => {
    onStatus?.('connecting');
    socket = new WebSocket(CHAT_SOCKET_URL);

    socket.onopen = () => {
      onStatus?.('connected');
      socket.send(JSON.stringify({ type: 'JOIN', role, userId, name }));
    };

    socket.onmessage = (event) => {
      try {
        onEvent?.(JSON.parse(event.data));
      } catch (error) {
        console.error('Không đọc được tin nhắn chat:', error);
      }
    };

    socket.onerror = () => onStatus?.('error');
    socket.onclose = () => {
      onStatus?.('disconnected');
      if (!closedByUser) retryTimer = setTimeout(connect, 2500);
    };
  };

  connect();

  return {
    send(payload) {
      if (socket?.readyState !== WebSocket.OPEN) return false;
      socket.send(JSON.stringify(payload));
      return true;
    },
    close() {
      closedByUser = true;
      clearTimeout(retryTimer);
      socket?.close();
    }
  };
};
