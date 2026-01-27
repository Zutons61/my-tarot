function applyScale() {
    const app = document.getElementById('app');
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const scale = Math.min(winW / 412, winH / 914);
    app.style.transform = `scale(${scale})`;
}
window.addEventListener('load', () => { applyScale(); setTimeout(applyScale, 100); });
window.addEventListener('resize', applyScale);

let selectedIdx = 1;

function nextPage(num) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
    const next = document.getElementById(`page-${num}`);
    next.style.display = 'block';
    requestAnimationFrame(() => { next.classList.add('active'); });
    if (num === 2) initInfiniteSlider();
    if (num === 5) startFanfare();
}

function initInfiniteSlider() {
    const track = document.getElementById('track');
    track.innerHTML = '';
    const repeat = 50;
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
    const cardWidth = 137;
    slider.scrollLeft = (slider.scrollWidth / 2) - ((slider.scrollWidth / 2) % (cardWidth * 3));
    slider.addEventListener('scroll', () => {
        const threshold = 1500;
        if (slider.scrollLeft < threshold) slider.scrollLeft += (slider.scrollWidth / 3);
        else if (slider.scrollLeft > slider.scrollWidth - threshold - 412) slider.scrollLeft -= (slider.scrollWidth / 3);
        updateActiveCard();
    });
}

function updateActiveCard() {
    const cards = document.querySelectorAll('.card-item');
    const slider = document.getElementById('slider');
    const centerX = slider.getBoundingClientRect().left + (slider.offsetWidth / 2);
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardMid = rect.left + rect.width / 2;
        if (Math.abs(centerX - cardMid) < 50) {
            card.classList.add('selected');
            selectedIdx = parseInt(card.dataset.id);
        } else {
            card.classList.remove('selected');
        }
    });
}

// [요청 3b] 카드 선택 버튼 클릭 시 특수 효과 후 페이지 이동
function pickCard() {
    // 특수 효과 실행
    const effect = document.getElementById('transition-effect');
    effect.classList.add('active');

    // 0.8초(애니메이션 시간) 후 페이지 이동 및 효과 초기화
    setTimeout(() => {
        effect.classList.remove('active');
        nextPage(3);

        // 로딩 후 결과 페이지 이동
        setTimeout(() => {
            document.getElementById('res-bg-4').src = `./images/bg_res_4-${selectedIdx}.jpg`;
            document.getElementById('res-char-4').src = `./images/gif/char_check_${selectedIdx}.apng`;
            document.getElementById('res-bg-5').src = `./images/bg_res_5-${selectedIdx}.jpg`;
            document.getElementById('res-char-5').src = `./images/gif/char_final_${selectedIdx}.apng`;
            nextPage(4);
        }, 4000);
    }, 800); // 특수 효과 지속 시간과 맞춤
}

function startFanfare() {
    const box = document.getElementById('fanfare-box');
    const colors = ['#FFD700', '#FF69B4', '#00BFFF', '#ADFF2F'];
    for (let i = 0; i < 60; i++) {
        const c = document.createElement('div');
        c.className = 'confetti';
        c.style.setProperty('--side', `${(Math.random() - 0.5) * 250}px`);
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
    html2canvas(area, { useCORS: true, scrollY: -window.scrollY }).then(canvas => {
        const link = document.createElement('a');
        link.download = `fortune_${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}