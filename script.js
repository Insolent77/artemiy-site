document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener('click',e=>{
    const target=document.querySelector(link.getAttribute('href'));
    if(!target)return;
    e.preventDefault();
    target.scrollIntoView({behavior:'smooth',block:'start'});
  });
});

const items=[...document.querySelectorAll('.reveal')];

if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },{threshold:.08,rootMargin:'0px 0px -5% 0px'});

  items.forEach((el,i)=>{
    el.style.transitionDelay=`${(i%6)*45}ms`;
    observer.observe(el);
  });
}else{
  items.forEach(el=>el.classList.add('is-visible'));
}