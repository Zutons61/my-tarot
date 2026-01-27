let selectedIdx = 1;

// 1. 페이지 전환 함수
function nextPage(num) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    setTimeout(() => {
        pages.forEach(p => p.style.display = 'none');
        const next = document.getElementById(`page-${num}`);
        next.style.display = 'block';
        setTimeout(() => next.classList.add('active'), 50);
    }, 400);

    if(num === 2) initSlider();
}

// 2. 무한 슬라이더 초기화 (카드 3장을 10세트 복제하여 루프 생성)
function initSlider() {
    const track = document.getElementById('track');
    track.innerHTML = '';
    for(let i=0; i<10; i++) {
        for(let j=1; j<=3; j++) {
            const img = document.createElement('img');
            img.src = `./images/btn/btn_card_back${j}.png`;
            img.className = 'card-item';
            img.dataset.id = j;
            track.appendChild(img);
        }
    }
    const slider = document.getElementById('slider');
    slider.scrollLeft = slider.scrollWidth / 3; // 중간 지점에서 시작
    
    slider.addEventListener('scroll', () => {
        updateActiveCard();
        // 무한 루프 트릭: 끝에 닿으면 반대편으로 순간이동
        if(slider.scrollLeft < 10) slider.scrollLeft = slider.scrollWidth / 3;
        if(slider.scrollLeft > (slider.scrollWidth * 0.6)) slider.scrollLeft = slider.scrollWidth / 3;
    });
}

function updateActiveCard() {
    const cards = document.querySelectorAll('.card-item');
    const centerX = document.getElementById('slider').scrollLeft + (window.innerWidth / 2);
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        if(Math.abs(window.innerWidth/2 - cardCenter) < 50) {
            card.classList.add('active');
            selectedIdx = parseInt(card.dataset.id);
        } else {
            card.classList.remove('active');
        }
    });
}

// 3. 카드 선택 및 로딩
function pickCard() {
    nextPage(3);
    setTimeout(() => {
        // 결과 이미지 셋팅
        document.getElementById('res-bg-4').src = `./images/bg_res_4-${selectedIdx}.jpg`;
        document.getElementById('res-char-4').src = `./images/gif/char_check_${selectedIdx}.apng`;
        document.getElementById('res-bg-5').src = `./images/bg_res_5-${selectedIdx}.jpg`;
        document.getElementById('res-char-5').src = `./images/gif/char_final_${selectedIdx}.apng`;
        nextPage(4);
    }, 4000);
}

// 4. 저장 및 캡쳐 기능
function saveImage() {
    const area = document.getElementById('capture-area');
    html2canvas(area, { useCORS: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = `fortune_jogom_${selectedIdx}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}