import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 본인의 Firebase 프로젝트 설정 키
const firebaseConfig = {
    apiKey: "AIzaSyBBQHt64OHC4B9D56Yjz2e9Tn-I0Bj2Q-o",
    authDomain: "ppolearning-917fd.firebaseapp.com",
    projectId: "ppolearning-917fd",
    storageBucket: "ppolearning-917fd.firebasestorage.app",
    messagingSenderId: "422627225597",
    appId: "1:422627225597:web:0d7c61fb2081a81498f394"
  };

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// DOM 요소 참조
const authSection = document.getElementById("auth-section");
const dashboardSection = document.getElementById("dashboard-section");
const userEmailSpan = document.getElementById("user-email");
const userNameSpan = document.getElementById("user-name");
const userPhotoImg = document.getElementById("user-photo");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const messageEl = document.getElementById("message");

const btnGoogle = document.getElementById("btn-google");
const btnLogin = document.getElementById("btn-login");
const btnSignup = document.getElementById("btn-signup");
const btnLogout = document.getElementById("btn-logout");

// 1. 구글 팝업 로그인
btnGoogle.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    showMessage("");
  } catch (error) {
    if (error.code !== "auth/popup-closed-by-user") {
      showMessage(`구글 로그인 실패: ${error.message}`);
    }
  }
});

// 2. 이메일 회원가입
btnSignup.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email || !password) return showMessage("이메일과 비밀번호를 입력해주세요.");

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    showMessage("");
  } catch (error) {
    handleAuthError(error.code);
  }
});

// 3. 이메일 로그인
btnLogin.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email || !password) return showMessage("이메일과 비밀번호를 입력해주세요.");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showMessage("");
  } catch (error) {
    handleAuthError(error.code);
  }
});

// 4. 로그아웃
btnLogout.addEventListener("click", async () => {
  await signOut(auth);
  emailInput.value = "";
  passwordInput.value = "";
  showMessage("");
});

// 5. 로그인 상태 실시간 감지 (로그인 성공 시 input.html로 자동 이동)
onAuthStateChanged(auth, (user) => {
  if (user) {
    // 로그인에 성공했거나 이미 로그인된 상태라면 바로 input.html로 보내짐
    console.log("로그인 성공:", user.email);
    window.location.href = "input.html";
  } else {
    // 로그아웃 상태일 때는 그대로 login.html 화면을 유지합니다.
    if (authSection) authSection.classList.remove("hidden");
  }
});

// 에러 메시지 처리 함수
function showMessage(text) {
  messageEl.textContent = text;
}

function handleAuthError(code) {
  if (code === "auth/email-already-in-use") showMessage("이미 가입된 이메일입니다.");
  else if (code === "auth/weak-password") showMessage("비밀번호는 최소 6자 이상이어야 합니다.");
  else if (code === "auth/invalid-credential") showMessage("계정 정보가 일치하지 않습니다.");
  else showMessage(`오류 발생: ${code}`);
}