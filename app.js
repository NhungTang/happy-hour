/* Bảng ghi chú Happy Hour — lưu hết trong localStorage, không cần server */

const STORE_KEY = 'happy-hour-notes-v2';

/* Quán hay đặt — link bà gửi */
const PLACES = [
  {
    name: 'Quán Cô La — Nem Nắm & Nem Chạo Giao Thuỷ (109 Trần Cung)',
    url: 'https://shopeefood.vn/ha-noi/quan-co-la-nem-nam-nem-chao-giao-thuy-109-tran-cung.e8qvil',
    note: 'Thường đặt: lạc',
  },
  {
    name: 'Jongno Kimbap — Cơm cuộn, cơm trộn Hàn Quốc (Đình Thôn)',
    url: 'https://shopeefood.vn/ha-noi/jongno-kimbap-com-cuon-com-tron-do-an-han-quoc-dinh-thon',
    note: 'Thường đặt: kimbap',
  },
  {
    name: 'Nem Chua Rán 36 Tạm Thương (Trần Thái Tông)',
    url: 'https://shopeefood.vn/ha-noi/nem-chua-ran-36-tam-thuong-tran-thai-tong',
    note: 'Thường đặt: nem chua rán, khoai tây',
  },
  {
    name: 'Thịt Xiên Nướng (90 Hoa Bằng)',
    url: 'https://shopeefood.vn/ha-noi/thit-xien-nuong-90-hoa-bang',
    note: 'Thường đặt: thịt xiên nướng',
  },
  {
    name: 'CUỐN XƯA — Phở Cuốn Hà Thành (Trần Cung)',
    url: 'https://shopeefood.vn/ha-noi/cuon-xua-pho-cuon-ha-thanh-tran-cung',
    note: 'Thường đặt: cuốn',
  },
  {
    name: 'Hoa quả',
    url: '',
    note: 'Liên hệ Luyến xin contact',
  },
];

/* địa điểm cố định — không cho sửa trên giao diện */
const PLACE = 'Pantry tầng 19';

/* trần ngân sách một bữa — nhập quá là bị kéo về mức này */
const MAX_BUDGET = 700000;

/* Khoảnh khắc ăn uống — ảnh những bữa ăn của team.
   Bỏ ảnh vào folder images/ rồi điền tên file vào img, vd:
     { caption: 'Happy hour 10/09', img: 'images/hh-1009.jpg' }
   img cũng nhận link ảnh ngoài (https://...).
   Để img rỗng thì hiện ô mẫu pastel, không bị vỡ ảnh. */
const MOMENTS = [
  {
    caption: 'Bàn tiệc pantry tầng 19 — 3 pizza, cuốn, cánh gà, lạc luộc, hoa quả',
    img: 'images/hh-pantry-1.jpg',
  },
  { caption: 'Happy hour gần nhất', img: '' },
  { caption: 'Cả team quẩy', img: '' },
  { caption: 'Món tủ của team', img: '' },
];


/* Menu tham khảo — các buổi đã đặt. Cố định, thêm buổi mới ngay ở mảng này.
   total để null nếu không đủ giá từng món. */
const MENU = [
  {
    items: ['183k thịt xiên nướng (20)', '83k lạc luộc (1kg)', '177k nem chua & khoai chiên', '200k hoa quả'],
    total: 643000,
  },
  {
    items: ['165.24k phở cuốn', '118k nem chua', '81k lạc', '240k hoa quả'],
    total: 604240,
  },
  {
    items: ['220k hoa quả', '231k bánh tráng trộn, nem, trứng', '188.46k nem, lạc'],
    total: 639460,
  },
  {
    items: ['220k hoa quả', '166k phở cuốn', '251k thịt xiên'],
    total: 637000,
  },
  {
    items: ['200k hoa quả', '144k nem', '136.6k kimbap', '53.5k lạc', '401k pizza'],
    total: 935100,
  },
  {
    items: ['240k hoa quả', 'lạc, xiên bẩn, nem rán, khoai'],
    total: null,
  },
  {
    items: ['260k hoa quả', '243k chân gà', '93.42k kimbap', '80.5k lạc', '207k lạc'],
    total: 883920,
  },
  {
    items: ['hoa quả, lạc, phở cuốn, cốm'],
    total: null,
  },
];

/* 4 người chuẩn bị tuần này — ĐIỀN TÊN VÀO ĐÂY HÀNG TUẦN.
   Tên hiện ở dòng ngay dưới tiêu đề trang.
   Slot nào chưa chốt thì để '' cũng được. */
