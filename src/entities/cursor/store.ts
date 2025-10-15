import { proxy } from 'valtio';

import type { CursorData, UserId } from './types';

type CursorStore = {
  map: Map<UserId, CursorData>;
};

export const cursors = proxy<CursorStore>({ map: new Map([]) });

export const loadCursors = (map: CursorStore['map']) => (cursors.map = map);
export const updateCursor = (id: UserId, data: CursorData) =>
  cursors.map.set(id, data);
export const removeCursor = (id: UserId) => cursors.map.delete(id);
export const cursorsToArray = () => Array.from(cursors.map);
