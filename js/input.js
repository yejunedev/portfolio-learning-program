// LocalStorage 키 이름
const STORAGE_KEY = 'portfolio_draft_data';

// 1. 고정 요소 선택
const photoInput = document.getElementById('photoInput');
const btnUpload = document.getElementById('btnUpload');
const btnResetPhoto = document.getElementById('btnResetPhoto');
const profilePreview = document.getElementById('profilePreview');

const nameInput = document.getElementById('name');
const jobInput = document.getElementById('job');
const introInput = document.getElementById('intro');

const githubInput = document.getElementById('github');
const emailInput = document.getElementById('email');
const blogInput = document.getElementById('blog');

// 동적 컨테이너 및 추가 버튼
const projectContainer = document.getElementById('projectContainer');
const btnAddProject = document.getElementById('btnAddProject');

const certContainer = document.getElementById('certContainer');
const btnAddCert = document.getElementById('btnAddCert');

const tagList = document.getElementById('tagList');
const stackInput = document.getElementById('stackInput');
const stackCount = document.getElementById('stackCount');
const chipButtons = document.querySelectorAll('.chip-item');

const btnResetAll = document.getElementById('btnResetAll');

// 상태 데이터
let currentPhoto = '';
let currentTags = [];

// ==========================================
// 2. 동적 행 생성 및 라벨 관리
// ==========================================

function updateRowLabels(container, labelNames) {
  const firstRow = container.firstElementChild;
  if (!firstRow) return;
  firstRow.classList.add('has-labels');
  const fields = firstRow.querySelectorAll('.field');
  fields.forEach((field, idx) => {
    if (!field.querySelector('label')) {
      const label = document.createElement('label');
      label.innerText = labelNames[idx];
      field.insertBefore(label, field.firstChild);
    }
  });
}

// 프로젝트 빈칸 행 생성
function createProjectBox(data = { title: '', period: '', desc: '' }) {
  const isFirst = projectContainer.children.length === 0;
  const row = document.createElement('div');
  row.className = `dynamic-row ${isFirst ? 'has-labels' : ''}`;

  row.innerHTML = `
    <div class="field">
      ${isFirst ? '<label>프로젝트명</label>' : ''}
      <input type="text" class="proj-title" placeholder="프로젝트명" value="${data.title || ''}">
    </div>
    <div class="field">
      ${isFirst ? '<label>진행기간</label>' : ''}
      <input type="text" class="proj-period" placeholder="YYYY.MM - YYYY.MM" value="${data.period || ''}">
    </div>
    <div class="field">
      ${isFirst ? '<label>설명 및 핵심 성과</label>' : ''}
      <input type="text" class="proj-desc" placeholder="역할과 성과 요약" value="${data.desc || ''}">
    </div>
    <button type="button" class="btn-row-del" title="삭제">✕</button>
  `;

  row.querySelector('.btn-row-del').addEventListener('click', () => {
    row.remove();
    if (projectContainer.children.length > 0) {
      updateRowLabels(projectContainer, ['프로젝트명', '진행기간', '설명 및 핵심 성과']);
    }
    autoSaveData();
  });

  row.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', autoSaveData);
  });

  projectContainer.appendChild(row);
}

// 자격증 빈칸 행 생성
function createCertBox(data = { name: '', org: '', date: '' }) {
  const isFirst = certContainer.children.length === 0;
  const row = document.createElement('div');
  row.className = `dynamic-row ${isFirst ? 'has-labels' : ''}`;

  row.innerHTML = `
    <div class="field">
      ${isFirst ? '<label>활동/자격증명</label>' : ''}
      <input type="text" class="cert-name" placeholder="예: 정보처리기사" value="${data.name || ''}">
    </div>
    <div class="field">
      ${isFirst ? '<label>발행처 / 주관사</label>' : ''}
      <input type="text" class="cert-org" placeholder="예: 한국산업인력공단" value="${data.org || ''}">
    </div>
    <div class="field">
      ${isFirst ? '<label>취득연월</label>' : ''}
      <input type="text" class="cert-date" placeholder="YYYY.MM" value="${data.date || ''}">
    </div>
    <button type="button" class="btn-row-del" title="삭제">✕</button>
  `;

  row.querySelector('.btn-row-del').addEventListener('click', () => {
    row.remove();
    if (certContainer.children.length > 0) {
      updateRowLabels(certContainer, ['활동/자격증명', '발행처 / 주관사', '취득연월']);
    }
    autoSaveData();
  });

  row.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', autoSaveData);
  });

  certContainer.appendChild(row);
}

