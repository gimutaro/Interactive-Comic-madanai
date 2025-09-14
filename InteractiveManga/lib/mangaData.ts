export interface Panel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  image: string;
  type: 'cover' | 'panel';
}

export interface Page {
  id: string;
  panels: Panel[];
}

export const mangaPages: Page[] = [
  {
    id: 'cover',
    panels: [
      { id: 'cover_front', x: 0, y: 0, width: 800, height: 1200, image: '/images/cover_front.png', type: 'cover' }
    ]
  },
  {
    id: 'page1',
    panels: [
      { id: 'p1_koma1', x: 30, y: 20, width: 340, height: 380, image: '/images/p1_koma1.png', type: 'panel' },
      { id: 'p1_koma2', x: 430, y: 20, width: 340, height: 380, image: '/images/p1_koma2.png', type: 'panel' },
      { id: 'p1_koma3', x: 30, y: 420, width: 740, height: 760, image: '/images/p1_koma3.png', type: 'panel' }
    ]
  },
  {
    id: 'page2',
    panels: [
      { id: 'p2_koma1', x: 30, y: 20, width: 340, height: 280, image: '/images/p2_koma1.png', type: 'panel' },
      { id: 'p2_koma2', x: 430, y: 20, width: 340, height: 280, image: '/images/p2_koma2.png', type: 'panel' },
      { id: 'p2_koma3', x: 30, y: 320, width: 340, height: 280, image: '/images/p2_koma3.png', type: 'panel' },
      { id: 'p2_koma4', x: 430, y: 320, width: 340, height: 280, image: '/images/p2_koma4.png', type: 'panel' },
      { id: 'p2_koma5', x: 30, y: 620, width: 340, height: 560, image: '/images/p2_koma5.png', type: 'panel' },
      { id: 'p2_koma6', x: 430, y: 620, width: 340, height: 560, image: '/images/p2_koma6.png', type: 'panel' }
    ]
  },
  {
    id: 'page3',
    panels: [
      { id: 'p3_koma1', x: 30, y: 20, width: 740, height: 580, image: '/images/p3_koma1.png', type: 'panel' },
      { id: 'p3_koma2', x: 30, y: 620, width: 740, height: 560, image: '/images/p3_koma2.png', type: 'panel' }
    ]
  },
  {
    id: 'page4',
    panels: [
      { id: 'p4_koma1', x: 30, y: 20, width: 340, height: 380, image: '/images/p4_koma1.png', type: 'panel' },
      { id: 'p4_koma2', x: 430, y: 20, width: 340, height: 380, image: '/images/p4_koma2.png', type: 'panel' },
      { id: 'p4_koma3', x: 30, y: 420, width: 340, height: 180, image: '/images/p4_koma3.png', type: 'panel' },
      { id: 'p4_koma4', x: 430, y: 420, width: 340, height: 180, image: '/images/p4_koma4.png', type: 'panel' },
      { id: 'p4_koma5', x: 30, y: 620, width: 740, height: 560, image: '/images/p4_koma5.png', type: 'panel' }
    ]
  },
  {
    id: 'page5',
    panels: [
      { id: 'p5_koma1', x: 30, y: 20, width: 340, height: 380, image: '/images/p5_koma1.png', type: 'panel' },
      { id: 'p5_koma2', x: 430, y: 20, width: 340, height: 380, image: '/images/p5_koma2.png', type: 'panel' },
      { id: 'p5_koma3', x: 30, y: 420, width: 740, height: 180, image: '/images/p5_koma3.png', type: 'panel' },
      { id: 'p5_koma4', x: 30, y: 620, width: 340, height: 560, image: '/images/p5_koma4.png', type: 'panel' },
      { id: 'p5_koma5', x: 430, y: 620, width: 340, height: 560, image: '/images/p5_koma5.png', type: 'panel' }
    ]
  },
  {
    id: 'page6',
    panels: [
      { id: 'p6_koma1', x: 30, y: 20, width: 340, height: 280, image: '/images/p6_koma1.png', type: 'panel' },
      { id: 'p6_koma2', x: 430, y: 20, width: 340, height: 280, image: '/images/p6_koma2.png', type: 'panel' },
      { id: 'p6_koma3', x: 30, y: 320, width: 340, height: 280, image: '/images/p6_koma3.png', type: 'panel' },
      { id: 'p6_koma4', x: 430, y: 320, width: 340, height: 280, image: '/images/p6_koma4.png', type: 'panel' },
      { id: 'p6_koma5', x: 30, y: 620, width: 340, height: 560, image: '/images/p6_koma5.png', type: 'panel' },
      { id: 'p6_koma6', x: 430, y: 620, width: 340, height: 560, image: '/images/p6_koma6.png', type: 'panel' }
    ]
  },
  {
    id: 'page7',
    panels: [
      { id: 'p7_koma1', x: 30, y: 20, width: 740, height: 380, image: '/images/p7_koma1.png', type: 'panel' },
      { id: 'p7_koma2', x: 30, y: 420, width: 340, height: 380, image: '/images/p7_koma2.png', type: 'panel' },
      { id: 'p7_koma3', x: 430, y: 420, width: 340, height: 380, image: '/images/p7_koma3.png', type: 'panel' },
      { id: 'p7_koma4', x: 30, y: 820, width: 340, height: 360, image: '/images/p7_koma4.png', type: 'panel' },
      { id: 'p7_koma5', x: 430, y: 820, width: 340, height: 360, image: '/images/p7_koma5.png', type: 'panel' }
    ]
  },
  {
    id: 'page8',
    panels: [
      { id: 'p8_koma1', x: 30, y: 20, width: 340, height: 380, image: '/images/p8_koma1.png', type: 'panel' },
      { id: 'p8_koma2', x: 430, y: 20, width: 340, height: 380, image: '/images/p8_koma2.png', type: 'panel' },
      { id: 'p8_koma3', x: 30, y: 420, width: 340, height: 380, image: '/images/p8_koma3.png', type: 'panel' },
      { id: 'p8_koma4', x: 430, y: 420, width: 340, height: 380, image: '/images/p8_koma4.png', type: 'panel' },
      { id: 'p8_koma5', x: 30, y: 820, width: 740, height: 360, image: '/images/p8_koma5.png', type: 'panel' }
    ]
  },
  {
    id: 'page9',
    panels: [
      { id: 'p9_koma1', x: 30, y: 20, width: 340, height: 280, image: '/images/p9_koma1.png', type: 'panel' },
      { id: 'p9_koma2', x: 430, y: 20, width: 340, height: 280, image: '/images/p9_koma2.png', type: 'panel' },
      { id: 'p9_koma3', x: 30, y: 320, width: 340, height: 280, image: '/images/p9_koma3.png', type: 'panel' },
      { id: 'p9_koma4', x: 430, y: 320, width: 340, height: 280, image: '/images/p9_koma4.png', type: 'panel' },
      { id: 'p9_koma5', x: 30, y: 620, width: 340, height: 560, image: '/images/p9_koma5.png', type: 'panel' },
      { id: 'p9_koma6', x: 430, y: 620, width: 340, height: 560, image: '/images/p9_koma6.png', type: 'panel' }
    ]
  }
];