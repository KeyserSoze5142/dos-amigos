// Dos Amigos Mexican Grill — shared site script

// ── Menu tabs (data-tab buttons + #hash deep links, e.g. /menu/#drinks) ──
function showTab(name, updateHash) {
  var panel = document.getElementById('tab-' + name);
  if (!panel) return false;
  document.querySelectorAll('.menu-panel').forEach(function (p) { p.classList.remove('active'); });
  document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
  panel.classList.add('active');
  var btn = document.querySelector('.tab-btn[data-tab="' + name + '"]');
  if (btn) { btn.classList.add('active'); btn.setAttribute('aria-selected', 'true'); if (btn.scrollIntoView) btn.scrollIntoView({ inline: 'center', block: 'nearest' }); }
  if (updateHash && history.replaceState) history.replaceState(null, '', '#' + name);
  return true;
}
document.querySelectorAll('.tab-btn[data-tab]').forEach(function (b) {
  b.addEventListener('click', function () { showTab(b.getAttribute('data-tab'), true); });
});
if (document.querySelector('.menu-tabs')) {
  var h = location.hash.replace('#', '').replace(/^tab-/, '');
  if (h && showTab(h)) {
    var el = document.querySelector('.menu-tabs');
    if (el) setTimeout(function () { el.scrollIntoView({ block: 'start' }); }, 50);
  }
}

// ── Highlight today's hours ──
var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var todayName = DAYS[new Date().getDay()];
document.querySelectorAll('.hours-table tr').forEach(function (tr) {
  var td = tr.querySelector('td');
  if (td && td.textContent.trim() === todayName) tr.classList.add('today');
});

// ── Today's special badge (home + specials) ──
var dayCode = { Sunday: 'SUN', Monday: 'MON', Tuesday: 'TUE', Wednesday: 'WED', Thursday: 'THU', Friday: 'FRI', Saturday: 'FRI' }[todayName];
document.querySelectorAll('.special-card[data-day="' + dayCode + '"]').forEach(function (card) {
  card.classList.add('is-today');
  var badge = document.createElement('div');
  badge.className = 'today-badge';
  badge.textContent = 'Today';
  card.appendChild(badge);
});

// ── Mobile nav toggle ──
function toggleMobileMenu(btn) {
  var links = document.querySelector('.nav-links');
  var open = links.classList.toggle('nav-open');
  if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}
document.querySelectorAll('.nav-links a').forEach(function (link) {
  link.addEventListener('click', function () { document.querySelector('.nav-links').classList.remove('nav-open'); });
});
document.addEventListener('click', function (e) {
  if (!e.target.closest('nav')) {
    var l = document.querySelector('.nav-links'); if (l) l.classList.remove('nav-open');
  }
});

// ── Entrance animations ──
if ('IntersectionObserver' in window) {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; observer.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.special-card, .review-card, .gallery-item, .menu-item, .faq-item').forEach(function (el) {
    el.style.cssText += 'opacity:0;transform:translateY(20px);transition:opacity 0.5s ease,transform 0.5s ease;';
    observer.observe(el);
  });
}
