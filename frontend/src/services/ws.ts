import { io } from 'socket.io-client';

export default function(transports = ['websocket']) { // Creates app WebSocket socket instances
  return io(import.meta.env.VITE_API_URL, {
    transports,
    withCredentials: true,
    auth: {
      token: localStorage.getItem('token'),
    },
  });
}
