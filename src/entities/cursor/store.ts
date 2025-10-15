import { derive } from 'derive-valtio';
import { proxyMap } from 'valtio/utils';

import type { CursorData, UserId } from './types';

type CursorStore = {
  map: [UserId, CursorData][];
  count: number;
};

const cursors = proxyMap<UserId, CursorData>([]);
export const cursorActions = {
  load: (map: CursorStore['map']) => {
    cursors.clear();
    map.forEach(([key, value]) => {
      cursors.set(key, value);
    });
  },
  updateSingle: (id: UserId, data: CursorData) => cursors.set(id, data),
  remove: (id: UserId) => cursors.delete(id),
};

export const cursorsStore = derive({
  userCount: (get) => get(cursors).size,
  map: (get) => Array.from(get(cursors).entries()),
});
