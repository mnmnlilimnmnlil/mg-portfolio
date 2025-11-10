import { atom } from 'recoil';

// 현재 활성 섹션
export const activeSectionAtom = atom({
  key: 'activeSection',
  default: 'intro',
});

// 스크롤 위치
export const scrollPositionAtom = atom({
  key: 'scrollPosition',
  default: 0,
});

// 다크모드 (필요시)
export const darkModeAtom = atom({
  key: 'darkMode',
  default: true,
});

