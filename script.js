let selectedIdx = 1; // 1, 2, 3 중 하나

function nextPage(num) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    
    setTimeout(() => {
        pages.forEach(p => p.style.display = 'none');
        const next = document.getElementById(`page-${num}`);
        next.style.display = 'block';
        setTimeout(() => next.classList.add('active'), 50);
    }, 100);

    // 2페이지 진입 시 결과값 미리 생성
    if(num === 2) selectedIdx = Math.floor(Math.random() * 3) + 1;
}

function startLoading() {
    nextPage(3);
    
    // 4초 로딩 후 결과 페이지 이동
    setTimeout(() => {
        // 4페이지 리소스 세팅
        document.getElementById('res-bg-4').src = `./images/bg_res_4-${selectedIdx}.jpg`;
        document.getElementById('res-char-4').src = `./images/gif/char_check_${selectedIdx}.apng`;
        
        // 5페이지 리소스 세팅
        document.getElementById('res-bg-5').src = `./images/bg_res_5-${selectedIdx}.jpg`;
        document.getElementById('res-char-5').src = `./images/gif/char_final_${selectedIdx}.apng`;
        
        nextPage(4);
    }, 4000);
}

// 캡쳐 및 저장 기능
function saveImage() {
    const area = document.getElementById('capture-area');
    html2canvas(area, { useCORS: true, logging: false }).then(canvas => {
        const link = document.createElement('a');
        link.download = `jogom_result_${selectedIdx}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}