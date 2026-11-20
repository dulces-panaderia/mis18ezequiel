// Editá estos datos:
var WHATSAPP = "5493816659457";      // código de país + número, sin + ni espacios
var ALIAS = "ezequiel.148.tubo.mp";            // alias para los regalos
var FIESTA = new Date("2026-12-26T22:00:00-03:00");

// Música de fondo: el navegador solo la permite después de un toque, así que arranca con la primera interacción
(function(){
  var musica = document.getElementById("musica"), boton = document.getElementById("sonido"), pausaManual = false, reanuda = false;
  musica.volume = 1;
  function estado(){ var on = !musica.paused; boton.classList.toggle("on", on); boton.setAttribute("aria-pressed", on); }
  function suena(){ var p = musica.play(); if (p && p.catch) p.catch(function(){}); }
  musica.addEventListener("play", estado); musica.addEventListener("pause", estado);
  boton.addEventListener("click", function(){
    if (musica.paused){ pausaManual = false; suena(); } else { pausaManual = true; musica.pause(); }
  });
  var eventos = ["pointerup", "touchend", "keydown", "click"];
  function primero(e){
    if (e.target && e.target.closest && e.target.closest("#sonido")) return;
    eventos.forEach(function(ev){ removeEventListener(ev, primero); });
    if (!pausaManual && musica.paused) suena();
  }
  eventos.forEach(function(ev){ addEventListener(ev, primero, {passive: true}); });
  var puerta = document.getElementById("entrar");
  puerta.addEventListener("click", function(){
    pausaManual = false; suena();
    document.documentElement.classList.remove("espera");
    puerta.classList.add("abierta");
    setTimeout(function(){ puerta.hidden = true; }, 1700);
  });
  suena();
  document.addEventListener("visibilitychange", function(){
    if (document.hidden){ if (!musica.paused){ reanuda = true; musica.pause(); } }
    else if (reanuda){ reanuda = false; suena(); }
  });
})();

// Animaciones al deslizar
(function(){
  var de = document.documentElement, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, els = [];
  de.classList.add("js", "espera");
  if (!reduce){
    de.classList.add("bloqueo");
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    scrollTo(0, 0);
    var libera = function(){ de.classList.remove("bloqueo"); };
    var fin = document.querySelector(".nombre .trazo");
    if (fin) fin.addEventListener("animationend", function(e){ if (e.animationName === "rellena") libera(); });
    document.getElementById("entrar").addEventListener("click", function(){ setTimeout(libera, 6000); });
  }
  function marca(c, i, base, zoom){ c.classList.add("rv"); if (zoom) c.classList.add("zoom"); c.style.setProperty("--d", (base + i * .16) + "s"); els.push(c); }
  document.querySelectorAll("section, .cierre-cielo").forEach(function(sec){
    Array.prototype.forEach.call(sec.children, function(c, i){ if (!c.classList.contains("iconos") && !c.classList.contains("fx")) marca(c, i, 0); });
  });
  document.querySelectorAll(".iconos > div").forEach(function(c, i){ marca(c, i * 1.6, .2, true); });
  document.querySelectorAll(".hero .texto > :not(.nombre):not(.mis)").forEach(function(c, i){ marca(c, i * 1.5, 2.6); });
  document.querySelectorAll(".ic path").forEach(function(p){ try { p.style.setProperty("--l", Math.ceil(p.getTotalLength())); } catch (e) {} });
  function muestra(c){
    c.classList.add("in");
    var ic = c.querySelector(".ic"); if (ic) ic.classList.add("dib");
    setTimeout(function(){ c.classList.remove("rv", "in", "zoom"); }, 4200);
  }
  if ("IntersectionObserver" in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting){ if (de.classList.contains("espera") && e.target.closest(".hero")) return; muestra(e.target); io.unobserve(e.target); } });
    }, {threshold: .2, rootMargin: "0px 0px -6% 0px"});
    els.forEach(function(c){ io.observe(c); });
    document.getElementById("entrar").addEventListener("click", function(){
      setTimeout(function(){ document.querySelectorAll(".hero .rv").forEach(function(c){ io.unobserve(c); io.observe(c); }); }, 60);
    });
  } else els.forEach(muestra);
  var hero = document.querySelector(".hero"), bar = document.getElementById("prog"), espera = false;
  function alDeslizar(){
    if (espera) return; espera = true;
    requestAnimationFrame(function(){
      var y = window.scrollY, max = de.scrollHeight - innerHeight;
      bar.style.setProperty("--p", max > 0 ? Math.min(1, y / max) : 0);
      if (!reduce && y < innerHeight * 1.3) hero.style.setProperty("--sy", y);
      espera = false;
    });
  }
  addEventListener("scroll", alDeslizar, {passive: true}); alDeslizar();
})();

