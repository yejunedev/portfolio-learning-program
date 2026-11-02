document.addEventListener("DOMContentLoaded", () => {
  renderMyPageCards();
});

function renderMyPageCards() {
  const emptyCards = document.querySelectorAll(".project-grid .empty-card");
  const savedProjects = JSON.parse(localStorage.getItem("myProjects")) || [];

  // 카드 슬롯 초기화 (기존 비어있는 슬롯 복원)
  const allGridCards = document.querySelectorAll(".project-grid .project-card:not(.new-card)");
  allGridCards.forEach(card => {
    card.className = "project-card empty-card";
    card.innerHTML = "";
    card.style = "";
  });

  const slots = document.querySelectorAll(".project-grid .empty-card");

  savedProjects.forEach((proj, index) => {
    if (index < slots.length) {
      const targetCard = slots[index];
      
      targetCard.classList.remove("empty-card");
      targetCard.style.cursor = "pointer";
      targetCard.style.padding = "18px";
      targetCard.style.boxSizing = "border-box";
      targetCard.style.display = "flex";
      targetCard.style.flexDirection = "column";
      targetCard.style.justifyContent = "space-between";
      targetCard.style.position = "relative";
      targetCard.style.backgroundColor = "#ffffff";
      targetCard.style.border = "1px solid #e2e8f0";
      targetCard.style.borderRadius = "8px";

      targetCard.innerHTML = `
        <div>
          <!-- 상단: 테마/직무 뱃지 & 삭제 버튼 -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div style="display: flex; gap: 4px; align-items: center;">
              <span style="font-size: 11px; font-weight: 700; color: #3b82f6; background: #eff6ff; padding: 2px 6px; border-radius: 4px;">
                ${proj.job || "포지션"}
              </span>
              ${proj.theme ? `<span style="font-size: 11px; color: #6366f1; background: #eef2ff; padding: 2px 6px; border-radius: 4px;">${proj.theme}</span>` : ""}
            </div>
            <!-- 삭제 버튼 (✕) -->
            <button class="btn-card-delete" data-index="${index}" style="background: none; border: none; font-size: 16px; color: #94a3b8; cursor: pointer; padding: 0 4px; line-height: 1;" title="프로젝트 삭제">✕</button>
          </div>

          <!-- 프로젝트 타이틀 및 소개글 -->
          <h3 style="font-size: 15px; font-weight: 700; color: #1e293b; margin: 0 0 6px 0; word-break: break-all;">
            ${proj.name ? proj.name + "의 포트폴리오" : "포트폴리오"}
          </h3>
          <p style="font-size: 13px; color: #64748b; line-height: 1.4; margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; word-break: break-all;">
            ${proj.intro || "작성된 자기소개가 없습니다."}
          </p>
        </div>

        <!-- 하단: 생성 날짜 및 이동 -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
          <span style="font-size: 11px; color: #94a3b8;">${proj.createdAt || ""}</span>
          <span style="font-size: 12px; color: #6366f1; font-weight: 600;">상세보기 →</span>
        </div>
      `;

      // 저장된 테마에 맞춰 이동할 파일 결정
        let targetPage = "main1.html";
        if (proj.theme === "테마 2") targetPage = "main2.html";
        else if (proj.theme === "테마 3") targetPage = "main3.html";
        else if (proj.theme === "테마 4") targetPage = "main4.html";

        // 카드 클릭 시 해당 테마 페이지로 번호(?projectIndex=0)를 들고 이동
        targetCard.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-card-delete")) return; // 삭제 버튼 누른 건 무시
        location.href = `${targetPage}?projectIndex=${index}`;
        });
    }
  });

  document.querySelectorAll(".btn-card-delete").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); 
      const deleteIdx = parseInt(btn.getAttribute("data-index"), 10);
      if (confirm("이 프로젝트를 삭제하시겠습니까?")) {
        const currentProjects = JSON.parse(localStorage.getItem("myProjects")) || [];
        currentProjects.splice(deleteIdx, 1);
        localStorage.setItem("myProjects", JSON.stringify(currentProjects));
        renderMyPageCards(); // 화면 갱신
      }
    });
  });
}