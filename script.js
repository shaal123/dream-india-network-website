const YOUTUBE_ID = ''; /* paste your YouTube video ID here, for example 'dQw4w9WgXcQ' */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* menu */
const mb = $('.menu-btn'), nav = $('#nav');
mb.addEventListener('click', () => { const o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });
const subs = $$('.has-sub');
const canHover = () => matchMedia('(hover:hover) and (min-width:1101px)').matches;
function setOpen(li, o) { li.classList.toggle('open', o); $('.nav-btn', li).setAttribute('aria-expanded', o); }
function closeAll(except) { subs.forEach(li => { if (li !== except) setOpen(li, false); }); }
subs.forEach(li => {
  $('.nav-btn', li).addEventListener('click', () => { const o = canHover() ? true : !li.classList.contains('open'); closeAll(li); setOpen(li, o); });
  li.addEventListener('mouseenter', () => { if (canHover()) { closeAll(li); setOpen(li, true); } });
  li.addEventListener('mouseleave', () => { if (canHover()) setOpen(li, false); });
  li.addEventListener('focusout', (e) => { if (!li.contains(e.relatedTarget)) setOpen(li, false); });
});
document.addEventListener('click', (e) => { if (!e.target.closest('.nav')) closeAll(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeAll(); nav.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); } });
/* links are placeholders until the pages exist */
$$('a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

/* generic rotator */
function rotator(items, ms, onShow, opts = {}) {
  let i = 0, t, paused = reduce, hold = false;
  const show = (n) => { i = (n + items.length) % items.length; items.forEach((el, k) => el.classList.toggle('is-on', k === i)); onShow && onShow(i); };
  const tick = () => { clearTimeout(t); if (!paused && !hold && !document.hidden) t = setTimeout(() => { show(i + 1); tick(); }, ms); else t = setTimeout(tick, 600); };
  show(0); tick();
  return {
    go: (n) => { show(n); tick(); },
    next: () => { show(i + 1); tick(); }, prev: () => { show(i - 1); tick(); },
    setPaused: (p) => { paused = p; tick(); }, setHold: (h) => { hold = h; }, isPaused: () => paused, index: () => i,
  };
}

/* hero */
const hero = $('.hero'), slides = $$('.slide'), dots = $$('.hero .dot'), pauseBtn = $('#pause');
const HMS = 6500; hero.style.setProperty('--ms', HMS + 'ms');
let H; H = rotator(slides, HMS, (i) => {
  dots.forEach((d, k) => d.setAttribute('aria-current', k === i));
  slides.forEach((s, k) => s.setAttribute('aria-hidden', k !== i));
  hero.classList.remove('run'); void hero.offsetWidth; if (!H || !H.isPaused()) hero.classList.add('run');
});
$('#hprev').onclick = () => H.prev(); $('#hnext').onclick = () => H.next();
dots.forEach((d, k) => d.onclick = () => H.go(k));
pauseBtn.onclick = () => { const p = !H.isPaused(); H.setPaused(p); pauseBtn.textContent = p ? '▶' : '❚❚'; pauseBtn.setAttribute('aria-label', p ? 'Play banners' : 'Pause banners'); hero.classList.toggle('run', !p); };
if (reduce) { pauseBtn.textContent = '▶'; pauseBtn.setAttribute('aria-label', 'Play banners'); }
hero.addEventListener('mouseenter', () => H.setHold(true)); hero.addEventListener('mouseleave', () => H.setHold(false));
hero.addEventListener('focusin', () => H.setHold(true)); hero.addEventListener('focusout', () => H.setHold(false));

/* sponsor strip + contents */
rotator($$('.msg'), 5200);
const cdots = $$('.cdots .dot');
const C = rotator($$('.cp'), 7000, (i) => cdots.forEach((d, k) => d.setAttribute('aria-current', k === i)));
cdots.forEach((d, k) => d.onclick = () => C.go(k));
$('.contents').addEventListener('mouseenter', () => C.setHold(true)); $('.contents').addEventListener('mouseleave', () => C.setHold(false));

/* video */
$$('.video').forEach(vid => vid.addEventListener('click', () => {
  if (YOUTUBE_ID) { const f = document.createElement('iframe'); f.src = 'https://www.youtube-nocookie.com/embed/' + YOUTUBE_ID + '?autoplay=1&rel=0'; f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true; f.title = 'Dream India Network video'; vid.appendChild(f); }
  else $('.vnote', vid).classList.add('show');
}));

/* programme pop-ups */
const PROG = {"foster": {"t": "Foster Homes", "d": "Family-based care that gives children a safe, loving home while they grow.", "a": "k-foster"}, "adoption": {"t": "Adoption", "d": "Helping children find a permanent, caring family.", "a": "k-foster"}, "school": {"t": "School", "d": "Education that keeps children learning and opens a path forward.", "a": "k-school"}, "preschool": {"t": "Pre-schools", "d": "A safe and playful start to learning for the youngest children.", "a": "k-school"}, "cfs": {"t": "CFS", "d": "Details to be added.", "a": "k-shelter"}, "grace": {"t": "Grace Hospital", "d": "Healthcare for destitute and homeless people.", "a": "k-clinic"}, "mobile": {"t": "Mobile Clinic Service", "d": "A clinic on wheels that brings care to people where they live.", "a": "k-clinic"}, "night": {"t": "Night Survey", "d": "Teams reach people sleeping outside at night and connect them to help.", "a": "k-shelter"}, "openshelter": {"t": "Open Shelter", "d": "A safe place to rest, with dignity.", "a": "k-shelter"}, "learn": {"t": "Learn to Transform Project", "d": "Learning and skills for the transgender community.", "a": "k-empower"}, "inclusion": {"t": "Empowerment & Inclusion Project", "d": "Equal place and opportunity for the transgender community.", "a": "k-empower"}, "food": {"t": "Food Basket", "d": "Food that reaches families and individuals who need it.", "a": "k-food"}, "research": {"t": "Research, Training and Advocacy", "d": "Evidence and advocacy that speak up for people on the margins.", "a": "k-bond"}};
const dlg = $('#pop');
$$('[data-pop]').forEach(b => b.addEventListener('click', () => {
  const p = PROG[b.dataset.pop]; $('#pop-t').textContent = p.t; $('#pop-d').textContent = p.d;
  const box = $('#pop-art'); if (box) { box.innerHTML = ''; if (document.getElementById(p.a)) box.innerHTML = '<svg class="art" aria-hidden="true"><use href="#' + p.a + '" width="100%" height="100%"/></svg>'; box.hidden = !box.innerHTML; }
  dlg.showModal();
}));
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

/* count up */
const fmt = (n) => n.toLocaleString('en-IN');
const nums = $$('.num');
const run = () => nums.forEach(el => {
  const to = +el.dataset.to; if (reduce) return; const t0 = performance.now(), D = 1500;
  const step = (t) => { const k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(Math.round(to * e)) + '+'; if (k < 1) requestAnimationFrame(step); };
  el.textContent = '0+'; requestAnimationFrame(step);
});
if ('IntersectionObserver' in window && !reduce) { const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { run(); io.disconnect(); } }, { threshold: .35 }); io.observe($('.impact')); }

