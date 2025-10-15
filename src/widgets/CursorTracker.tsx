import { io, Socket } from 'socket.io-client';
import { useSnapshot } from 'valtio';

import { useEffect, useRef } from 'react';

import { cursorActions, cursorsStore } from '@entities/cursor';
import type { CursorData, UserId } from '@entities/cursor/types';
import { throttle } from '@entities/cursor/utils';

const SOCKET_URL = 'http://localhost:3000';

const sendCursor = throttle((socket: Socket | null, x: number, y: number) => {
  if (!socket) return;

  socket.emit('cursor:move', { x, y });
}, 50);

export default function IndexPage() {
  const socketRef = useRef<Socket>(null);

  const { map, userCount } = useSnapshot(cursorsStore);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on(
      'cursor:load-existing',
      (existingCursors: [UserId, CursorData][]) =>
        cursorActions.load(existingCursors)
    );

    // Обновление курсора другого пользователя
    socket.on(
      'cursor:update',
      ({ user, ...data }: CursorData & { user: UserId }) =>
        cursorActions.updateSingle(user, data)
    );

    // Удаление курсора при отключении пользователя
    socket.on('cursor:remove', (userId: string) =>
      cursorActions.remove(userId)
    );
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) =>
      sendCursor(socketRef.current, e.clientX, e.clientY);
    window.addEventListener('mousemove', handleMove);

    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="w-screen h-screen relative bg-gray-50 cursor-none">
      {/* Отображение курсоров других пользователей */}
      {map.map(([userId, cursor]) => (
        <div
          key={userId}
          className="absolute pointer-events-none z-50 transition-all duration-300 ease-out bg-amber-600 w-2 h-2 rounded-full"
          style={{
            left: `${cursor.x}px`,
            top: `${cursor.y}px`,
          }}></div>
      ))}

      {/* Информация внизу */}
      <div className="absolute bottom-4 left-4 text-gray-600 text-sm">
        🖱️ Онлайн-курсоры (Socket.IO) • Пользователей: {userCount + 1}
      </div>
    </div>
  );
}
