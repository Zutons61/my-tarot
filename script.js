let selectedIdx = 1;

function nextPage(num) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    setTimeout(() => {
        document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
        const next = document.getElementById(`page-${num}`);
        next.style.display = 'block';
        setTimeout(() => next.classList.add('active'), 50);
        if (num === 2) initInfiniteSlider();
        if (num === 5) startFanfare();
    }, 300);
}

// 무한 룰렛 최적화 (카드 120장으로 확장하여 슥슥 돌려도 끊김 없음)
function initInfiniteSlider() {
    const track = document.getElementById('track');
    track.innerHTML = '';
    const cardSetCount = 40; // 3장 세트를 40번 반복
    for (let i = 0; i < cardSetCount; i++) {
        for (let j = 1; j <= 3; j++) {
            const img = document.createElement('img');
            img.src = `./images/btn/btn_card_back${j}.png`;
            img.className = 'card-item';
            img.dataset.id = j;
            track.appendChild(img);
        }
    }
    const slider = document.getElementById('slider');
    // 처음 위치를 중앙 근처로 세팅
    slider.scrollLeft = (slider.scrollWidth / 2) - (slider.scrollWidth % 137);

    slider.addEventListener('scroll', () => {
        // 무한 텔레포트: 양 끝에 도달하기 훨씬 전에 중앙으로 보정
        const buffer = 1000;
        if (slider.scrollLeft < buffer) slider.scrollLeft += (slider.scrollWidth / 3);
        if (slider.scrollLeft > slider.scrollWidth - buffer - 412) slider.scrollLeft -= (slider.scrollWidth / 3);
        updateActiveCard();
    });
}

function updateActiveCard() {
    const cards = document.querySelectorAll('.card-item');
    const centerX = 412 / 2;
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        // transform: scale이 적용된 상태에서도 정확한 위치 계산을 위해 app의 scale값 고려
        const scale = min(window.innerWidth / 412, window.innerHeight / 914);
        const cardMid = rect.left + rect.width / 2;
        // 실제 화면상의 중앙 좌표와 비교
        if (Math.abs((window.innerWidth / 2) - cardMid) < 40 * scale) {
            card.classList.add('selected');
            selectedIdx = parseInt(card.dataset.id);
        } else {
            card.classList.remove('selected');
        }
    });
}

// 헬퍼 함수
function min(a, b) { return a < b ? a : b; }

function pickCard() {
    nextPage(3);
    setTimeout(() => {
        document.getElementById('res-bg-4').src = `./images/bg_res_4-${selectedIdx}.jpg`;
        document.getElementById('res-char-4').src = `./images/gif/char_check_${selectedIdx}.apng`;
        document.getElementById('res-bg-5').src = `./images/bg_res_5-${selectedIdx}.jpg`;
        document.getElementById('res-char-5').src = `./images/gif/char_final_${selectedIdx}.apng`;
        nextPage(4);
    }, 4000);
}

// 빵빠레: 자연스러운 지그재그 낙하
function startFanfare() {
    const container = document.getElementById('confetti-canvas');
    const colors = ['#FFD700', '#FFA500', '#FF4500', '#ADFF2F', '#00BFFF', '#FF69B4'];
    for (let i = 0; i < 80; i++) {
        const c = document.createElement('div');
        c.className = 'confetti';
        c.style.left = Math.random() * 100 + '%';
        c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        c.style.animationDelay = Math.random() * 2 + 's';
        c.style.width = (Math.random() * 8 + 6) + 'px';
        c.style.height = c.style.width;
        container.appendChild(c);
        setTimeout(() => c.remove(), 5000);
    }
}

function saveImage() {
    const area = document.getElementById('capture-area');
    html2canvas(area, { useCORS: true, backgroundColor: null }).then(canvas => {
        const link = document.createElement('a');
        link.download = `jogom_fortune_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}