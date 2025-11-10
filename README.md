# Portfolio - 박민규

Vite + React 기반의 프론트엔드 포트폴리오 웹사이트

## 🚀 기술 스택

- **React** + **Vite** - 빠른 개발 환경
- **SCSS (CSS Modules)** - 모듈화된 스타일링
- **React Router DOM** - 페이지 라우팅
- **Recoil** - 상태 관리
- **Framer Motion** - 애니메이션
- **GSAP + ScrollTrigger** - 스크롤 인터랙션
- **Lenis** - 부드러운 스크롤
- **EmailJS** - Contact 폼 메일 전송
- **Three.js** - 3D 효과
- **React Icons** - 아이콘

## 📦 설치

```bash
npm install
```

## 🛠️ 개발 서버 실행

```bash
npm run dev
```

기본 포트: `http://localhost:3000`

## 🏗️ 빌드

```bash
npm run build
```

## 📂 폴더 구조

```
src/
 ├─ assets/           # 이미지, 폰트, Lottie JSON
 ├─ components/       # 버튼, 네비게이션, 카드, 공용 UI
 ├─ sections/         # Intro / Skills / Projects / Career / Contact
 ├─ hooks/            # IntersectionObserver, Scroll 등
 ├─ recoil/           # atoms, selectors
 ├─ styles/           # SCSS modules, variables.scss, mixins.scss
 ├─ App.jsx
 └─ main.jsx
```

## 🎨 디자인 컨셉

- **블랙 베이스** (#0E0E0E) + **레드 포인트** (#E63946)
- 감성적이고 기술적인 포트폴리오
- 반응형 디자인 (모바일 대응)

## 📝 섹션

1. **Intro** - 자기소개, GitHub, Resume 버튼
2. **Skills** - 태그 구름형 UI
3. **Projects** - 카드형 + 상세페이지 구조
4. **Career** - 타임라인 구조
5. **Contact** - EmailJS 연동 + 감성 마무리 문구

## 🚀 배포

Vercel 배포 가능한 상태로 설정되어 있습니다.

```bash
npm run build
```

빌드 후 `dist` 폴더를 Vercel에 배포하세요.
