(function () {
  "use strict";
  var pillars = document.querySelectorAll(".pillar");

  pillars.forEach(function (pillar) {
    var head = pillar.querySelector(".pillar-head");
    var body = pillar.querySelector(".pillar-body");

    head.addEventListener("click", function () {
      var isOpen = pillar.getAttribute("aria-expanded") === "true";

      pillars.forEach(function (p) {
        p.setAttribute("aria-expanded", "false");
        p.querySelector(".pillar-body").style.maxHeight = null;
      });

      if (!isOpen) {
        pillar.setAttribute("aria-expanded", "true");
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });

  if (pillars.length) pillars[0].querySelector(".pillar-head").click();

  document.querySelectorAll(".chakra-pillar").forEach(function (spoke) {
    function activate() {
      var n = parseInt(spoke.getAttribute("data-pillar"), 10);
      var target = pillars[n - 1];
      if (!target) return;
      target.querySelector(".pillar-head").click();
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    spoke.addEventListener("click", activate);
    spoke.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
    });
  });
})();

