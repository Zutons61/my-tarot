let selectedIdx = 1;

function nextPage(num) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    setTimeout(() => {
        pages.forEach(p => p.style.display = 'none');
        const next = document.getElementById(`page-${num}`);
        next.style.display = 'block';
        setTimeout(() => next.classList.add('active'), 50);
    }, 400);

    if (num === 2) initInfiniteSlider();
}

// 룰렛 무한 루프 핵심 로직
function initInfiniteSlider() {
    const track = document.getElementById('track');
    track.innerHTML = '';
    // 카드 3장을 15세트 복제 (충분한 길이 확보)
    for (let i = 0; i < 15; i++) {
        for (let j = 1; j <= 3; j++) {
            const img = document.createElement('img');
            img.src = `./images/btn/btn_card_back${j}.png`;
            img.className = 'card-item';
            img.dataset.id = j;
            track.appendChild(img);
        }
    }

    const slider = document.getElementById('slider');
    // 초기 위치를 중간으로 설정
    slider.scrollLeft = slider.scrollWidth / 2;

    slider.addEventListener('scroll', () => {
        const scrollWidth = slider.scrollWidth;
        const currentScroll = slider.scrollLeft;
        
        // 무한 루프: 양쪽 끝에 도달하기 전 중간으로 텔레포트
        if (currentScroll < 100) {
            slider.scrollLeft = scrollWidth / 2;
        } else if (currentScroll > scrollWidth - window.innerWidth - 100) {
            slider.scrollLeft = scrollWidth / 2;
        }
        
        updateActiveCard();
    });
}

function updateActiveCard() {
    const cards = document.querySelectorAll('.card-item');
    const centerX = window.innerWidth / 2;
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        if (Math.abs(centerX - cardCenter) < rect.width / 2) {
            card.classList.add('active');
            selectedIdx = parseInt(card.dataset.id); // 중앙 카드 번호 실시간 저장
        } else {
            card.classList.remove('active');
        }
    });
}

function pickCard() {
    nextPage(3);
    setTimeout(() => {
        // 4, 5페이지 리소스 동적 매칭
        document.getElementById('res-bg-4').src = `./images/bg_res_4-${selectedIdx}.jpg`;
        document.getElementById('res-char-4').src = `./images/gif/char_check_${selectedIdx}.apng`;
        document.getElementById('res-bg-5').src = `./images/bg_res_5-${selectedIdx}.jpg`;
        document.getElementById('res-char-5').src = `./images/gif/char_final_${selectedIdx}.apng`;
        nextPage(4);
    }, 4000);
}

function saveImage() {
    const area = document.getElementById('capture-area');
    html2canvas(area, { useCORS: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = `jogom_tarot_${selectedIdx}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}