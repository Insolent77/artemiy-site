document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',e=>{
  const id=link.getAttribute('href'); if(id==='#') return;
  const target=document.querySelector(id); if(!target) return;
  e.preventDefault(); target.scrollIntoView({behavior:'smooth',block:'start'});
}));