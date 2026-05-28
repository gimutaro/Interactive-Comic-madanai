export type LauncherTarget =
  | { type: 'aibot' }
  | {
      type: 'minigame';
      url: string;
      title: string;
      fullScreen: boolean;
    };

const launcherMap: Record<string, LauncherTarget> = {
  'p3-1': { type: 'aibot' },
  'p2-1': {
    type: 'minigame',
    url: '/mini-games/p2_koma1_email.html',
    title: 'Email',
    fullScreen: true,
  },
  'p4-5': {
    type: 'minigame',
    url: '/mini-games/p4_koma5_ufo.html',
    title: 'UFO Catcher',
    fullScreen: true,
  },
  'p6-4': {
    type: 'minigame',
    url: '/mini-games/p6_koma4_bubble.html',
    title: 'Interactive Bubbles',
    fullScreen: true,
  },
  'p7-5': {
    type: 'minigame',
    url: '/mini-games/p7_koma5_tetris.html',
    title: 'Tetris',
    fullScreen: true,
  },
  'p9-4': {
    type: 'minigame',
    url: '/mini-games/p9_koma4_shooting.html',
    title: 'Shooting',
    fullScreen: true,
  },
};

const launcherKey = (pageNum: number, komaNum: number) => `p${pageNum}-${komaNum}`;

export const getLauncherTarget = (
  pageNum: number,
  komaNum: number,
): LauncherTarget | null => launcherMap[launcherKey(pageNum, komaNum)] ?? null;

export const isLauncher = (pageNum: number, komaNum: number): boolean =>
  launcherKey(pageNum, komaNum) in launcherMap;
