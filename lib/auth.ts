// --- (1/3) 필요한 Firebase auth 함수들을 import 합니다 ---
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  setPersistence, 
  browserSessionPersistence, 
  browserLocalPersistence,
  AuthError
} from "firebase/auth";
import { auth } from './firebase'; // lib/firebase.ts에서 auth를 가져옵니다

// --- (2/3) signIn 함수가 3번째 인자(autoLogin)를 받도록 수정 ---
export async function signIn(email: string, password: string, autoLogin: boolean) {
  try {
    // autoLogin 값에 따라 지속성 설정
    // true (체크됨)  -> browserLocalPersistence (탭 닫아도 유지)
    // false (체크안됨) -> browserSessionPersistence (탭 닫으면 로그아웃)
    const persistence = autoLogin ? browserLocalPersistence : browserSessionPersistence;
    
    // signInWithEmailAndPassword 호출 *전에* 지속성을 설정합니다.
    await setPersistence(auth, persistence);
    
    // 로그인 실행
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
    
  } catch (error) {
    return { user: null, error: error as AuthError };
  }
}

// --- (3/3) signUp 함수 (수정 없음) ---
export async function signUp(email: string, password: string) {
  try {
    // 회원가입 시에는 기본 지속성(local)을 따릅니다.
    // (회원가입 후 바로 로그인되므로)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error as AuthError };
  }
}

// 로그아웃 함수 (필요시 사용)
// import { signOut } from "firebase/auth";
// export async function logOut() {
//   try {
//     await signOut(auth);
    
//     return { success: true, error: null };
//   } catch (error) {
//     return { success: false, error: error as AuthError };
//   }
// }