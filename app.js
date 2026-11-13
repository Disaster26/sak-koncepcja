(function(){
  var d=document;
  // menu mobilne
  var b=d.getElementById('burger'),m=d.getElementById('menu');
  function zamknij(){m.classList.remove('otw');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Otwórz menu');}
  b.addEventListener('click',function(){var o=m.classList.toggle('otw');b.setAttribute('aria-expanded',o?'true':'false');b.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');});
  m.addEventListener('click',function(e){if(e.target.tagName==='A')zamknij();});
  d.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij();});

  // aktywna pozycja menu
  var linki=[].slice.call(m.querySelectorAll('a'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){linki.forEach(function(a){a.classList.toggle('akt',a.getAttribute('href')==='#'+en.target.id);});}});},{rootMargin:'-45% 0px -50% 0px'});
    linki.forEach(function(a){var s=d.querySelector(a.getAttribute('href'));if(s)io.observe(s);});
    var start=d.getElementById('start');
    new IntersectionObserver(function(es){if(es[0].isIntersecting)linki.forEach(function(a){a.classList.remove('akt');});},{rootMargin:'-45% 0px -50% 0px'}).observe(start);
  }

  // karuzele: palec, mysz, strzałki, licznik
  var strz='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10 3L5 8l5 5"/></svg>';
  [].forEach.call(d.querySelectorAll('[data-kar]'),function(k){
    var t=k.querySelector('.kar-tor'),n=t.children.length;
    if(n<2)return;
    var l=d.createElement('span');l.className='licz';k.appendChild(l);
    var p=d.createElement('button');p.type='button';p.className='wst';p.setAttribute('aria-label','Poprzednie zdjęcie');p.innerHTML=strz;
    var nx=d.createElement('button');nx.type='button';nx.className='dal';nx.setAttribute('aria-label','Następne zdjęcie');nx.innerHTML=strz.replace('M10 3L5 8l5 5','M6 3l5 5-5 5');
    k.appendChild(p);k.appendChild(nx);
    function idx(){return Math.round(t.scrollLeft/t.clientWidth);}
    function upd(){l.textContent=(idx()+1)+' / '+n;}
    function idz(i){i=(i+n)%n;t.scrollTo({left:i*t.clientWidth,behavior:'smooth'});}
    p.addEventListener('click',function(){idz(idx()-1);});
    nx.addEventListener('click',function(){idz(idx()+1);});
    t.addEventListener('scroll',function(){window.requestAnimationFrame(upd);},{passive:true});
    t.tabIndex=0;t.setAttribute('aria-label','Galeria zdjęć, '+n+' zdjęć');
    t.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();idz(idx()+1);}if(e.key==='ArrowLeft'){e.preventDefault();idz(idx()-1);}});
    var x0=0,s0=0,ciag=false,ruch=0;
    t.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;ciag=true;ruch=0;x0=e.clientX;s0=t.scrollLeft;t.classList.add('ciag');t.setPointerCapture(e.pointerId);});
    t.addEventListener('pointermove',function(e){if(!ciag)return;ruch=e.clientX-x0;t.scrollLeft=s0-ruch;});
    function kon(){if(!ciag)return;ciag=false;t.classList.remove('ciag');var i=Math.round(s0/t.clientWidth);if(ruch<-40)i++;else if(ruch>40)i--;i=Math.max(0,Math.min(n-1,i));t.scrollTo({left:i*t.clientWidth,behavior:'smooth'});}
    t.addEventListener('pointerup',kon);t.addEventListener('pointercancel',kon);
    t.addEventListener('click',function(e){if(Math.abs(ruch)>6){e.preventDefault();e.stopPropagation();}},true);
    upd();
  });

  // wszystkie inwestycje na telefonie
  var w=d.getElementById('wiecej'),inw=d.getElementById('inw');
  w.addEventListener('click',function(){inw.classList.add('wszystkie');});

  // przycisk "zapytaj" ustawia temat formularza
  var sel=d.getElementById('f-temat');
  [].forEach.call(d.querySelectorAll('[data-temat]'),function(a){a.addEventListener('click',function(){sel.value=a.getAttribute('data-temat');});});

  // formularz pokazowy
  d.getElementById('form').addEventListener('submit',function(e){e.preventDefault();d.getElementById('info').textContent='To podgląd strony. Na gotowej stronie zapytanie trafi na sak@sak.com.pl.';});

  // pasek kontaktu po przewinięciu za pierwszy ekran
  var mob=d.getElementById('mob'),hero=d.querySelector('.hero-in .btn');
  if('IntersectionObserver' in window&&hero){new IntersectionObserver(function(es){mob.classList.toggle('widac',!es[0].isIntersecting&&es[0].boundingClientRect.top<0);}).observe(hero);}

  // mapa ładowana przy przewinięciu
  var mapa=d.getElementById('mapa');
  function laduj(){if(mapa.dataset.ok)return;mapa.dataset.ok=1;var f=d.createElement('iframe');f.src=mapa.dataset.src;f.title='Mapa: ul. Zwycięstwa 28, Koszalin';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';mapa.appendChild(f);}
  if('IntersectionObserver' in window){new IntersectionObserver(function(es,o){if(es[0].isIntersecting){laduj();o.disconnect();}},{rootMargin:'400px'}).observe(mapa);}else laduj();

  d.getElementById('rok').textContent=new Date().getFullYear();
})();
