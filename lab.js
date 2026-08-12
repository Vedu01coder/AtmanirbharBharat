(function () {
  "use strict";
  var data = {
    digital: ["01 · DIGITAL PUBLIC INFRASTRUCTURE", "Build the rails, then let everyone innovate.", "UPI, Aadhaar and India Stack are examples of digital systems developed at national scale. Their significance is the shared infrastructure around which many services can grow.", "01"],
    space: ["02 · SPACE", "Reach beyond the atmosphere — with Indian capability.", "From launch vehicles and satellites to lunar exploration, India's space programme shows how long-term engineering capability can turn ambitious missions into repeatable capacity.", "02"],
    defence: ["03 · DEFENCE", "Move from buyer to builder.", "Domestic design and manufacturing can strengthen strategic capability while creating engineering, production and export opportunities across a wider industrial ecosystem.", "03"],
    health: ["04 · HEALTH", "Build critical capacity when it matters most.", "Pharmaceuticals, vaccines, medical technology and health infrastructure show why resilient domestic capability matters when global supply chains are under pressure.", "04"],
    manufacturing: ["05 · MANUFACTURING", "Make at scale. Improve at speed.", "Manufacturing connects skills, suppliers, technology, logistics and markets. Stronger domestic production can create jobs while helping Indian firms compete internationally.", "05"]
  };
  var tabs = document.querySelectorAll(".lab-tab");
  var k = document.getElementById("labKicker");
  var t = document.getElementById("labTitle");
  var x = document.getElementById("labText");
  var core = document.querySelector(".lab-core");
  if (!tabs.length) return;

  tabs.forEach(function (b) {
    b.addEventListener("click", function () {
      var d = data[b.dataset.sector];
      tabs.forEach(function (q) {
        q.classList.toggle("active", q === b);
        q.setAttribute("aria-selected", q === b ? "true" : "false");
      });
      k.textContent = d[0];
      t.textContent = d[1];
      x.textContent = d[2];
      core.textContent = d[3];
      core.classList.remove("lab-pulse");
      void core.offsetWidth;
      core.classList.add("lab-pulse");
    });
  });
})();