const DUTY = [
  'anmv',
  'vula',
  'huyennt7',
  'diepntn',
  'hieult3',
  'luyennt',
];

/* tên đã điền, bỏ slot trống */
function chefs() {
  return DUTY.map((n) => n.trim()).filter(Boolean);
}

const $ = (sel) => document.querySelector(sel);

let state = load();
let partied = false; // confetti chỉ bắn 1 lần khi tới giờ quẩy

/* ---------------- storage ---------------- */
function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY));
    // gộp với mặc định để bản lưu cũ vẫn đủ field mới
    if (raw && typeof raw === 'object') return { ...freshState(), ...raw };
  } catch (_) { /* dữ liệu hỏng thì tạo lại mẫu */ }
  return freshState();
}

function nextWednesday() {
  const d = new Date();
  const toWed = (3 - d.getDay() + 7) % 7 || 7; // hôm nay là thứ 4 thì tính tuần sau
  d.setDate(d.getDate() + toWed);
  d.setHours(16, 0, 0, 0);
  return d;
}

function freshState() {
  return {
    eventAt: toLocalInput(nextWednesday()),
    budget: MAX_BUDGET,
    people: 38,
  };
}

function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function toLocalInput(date) {
  const p = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`;
}

/* ---------------- tab ---------------- */
function setTab(key) {
  document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === key));
  document.querySelectorAll('.tab-panel').forEach((p) => p.classList.toggle('hidden', p.id !== 'panel-' + key));
}

/* ---------------- tab: khoảnh khắc ăn uống ---------------- */
function renderMoments() {
  const grid = $('#momentGrid');
  grid.innerHTML = '';
  MOMENTS.forEach((m, i) => {
    const el = document.createElement('figure');
    el.className = 'moment';
    const blank = `<div class="moment-img moment-blank" data-i="${i % 4}">📸</div>`;
    el.innerHTML = (m.img ? '<img class="moment-img" alt="" loading="lazy" />' : blank) + '<figcaption></figcaption>';
    if (m.img) {
      const img = el.querySelector('img');
      img.src = m.img;
      // chưa bỏ file ảnh vào images/ thì hiện ô mẫu thay vì icon ảnh vỡ
      img.onerror = () => img.outerHTML = blank;
    }
    el.querySelector('figcaption').textContent = m.caption;
    grid.appendChild(el);
  });
  $('#momentEmpty').classList.toggle('hidden', MOMENTS.length > 0);
}

/* ---------------- tab: menu tham khảo (cố định, sửa ở mảng MENU) ---------------- */
function renderMenu() {
  const tbody = $('#menuBody');
  tbody.innerHTML = '';
  MENU.forEach((m) => {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td class="mt-items"></td><td class="mt-total"></td>';
    tr.querySelector('.mt-items').textContent = m.items.join('  ·  ');
    tr.querySelector('.mt-total').textContent = m.total ? formatVND(m.total) : '—';
    tbody.appendChild(tr);
  });
  $('#menuEmpty').classList.toggle('hidden', MENU.length > 0);
}

/* ---------------- dòng đầu bếp tuần này ---------------- */
function renderChefs() {
  const onDuty = chefs();
  const hero = $('#heroSub');
  hero.innerHTML = '';
  if (onDuty.length) {
    const names = document.createElement('b');
    names.className = 'chefs';
    names.textContent = onDuty.join(' · ');
    hero.append('Tuần này chúng ta sẽ thưởng thức món ăn của các đầu bếp ', names, ' chuẩn bị 👨‍🍳');
    hero.classList.add('has-chef');
  } else {
    hero.textContent = 'Tuần này chưa chốt đầu bếp nào 🥺';
    hero.classList.remove('has-chef');
  }
}

/* ---------------- ngân sách ---------------- */
const NUM_FMT = new Intl.NumberFormat('en-US'); // 700000 -> 700,000

function formatNumber(n) {
  return NUM_FMT.format(Math.round(Number(n) || 0));
}

function parseNumber(s) {
  return Number(String(s).replace(/\D/g, '')) || 0;
}

function formatVND(n) {
  return formatNumber(n) + 'đ';
}

function renderBudget() {
  const budget = Number(state.budget) || 0;
  const people = Math.max(1, Number(state.people) || 1);
  $('#perHead').textContent = budget ? formatVND(budget / people) : '—';
}

/* ---------------- quán hay đặt (cố định, sửa ở mảng PLACES) ---------------- */
function renderPlaces() {
  const ul = $('#placeList');
  ul.innerHTML = '';
  PLACES.forEach((p) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="p-emoji">🍽️</span>
      <div class="p-main">
        <b class="p-name"></b>
        <span class="p-note"></span>
      </div>
      <a class="p-open" target="_blank" rel="noopener noreferrer" title="Mở link">↗</a>`;
    li.querySelector('.p-name').textContent = p.name;
    const note = li.querySelector('.p-note');
    if (p.note) note.textContent = p.note; else note.remove();
    const open = li.querySelector('.p-open');
    if (p.url) open.href = p.url; else open.remove(); // chỗ không có link (vd hoa quả) thì bỏ nút ↗
    ul.appendChild(li);
  });
}