// Fondo animado: estrellas que titilan, planetas a la deriva y estrellas fugaces
document.querySelectorAll("canvas.fx").forEach(function(cv){
  var ctx = cv.getContext("2d"), W = 0, H = 0, stars = [], planets = [], shots = [], luna = null, vivo = true;
  var quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function init(){
    var r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height; if (!W || !H) return;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(W * H / 1000), m = Math.min(W, H); stars = [];
    for (var i = 0; i < n; i++) stars.push({x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + .3, f: Math.random() * 6.28, v: Math.random() * 1.6 + .5, b: Math.random() < .05});
    planets = []; luna = cv.dataset.luna ? pintaLuna(W, H) : null;
    dibuja(0);
  }
  function pintaLuna(W, H){
    var d = Math.min(W < 700 ? W * .5 : H * .55, 340), pad = d * .25, c = document.createElement("canvas");
    c.width = c.height = Math.round(d + pad * 2);
    var x = c.getContext("2d"), R = d / 2, C = c.width / 2, i, g;
    g = x.createRadialGradient(C, C, R * .9, C, C, R * 1.25);
    g.addColorStop(0, "rgba(160,200,255,.45)"); g.addColorStop(1, "rgba(160,200,255,0)");
    x.fillStyle = g; x.fillRect(0, 0, c.width, c.height);
    x.save(); x.beginPath(); x.arc(C, C, R, 0, 6.283); x.clip();
    g = x.createRadialGradient(C - R * .3, C - R * .3, R * .1, C, C, R);
    g.addColorStop(0, "#eaf4ff"); g.addColorStop(.6, "#a9c9e6"); g.addColorStop(1, "#5d86b0");
    x.fillStyle = g; x.fillRect(0, 0, c.width, c.height);
    var s = 7; function rnd(){ s = (s * 16807) % 2147483647; return s / 2147483647; }
    for (i = 0; i < 22; i++){
      var px = C + (rnd() - .5) * R * 1.7, py = C + (rnd() - .5) * R * 1.7, r = R * (.07 + rnd() * .17);
      g = x.createRadialGradient(px, py, 0, px, py, r);
      g.addColorStop(0, "rgba(70,105,150," + (.35 + rnd() * .25) + ")"); g.addColorStop(1, "rgba(70,105,150,0)");
      x.fillStyle = g; x.fillRect(px - r, py - r, r * 2, r * 2);
    }
    for (i = 0; i < 45; i++){
      var qx = C + (rnd() - .5) * R * 1.8, qy = C + (rnd() - .5) * R * 1.8, q = R * (.015 + rnd() * .04);
      x.strokeStyle = "rgba(255,255,255,.22)"; x.lineWidth = 1; x.beginPath(); x.arc(qx, qy, q, 0, 6.283); x.stroke();
      x.strokeStyle = "rgba(40,70,110,.25)"; x.beginPath(); x.arc(qx + 1, qy + 1, q, 0.5, 3.6); x.stroke();
    }
    x.restore();
    var m = W < 700;
    return {img: c, d: c.width, x: m ? W * .04 - c.width / 2 : W * .08 - pad, y: m ? H * .05 : H * .5 - c.height / 2};
  }
  function dibuja(t){
    ctx.clearRect(0, 0, W, H);
    if (luna) ctx.drawImage(luna.img, luna.x, luna.y, luna.d, luna.d);
    ctx.fillStyle = "#fff";
    stars.forEach(function(s){
      var a = .35 + .65 * Math.abs(Math.sin(t / 1000 * s.v + s.f));
      ctx.globalAlpha = a;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
      if (s.b){ var L = s.r * 7 * a; ctx.strokeStyle = "#cfeaff"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(s.x - L, s.y); ctx.lineTo(s.x + L, s.y); ctx.moveTo(s.x, s.y - L); ctx.lineTo(s.x, s.y + L); ctx.stroke(); }
    });
    ctx.globalAlpha = 1;
    planets.forEach(function(p, i){
      if (!quieto){ p.x += p.vx; if (p.x > W + p.r * 3) p.x = -p.r * 3; if (p.x < -p.r * 3) p.x = W + p.r * 3; }
      var y = p.y + (quieto ? 0 : Math.sin(t / 4000 + i * 2) * 6);
      var g = ctx.createRadialGradient(p.x - p.r * .4, y - p.r * .4, p.r * .1, p.x, y, p.r);
      g.addColorStop(0, p.c1); g.addColorStop(1, p.c2);
      ctx.save(); ctx.shadowColor = p.c1; ctx.shadowBlur = p.r * .6;
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, y, p.r, 0, 6.283); ctx.fill(); ctx.restore();
      if (p.anillo){
        ctx.save(); ctx.translate(p.x, y); ctx.rotate(-.35);
        ctx.strokeStyle = "rgba(255,232,205,.65)"; ctx.lineWidth = p.r * .1;
        ctx.beginPath(); ctx.ellipse(0, 0, p.r * 1.7, p.r * .45, 0, 0, 6.283); ctx.stroke(); ctx.restore();
      }
    });
    if (!quieto && !shots.length && Math.random() < .006) shots.push({x: W * (.3 + Math.random() * .7), y: H * Math.random() * .4, l: 0});
    shots = shots.filter(function(s){
      s.x -= 8; s.y += 4; s.l++;
      var a = 1 - s.l / 45, gr = ctx.createLinearGradient(s.x, s.y, s.x + 60, s.y - 30);
      gr.addColorStop(0, "rgba(255,255,255," + a + ")"); gr.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = gr; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x + 60, s.y - 30); ctx.stroke();
      return s.l < 45;
    });
  }
  function frame(t){ if (vivo) dibuja(t); requestAnimationFrame(frame); }
  if (window.ResizeObserver) new ResizeObserver(init).observe(cv); else init();
  if (window.IntersectionObserver) new IntersectionObserver(function(e){ vivo = e[0].isIntersecting; }).observe(cv);
  if (!quieto) requestAnimationFrame(frame);
});

