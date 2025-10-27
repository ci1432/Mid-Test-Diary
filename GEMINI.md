# 프로젝트: 날짜별 일기 앱 (Next.js & Firebase)

# 모델 지시사항

당신은 Next.js, Firebase, Shadcn/UI에 매우 능숙한 전문 풀스택 개발자입니다. 사용자의 요청에 따라 날짜별로 일기를 작성하고 관리할 수 있는 웹 애플리케이션의 전체 코드베이스를 생성해야 합니다.

---

## 1. 핵심 기술 스택

* **프레임워크:** **Next.js 14+** (App Router 사용)
* **스타일링:** **Tailwind CSS**
* **UI 라이브러리:** **Shadcn/UI**
* **백엔드 (DB 및 인증):** **Firebase** (Firestore Database, Firebase Authentication)

---

## 2. 프론트엔드 및 UI 요구사항

1.  **Next.js App Router:** `app/` 디렉토리 기반의 라우팅 구조를 사용합니다.
2.  **Tailwind CSS 설정:** `tailwind.config.ts` 및 `globals.css` 파일에 Tailwind CSS 설정을 완료해야 합니다.
3.  **Shadcn/UI 통합:**
    * Shadcn/UI를 프로젝트에 설치하고 초기 설정을 완료합니다.
    * `app/layout.tsx`에 `ThemeProvider`를 설정하여 **라이트/다크 모드**를 지원해야 합니다.
    * 핵심 컴포넌트로 **`Calendar`**, **`Textarea`**, **`Button`**, **`Card`**를 적극 활용합니다.
    * `lib/utils.ts` 파일 (Shadcn/UI의 `cn` 헬퍼 함수 포함)을 생성합니다.
    * **[추가] 핵심 컴포넌트(`Calendar`, `Textarea` 등)를 설치할 때, `npx`가 확인 질문을 하지 않도록 반드시 `npx --yes` 플래그를 사용해야 합니다.**
    * **[수정] 예시:** `npx --yes shadcn-ui@latest add calendar -y`

---

## 3. 백엔드 및 데이터베이스 요구사항

1.  **Firebase 설정:**
    * `lib/firebase.ts` 파일을 생성하여 Firebase SDK (v9+ 모듈식)를 초기화합니다. `getAuth`와 `getFirestore`를 export 해야 합니다.
    * Firebase 설정값(API 키 등)은 `.env.local` 파일을 통해 환경 변수로 관리해야 합니다.
    * `.gitignore` 파일에 `.env.local`이 반드시 포함되어야 합니다.
2.  **Firebase Authentication (인증):**
    * 이메일/비밀번호 또는 구글 소셜 로그인을 사용한 회원가입 및 로그인 기능을 구현합니다.
    * 로그인한 사용자만 일기장 기능에 접근할 수 있도록 미들웨어나 레이아웃을 통해 라우트를 보호합니다.
3.  **Firestore Database (데이터베이스):**
    * `diaries`라는 이름의 컬렉션을 사용합니다.
    * **문서 구조:** 각 문서는 `userId` (작성자 UID), `date` (일기 날짜, "YYYY-MM-DD" 형식의 문자열 권장), `content` (일기 내용) 필드를 가져야 합니다.
    * Firestore 보안 규칙(Security Rules)을 설정하여, 사용자는 자신의 `userId`와 일치하는 문서만 읽고 쓸 수 있도록 제한해야 합니다 (예시 규칙 포함 권장).

---

## 4. 애플리케이션 핵심 기능

1.  **인증 페이지 (`app/page.tsx` 또는 `app/login/page.tsx`):**
    * 앱의 메인 페이지는 로그인 여부를 확인합니다.
    * 로그인되지 않은 사용자는 로그인/회원가입 폼(`AuthComponent`)을 보게 됩니다.
    * 로그인된 사용자는 자동으로 `/dashboard` 페이지로 리디렉션됩니다.
2.  **대시보드 페이지 (`app/dashboard/page.tsx`):**
    * 이 페이지는 `"use client"`로 설정되어야 합니다.
    * **왼쪽 패널:** Shadcn/UI의 `Calendar` 컴포넌트를 표시합니다.
    * **오른쪽 패널:** `DiaryEditor` 컴포넌트를 표시합니다.
    * `Calendar`에서 날짜를 선택하면(state로 관리), `DiaryEditor`가 해당 날짜의 일기를 Firestore에서 불러오거나 새로 작성할 수 있도록 상태가 변경되어야 합니다.
3.  **일기 에디터 컴포넌트 (`components/DiaryEditor.tsx`):**
    * `"use client"` 컴포넌트입니다.
    * 선택된 날짜(props로 전달받음)를 표시합니다.
    * Shadcn/UI의 `Textarea`를 사용하여 일기 내용을 입력받습니다.
    * '저장' `Button`을 누르면, 현재 사용자의 `uid`와 선택된 `date`를 기준으로 Firestore에 문서를 생성(Create)하거나 덮어씁니다(Update/Set).
    * 데이터 저장/로딩 중에는 버튼이 비활성화되거나 로딩 스피너를 표시합니다.

---

## 5. 생성할 주요 파일 구조