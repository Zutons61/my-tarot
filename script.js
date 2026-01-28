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

// [수정] 무한 룰렛 - 스크롤 보정 범위 및 초기 위치 정밀화
function initInfiniteSlider() {
    const track = document.getElementById('track');
    if (!track) return;

    track.innerHTML = '';
    const repeat = 60; // 180장으로 대폭 늘려 연속 스크롤 대응 강화
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

    // 초기 위치를 정확히 3의 배수 카드의 중앙 세트로 설정
    const totalContentWidth = cardWidth * 3 * repeat;
    slider.scrollLeft = (totalContentWidth / 2) - ((totalContentWidth / 2) % (cardWidth * 3));

    slider.removeEventListener('scroll', handleScroll); // 중복 등록 방지
    slider.addEventListener('scroll', handleScroll);

    // 초기 실행
    updateActiveCard();
}

function handleScroll() {
    const slider = document.getElementById('slider');
    const scrollWidth = slider.scrollWidth;
    const threshold = scrollWidth * 0.2; // 20% 지점 도달 시 텔레포트

    if (slider.scrollLeft < threshold) {
        slider.scrollLeft += (scrollWidth / 3);
    } else if (slider.scrollLeft > scrollWidth - threshold - 412) {
        slider.scrollLeft -= (scrollWidth / 3);
    }
    updateActiveCard();
}

function updateActiveCard() {
    const slider = document.getElementById('slider');
    const cards = document.querySelectorAll('.card-item');
    if (!slider || cards.length === 0) return;

    // 슬라이더 컨테이너의 실제 화면상 수평 중앙 지점 계산
    const sliderRect = slider.getBoundingClientRect();
    const sliderCenterX = sliderRect.left + (sliderRect.width / 2);

    let closestCard = null;
    let minDistance = Infinity;

    cards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const cardMidX = cardRect.left + (cardRect.width / 2);

        // 슬라이더 중앙과 카드의 거리를 측정
        const distance = Math.abs(sliderCenterX - cardMidX);

        // 기존 클래스 일단 제거
        card.classList.remove('selected');

        if (distance < minDistance) {
            minDistance = distance;
            closestCard = card;
        }
    });

    // 가장 중앙에 가까운 카드 하나만 선택 및 밝기 조절
    if (closestCard) {
        closestCard.classList.add('selected');
        selectedIdx = parseInt(closestCard.dataset.id);
    }
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