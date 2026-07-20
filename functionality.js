// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {

    // Smooth internal links
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', e=>{
        const href = a.getAttribute('href');
        if(href.startsWith('#')){
          e.preventDefault(); const el = document.querySelector(href);
          if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
          closeMobileNav();
        }
      });
    });

    // Mobile nav toggle
    const navToggle = document.getElementById('navToggle');
    const primaryNav = document.getElementById('primaryNav');
    function closeMobileNav(){
      if(navToggle && primaryNav){ navToggle.classList.remove('open'); navToggle.setAttribute('aria-expanded','false'); primaryNav.classList.remove('open'); }
    }
    if(navToggle && primaryNav){
      navToggle.addEventListener('click', ()=>{
        const isOpen = primaryNav.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
      });
      document.addEventListener('click', (e)=>{
        if(!primaryNav.contains(e.target) && !navToggle.contains(e.target)) closeMobileNav();
      });
    }

    // Scroll reveal (IntersectionObserver) for generic .reveal elements and project cards
    const revealTargets = document.querySelectorAll('.reveal, .projects-grid .project-card');
    if('IntersectionObserver' in window && revealTargets.length){
      const io = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            entry.target.classList.add('in-view');
            entry.target.classList.add('show'); // project-card compatibility
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealTargets.forEach(t=> io.observe(t));
    } else {
      revealTargets.forEach(t=>{ t.classList.add('in-view'); t.classList.add('show'); });
    }

    // Count-up animation for hero stats
    const statNums = document.querySelectorAll('.stat-num');
    if(statNums.length){
      const animateCount = (el)=>{
        const target = parseFloat(el.getAttribute('data-count')) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1400;
        const start = performance.now();
        function tick(now){
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.round(target * eased);
          el.textContent = value + suffix;
          if(progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      };
      if('IntersectionObserver' in window){
        const statIo = new IntersectionObserver((entries)=>{
          entries.forEach(entry=>{
            if(entry.isIntersecting){ animateCount(entry.target); statIo.unobserve(entry.target); }
          });
        }, { threshold: 0.5 });
        statNums.forEach(n=> statIo.observe(n));
      } else {
        statNums.forEach(animateCount);
      }
    }

    // Back to top
    const back = document.getElementById('backToTop');
    if(back){
      window.addEventListener('scroll', ()=>{ if(window.scrollY > 420) back.style.display = 'flex'; else back.style.display = 'none'; });
      back.addEventListener('click', ()=>window.scrollTo({top:0, behavior:'smooth'}));
    }

    // Subtle tilt effect on project cards
    document.querySelectorAll('.project-card').forEach(card=>{
      card.addEventListener('mousemove', (e)=>{
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*4).toFixed(2)}deg)`;
      });
      card.addEventListener('mouseleave', ()=>{ card.style.transform = ''; });
    });

    // Modal logic with smooth fade+scale
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalTech = document.getElementById('modalTech');
    const modalDesc = document.getElementById('modalDesc');
    const modalTags = document.getElementById('modalTags');
    const modalLogo = document.getElementById('modalLogo');
    const modalClose = document.getElementById('modalClose');
    const modalLive = document.getElementById('modalLive');

    function openModal(data){
      if(!modalBackdrop) return;
      modalTitle.textContent = data.title || 'Project';
      modalTech.textContent = data.tech || ''; modalDesc.textContent = data.desc || '';
      modalTags.innerHTML = '';
      (data.tags||[]).forEach(t=>{ const el = document.createElement('span'); el.className = 'chip'; el.textContent = t; modalTags.appendChild(el); });
      if(modalLogo){
        modalLogo.innerHTML = '';
        if(data.logo){ const img = document.createElement('img'); img.src = data.logo; img.alt = data.title || 'logo'; modalLogo.appendChild(img); }
        else { const i = document.createElement('i'); i.className = data.icon || 'fas fa-folder-open'; modalLogo.appendChild(i); }
      }
      if(data.live){ modalLive.href = data.live; modalLive.style.display = 'inline-block'; } else modalLive.style.display = 'none';
      modalBackdrop.style.display = 'flex';
      requestAnimationFrame(()=> modal.classList.add('open'));
      modalBackdrop.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden';
    }

    function closeModal(){
      if(!modalBackdrop) return;
      modal.classList.remove('open');
      setTimeout(()=>{ modalBackdrop.style.display = 'none'; modalBackdrop.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }, 220);
    }

    document.querySelectorAll('.project-card').forEach(card=>{
      card.addEventListener('click', ()=>{ try{ const raw = card.getAttribute('data-project'); const data = JSON.parse(raw); openModal(data); }catch(e){console.error(e)} });
      card.addEventListener('keydown', e=>{ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); card.click(); } });
    });

    if(modalClose) modalClose.addEventListener('click', closeModal);
    if(modalBackdrop) modalBackdrop.addEventListener('click', (e)=>{ if(e.target === modalBackdrop) closeModal(); });
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

}); // End DOMContentLoaded