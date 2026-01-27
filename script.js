let selectedIdx = 1;

function nextPage(num) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    setTimeout(() => {
        document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
        const next = document.getElementById(`page-${num}`);
        next.style.display = 'block';
        setTimeout(() => next.classList.add('active'), 50);
        if (num === 2) initInfiniteSlider();
        if (num === 5) triggerFanfare();
    }, 300);
}

// 무한 슬라이더: 30세트(90장)로 대폭 확장하여 버그 방지
function initInfiniteSlider() {
    const track = document.getElementById('track');
    track.innerHTML = '';
    for (let i = 0; i < 30; i++) {
        for (let j = 1; j <= 3; j++) {
            const img = document.createElement('img');
            img.src = `./images/btn/btn_card_back${j}.png`;
            img.className = 'card-item';
            img.dataset.id = j;
            track.appendChild(img);
        }
    }
    const slider = document.getElementById('slider');
    slider.scrollLeft = slider.scrollWidth / 2; // 중간부터 시작

    slider.addEventListener('scroll', () => {
        // 무한 텔레포트 로직
        if (slider.scrollLeft < 200) slider.scrollLeft = slider.scrollWidth / 2;
        if (slider.scrollLeft > slider.scrollWidth - 600) slider.scrollLeft = slider.scrollWidth / 2;

        updateActiveCard();
    });
}

function updateActiveCard() {
    const cards = document.querySelectorAll('.card-item');
    const centerX = 412 / 2;
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

// 5페이지 빵빠레 연출
function triggerFanfare() {
    const container = document.getElementById('fanfare-container');
    const colors = ['#f9f295', '#d4af37', '#ff4d4d', '#4dff4d', '#4db8ff'];
    for (let i = 0; i < 100; i++) {
        const div = document.createElement('div');
        div.className = 'confetti';
        div.style.left = Math.random() * 412 + 'px';
        div.style.top = '-10px';
        div.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        div.style.transform = `rotate(${Math.random() * 360}deg)`;
        container.appendChild(div);
        setTimeout(() => div.remove(), 3000);
    }
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