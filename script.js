/* ================================================================
   AskMyNotes – script.js
   ================================================================ */

/* ── 1. DOM Ready ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initProgressBar();
  initNavbar();
  initDarkMode();
  initHeroFadeUp();
  initParticles();
  initTypewriter();
  initScrollReveal();
  initMobileMenu();
});

/* ── 2. Progress Bar ─────────────────────────────────────────── */
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const max = document.body.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ── 3. Navbar scroll state + active link ────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');
  const sections = Array.from(document.querySelectorAll('section[id]'));

  const onScroll = () => {
    // Scrolled state
    if (window.scrollY > 24) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link highlight
    const mid = window.scrollY + window.innerHeight / 2;
    let current = sections[0]?.id ?? '';
    for (const sec of sections) {
      if (sec.offsetTop <= mid) current = sec.id;
    }
    links.forEach(l => {
      l.classList.toggle('active', l.dataset.section === current);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── 4. Dark Mode Toggle ─────────────────────────────────────── */
function initDarkMode() {
  const btn = document.getElementById('dark-mode-toggle');
  if (!btn) return;

  const stored = localStorage.getItem('amn-theme');
  if (stored === 'light') document.body.classList.add('light-mode');

  btn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('amn-theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
  });
}

/* ── 5. Hero Fade-Up Sequence ────────────────────────────────── */
function initHeroFadeUp() {
  const els = document.querySelectorAll('.fade-up');
  els.forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), 200 + i * 120);
  });
}

/* ── 6. Canvas Particle System ───────────────────────────────── */
function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  container.appendChild(canvas);

  let W, H, particles = [];

  const resize = () => {
    W = canvas.width = container.offsetWidth;
    H = canvas.height = container.offsetHeight;
  };

  const rand = (min, max) => Math.random() * (max - min) + min;

  const createParticle = () => ({
    x: rand(0, W),
    y: rand(0, H),
    r: rand(1, 3),
    vx: rand(-0.3, 0.3),
    vy: rand(-0.5, -0.1),
    alpha: rand(0.2, 0.6),
    color: Math.random() > 0.5 ? '#7C3AED' : '#F472B6',
  });

  const setup = () => {
    const count = Math.min(60, Math.floor(W * H / 14000));
    particles = Array.from({ length: count }, createParticle);
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -10) { p.y = H + 10; p.x = rand(0, W); }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  };

  resize();
  setup();
  draw();
  window.addEventListener('resize', () => { resize(); setup(); }, { passive: true });
}

/* ── 7. Typewriter Effect ────────────────────────────────────── */
function initTypewriter() {
  const el = document.getElementById('heroHeadline');
  if (!el) return;

  const phrases = [
    'Your Study Buddy,\nPowered by AI',
    'Ask Questions.\nGet Cited Answers.',
    'No Hallucinations.\nOnly Your Notes.',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  const caret = '<span class="typewriter-caret"></span>';

  const renderLines = (text) => {
    // Replace \n with <br/><span class="gradient-text">
    const parts = text.split('\n');
    const line1 = parts[0] ?? '';
    const line2 = parts[1] ?? '';
    return line2
      ? `${line1}<br/><span class="gradient-text">${line2}</span>`
      : `${line1}<span class="gradient-text"></span>`;
  };

  const type = () => {
    const full = phrases[phraseIdx];
    const current = deleting
      ? full.slice(0, charIdx--)
      : full.slice(0, charIdx++);

    el.innerHTML = renderLines(current) + caret;

    const pause = deleting
      ? 40
      : charIdx > full.length ? 1800 : 55;

    if (!deleting && charIdx > full.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
    if (deleting && charIdx < 0) {
      deleting = false;
      charIdx = 0;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(type, 400);
      return;
    }

    setTimeout(type, pause);
  };

  // Start after hero fade-up
  setTimeout(type, 600);
}

/* ── 8. Intersection Observer – Scroll Reveal ────────────────── */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.reveal, .reveal-card, .reveal-left, .reveal-right, .reveal-block'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay') || '0');
      setTimeout(() => el.classList.add('revealed'), delay * 1000);
      observer.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(t => observer.observe(t));
}

/* ── 9. Mobile Menu ──────────────────────────────────────────── */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });

  menu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
}