/* tabs */
const tabs = $$('.tab');
tabs.forEach(t => t.addEventListener('click', () => {
  tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', on); $('#' + x.getAttribute('aria-controls')).hidden = !on; });
}));

/* flip cards */
const flips = $$('.flip');
flips.forEach((f, k) => {
  const toggle = () => f.classList.toggle('on');
  f.addEventListener('click', toggle);
  f.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  let hover = false; f.addEventListener('mouseenter', () => hover = true); f.addEventListener('mouseleave', () => hover = false);
  if (!reduce) setTimeout(() => setInterval(() => { if (!hover && !document.hidden && f.offsetParent) toggle(); }, 7000), 1200 + (k % 6) * 900);
});

/* newsletter */
$('#news-form').addEventListener('submit', (e) => {
  e.preventDefault();
  $('#news-ok').textContent = 'Thank you. This preview is not connected to an email service yet.';
});

/* content pages */
const homeView = $('#home-view'), pages = $$('.page'), homeTitle = document.title;
function route() {
  const h = location.hash, m = h.match(/^#\/([\w-]+)/);
  const pg = m && pages.find(p => p.dataset.page === m[1]);
  homeView.hidden = !!pg;
  pages.forEach(p => p.hidden = p !== pg);
  document.title = pg ? pg.dataset.title + ' | Dream India Network' : homeTitle;
  closeAll(); nav.classList.remove('open'); mb.setAttribute('aria-expanded', 'false');
  if (pg) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const t = $('h1', pg); t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true });
  } else if (h.length > 1 && !m) {
    requestAnimationFrame(() => { const t = document.getElementById(decodeURIComponent(h.slice(1))); if (t) t.scrollIntoView(); });
  } else if (!h || h === '#') { window.scrollTo({ top: 0, behavior: 'instant' }); }
}
window.addEventListener('hashchange', route); route();

/* map: highlight a state from its name or from the map */
$$('[data-s]').forEach(el => {
  const on = (v) => $$('[data-s="' + el.dataset.s + '"]').forEach(x => x.classList.toggle('hl', v));
  el.addEventListener('mouseenter', () => on(true)); el.addEventListener('mouseleave', () => on(false));
  el.addEventListener('focus', () => on(true)); el.addEventListener('blur', () => on(false));
});