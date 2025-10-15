import { io, Socket } from 'socket.io-client';

import { useEffect, useRef } from 'react';

import {
  cursors,
  cursorsToArray,
  loadCursors,
  removeCursor,
  updateCursor,
} from '@entities/cursor';
import type { CursorData, UserId } from '@entities/cursor/types';
import { throttle } from '@entities/cursor/utils';

const SOCKET_URL = 'http://localhost:3000';

export default function IndexPage() {
  const socketRef = useRef<Socket>(null);

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
        loadCursors(new Map(existingCursors))
    );

    // Обновление курсора другого пользователя
    socket.on(
      'cursor:update',
      ({ user, ...data }: CursorData & { user: UserId }) =>
        updateCursor(user, data)
    );

    // Удаление курсора при отключении пользователя
    socket.on('cursor:remove', (userId: string) => removeCursor(userId));
  }, []);

  useEffect(() => {
    const sendCursor = throttle((x: number, y: number) => {
      console.log(`Cursor moved {x: ${x}; y: ${y}}`);
      socketRef.current?.emit('cursor:move', {
        x,
        y,
      });
    }, 50);
    const handleMove = (e: MouseEvent) => sendCursor(e.clientX, e.clientY);
    window.addEventListener('mousemove', handleMove);

    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="w-screen h-screen relative bg-gray-50 cursor-none">
      {/* Отображение курсоров других пользователей */}
      {cursorsToArray().map(([userId, cursor]) => (
        <div
          key={userId}
          className="absolute pointer-events-none z-50"
          style={{
            left: `${cursor.x}px`,
            top: `${cursor.y}px`,
            transform: 'translate(-6px, -12px)',
          }}>
          {/* Стрелка курсора */}
          <div className="w-2 h-2 border-l-6 border-r-6 border-b-12 bg-amber-500" />
          {/* Метка пользователя */}
          {/* <div
            className="absolute top-3 left-2 text-xs text-white px-2 py-1 rounded whitespace-nowrap"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}>
            {cursor.user}
          </div> */}
        </div>
      ))}

      {/* Список онлайн пользователей */}
      <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-50">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Онлайн пользователи ({cursorsToArray().length})
        </h3>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {cursorsToArray().map(([userId]) => (
            <div key={userId} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full" />
              <span className="text-gray-700">{userId}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Информация внизу */}
      <div className="absolute bottom-4 left-4 text-gray-600 text-sm">
        🖱️ Онлайн-курсоры (Socket.IO) • Пользователей:{' '}
        {Object.keys(cursors).length + 1}
      </div>
    </div>
  );
}
