let selectedIdx = 1; // 랜덤 결과 (1~3)

function nextPage(num) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    setTimeout(() => {
        document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
        const next = document.getElementById(`page-${num}`);
        next.style.display = 'block';
        setTimeout(() => next.classList.add('active'), 50);
    }, 100);

    // 2페이지 진입 시 결과 미리 결정
    if(num === 2) selectedIdx = Math.floor(Math.random() * 3) + 1;
}

function startLoading() {
    nextPage(3);
    
    // 4초 후 4페이지로 이동하며 이미지 매칭
    setTimeout(() => {
        // 4페이지 배경 및 캐릭터
        document.getElementById('res-bg-4').src = `images/bg_res_4-${selectedIdx}.jpg`;
        document.getElementById('res-char-4').src = `images/gif/char_check_${selectedIdx}.apng`;
        
        // 5페이지 결과 미리 로드
        document.getElementById('res-bg-5').src = `images/bg_res_5-${selectedIdx}.jpg`;
        document.getElementById('res-char-5').src = `images/gif/char_final_${selectedIdx}.apng`;
        
        nextPage(4);
    }, 4000);
}

// 이미지 저장
function saveImage() {
    const area = document.getElementById('capture-area');
    html2canvas(area).then(canvas => {
        const link = document.createElement('a');
        link.download = 'jogom_result.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}