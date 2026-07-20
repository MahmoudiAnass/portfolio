// functionality.js — Anass Mahmoudi portfolio
// Quiet interactions: scroll reveals, mobile nav, project modal, header shadow, back-to-top.

document.addEventListener('DOMContentLoaded', () => {

  // ---------- smooth internal anchors ----------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href && href.length > 1 && href.startsWith('#')) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          closeMobileNav();
        }
      }
    });
  });

  // ---------- mobile nav ----------
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  function closeMobileNav() {
    if (!navToggle || !primaryNav) return;
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    primaryNav.classList.remove('open');
  }
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = primaryNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    document.addEventListener('click', (e) => {
      if (!primaryNav.contains(e.target) && !navToggle.contains(e.target)) closeMobileNav();
    });
    primaryNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileNav));
  }

  // ---------- header shadow on scroll ----------
  const header = document.querySelector('header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------- scroll reveal ----------
  const revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealTargets.length) {
    // stagger items within a common parent
    revealTargets.forEach((el, i) => {
      const parent = el.parentElement;
      const siblings = parent ? parent.querySelectorAll(':scope > .reveal') : [el];
      const idx = Array.prototype.indexOf.call(siblings, el);
      const delay = Math.min(idx, 6) * 60; // cap the stagger
      el.style.setProperty('--reveal-delay', delay + 'ms');
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(t => io.observe(t));
  } else {
    revealTargets.forEach(t => t.classList.add('in-view'));
  }

  // ---------- back to top ----------
  const back = document.getElementById('backToTop');
  if (back) {
    window.addEventListener('scroll', () => {
      back.style.display = window.scrollY > 520 ? 'flex' : 'none';
    }, { passive: true });
    back.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ---------- project modal ----------
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modal         = document.getElementById('modal');
  const modalTitle    = document.getElementById('modalTitle');
  const modalRole     = document.getElementById('modalRole');
  const modalYear     = document.getElementById('modalYear');
  const modalTech     = document.getElementById('modalTech');
  const modalDesc     = document.getElementById('modalDesc');
  const modalTags     = document.getElementById('modalTags');
  const modalClose    = document.getElementById('modalClose');
  const modalLive     = document.getElementById('modalLive');

  function openModal(data) {
    if (!modalBackdrop || !modal) return;
    if (modalTitle) modalTitle.textContent = data.title || 'Project';
    if (modalRole)  modalRole.innerHTML    = data.role  || '';
    if (modalYear)  modalYear.innerHTML    = data.year  || '';
    if (modalTech)  modalTech.innerHTML    = data.tech  || '';
    if (modalDesc)  modalDesc.innerHTML    = data.desc  || '';
    if (modalTags) {
      modalTags.innerHTML = '';
      (data.tags || []).forEach(t => {
        const el = document.createElement('span');
        el.className = 'chip';
        el.textContent = t;
        modalTags.appendChild(el);
      });
    }
    if (modalLive) {
      if (data.live) { modalLive.href = data.live; modalLive.style.display = 'inline-flex'; }
      else modalLive.style.display = 'none';
    }
    modalBackdrop.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('open'));
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    if (!modalBackdrop || !modal) return;
    modal.classList.remove('open');
    setTimeout(() => {
      modalBackdrop.style.display = 'none';
      modalBackdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }, 240);
  }

  // Trigger modal only when a work item is activated with a modifier key or via keyboard;
  // by default, the anchor navigates directly to the live URL — which is what most visitors want.
  // Keyboard: Shift+Enter opens the modal instead of following the link.
  document.querySelectorAll('.work-item').forEach(item => {
    const link = item.querySelector('.work-link');
    if (!link) return;
    link.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.shiftKey) {
        e.preventDefault();
        try { openModal(JSON.parse(item.getAttribute('data-project'))); } catch (err) { console.error(err); }
      }
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

});
