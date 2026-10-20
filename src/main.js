import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fees, households, scenarios, questions } from './data.js';

gsap.registerPlugin(ScrollTrigger);
document.documentElement.classList.add('js');

const number = new Intl.NumberFormat('zh-TW');
const feeChart = document.querySelector('#fee-chart');
const incomeChart = document.querySelector('#income-chart');

function setPressed(buttons, selected) {
  buttons.forEach((button) => {
    const active = button === selected;
    button.setAttribute('aria-pressed', String(active));
    button.classList.toggle('is-selected', active);
  });
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Use the published percentages, including their original rounding tail.
fees.forEach((fee, index) => {
  const button = element('button', 'fee-bar');
  button.type = 'button';
  button.dataset.index = String(index);
  button.setAttribute('aria-label', `${fee.label}：${fee.share.toFixed(1)}%`);
  button.setAttribute('aria-pressed', String(index === 2));
  button.classList.toggle('is-selected', index === 2);
  const track = element('span', 'fee-track');
  track.setAttribute('aria-hidden', 'true');
  const fill = element('span', 'fee-fill');
  fill.style.setProperty('--bar-width', `${(fee.share / 40) * 100}%`);
  track.append(fill);
  button.append(
    element('span', 'fee-bar-label', fee.label),
    track,
    element('span', 'fee-bar-value', `${fee.share.toFixed(1)}%`),
  );
  feeChart.append(button);
});

feeChart.addEventListener('click', (event) => {
  const button = event.target.closest('.fee-bar');
  if (!button) return;
  const index = Number(button.dataset.index);
  const fee = fees[index];
  setPressed(feeChart.querySelectorAll('button'), button);
  document.querySelector('#fee-value').textContent = fee.share.toFixed(1);
  document.querySelector('#fee-index').textContent = String(index + 1).padStart(2, '0');
  let label = `每月 ${fee.label} 元`;
  if (index === 0) label = '未付費';
  if (index === fees.length - 1) label = '每月 30,000 元以上';
  document.querySelector('#fee-label').textContent = label;
  document.querySelector('#fee-description').textContent =
    index === 0
      ? '12.9% 的學齡兒童被歸為「未付費」。這一題還沒告訴我們是否使用免費資源、由誰陪伴，以及沒有付費的原因。'
      : `${fee.share.toFixed(1)}% 的學齡兒童，家長或主要照顧者填報的每月補習及課後照顧費落在這個區間。`;
});

households.forEach((household, index) => {
  const button = element('button', 'income-group');
  button.type = 'button';
  button.dataset.index = String(index);
  button.setAttribute('aria-pressed', String(index === 2));
  button.classList.toggle('is-selected', index === 2);
  button.setAttribute(
    'aria-label',
    `${household.label}：每戶全年平均教育支出 ${number.format(household.education)} 元，平均每戶 ${household.people.toFixed(2)} 人`,
  );
  const bar = element('span', 'income-bar');
  bar.style.setProperty('--education', String(household.education));
  bar.setAttribute('aria-hidden', 'true');
  button.append(
    element('span', 'income-value', number.format(household.education)),
    bar,
    element('span', 'income-group-label', `第 ${household.group} 組`),
  );
  incomeChart.append(button);
});

incomeChart.addEventListener('click', (event) => {
  const button = event.target.closest('.income-group');
  if (!button) return;
  const household = households[Number(button.dataset.index)];
  setPressed(incomeChart.querySelectorAll('button'), button);
  document.querySelector('#household-code').textContent = String(household.group).padStart(2, '0');
  document.querySelector('#household-label').textContent = household.label;
  document.querySelector('#household-value').textContent = number.format(household.education);
  document.querySelector('#household-people').textContent = household.people.toFixed(2);
});

document.querySelectorAll('[data-scenario]').forEach((button) => {
  button.addEventListener('click', () => {
    const scenario = scenarios[button.dataset.scenario];
    setPressed(document.querySelectorAll('[data-scenario]'), button);
    document.querySelector('#scenario-kicker').textContent = scenario.kicker;
    document.querySelector('#scenario-icon').textContent = scenario.icon;
    document
      .querySelector('#scenario-title')
      .replaceChildren(
        document.createTextNode(scenario.title[0]),
        document.createElement('br'),
        document.createTextNode(scenario.title[1]),
      );
    document.querySelector('#scenario-description').textContent = scenario.description;
    document.querySelector('#scenario-note').textContent = scenario.note;
    const rows = scenario.conditions.map(([label, description]) => {
      const row = document.createElement('div');
      row.append(element('dt', '', label), element('dd', '', description));
      return row;
    });
    document.querySelector('#condition-list').replaceChildren(...rows);
    ScrollTrigger.refresh();
  });
});

document.querySelectorAll('[data-question]').forEach((button) => {
  button.addEventListener('click', () => {
    setPressed(document.querySelectorAll('[data-question]'), button);
    document.querySelector('#takeaway-response').textContent = questions[button.dataset.question];
  });
});

const dialog = document.querySelector('#source-dialog');
let sourceOpener;
document.querySelectorAll('[data-open-sources]').forEach((button) => {
  button.addEventListener('click', () => {
    sourceOpener = button;
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  sourceOpener?.focus({ preventScroll: true });
});
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    dialog.close();
});

function downloadCsv(dataset) {
  const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;
  let rows;
  if (dataset === 'fees') {
    rows = [
      ['統計年', '對象', '費用類別（新臺幣元／月）', '比率（%）', '來源'],
      ...fees.map((fee) => [
        2022,
        '國小學齡兒童（全體，含未付費者）',
        fee.label,
        fee.share.toFixed(1),
        '衛福部111年兒童及少年生活狀況調查兒童篇表24',
      ]),
    ];
  } else {
    rows = [
      [
        '統計年',
        '對象',
        '所得組',
        '平均每戶人數（人）',
        '平均每戶教育支出（新臺幣元／年）',
        '來源',
      ],
      ...households.map((household) => [
        2025,
        '全體家庭（含無在學成員家庭）',
        household.label,
        household.people.toFixed(2),
        household.education,
        '主計總處114年家庭收支調查戶為單位第6表',
      ]),
    ];
  }
  const csv = '\uFEFF' + rows.map((row) => row.map(quote).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = element('a');
  link.href = url;
  link.download = dataset === 'fees' ? 'taiwan-child-fees-2022.csv' : 'taiwan-households-2025.csv';
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
document.querySelectorAll('[data-download]').forEach((button) => {
  button.addEventListener('click', () => downloadCsv(button.dataset.download));
});

const navigation = [...document.querySelectorAll('.site-nav a')];
const chapterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navigation.forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  },
  { rootMargin: '-15% 0px -60% 0px' },
);
document.querySelectorAll('.chapter').forEach((chapter) => chapterObserver.observe(chapter));

const progress = document.querySelector('.reading-progress');
ScrollTrigger.create({
  start: 0,
  end: 'max',
  onUpdate: (self) => {
    progress.style.transform = `scaleX(${self.progress})`;
  },
});

const media = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('#motion-toggle');
let motionContext;
let manuallyReduced = false;

function configureMotion() {
  motionContext?.revert();
  const reduced = media.matches || manuallyReduced;
  document.documentElement.classList.toggle('reduced-motion', reduced);
  motionButton.setAttribute('aria-pressed', String(reduced));
  motionButton.disabled = media.matches;
  motionButton.textContent = media.matches
    ? '已依系統減少動態'
    : reduced
      ? '動態效果已減少'
      : '減少動態效果';
  if (!reduced) {
    motionContext = gsap.context(() => {
      if (window.scrollY < 150) {
        gsap.from('.hero-intro, .hero-line, .hero-description, .primary-link', {
          y: 26,
          opacity: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
        });
        gsap.from('.hero-receipt', {
          y: 45,
          rotation: 11,
          opacity: 0,
          duration: 1.1,
          delay: 0.25,
          ease: 'power3.out',
        });
        gsap.from('.paper-back', { y: 30, opacity: 0, stagger: 0.1, duration: 1, delay: 0.15 });
      }
      gsap.utils.toArray('[data-reveal]').forEach((node) => {
        gsap.from(node, {
          y: 28,
          opacity: 0,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: { trigger: node, start: 'top 92%', once: true },
        });
      });
      gsap.from('.fee-fill', {
        scaleX: 0,
        duration: 0.8,
        stagger: 0.045,
        ease: 'power2.out',
        scrollTrigger: { trigger: feeChart, start: 'top 87%', once: true },
      });
      gsap.from('.income-bar', {
        scaleY: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: { trigger: incomeChart, start: 'top 87%', once: true },
      });
      if (window.matchMedia('(min-width: 761px)').matches) {
        gsap.to('.hero-art', {
          y: -35,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.7 },
        });
      }
    });
  }
  ScrollTrigger.refresh();
}

motionButton.addEventListener('click', () => {
  manuallyReduced = !manuallyReduced;
  configureMotion();
});
media.addEventListener('change', configureMotion);
configureMotion();
document.fonts.ready.then(() => ScrollTrigger.refresh());
document.querySelectorAll('.data-table-details').forEach((details) => {
  details.addEventListener('toggle', () => ScrollTrigger.refresh());
});
