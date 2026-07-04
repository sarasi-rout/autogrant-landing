(function(){
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------- hero pace race -------
     real pace: 240/yr ≈ 0.456/wk-hour... we scale time so the FAST lane
     ticks every 0.9s (50/wk) and the slow lane at the true ratio.
     ratio = 50 per week vs 240/52 per week = 50 / 4.615 ≈ 10.83          */
  var fastEl = document.getElementById("count-fast");
  var slowEl = document.getElementById("count-slow");
  var fastChips = document.getElementById("chips-fast");
  var slowChips = document.getElementById("chips-slow");
  var FAST_MS = 900;
  var SLOW_MS = Math.round(FAST_MS * (50 / (240/52)));  // ≈ 9750ms
  var MAX_CHIPS = 24;

  function tick(countEl, chipBox){
    countEl.textContent = String(parseInt(countEl.textContent,10) + 1);
    var chip = document.createElement("span");
    chip.className = "chip";
    chipBox.appendChild(chip);
    if (chipBox.children.length > MAX_CHIPS) chipBox.removeChild(chipBox.firstChild);
  }

  if (reduced){
    /* static end-state instead of animation */
    fastEl.textContent = "50";
    slowEl.textContent = "5";
    document.getElementById("race-caption").textContent =
      "In one week: about 5 applications by hand, 50 with AutoGrant.";
    for (var i=0;i<20;i++){ var c=document.createElement("span");c.className="chip";fastChips.appendChild(c); }
    for (var j=0;j<2;j++){ var d=document.createElement("span");d.className="chip";slowChips.appendChild(d); }
  } else {
    setInterval(function(){ tick(fastEl, fastChips); }, FAST_MS);
    setInterval(function(){ tick(slowEl, slowChips); }, SLOW_MS);
  }

  /* ------- calculator ------- */
  var slider = document.getElementById("apps-slider");
  var nowEl = document.getElementById("apps-now");
  var afterEl = document.getElementById("apps-after");
  var hoursEl = document.getElementById("hours-back");
  var MULTIPLIER = 10;      // Climate Resolve went ~10x on throughput
  var HRS_PER_APP = 8;      // rough manual hours per application
  var TIME_CUT = 0.6;       // 60% processing-time reduction

  function updateCalc(){
    var n = parseInt(slider.value,10);
    nowEl.textContent = n;
    afterEl.textContent = n * MULTIPLIER;
    hoursEl.textContent = Math.round(n * HRS_PER_APP * TIME_CUT);
  }
  slider.addEventListener("input", updateCalc);
  updateCalc();

  /* ------- scroll reveal (progressive: classes added by JS only) ------- */
  if (!reduced && "IntersectionObserver" in window){
    var revealables = document.querySelectorAll(
      ".step, .stat, .lane, .fact, .calc-input, .calc-out, .tools-wrap, .contact-card, .demo-frame, .team-frame, .process-wrap, .process-callout"
    );
    var revObs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){
          e.target.classList.add("in");
          revObs.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    revealables.forEach(function(el){
      el.classList.add("reveal");
      revObs.observe(el);
    });
  }


  /* ------- process explorer ------- */
  var processData = [
    {
      title: "Initial diagnosis",
      body: "<p>We map your grant workflow from end to end: finding opportunities, triage, drafting, tracking, whatever your team actually does. We do it together and mark where the hours go.</p><p>You leave with a shared picture of what to automate first.</p>",
      tag: "You're in every meeting",
      slide: "slides/climate-resolve-1.jpg",
      fallback: "slides/climate-resolve-1.svg",
      alt: "Climate Resolve presentation slide 1: Initial diagnosis"
    },
    {
      title: "Wireframe & PRD",
      body: "<p>We sketch the automation and write up how data moves between your tools, so nothing is a surprise when build starts.</p><p>We bring you a few tool options. Nothing moves until you've signed off.</p>",
      tag: "You approve before we build",
      slide: "slides/climate-resolve-2.jpg",
      fallback: "slides/climate-resolve-2.svg",
      alt: "Climate Resolve presentation slide 2: Wireframe and PRD"
    },
    {
      title: "Build, build, build",
      body: "<p>Once you say go, we build. We check in as often as you want (weekly, biweekly, monthly) to show progress, answer questions, and change course if priorities shift.</p><p>You're not guessing what's happening. You see pieces working as they land.</p>",
      tag: "Check-ins on your schedule",
      slide: "slides/climate-resolve-3.jpg",
      fallback: "slides/climate-resolve-3.svg",
      alt: "Climate Resolve presentation slide 3: Build phase"
    },
    {
      title: "Hand-off",
      body: "<p>We write everything down: how the system works, how to fix common problems, so your team can run it.</p><p>If something breaks later, we're still around. This isn't a handoff and goodbye.</p>",
      tag: "Docs plus help when you need it",
      slide: "slides/climate-resolve-4.jpg",
      fallback: "slides/climate-resolve-4.svg",
      alt: "Climate Resolve presentation slide 4: Hand-off"
    }
  ];
  var processIdx = 0;
  var tabBtns = document.querySelectorAll(".process-step-btn");
  var titleEl = document.getElementById("process-title");
  var bodyEl = document.getElementById("process-body");
  var tagEl = document.getElementById("process-tag");
  var slideImg = document.getElementById("process-slide-img");
  var counterEl = document.getElementById("process-counter");
  var prevBtn = document.getElementById("process-prev");
  var nextBtn = document.getElementById("process-next");
  var panelEl = document.getElementById("process-panel");

  function setProcessStep(i){
    if (i < 0 || i >= processData.length) return;
    processIdx = i;
    var d = processData[i];
    titleEl.textContent = d.title;
    bodyEl.innerHTML = d.body;
    tagEl.textContent = d.tag;
    slideImg.dataset.fallback = "";
    slideImg.onerror = function(){
      if (d.fallback && !slideImg.dataset.fallback){
        slideImg.dataset.fallback = "1";
        slideImg.src = d.fallback;
      }
    };
    slideImg.src = d.slide;
    slideImg.alt = d.alt;
    counterEl.textContent = "Slide " + (i + 1) + " of 4";
    tabBtns.forEach(function(btn, j){
      var on = j === i;
      btn.setAttribute("aria-selected", on ? "true" : "false");
      btn.tabIndex = on ? 0 : -1;
    });
    if (panelEl) panelEl.setAttribute("aria-labelledby", "process-tab-" + i);
    if (prevBtn) prevBtn.disabled = i === 0;
    if (nextBtn) nextBtn.disabled = i === processData.length - 1;
  }

  tabBtns.forEach(function(btn){
    btn.addEventListener("click", function(){ setProcessStep(parseInt(btn.dataset.step, 10)); });
  });
  if (prevBtn) prevBtn.addEventListener("click", function(){ setProcessStep(processIdx - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function(){ setProcessStep(processIdx + 1); });

  document.addEventListener("keydown", function(e){
    if (!document.getElementById("process")) return;
    var inView = document.getElementById("process").getBoundingClientRect();
    if (inView.bottom < 0 || inView.top > window.innerHeight) return;
    if (e.key === "ArrowLeft") { setProcessStep(processIdx - 1); e.preventDefault(); }
    if (e.key === "ArrowRight") { setProcessStep(processIdx + 1); e.preventDefault(); }
  });
  setProcessStep(0);


  /* ------- scrollspy ------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var sections = links.map(function(l){ return document.querySelector(l.getAttribute("href")); });

  function setActive(id){
    links.forEach(function(l){
      l.classList.toggle("active", l.getAttribute("href") === "#" + id);
    });
  }
  if ("IntersectionObserver" in window){
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(function(s){ if (s) obs.observe(s); });
  }
})();
