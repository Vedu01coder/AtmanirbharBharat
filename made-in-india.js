(function () {
  "use strict";
  var buttons = document.querySelectorAll(".filter-btn");
  var cards = document.querySelectorAll(".achieve-card");
  var countEl = document.getElementById("resultCount");

  function applyFilter(category) {
    var shown = 0;
    cards.forEach(function (card) {
      var match = category === "all" || card.getAttribute("data-category") === category;
      card.hidden = !match;
      if (match) shown++;
    });
    if (countEl) countEl.textContent = shown;
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      buttons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      applyFilter(btn.getAttribute("data-filter"));
    });
  });

  applyFilter("all");
})();

