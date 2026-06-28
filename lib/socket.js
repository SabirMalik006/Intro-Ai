let socket = null;

export function getSocket() {
  return socket;
}

export async function connectSocket() {
  if (socket?.connected) return socket;

  const { io } = await import('socket.io-client');

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
    withCredentials: true,
    transports: ['websocket', 'polling'],
  });

  return new Promise((resolve) => {
    socket.on('connect', () => resolve(socket));
    socket.on('connect_error', () => resolve(socket));
    setTimeout(() => resolve(socket), 3000);
  });
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