// ==========================================
// 3. 기술 스택 태그 UI 제어
// ==========================================

function renderTags() {
  tagList.innerHTML = '';
  currentTags.forEach((tag, idx) => {
    const badge = document.createElement('span');
    badge.className = 'tag-badge';
    badge.innerHTML = `
      ${tag}
      <button type="button" class="btn-tag-del" data-idx="${idx}">✕</button>
    `;
    tagList.appendChild(badge);
  });

  stackCount.innerText = `${currentTags.length}개 등록됨`;

  tagList.querySelectorAll('.btn-tag-del').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = e.target.dataset.idx;
      currentTags.splice(idx, 1);
      renderTags();
      autoSaveData();
    });
  });
}

function addTag(text) {
  const cleanText = text.replace(/^[+]/, '').trim();
  if (!cleanText) return;
  if (currentTags.includes(cleanText)) {
    alert('이미 등록된 기술 스택입니다.');
    return;
  }
  currentTags.push(cleanText);
  renderTags();
  autoSaveData();
}

// ==========================================
// 4. LocalStorage 자동 저장 & 복원
// ==========================================

function autoSaveData() {
  const projects = [];
  projectContainer.querySelectorAll('.dynamic-row').forEach(row => {
    projects.push({
      title: row.querySelector('.proj-title').value,
      period: row.querySelector('.proj-period').value,
      desc: row.querySelector('.proj-desc').value
    });
  });

  const certs = [];
  certContainer.querySelectorAll('.dynamic-row').forEach(row => {
    certs.push({
      name: row.querySelector('.cert-name').value,
      org: row.querySelector('.cert-org').value,
      date: row.querySelector('.cert-date').value
    });
  });

  const data = {
    photo: currentPhoto,
    name: nameInput.value,
    job: jobInput.value,
    intro: introInput.value,
    projects: projects,
    certs: certs,
    tags: currentTags,
    github: githubInput.value,
    email: emailInput.value,
    blog: blogInput.value
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadSavedData() {
  const savedString = localStorage.getItem(STORAGE_KEY);
  if (!savedString) {
    createProjectBox();
    createCertBox();
    return;
  }

  const data = JSON.parse(savedString);

  if (data.photo) {
    currentPhoto = data.photo;
    profilePreview.innerHTML = `<img src="${data.photo}" alt="프로필">`;
  }
  nameInput.value = data.name || '';
  jobInput.value = data.job || '';
  introInput.value = data.intro || '';

  projectContainer.innerHTML = '';
  if (data.projects && data.projects.length > 0) {
    data.projects.forEach(proj => createProjectBox(proj));
  } else {
    createProjectBox();
  }

  certContainer.innerHTML = '';
  if (data.certs && data.certs.length > 0) {
    data.certs.forEach(cert => createCertBox(cert));
  } else {
    createCertBox();
  }

  currentTags = data.tags || [];
  renderTags();

  githubInput.value = data.github || '';
  emailInput.value = data.email || '';
  blogInput.value = data.blog || '';
}

// ==========================================
// 5. 이벤트 바인딩
// ==========================================

btnAddProject.addEventListener('click', () => {
  createProjectBox();
  autoSaveData();
});

btnAddCert.addEventListener('click', () => {
  createCertBox();
  autoSaveData();
});

stackInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTag(stackInput.value);
    stackInput.value = '';
  }
});

chipButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    addTag(btn.innerText);
  });
});

btnUpload.addEventListener('click', () => photoInput.click());
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

[nameInput, jobInput, introInput, githubInput, emailInput, blogInput].forEach(input => {
  input.addEventListener('input', autoSaveData);
});

const saveBtn = document.querySelector('.btn-save');
if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    autoSaveData();
    alert('모든 입력 내용이 브라우저에 임시 저장되었습니다!');
  });
}

if (btnResetAll) {
  btnResetAll.addEventListener('click', () => {
    const isConfirm = confirm('작성 중인 모든 내용이 삭제되고 초기화됩니다. 계속하시겠습니까?');
    if (isConfirm) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  });
}

// 최초 실행
loadSavedData();