(function(){
  var d=document;
  var rok=d.getElementById('rok'); if(rok) rok.textContent=new Date().getFullYear();

  // menu mobilne
  var burger=d.getElementById('burger'), menu=d.getElementById('menu');
  function zamknij(){menu.classList.remove('otw');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Otwórz menu');}
  burger.addEventListener('click',function(){
    var o=menu.classList.toggle('otw');
    burger.setAttribute('aria-expanded',o?'true':'false');
    burger.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');
  });
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',zamknij);});
  d.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij();});

  // aktywna pozycja menu = bieżąca sekcja
  var linki=[].slice.call(menu.querySelectorAll('a'));
  var sekcje=linki.map(function(a){return d.querySelector(a.getAttribute('href'));});
  function ustawAktywny(){
    var y=window.scrollY+window.innerHeight*0.35, akt=-1;
    sekcje.forEach(function(s,i){if(s&&s.offsetTop<=y)akt=i;});
    linki.forEach(function(a,i){a.classList.toggle('on',i===akt);if(i===akt)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
  }
  window.addEventListener('scroll',ustawAktywny,{passive:true}); ustawAktywny();

  // przeciąganie myszą dla torów przewijanych
  function przeciagaj(tor){
    var start=0,pos=0,ciag=false,ruch=0;
    tor.addEventListener('pointerdown',function(e){
      if(e.pointerType!=='mouse')return;
      ciag=true;ruch=0;start=e.clientX;pos=tor.scrollLeft;tor.classList.add('ciagnie');
    });
    window.addEventListener('pointermove',function(e){
      if(!ciag)return; ruch=e.clientX-start; tor.scrollLeft=pos-ruch;
    });
    window.addEventListener('pointerup',function(){
      if(!ciag)return; ciag=false; tor.classList.remove('ciagnie');
      var w=tor.firstElementChild?tor.firstElementChild.getBoundingClientRect().width:tor.clientWidth;
      var krok=w+(parseFloat(getComputedStyle(tor).columnGap)||0);
      var idx=Math.round(tor.scrollLeft/krok);
      if(Math.abs(ruch)>40){idx=Math.round(pos/krok)+(ruch<0?1:-1);}
      tor.scrollTo({left:Math.max(0,idx*krok),behavior:'smooth'});
    });
    tor.addEventListener('click',function(e){if(Math.abs(ruch)>5){e.preventDefault();e.stopPropagation();}},true);
  }

  var str='<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  d.querySelectorAll('[data-gal]').forEach(function(g){
    var tor=g.querySelector('.gal-tor'), n=tor.children.length;
    if(n<2)return;
    var nr=d.createElement('span');nr.className='gal-nr';nr.textContent='1 / '+n;g.appendChild(nr);
    var l=d.createElement('button'),r=d.createElement('button');
    l.className='gal-str l';r.className='gal-str r';l.type=r.type='button';
    l.setAttribute('aria-label','Poprzednie zdjęcie');r.setAttribute('aria-label','Następne zdjęcie');
    l.innerHTML=str;r.innerHTML=str;r.querySelector('svg').style.transform='scaleX(-1)';
    g.appendChild(l);g.appendChild(r);
    function idx(){return Math.round(tor.scrollLeft/tor.clientWidth);}
    function idz(i){i=(i+n)%n;tor.scrollTo({left:i*tor.clientWidth,behavior:'smooth'});}
    l.addEventListener('click',function(){idz(idx()-1);});
    r.addEventListener('click',function(){idz(idx()+1);});
    tor.addEventListener('scroll',function(){nr.textContent=(idx()+1)+' / '+n;},{passive:true});
    tor.tabIndex=0;tor.setAttribute('aria-label','Galeria zdjęć, '+n+' zdjęć');
    tor.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();idz(idx()+1);}if(e.key==='ArrowLeft'){e.preventDefault();idz(idx()-1);}});
    przeciagaj(tor);
  });
  d.querySelectorAll('[data-tor]').forEach(przeciagaj);

  // temat zapytania z karty oferty
  var temat=d.getElementById('temat');
  d.querySelectorAll('[data-temat]').forEach(function(a){
    a.addEventListener('click',function(){temat.value=a.getAttribute('data-temat');});
  });

  // formularz pokazowy
  var form=d.getElementById('form'), info=d.getElementById('formInfo');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    info.textContent='To podgląd strony. Na docelowej stronie zapytanie trafi od razu na sak@sak.com.pl.';
  });

  // dolny pasek na telefonie dopiero po minięciu przycisku z pierwszego ekranu
  var mob=d.getElementById('mob'), cta=d.getElementById('heroCta');
  if('IntersectionObserver' in window && mob && cta){
    new IntersectionObserver(function(w){
      var e=w[0], pod=!e.isIntersecting && e.boundingClientRect.top<0;
      mob.classList.toggle('widac',pod); mob.setAttribute('aria-hidden',pod?'false':'true');
      d.body.classList.toggle('ma-mob',pod);
    }).observe(cta);
  }
})();
