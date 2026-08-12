(function () {
  "use strict";

  function curLang() {
    return document.documentElement.getAttribute("data-lang") === "hi" ? "hi" : "en";
  }

  function tr(pair) {
    if (!pair) return "";
    var lang = curLang();
    return pair[lang] != null ? pair[lang] : pair.en;
  }

  var questions = [
    {
      en: "When you're buying a gift, what matters most?",
      hi: "जब आप कोई उपहार खरीदते हैं, तो सबसे ज़्यादा क्या मायने रखता है?",
      options: [
        { en: "Cheapest option, wherever it's from", hi: "जो भी सबसे सस्ता हो, चाहे कहीं से भी हो", v: 0 },
        { en: "Something good — ideally Indian-made", hi: "कुछ अच्छा — हो सके तो भारत में बना हुआ", v: 1 },
        { en: "I go looking for a local or handmade maker", hi: "मैं किसी स्थानीय या हस्तनिर्मित कारीगर को ढूंढता/ढूंढती हूं", v: 2 }
      ]
    },
    {
      en: "Something at home breaks. Your first move?",
      hi: "घर में कुछ टूट जाता है। आपका पहला कदम क्या होगा?",
      options: [
        { en: "Order a replacement", hi: "नया मंगवा लेना", v: 0 },
        { en: "See if it can be fixed first", hi: "पहले देखना कि उसे ठीक किया जा सकता है या नहीं", v: 1 },
        { en: "You already know a way to fix it", hi: "आपको पहले से पता है कि उसे कैसे ठीक करना है", v: 2 }
      ]
    },
    {
      en: "How often do you practice a hands-on skill (code, cooking, repair, craft)?",
      hi: "आप किसी व्यावहारिक हुनर (कोडिंग, खाना बनाना, मरम्मत, शिल्प) का अभ्यास कितनी बार करते हैं?",
      options: [
        { en: "Rarely", hi: "बहुत कम", v: 0 },
        { en: "Sometimes", hi: "कभी-कभी", v: 1 },
        { en: "Regularly, on purpose", hi: "नियमित रूप से, जानबूझकर", v: 2 }
      ]
    },
    {
      en: "India makes headlines for a tech or space milestone. You:",
      hi: "भारत किसी तकनीकी या अंतरिक्ष उपलब्धि के लिए सुर्खियों में आता है। आप:",
      options: [
        { en: "Scroll past", hi: "बिना ध्यान दिए आगे बढ़ जाते हैं", v: 0 },
        { en: "Feel proud and share it", hi: "गर्व महसूस करते हैं और उसे साझा करते हैं", v: 1 },
        { en: "Look up how it was actually built", hi: "यह जानने की कोशिश करते हैं कि इसे असल में कैसे बनाया गया", v: 2 }
      ]
    }
  ];

  var UI = {
    questionLabel: { en: "Question", hi: "प्रश्न" },
    yourResult: { en: "Your result", hi: "आपका परिणाम" },
    retake: { en: "Retake the quiz", hi: "क्विज़ फिर से लें" }
  };

  var RESULT_ICONS = {
    seed:
      '<svg class="result-icon" viewBox="0 0 40 40" aria-hidden="true"><ellipse cx="20" cy="26" rx="7.5" ry="9.5" fill="var(--accent-2)"/><path d="M20 17c0-6.5 4.5-10 4.5-10s.8 6.7-4.5 10Z" fill="var(--accent)"/></svg>',
    sapling:
      '<svg class="result-icon" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 33V17" stroke="var(--accent-2)" stroke-width="2.4" stroke-linecap="round"/><path d="M20 21c-6.5 0-9.5-5.5-9.5-5.5s6.5-2.2 9.5 5.5Zm0-2.4c6.3 0 9.3-6.3 9.3-6.3s-7.3-2-9.3 6.3Z" fill="var(--accent)"/></svg>',
    thread:
      '<svg class="result-icon" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="12.5" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="20" cy="20" r="4" fill="var(--accent)"/><path d="M20 5.5v5M20 29.5v5M4.5 20h5M30.5 20h5" stroke="var(--accent-2)" stroke-width="2.2" stroke-linecap="round"/></svg>'
  };

  var resultBands = [
    {
      max: 2, icon: RESULT_ICONS.seed,
      band: { en: "Seed", hi: "बीज" },
      message: {
        en: "You're just getting started. Pick one pillar on this site and try one thing from it this week.",
        hi: "आप अभी शुरुआत कर रहे हैं। इस वेबसाइट के किसी एक स्तंभ को चुनें और इस हफ्ते उससे एक चीज़ आज़माएं।"
      }
    },
    {
      max: 5, icon: RESULT_ICONS.sapling,
      band: { en: "Sapling", hi: "अंकुर" },
      message: {
        en: "Vocal for Local is already part of how you think. A few more deliberate habits and it becomes second nature.",
        hi: "\u2018वोकल फॉर लोकल\u2019 पहले से ही आपकी सोच का हिस्सा है। कुछ और सजग आदतें अपनाएं और यह आपकी फ़ितरत बन जाएगी।"
      }
    },
    {
      max: Infinity, icon: RESULT_ICONS.thread,
      band: { en: "Thread-Bearer", hi: "धागा-वाहक" },
      message: {
        en: "You already live the idea. The next step is pulling someone else in with you.",
        hi: "आप पहले से ही इस विचार को जी रहे हैं। अगला कदम है किसी और को भी अपने साथ जोड़ना।"
      }
    }
  ];

  var current = 0;
  var score = 0;
  var quizFinished = false;
  var quizBody = document.getElementById("quizBody");
  var dotsWrap = document.getElementById("quizDots");

  function renderDots() {
    dotsWrap.innerHTML = "";
    questions.forEach(function (_, i) {
      var d = document.createElement("span");
      if (i < current) d.classList.add("done");
      else if (i === current) d.classList.add("active");
      dotsWrap.appendChild(d);
    });
  }

  function renderQuestion() {
    quizFinished = false;
    renderDots();
    var item = questions[current];
    var html = '<div class="quiz-step">' +
      '<p class="kicker">' + tr(UI.questionLabel) + " " + (current + 1) + " / " + questions.length + '</p>' +
      "<h3 style='margin-top:.6rem'>" + tr(item) + "</h3>" +
      '<div class="quiz-options" role="group">';
    item.options.forEach(function (opt, i) {
      html += '<button class="quiz-option" style="--stagger:' + (i * 70) + 'ms" data-value="' + opt.v + '">' + tr(opt) + "</button>";
    });
    html += "</div></div>";
    quizBody.innerHTML = html;

    quizBody.querySelectorAll(".quiz-option").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (quizBody.classList.contains("is-advancing")) return;
        quizBody.classList.add("is-advancing");
        btn.classList.add("selected");
        score += parseInt(btn.getAttribute("data-value"), 10);
        current++;

        setTimeout(function () {
          quizBody.classList.remove("is-advancing");
          if (current < questions.length) {
            renderQuestion();
          } else {
            renderResult();
          }
        }, 220);
      });
    });
  }

  function renderResult() {
    quizFinished = true;
    renderDots();
    var band = resultBands.find(function (b) { return score <= b.max; }) || resultBands[resultBands.length - 1];
    quizBody.innerHTML =
      '<div class="quiz-step">' +
      '<div class="quiz-result">' +
      band.icon +
      '<p class="kicker mt-md">' + tr(UI.yourResult) + "</p>" +
      '<p class="badge">' + tr(band.band) + "</p>" +
      '<p class="text-soft mt-md">' + tr(band.message) + "</p>" +
      '<button class="btn btn-ghost btn-sm mt-md" id="retakeQuiz">' + tr(UI.retake) + "</button>" +
      "</div></div>";
    document.getElementById("retakeQuiz").addEventListener("click", function () {
      current = 0; score = 0; renderQuestion();
    });
  }

  if (quizBody) renderQuestion();

  document.addEventListener("ab:langchange", function () {
    if (!quizBody) return;
    if (quizFinished) renderResult(); else renderQuestion();
  });

  var STORAGE_KEY = "ab-pledges";
  var form = document.getElementById("pledgeForm");
  var wall = document.getElementById("pledgeWall");
  var nameInput = document.getElementById("pledgeName");
  var chips = document.querySelectorAll(".pledge-chip");
  var selectedPledge = null;
  var emptyNote = document.getElementById("wallEmptyNote");

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("selected"); });
      chip.classList.add("selected");
      selectedPledge = chip.textContent;
    });
  });

  function loadPledges() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }
  function savePledges(list) { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }

  var DIYA_SVG = '<svg class="diya-icon" viewBox="0 0 40 40" aria-hidden="true">' +
    '<path class="diya-flame" d="M20 6C14 14 14 20 20 24C26 20 26 14 20 6Z" fill="var(--accent)"/>' +
    '<path d="M6 26C6 22 12 20 20 20C28 20 34 22 34 26C34 30 28 32 20 32C12 32 6 30 6 26Z" fill="none" stroke="var(--copper)" stroke-width="2"/>' +
    "</svg>";

  function renderWall() {
    var list = loadPledges();
    wall.innerHTML = "";
    if (!list.length) {
      emptyNote.style.display = "block";
      return;
    }
    emptyNote.style.display = "none";
    list.slice().reverse().forEach(function (item, i) {
      var tile = document.createElement("div");
      tile.className = "pledge-tile" + (i === 0 ? " is-new" : "");
      tile.style.setProperty("--tile-stagger", Math.min(i, 8) * 45 + "ms");
      tile.innerHTML = DIYA_SVG + "<span><b>" + escapeHtml(item.name) + "</b>" + escapeHtml(item.pledge) + "</span>";
      wall.appendChild(tile);
    });
  }
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  if (wall) renderWall();

  var lastPledge = null;

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = nameInput.value.trim();
      var certSection = document.getElementById("certificateSection");

      if (!name) { nameInput.focus(); return; }
      if (!selectedPledge) {
        document.getElementById("chipHint").style.display = "block";
        return;
      }

      var list = loadPledges();
      list.push({ name: name, pledge: selectedPledge });
      savePledges(list);
      renderWall();

      lastPledge = { name: name, pledge: selectedPledge };
      if (certSection) {
        certSection.hidden = false;
        certSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      generateCertificate(lastPledge);

      form.reset();
      chips.forEach(function (c) { c.classList.remove("selected"); });
      selectedPledge = null;
    });
  }

  var resetWallBtn = document.getElementById("resetWall");
  if (resetWallBtn) {
    resetWallBtn.addEventListener("click", function () {
      localStorage.removeItem(STORAGE_KEY);
      renderWall();
    });
  }

  function generateCertificate(entry) {
    var canvas = document.getElementById("certificateCanvas");
    var ctx = canvas.getContext("2d");
    var CSS_W = 1000, CSS_H = 640;
    var DPR = 2;
    canvas.width = CSS_W * DPR;
    canvas.height = CSS_H * DPR;
    var isLoom = document.documentElement.getAttribute("data-theme") === "loom";

    var bg = isLoom ? "#F1EAD9" : "#12141C";
    var ink = isLoom ? "#201A10" : "#EDE9DD";
    var accent = "#E17A2D";
    var copper = "#B8744A";
    var saffron = "#FF9933";
    var green = "#138808";

    var devanagariTitle = "'Rozha One', 'Tiro Devanagari Hindi', serif";
    var devanagariBody = "'Noto Sans Devanagari', 'Tiro Devanagari Hindi', serif";
    var devanagariSample = "\u0906\u0924\u094D\u092E\u0928\u093F\u0930\u094D\u092D\u0930 \u092D\u093E\u0930\u0924 \u0938\u0902\u0915\u0932\u094D\u092A";

    Promise.all([
      document.fonts.load("700 40px 'Fraunces'"),
      document.fonts.load("italic 20px 'Fraunces'"),
      document.fonts.load("700 46px 'Fraunces'"),

      document.fonts.load("400 34px 'Rozha One'", devanagariSample),
      document.fonts.load("400 16px 'Noto Sans Devanagari'", devanagariSample),
      document.fonts.ready
    ]).then(function () {
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      var W = CSS_W, H = CSS_H;
      var m = 30, cut = 22;

      var bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, bg);
      bgGrad.addColorStop(1, isLoom ? "#F4E4C6" : "#171626");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      function triband(y) {
        var triH = 5, triW = (W - 2 * m - 8) / 3;
        ctx.fillStyle = saffron; ctx.fillRect(m + 4, y, triW, triH);
        ctx.fillStyle = isLoom ? "#FFFFFF" : ink; ctx.fillRect(m + 4 + triW, y, triW, triH);
        ctx.fillStyle = green; ctx.fillRect(m + 4 + triW * 2, y, triW, triH);
      }
      triband(m + 12);
      triband(H - m - 17);

      function angledBorder(inset, color, width) {
        ctx.strokeStyle = color; ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(m + inset, m + inset + cut);
        ctx.lineTo(m + inset + cut, m + inset);
        ctx.lineTo(W - m - inset, m + inset);
        ctx.lineTo(W - m - inset, H - m - inset - cut);
        ctx.lineTo(W - m - inset - cut, H - m - inset);
        ctx.lineTo(m + inset, H - m - inset);
        ctx.closePath();
        ctx.stroke();
      }
      angledBorder(0, copper, 2.5);
      angledBorder(8, accent, 1);

      ctx.save();
      ctx.globalAlpha = isLoom ? 0.35 : 0.28;
      ctx.strokeStyle = copper;
      ctx.setLineDash([1, 7]);
      ctx.lineWidth = 2;
      ctx.strokeRect(m + 16, m + 16, W - 2 * (m + 16), H - 2 * (m + 16));
      ctx.setLineDash([]);
      ctx.restore();

      function mangoLeaf(x, y, scale, rot) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.scale(scale, scale);
        ctx.fillStyle = saffron;
        ctx.globalAlpha = isLoom ? 0.5 : 0.6;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-9, 2, -11, 16, 0, 26);
        ctx.bezierCurveTo(11, 16, 9, 2, 0, 0);
        ctx.fill();
        ctx.restore();
      }
      mangoLeaf(m + 30, m + 26, 0.85, Math.PI);
      mangoLeaf(W - m - 30, m + 26, 0.85, Math.PI);
      mangoLeaf(m + 30, H - m - 26, 0.85, 0);
      mangoLeaf(W - m - 30, H - m - 26, 0.85, 0);

      ctx.save();
      ctx.globalAlpha = isLoom ? 0.14 : 0.18;
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.3;
      var cx = W / 2, cy = 300, r = 58;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.16, 0, Math.PI * 2); ctx.stroke();
      for (var s = 0; s < 24; s++) {
        var sa = (s / 24) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(sa) * r * 0.16, cy + Math.sin(sa) * r * 0.16);
        ctx.lineTo(cx + Math.cos(sa) * r, cy + Math.sin(sa) * r);
        ctx.stroke();
      }
      ctx.restore();

      ctx.textAlign = "center";

      ctx.fillStyle = accent;
      ctx.font = "400 30px " + devanagariTitle;
      ctx.fillText("\u0906\u0924\u094D\u092E\u0928\u093F\u0930\u094D\u092D\u0930 \u092D\u093E\u0930\u0924", W / 2, 82);

      ctx.fillStyle = "#1F6E3F";
      ctx.font = "600 14px 'IBM Plex Mono', monospace";
      ctx.fillText("WEB VISION BHARAT \u00B7 GRAND COMPETITION 2026", W / 2, 108);

      ctx.fillStyle = ink;
      ctx.font = "600 38px 'Fraunces', Georgia, serif";
      ctx.fillText("Certificate of Commitment", W / 2, 160);

      ctx.fillStyle = accent;
      ctx.font = "italic 19px 'Fraunces', Georgia, serif";
      ctx.fillText("This certifies that", W / 2, 226);

      var nameMaxWidth = W - 2 * m - 100;
      var nameSize = fitFontSize(ctx, entry.name, nameMaxWidth, 46, 24, "700 __SIZE__px 'Fraunces', Georgia, serif");
      ctx.font = "700 " + nameSize + "px 'Fraunces', Georgia, serif";
      ctx.fillStyle = "#C4661F";
      ctx.fillText(entry.name, W / 2, 305);

      var pledgeIsHindi = /[\u0900-\u097F]/.test(entry.pledge);
      var pledgeLine = pledgeIsHindi
        ? "\u2018" + entry.pledge + "\u2019 \u0915\u093E \u0938\u0902\u0915\u0932\u094D\u092A \u0932\u093F\u092F\u093E"
        : "has pledged: \u201C" + entry.pledge + "\u201D";
      ctx.fillStyle = ink;
      ctx.font = pledgeIsHindi ? "20px " + devanagariBody : "20px 'Manrope', Arial, sans-serif";
      wrapText(ctx, pledgeLine, W / 2, 372, W - 220, pledgeIsHindi ? 32 : 28, 3);

      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = copper;
      ctx.beginPath();
      ctx.moveTo(m + 60, H - 128);
      ctx.lineTo(W - m - 60, H - 128);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.save();
      ctx.translate(W / 2, H - 104);
      ctx.fillStyle = copper;
      ctx.beginPath();
      ctx.ellipse(0, 0, 13, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#F5A524";
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.quadraticCurveTo(4, -14, 0, -20);
      ctx.quadraticCurveTo(-4, -14, 0, -6);
      ctx.fill();
      ctx.restore();

      ctx.font = "13px 'IBM Plex Mono', monospace";
      ctx.fillStyle = ink;
      var today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
      ctx.fillText(today, W / 2, H - 62);

      var serial = "ABJ-" + new Date().getFullYear() +
        "-" + Math.abs(hashCode(entry.name + entry.pledge + Date.now())).toString(36).toUpperCase().slice(0, 5);
      ctx.textAlign = "left";
      ctx.font = "11px 'IBM Plex Mono', monospace";
      ctx.fillStyle = isLoom ? "#6B5330" : "#A9AABB";
      ctx.fillText("Certificate No. " + serial, m + 18, H - m - 22);
      ctx.textAlign = "right";
      ctx.fillText("atmanirbhar-bharat.site", W - m - 18, H - m - 22);
      ctx.textAlign = "center";

      var img = document.getElementById("certPreview");
      var dataUrl = canvas.toDataURL("image/png");
      img.src = dataUrl;
      img.hidden = false;
      img.classList.remove("is-ready");
      void img.offsetWidth;
      img.classList.add("is-ready");

      var dl = document.getElementById("downloadCert");
      dl.hidden = false;
      dl.onclick = function () {
        var a = document.createElement("a");
        a.href = dataUrl;
        a.download = "atmanirbhar-pledge-" + entry.name.replace(/\s+/g, "-").toLowerCase() + ".png";
        document.body.appendChild(a);
        a.click();
        a.remove();
      };

      launchConfetti(document.getElementById("certificateSection"), copper, accent);
    });
  }

  function hashCode(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
    return h;
  }

  function launchConfetti(host, colorA, colorB) {
    if (!host) return;
    var old = host.querySelector(".confetti-layer");
    if (old) old.remove();
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var layer = document.createElement("div");
    layer.className = "confetti-layer";
    layer.setAttribute("aria-hidden", "true");
    var colors = [colorA, colorB];
    for (var i = 0; i < 26; i++) {
      var dash = document.createElement("span");
      dash.className = "confetti-dash";
      dash.style.setProperty("--x", (Math.random() * 100) + "%");
      dash.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
      dash.style.setProperty("--rot", (Math.random() * 300 + 60) + "deg");
      dash.style.setProperty("--confetti-dur", (800 + Math.random() * 600) + "ms");
      dash.style.setProperty("--dash-color", colors[i % 2]);
      dash.style.animationDelay = (Math.random() * 250) + "ms";
      layer.appendChild(dash);
    }
    host.appendChild(layer);
    setTimeout(function () { layer.remove(); }, 2200);
  }

  function fitFontSize(ctx, text, maxWidth, maxSize, minSize, fontSpec) {
    var size = maxSize;
    while (size > minSize) {
      ctx.font = fontSpec.replace("__SIZE__", size);
      if (ctx.measureText(text).width <= maxWidth) break;
      size -= 2;
    }
    return size;
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    var words = text.split(" ");
    var line = "";
    var lines = [];
    for (var i = 0; i < words.length; i++) {
      var test = line + words[i] + " ";
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = words[i] + " ";
      } else {
        line = test;
      }
    }
    lines.push(line);
    if (maxLines && lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      var last = lines[maxLines - 1].trim();
      while (last.length && ctx.measureText(last + "\u2026").width > maxWidth) {
        last = last.slice(0, -1);
      }
      lines[maxLines - 1] = last + "\u2026";
    }
    lines.forEach(function (l, i) {
      ctx.fillText(l.trim(), x, y + i * lineHeight);
    });
  }
})();