function cuenta(){
  var t = Math.max(0, FIESTA - new Date());
  var v = [Math.floor(t/864e5), Math.floor(t/36e5)%24, Math.floor(t/6e4)%60, Math.floor(t/1e3)%60];
  ["d","h","m","s"].forEach(function(id,i){ var el = document.getElementById(id), tx = i ? String(v[i]).padStart(2, "0") : String(v[i]);
    if (el.textContent !== tx){ el.textContent = tx; if (el.dataset.ok){ el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); } el.dataset.ok = 1; } });
}
cuenta(); setInterval(cuenta, 1000);

document.getElementById("aliasTxt").textContent = ALIAS;
var otra = document.getElementById("otra");
[otra, document.getElementById("copiar")].forEach(function(btn){
  var t = btn.textContent;
  btn.addEventListener("click", function(){
    function ok(){ btn.textContent = "¡Alias copiado!"; setTimeout(function(){ btn.textContent = t; }, 1800); }
    if (navigator.clipboard) navigator.clipboard.writeText(ALIAS).then(ok, ok); else ok();
  });
});
document.getElementById("wsp").href = "https://wa.me/" + WHATSAPP + "?text=" +
  encodeURIComponent("¡Hola! Confirmo mi asistencia al cumpleaños de 18 de Ezequiel.");
document.getElementById("calendario").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=" + encodeURIComponent("Cumpleaños de 18 de Ezequiel") +
  "&dates=20261226T220000/20261227T040000&ctz=America/Argentina/Tucuman" +
  "&location=" + encodeURIComponent("Shakell Eventos, Bernardo de Monteagudo 2145");
