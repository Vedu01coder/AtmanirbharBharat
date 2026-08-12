(function () {
  "use strict";
  var track = document.getElementById("voiceTrack");
  if (!track) return;

  var slides = track.querySelectorAll(".voice-slide");
  var dotsWrap = document.getElementById("voiceDots");
  var prevBtn = document.getElementById("voicePrev");
  var nextBtn = document.getElementById("voiceNext");
  var index = 0;
  var timer;

  slides.forEach(function (_, i) {
    var dot = document.createElement("button");
    dot.setAttribute("aria-label", "Go to voice " + (i + 1));
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", function () { goTo(i); });
    dotsWrap.appendChild(dot);
  });
  var dots = dotsWrap.querySelectorAll("button");

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach(function (s, si) { s.classList.toggle("active", si === index); });
    dots.forEach(function (d, di) { d.classList.toggle("active", di === index); });
    restart();
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(function () { goTo(index + 1); }, 6000);
  }

  prevBtn.addEventListener("click", function () { goTo(index - 1); });
  nextBtn.addEventListener("click", function () { goTo(index + 1); });

  var startX = null;
  track.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) goTo(index + (diff < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });

  track.closest(".voice-viewport").addEventListener("mouseenter", function () { clearInterval(timer); });
  track.closest(".voice-viewport").addEventListener("mouseleave", restart);

  goTo(0);
})();

