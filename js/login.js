import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBQHt64OHC4B9D56Yjz2e9Tn-I0Bj2Q-o",
  authDomain: "ppolearning-917fd.firebaseapp.com",
  projectId: "ppolearning-917fd",
  storageBucket: "ppolearning-917fd.firebasestorage.app",
  messagingSenderId: "422627225597",
  appId: "1:422627225597:web:0d7c61fb2081a81498f394"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const messageEl = document.getElementById("message");

const btnLogin = document.getElementById("btn-login");
const btnSignup = document.getElementById("btn-signup");

// 1. 회원가입: 가입 후 로그아웃시키고 브라우저 팝업창(alert) 띄우기
if (btnSignup) {
  btnSignup.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) return showMessage("이메일과 비밀번호를 입력해주세요.");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Firebase 자동 로그인 상태 즉시 해제
      await signOut(auth);

      passwordInput.value = "";
      showMessage(""); // 하단 문구 초기화

      // 로그인 환료 팝업창
      alert("회원가입이 완료되었습니다!\n비밀번호를 입력하고 로그인해 주세요.");
      
    } catch (error) {
      handleAuthError(error.code);
    }
  });
}

// 2. 로그인: 사용자가 직접 로그인 버튼을 눌러 통과했을 때만 input.html로 이동
if (btnLogin) {
  btnLogin.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) return showMessage("이메일과 비밀번호를 입력해주세요.");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showMessage("");
      window.location.href = "myPage.html"; // 오직 여기서만 이동
    } catch (error) {
      handleAuthError(error.code);
    }
  });
}

function showMessage(text) {
  if (messageEl) messageEl.textContent = text;
}

function handleAuthError(code) {
  if (code === "auth/email-already-in-use") showMessage("이미 가입된 이메일입니다.");
  else if (code === "auth/weak-password") showMessage("비밀번호는 최소 6자 이상이어야 합니다.");
  else if (code === "auth/invalid-credential") showMessage("계정 정보가 일치하지 않습니다.");
  else showMessage(`오류 발생: ${code}`);
}