/* ── 10. Subject Chat Switcher ───────────────────────────────── */
function selectSubject(btn, subject) {
  // Update active button
  document.querySelectorAll('.subject-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Show correct message group
  document.querySelectorAll('.chat-message-group').forEach(g => {
    g.style.display = 'none';
  });
  const target = document.querySelector(`.${subject}-msgs`);
  if (target) target.style.display = 'flex';

  // Update header title
  const header = document.getElementById('chatHeaderTitle');
  const map = { physics: 'Physics', chemistry: 'Chemistry', math: 'Math' };
  if (header) header.textContent = `${map[subject] || subject} · AskMyNotes AI`;

  // Update filename shown
  const fileMap = {
    physics: 'Physics_notes.pdf',
    chemistry: 'Chem_notes.pdf',
    math: 'Math_notes.pdf',
  };
  const fileEl = document.getElementById('fileNameShow');
  if (fileEl) fileEl.textContent = fileMap[subject] || '';

  const file2El = document.getElementById('fileNameShow2');
  const file2Map = {
    physics: 'Mechanics_ch1.pdf',
    chemistry: 'Organic_Ch2.pdf',
    math: 'Algebra_notes.pdf',
  };
  if (file2El) file2El.textContent = file2Map[subject] || '';
}

// Ensure physics chat group shows as flex
document.querySelectorAll('.physics-msgs').forEach(g => g.style.display = 'flex');

/* ── 11. MCQ Interactions ────────────────────────────────────── */
function selectAnswer(label) {
  const group = label.closest('.mcq-options');
  if (!group) return;

  // Reset all in this group
  group.querySelectorAll('.mcq-option').forEach(opt => {
    opt.classList.remove('selected', 'wrong');
  });

  // Mark selected
  const isCorrect = label.classList.contains('correct-answer');
  label.classList.add(isCorrect ? 'selected' : 'wrong');

  // If wrong, briefly show correct
  if (!isCorrect) {
    const correct = group.querySelector('.correct-answer');
    if (correct) {
      setTimeout(() => correct.classList.add('selected'), 600);
    }
  }
}

function toggleExplanation(trigger) {
  const item = trigger.closest('.mcq-item');
  if (!item) return;
  const exp = item.querySelector('.explanation');
  if (!exp) return;
  const hidden = exp.classList.toggle('hidden');
  trigger.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
      <circle cx="12" cy="16" r="1" fill="currentColor"/>
    </svg>
    ${hidden ? 'Show Explanation' : 'Hide Explanation'}
  `;
}

/* ── 12. Demo Modal ──────────────────────────────────────────── */
function openDemo() {
  const modal = document.getElementById('demoModal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  const input = document.getElementById('modalInput');
  if (input) setTimeout(() => input.focus(), 300);
}

function closeDemo(e) {
  if (e.target === e.currentTarget) closeDemoBtn();
}

function closeDemoBtn() {
  const modal = document.getElementById('demoModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDemoBtn();
});

function handleModalEnter(e) {
  if (e.key === 'Enter') sendModalMessage();
}

/* ── 13. Modal Chat Logic ────────────────────────────────────── */
const DEMO_RESPONSES = {
  default: {
    text: "Based on your Physics notes (Page 12), Newton's Third Law states that for every action there is an equal and opposite reaction. All objects exert mutual forces on each other.",
    citation: "Physics_notes.pdf – Page 12",
    confidence: "High",
    snippet: "\"...every action has an equal and <mark>opposite reaction</mark> — Newton's Third Law...\""
  },
  momentum: {
    text: "The law of conservation of momentum states that if no external forces act on a system, the total momentum remains constant. According to your notes, p = mv for any object.",
    citation: "Mechanics_ch1.pdf – Page 22",
    confidence: "High",
    snippet: "\"...total momentum is conserved when no <mark>external forces</mark> act on the system...\""
  },
  friction: {
    text: "Friction is caused by microscopic surface irregularities interlocking between two surfaces. Your notes describe both static friction (μs·N) and kinetic friction (μk·N).",
    citation: "Physics_notes.pdf – Page 8",
    confidence: "High",
    snippet: "\"...<mark>friction arises</mark> from surface roughness at the microscopic level...\""
  },
  notfound: {
    text: "That topic doesn't appear to be covered in your uploaded Physics notes. Please upload relevant notes or try rephrasing your question.",
    isError: true,
  }
};

function getResponse(query) {
  const q = query.toLowerCase();
  if (q.includes('newton') || q.includes('third') || q.includes('action') || q.includes('reaction')) return DEMO_RESPONSES.default;
  if (q.includes('momentum') || q.includes('conservation')) return DEMO_RESPONSES.momentum;
  if (q.includes('friction')) return DEMO_RESPONSES.friction;
  return DEMO_RESPONSES.notfound;
}

function appendMsg(container, html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  container.appendChild(div.firstElementChild);
  container.scrollTop = container.scrollHeight;
}

function sendModalMessage() {
  const input = document.getElementById('modalInput');
  const msgs = document.getElementById('modalMessages');
  if (!input || !msgs) return;

  const text = input.value.trim();
  if (!text) return;

  // User bubble
  appendMsg(msgs, `
    <div class="msg user-msg">
      <div class="msg-bubble">${escapeHtml(text)}</div>
    </div>
  `);

  input.value = '';

  // Typing indicator
  const typingId = 'typing-' + Date.now();
  appendMsg(msgs, `
    <div class="msg ai-msg" id="${typingId}">
      <div class="msg-avatar">AI</div>
      <div class="msg-content">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    </div>
  `);
  msgs.scrollTop = msgs.scrollHeight;

  // Simulate response
  setTimeout(() => {
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    const resp = getResponse(text);
    let bubbleHtml;

    if (resp.isError) {
      bubbleHtml = `
        <div class="msg-bubble ai-bubble not-found">
          <div class="not-found-icon">⚠️</div>
          <strong>Not found in your Physics notes.</strong>
          <p style="font-size:0.82rem;margin-top:6px;color:var(--txt-secondary)">${escapeHtml(resp.text)}</p>
          <div class="msg-confidence medium"><div class="confidence-dot"></div>Out of Scope</div>
        </div>`;
    } else {
      bubbleHtml = `
        <div class="msg-bubble ai-bubble">
          ${escapeHtml(resp.text)}
          <div class="msg-citation">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            </svg>
            ${escapeHtml(resp.citation)}
          </div>
          <div class="msg-confidence high"><div class="confidence-dot"></div>Confidence: ${resp.confidence}</div>
          <div class="msg-snippet">${resp.snippet}</div>
        </div>`;
    }

    appendMsg(msgs, `
      <div class="msg ai-msg">
        <div class="msg-avatar">AI</div>
        <div class="msg-content">${bubbleHtml}</div>
      </div>
    `);
  }, 1200 + Math.random() * 600);
}

function askDemo(question) {
  const input = document.getElementById('modalInput');
  if (!input) return;
  input.value = question;
  sendModalMessage();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── 14. Notebook Scroll Animation ───────────────────────────── */
(function initNotebookScroll() {
  const coverRight = document.getElementById('nbCoverRight');
  const pen = document.getElementById('nbPen');
  const shadow = document.querySelector('.nb-shadow');
  const hero = document.getElementById('hero');
  if (!coverRight || !hero) return;

  window.addEventListener('scroll', () => {
    const rect = hero.getBoundingClientRect();
    const heroH = rect.height;
    // progress: 0 at top, 1 when hero is scrolled away
    const progress = Math.max(0, Math.min(1, -rect.top / (heroH * 0.6)));

    // Right cover opens (rotates) as you scroll down, closes as you scroll back up
    const angle = progress * -65; // max 65 degrees open
    coverRight.style.transform = `perspective(600px) rotateY(${angle}deg)`;

    // Pen lifts out
    if (pen) {
      const liftY = progress * -30;
      const liftX = progress * 20;
      const penRot = progress * -15;
      pen.style.transform = `translate(${liftX}px, ${liftY}px) rotate(${penRot}deg)`;
      pen.style.animation = progress > 0.05 ? 'none' : ''; // stop wiggle while scrolling
    }

    // Shadow gets wider as book opens
    if (shadow) {
      shadow.setAttribute('rx', 160 + progress * 20);
    }
  }, { passive: true });
})();
