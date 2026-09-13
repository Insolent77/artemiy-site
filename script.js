document.documentElement.classList.add('js');
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

const header = document.querySelector('.site-header');
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobile = window.matchMedia('(max-width: 800px)');

function closeMenu(returnFocus = false) {
  header.classList.remove('menu-open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Открыть меню');
  if (returnFocus) menu.focus();
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  header.classList.toggle('menu-open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && header.classList.contains('menu-open')) closeMenu(true);
});
document.addEventListener('click', event => {
  if (!header.contains(event.target)) closeMenu();
});
header.addEventListener('focusout', event => {
  if (!header.contains(event.relatedTarget)) closeMenu();
});
mobile.addEventListener('change', () => closeMenu());
navigation.addEventListener('click', event => {
  if (!event.target.closest('a')) return;
  closeMenu();
  // Keep keyboard focus on the destination after hiding the mobile navigation.
  const target = document.querySelector(event.target.closest('a').hash);
  if (target) {
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
});
let scrollScheduled = false;
function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 24);
  scrollScheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scrollScheduled) {
    scrollScheduled = true;
    requestAnimationFrame(updateHeader);
  }
}, { passive: true });
updateHeader();

if ('IntersectionObserver' in window) {
  const items = [...document.querySelectorAll('.reveal')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('is-pending');
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  items.forEach(el => {
    // Above-the-fold content remains immediately readable.
    if (motion.matches || el.getBoundingClientRect().top < window.innerHeight) return;
    const siblings = [...el.parentElement.children];
    el.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(el) % 3, 2) * 65}ms`);
    el.classList.add('is-pending');
    observer.observe(el);
  });
  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    observer.disconnect();
    items.forEach(el => el.classList.remove('is-pending'));
  });
  const links = [...navigation.querySelectorAll('a')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  ['services', 'benefits', 'contacts'].forEach(id => sectionObserver.observe(document.getElementById(id)));
}
