// LocalStorage 키
const STORAGE_KEY = 'portfolio_draft_data';

// 1. HTML 요소 가져오기
const photoInput = document.getElementById('photoInput');
const btnUpload = document.getElementById('btnUpload');
const btnResetPhoto = document.getElementById('btnResetPhoto');
const profilePreview = document.getElementById('profilePreview');

const nameInput = document.getElementById('name');
const jobInput = document.getElementById('job');
const introInput = document.getElementById('intro');

const projTitleInput = document.getElementById('projTitle');
const projPeriodInput = document.getElementById('projPeriod');
const projDescInput = document.getElementById('projDesc');

const certNameInput = document.getElementById('certName');
const certOrgInput = document.getElementById('certOrg');
const certDateInput = document.getElementById('certDate');

const stackInput = document.getElementById('stackInput');

const githubInput = document.getElementById('github');
const emailInput = document.getElementById('email');
const blogInput = document.getElementById('blog');

const themeText = document.getElementById('selected-theme-text');
const colorCircles = document.querySelectorAll('.color-circle');

// 현재 상태 변수
let currentPhoto = '';
let currentTheme = '';


// 2. LocalStorage에 데이터 자동 저장 함수
function autoSaveData() {
  const data = {
    photo: currentPhoto,
    name: nameInput.value,
    job: jobInput.value,
    intro: introInput.value,
    projTitle: projTitleInput.value,
    projPeriod: projPeriodInput.value,
    projDesc: projDescInput.value,
    certName: certNameInput.value,
    certOrg: certOrgInput.value,
    certDate: certDateInput.value,
    stack: stackInput.value,
    github: githubInput.value,
    email: emailInput.value,
    blog: blogInput.value,
    theme: currentTheme
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}


// 3. 페이지 접속 시 저장된 데이터 복원 함수
function loadSavedData() {
  const savedString = localStorage.getItem(STORAGE_KEY);
  if (!savedString) return;

  const data = JSON.parse(savedString);

  // 프로필 사진 복원
  if (data.photo) {
    currentPhoto = data.photo;
    profilePreview.innerHTML = `<img src="${data.photo}" alt="프로필">`;
  }

  // 텍스트 필드 복원
  nameInput.value = data.name || '';
  jobInput.value = data.job || '';
  introInput.value = data.intro || '';

  projTitleInput.value = data.projTitle || '';
  projPeriodInput.value = data.projPeriod || '';
  projDescInput.value = data.projDesc || '';

  certNameInput.value = data.certName || '';
  certOrgInput.value = data.certOrg || '';
  certDateInput.value = data.certDate || '';

  stackInput.value = data.stack || '';

  githubInput.value = data.github || '';
  emailInput.value = data.email || '';
  blogInput.value = data.blog || '';

  // 테마 복원
  if (data.theme) {
    applyThemeSelection(data.theme);
  }
}


// 4. 테마 선택 UI 적용 함수
function applyThemeSelection(themeName) {
  currentTheme = themeName;
  themeText.innerText = themeName;

  colorCircles.forEach(circle => {
    circle.classList.remove('active');
    circle.innerHTML = circle.classList.contains('custom') ? '+' : '';

    if (circle.dataset.theme === themeName) {
      circle.classList.add('active');
      circle.innerHTML = '✓';
    }
  });

  autoSaveData();
}

// 5. 프로필 사진 업로드 및 초기화 처리
btnUpload.addEventListener('click', () => {
  photoInput.click(); // 숨겨둔 file input 실행
});

photoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    currentPhoto = event.target.result;
    profilePreview.innerHTML = `<img src="${currentPhoto}" alt="프로필">`;
    autoSaveData();
  };
  reader.readAsDataURL(file);
});

btnResetPhoto.addEventListener('click', () => {
  currentPhoto = '';
  photoInput.value = '';
  profilePreview.innerHTML = '👤';
  autoSaveData();
});


// 6. 텍스트 입력 및 테마 이벤트 등록
const allInputs = [
  nameInput, jobInput, introInput,
  projTitleInput, projPeriodInput, projDescInput,
  certNameInput, certOrgInput, certDateInput,
  stackInput, githubInput, emailInput, blogInput
];

allInputs.forEach(input => {
  if (input) {
    input.addEventListener('input', autoSaveData);
  }
});

colorCircles.forEach(circle => {
  circle.addEventListener('click', () => {
    const selected = circle.dataset.theme;
    if (selected) {
      applyThemeSelection(selected);
    }
  });
});

const saveBtn = document.querySelector('.btn-save');
if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    autoSaveData();
    alert('현재 입력한 내용이 브라우저에 안전하게 저장되었습니다!');
  });
}

// 초기 실행
loadSavedData();