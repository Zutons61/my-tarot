// 1. 반응형 스케일 엔진
function applyScale() {
    const stage = document.getElementById('stage');
    const app = document.getElementById('app');
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    // 412*914 비율을 유지하면서 화면에 꽉 차게 계산
    const scale = Math.min(winW / 412, winH / 914);
    app.style.transform = `scale(${scale})`;
}
window.addEventListener('resize', applyScale);
window.addEventListener('load', applyScale);

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

// 2. 무한 루프 룰렛 (120장으로 안정성 확보)
function initInfiniteSlider() {
    const track = document.getElementById('track');
    track.innerHTML = '';
    const repeat = 40;
    for (let i = 0; i < repeat; i++) {
        for (let j = 1; j <= 3; j++) {
            const img = document.createElement('img');
            img.src = `./images/btn/btn_card_back${j}.png`;
            img.className = 'card-item';
            img.dataset.id = j;
            track.appendChild(img);
        }
    }
    const slider = document.getElementById('slider');
    // 정확히 3의 배수 위치에서 시작하도록 보정
    const cardWidth = 137;
    slider.scrollLeft = (slider.scrollWidth / 2) - ((slider.scrollWidth / 2) % (cardWidth * 3));

    slider.addEventListener('scroll', () => {
        const threshold = 1200;
        if (slider.scrollLeft < threshold) {
            slider.scrollLeft += (slider.scrollWidth / 3);
        } else if (slider.scrollLeft > slider.scrollWidth - threshold - 412) {
            slider.scrollLeft -= (slider.scrollWidth / 3);
        }
        updateActiveCard();
    });
}

function updateActiveCard() {
    const cards = document.querySelectorAll('.card-item');
    const appRect = document.getElementById('app').getBoundingClientRect();
    const centerX = appRect.left + (appRect.width / 2);

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardMid = rect.left + rect.width / 2;
        // 스케일링된 화면에서도 중앙 감지가 정확하도록 보정
        if (Math.abs(centerX - cardMid) < 40 * (appRect.width / 412)) {
            card.classList.add('selected');
            selectedIdx = parseInt(card.dataset.id);
        } else {
            card.classList.remove('selected');
        }
    });
}

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

// 3. 빵빠레 (자연스러운 지그재그)
function startFanfare() {
    const box = document.getElementById('fanfare-box');
    const colors = ['#FFD700', '#FF69B4', '#00BFFF', '#ADFF2F', '#FF4500'];
    for (let i = 0; i < 80; i++) {
        const c = document.createElement('div');
        c.className = 'confetti';
        c.style.left = Math.random() * 100 + '%';
        c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        c.style.width = (Math.random() * 10 + 5) + 'px';
        c.style.height = c.style.width;
        c.style.animationDelay = (Math.random() * 2) + 's';
        box.appendChild(c);
        setTimeout(() => c.remove(), 4000);
    }
}

function saveImage() {
    const area = document.getElementById('capture-area');
    html2canvas(area, { useCORS: true, logging: false }).then(canvas => {
        const link = document.createElement('a');
        link.download = `jogom_fortune_${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}