/* ---------------- countdown ---------------- */
function tick() {
  const msg = $('#cdMsg');
  const target = state.eventAt ? new Date(state.eventAt) : null;
  const setBox = (k, v) => { $(`[data-cd="${k}"]`).textContent = v; };

  if (!target || isNaN(target)) {
    ['d', 'h', 'm', 's'].forEach((k) => setBox(k, '–'));
    msg.textContent = 'Chọn ngày giờ để tui đếm ngược cho nha 💗';
    return;
  }

  const diff = target - Date.now();
  if (diff <= -6 * 3600 * 1000) {
    // quẩy xong quá 6 tiếng → tự nhảy sang thứ 4 tuần sau
    state.eventAt = toLocalInput(nextWednesday());
    save();
    $('#eventAt').value = state.eventAt;
    return;
  }
  if (diff <= 0) {
    ['d', 'h', 'm', 's'].forEach((k) => setBox(k, 0));
    msg.textContent = 'ĐANG QUẨY! Cất điện thoại xuống đi bà 🍻';
    if (!partied) { partied = true; party(); } // bắn confetti đúng 1 lần lúc tới giờ
    return;
  }

  const s = Math.floor(diff / 1000);
  setBox('d', Math.floor(s / 86400));
  setBox('h', Math.floor((s % 86400) / 3600));
  setBox('m', Math.floor((s % 3600) / 60));
  setBox('s', s % 60);
  msg.textContent = `Hẹn nhau ở ${PLACE} nha 💗`;
}

/* ---------------- thông báo (thay alert) ---------------- */
let toastTimer = null;

function toast(emoji, msg) {
  const el = $('#toast');
  el.innerHTML = '<span class="t-emoji"></span><span class="t-msg"></span>';
  el.querySelector('.t-emoji').textContent = emoji;
  el.querySelector('.t-msg').textContent = msg;
  el.classList.remove('hidden', 'bye');
  void el.offsetWidth; // chạy lại animation nếu toast đang hiện
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.add('bye');
    setTimeout(() => el.classList.add('hidden'), 300);
  }, 3000);
}

/* ---------------- confetti ---------------- */
function party() {
  const box = $('#confetti');
  const emojis = ['🎉', '🎊', '🍻', '💗', '⭐', '🧁', '🎈'];
  for (let i = 0; i < 40; i++) {
    const s = document.createElement('span');
    s.className = 'conf';
    s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    s.style.left = Math.random() * 100 + '%';
    s.style.animationDuration = 2.5 + Math.random() * 2 + 's';
    s.style.animationDelay = Math.random() * 0.6 + 's';
    box.appendChild(s);
    setTimeout(() => s.remove(), 6000);
  }
}

/* ---------------- form + events ---------------- */
document.querySelectorAll('.tab').forEach((b) => { b.onclick = () => setTab(b.dataset.tab); });

$('#budget').oninput = (e) => {
  const typed = parseNumber(e.target.value);
  if (typed > MAX_BUDGET) {
    toast('🥲', `Không có tiền đâu bác ơi! Ngân sách tối đa ${formatVND(MAX_BUDGET)} thôi.`);
    state.budget = MAX_BUDGET;
  } else {
    state.budget = typed;
  }
  e.target.value = state.budget ? formatNumber(state.budget) : '';
  save();
  renderBudget();
};
$('#people').oninput = (e) => { state.people = Number(e.target.value); save(); renderBudget(); };

$('#eventAt').onchange = (e) => { state.eventAt = e.target.value; save(); tick(); };

/* ---------------- boot ---------------- */
function init() {
  $('#eventAt').value = state.eventAt || '';
  state.budget = Math.min(Number(state.budget) || 0, MAX_BUDGET); // bản lưu cũ lỡ vượt trần thì kéo về
  $('#budget').value = state.budget ? formatNumber(state.budget) : '';
  $('#people').value = state.people || '';
  renderBudget();
  renderPlaces();
  renderMoments();
  renderMenu();
  renderChefs();
  setTab('menu');
  tick();
}

init();
setInterval(tick, 1000);
