1. 프로젝트 제목: 날짜별 일기 앱 (My Diary App)

Next.js(App Router), Tailwind CSS, Shadcn/UI를 기반으로 구축한 개인 일기장 웹 애플리케이션입니다. Firebase Authentication을 통한 사용자 인증과 Firestore Database를 사용한 데이터 저장을 구현하여, 사용자가 날짜별로 자신의 일기를 안전하게 작성하고 관리할 수 있습니다.

2. 주요 기능 소개

사용자 인증: Firebase를 이용한 이메일/비밀번호 기반 회원가입 및 로그인.

로그인 세션 관리: '자동 로그인' 체크박스 기능.

체크 시: 브라우저를 닫아도 로그인이 유지됩니다 (local persistence).

체크 해제 시: 브라우저 탭을 닫으면 자동으로 로그아웃됩니다 (session persistence).

캘린더 연동: Shadcn/UI의 캘린더 컴포넌트를 통해 날짜를 선택할 수 있습니다.

일기 CRUD:

선택한 날짜의 일기를 작성, 저장, 수정할 수 있습니다.

작성된 일기는 Firestore에 users/{userId}/diaries/{YYYY-MM-DD} 경로로 안전하게 저장됩니다.

날짜를 다시 클릭하면 저장된 일기를 자동으로 불러옵니다.

테마 변경: 라이트(Light) / 다크(Dark) / 시스템(System) 3가지 모드를 지원하는 테마 토글 버튼을 구현했습니다.

3. 설치 및 실행 방법

1. Firebase 설정

Firebase Console에서 새 프로젝트를 생성합니다.

프로젝트 내에서 Authentication을 활성화하고 '이메일/비밀번호' 로그인 공급자를 사용 설정합니다.

Firestore Database를 활성화합니다. (테스트 모드 또는 아래 보안 규칙 적용)

프로젝트 설정 > 내 앱에서 '웹 앱'(</>)을 등록하고 firebaseConfig 객체 값을 복사합니다.

2. 로컬에 설치

# 1. 이 저장소를 로컬에 복제(Clone)합니다.
# (아래 URL은 본인의 GitHub 저장소 주소로 변경하세요)
git clone https://github.com/ci1432/my-diary-app.git

# 2. 방금 복제한 폴더로 이동합니다.
cd my-diary-app


3. .env.local 파일 생성

프로젝트 루트에 .env.local 파일을 만들고, 1-4에서 복사한 Firebase 키를 아래 형식으로 붙여넣습니다. (이 파일은 .gitignore에 의해 GitHub에 올라가지 않습니다.)

.env.local.example (이 내용을 복사해서 .env.local 파일을 만드세요)

NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=1:...:web:...


4. Firestore 보안 규칙 설정

Firestore의 '규칙'(Rules) 탭에서, 로그인한 사용자가 본인의 일기만 읽고 쓸 수 있도록 다음 규칙을 붙여넣고 '게시'합니다.

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      match /diaries/{diaryId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}


5. 실행

# 1. 필요한 npm 패키지를 설치합니다.
npm install

# 2. 개발 서버를 실행합니다.
npm run dev


브라우저에서 http://localhost:3000으로 접속합니다.

4. 기술 스택

프레임워크: Next.js 14+ (App Router)

언어: TypeScript

백엔드 (BaaS): Firebase

Database: Firestore

Authentication: Firebase Auth

UI 라이브러리: Shadcn/UI

스타일링: Tailwind CSS

테마 관리: next-themes

상태 관리: React Hooks (useState, useEffect)

5. 스크린샷

(프로젝트 루트에 screenshots 폴더를 만드신 후, 캡처한 이미지를 login.png, dashboard-light.png 등의 이름으로 저장하세요. 아래 코드는 해당 이미지들을 GitHub에 올렸을 때 표시하는 예시입니다.)

로그인 페이지 (자동 로그인 기능 포함)

메인 대시보드 (라이트 모드)

메인 대시보드 (다크 모드)

6. 개발 과정에서의 AI 활용 방법

본 프로젝트는 Google Gemini (특히 Gemini CLI)를 활용하여 초기 기획부터 상세 기능 구현, 디버깅까지 전 과정에 걸쳐 AI의 도움을 받아 개발되었습니다.

1) Gemini CLI를 통한 프로젝트 초기 구축

gemini.md (설계도 작성): 프로젝트의 목표, 사용할 기술 스택(Next.js, Firebase, Shadcn/UI), 필요한 파일 구조(컴포넌트, lib 파일 등)를 gemini.md 파일에 명세했습니다.

gemini init / gemini generate (코드 생성): Gemini CLI가 gemini.md 파일을 읽어 프로젝트의 기본 골격 코드(Boilerplate)와 AuthComponent, DiaryEditor 등의 초기 컴포넌트 파일을 자동으로 생성했습니다.

2) Gemini 채팅을 통한 기능 구현 및 디버깅

Gemini CLI로 생성된 코드를 기반으로, Gemini 채팅 인터페이스를 통해 다음과 같은 복잡한 문제를 해결하고 기능을 추가했습니다.

초기 설정 디버깅:

autoprefixer 누락, border-border 클래스 인식 불가 등 Tailwind CSS 및 Shadcn/UI의 초기 설정 오류를 AI의 진단으로 해결했습니다.

node_modules 및 .next 캐시 문제 등 복잡한 의존성 문제를 해결했습니다.

핵심 기능 구현:

자동 로그인: Firebase의 setPersistence를 local과 session으로 동적 변경하는 기능을 구현했습니다.

다크 모드: next-themes 패키지를 설치하고, ThemeProvider와 ThemeToggle 버튼을 단계별로 생성하여 적용했습니다.

Firestore 연동: users/{userId}/diaries/{dateId}라는 안전한 Firestore 경로 구조를 설계하고, Firebase 보안 규칙을 작성했습니다.

치명적인 런타임 버그 해결:

시간대(Timezone) 버그: 사용자가 선택한 날짜(KST)와 toISOString()(UTC) 간의 차이로 날짜가 하루 전으로 표시되는 문제를, formatDate 함수를 새로 작성하여 해결했습니다.

CSS 우선순위 버그: "이번 달이 아닌" 토/일요일 색상이 잘못 표시되는 문제를, :not(.text-muted-foreground) 및 CSS 재정의를 사용하여 해결했습니다.

하이드레이션(Hydration) 오류: 서버/클라이언트 렌더링 불일치 문제를 .next 캐시 삭제 및 서버 재시작으로 해결했습니다.