/* =========================================================
   Technyx Systems — Main.js
   Modern Frontend Boilerplate Template (ES6+)
   ---------------------------------------------------------
   Build Mode: "Dev" or "Prod"
   Author: Technyx Systems
   --------------------------------------------------------- */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
// import reshaper from 'arabic-persian-reshaper';
import Swiper from "swiper";
import { Autoplay, Navigation } from 'swiper/modules';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Chart from 'chart.js/auto';


gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
//Swiper auto play register
Swiper.use([Autoplay, Navigation])
/* ---------------------------------------------------------
   Build Configuration
--------------------------------------------------------- */
const Build = "Dev"; // Change to "Prod" for production

/* ---------------------------------------------------------
   Global Namespace
--------------------------------------------------------- */
window.$ = window.$ || {};
$.string = (v) => typeof v === "string";
$.number = (v) => typeof v === "number" && !isNaN(v);
$.object = (v) => v && typeof v === "object" && !Array.isArray(v);

/* ---------------------------------------------------------
   DOM & Layout Helpers
--------------------------------------------------------- */
const isAbove = (width) => window.innerWidth > width;
const isBelow = (width) => window.innerWidth <= width;
const isAboveHeight = (height) => window.innerHeight > height;
const isBelowHeight = (height) => window.innerHeight <= height;
const isRTL = () => document.documentElement.dir === "rtl";
const isLTR = () => document.documentElement.dir === "ltr";
window.isRTL = isRTL;
window.isLTR = isLTR;

const remToPx = (rem) => {
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  return rem * rootFontSize;
};

const pxToRem = (px) => {
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  return px / rootFontSize;
};


document.querySelectorAll("[data-bg-image]").forEach(el => {
  const bg = el.dataset.bgImage;
  if (bg) el.style.backgroundImage = `url(${bg})`;
});

function getStyles(element) {
  if (!element) {
    throw new Error("No element provided");
  }
  return window.getComputedStyle(element);
}

/* ---------------------------------------------------------
   Language & Time Utilities
--------------------------------------------------------- */
const getLang = () => {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const supported = ["en", "ar", "fr"];
  return supported.includes(pathParts[0]) ? pathParts[0] : "en";
};

const getMonthName = (monthIndex, lang = "en") => {
  const months = {
    en: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    ar: [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ],
  };
  return months[lang]?.[monthIndex] || months.en[monthIndex];
};

const formatTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

/* ---------------------------------------------------------
   Utility Functions
--------------------------------------------------------- */
const log = (message, type = "info") => {
  if (Build !== "Dev") return;
  const prefix = "%c[Naseej]";
  const style =
    type === "warn"
      ? "color: orange"
      : type === "error"
        ? "color: red"
        : "color: #00bcd4";
  // console.log(prefix, style, message);
};

const getEl = (selector, parent = document) => parent.querySelector(selector);
const getAll = (selector, parent = document) => parent.querySelectorAll(selector);

const on = (el, event, handler) => el && el.addEventListener(event, handler);
const off = (el, event, handler) => el && el.removeEventListener(event, handler);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getTotalHeight = (...selectors) => {
  return selectors.reduce((total, selector) => {
    const elements = document.querySelectorAll(selector);
    let combined = 0;
    elements.forEach(el => {
      combined += el.offsetHeight;
    });
    return total + combined;
  }, 0);
};

const elementTopDistance = (selectorA, selectorB) => {
  const elA = document.querySelector(selectorA);
  const elB = document.querySelector(selectorB);

  if (!elA || !elB) {
    log(`One or both selectors not found ${selectorA, selectorB}`, "warn");
    return 0;
  }

  const rectA = elA.getBoundingClientRect();
  const rectB = elB.getBoundingClientRect();

  // distance from top of A to bottom of B
  const distance = rectA.top - rectB.top;
  // console.log(`Top: ${rectB.top}`,`bottom: ${rectA.top}`)
  return distance;
};


const elementBetweenDistance = (selectorA, selectorB) => {
  const elA = document.querySelector(selectorA);
  const elB = document.querySelector(selectorB);

  if (!elA || !elB) {
    log(`One or both selectors not found ${selectorA, selectorB}`, "warn");
    return 0;
  }

  const rectA = elA.getBoundingClientRect();
  const rectB = elB.getBoundingClientRect();

  // distance from top of A to bottom of B
  const distance = rectA.top - rectB.bottom;
  // console.log(`rectA.top: ${rectA.top}`, `rectB.bottom: ${rectB.bottom}`)
  return distance;
};

/* ---------------------------------------------------------
   SVG Utility: Convert <img> to inline <svg>
--------------------------------------------------------- */
const changeToSvg = () => {
  const images = getAll("img.js-tosvg");;

  images.forEach((img) => {
    const imgID = img.id;
    const imgClass = img.className;
    const imgURL = img.src;

    fetch(imgURL)
      .then((res) => res.text())
      .then((data) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "image/svg+xml");
        let svg = xmlDoc.querySelector("svg");
        if (!svg) return;

        if (imgID) svg.setAttribute("id", imgID);
        if (imgClass) svg.setAttribute("class", imgClass + " insvg");
        svg.removeAttribute("xmlns:a");

        if (
          !svg.getAttribute("viewBox") &&
          svg.getAttribute("height") &&
          svg.getAttribute("width")
        ) {
          svg.setAttribute(
            "viewBox",
            `0 0 ${svg.getAttribute("width")} ${svg.getAttribute("height")}`
          );
        }

        if (img.parentNode) img.parentNode.replaceChild(svg, img);
      });
  });
};

// Optionally expose globally
window.changeToSvg = changeToSvg;


/* ---------------------------------------------------------
   SVG Utility: Convert <img> to inline <svg>
--------------------------------------------------------- */
const browserDetect = () => {
  navigator.sayswho = (function () {
    var ua = navigator.userAgent,
      tem,
      M =
        ua.match(
          /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
        ) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return "IE " + (tem[1] || "");
    }
    if (M[1] === "Chrome") {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return tem.slice(1).join("").replace("OPR", "Opera");
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(" ");
  })();

  const safeClass = navigator.sayswho.replace(/\s+/g, "-").toLowerCase();
  document.body.classList.add(`${safeClass}`);
}

// Optionally expose globally
window.browserDetect = browserDetect;


/* ---------------------------------------------------------
  Device check Utility if it is iphone/ipad
--------------------------------------------------------- */
const isIOS = () => {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
    // iPad on iOS 13+ detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}

// Optionally expose globally
window.isIOS = isIOS;

/* ---------------------------------------------------------
   Core Initialization
--------------------------------------------------------- */
const initMainJs = async () => {
  changeToSvg();

  const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper", // the outer container
    content: "#smooth-content", // the scrollable inner content
    smooth: 2.5, // scroll smoothness (seconds)
    effects: true, // enable data-speed / data-lag effects
    normalizeScroll: true,
    //  smoothTouch: 0.1,  
  });

  const isHomePage = document.querySelector(".js-home-page")
  window.isHomePage = isHomePage;


  if (smoother) {

    smoother.paused(false);

    // Smooth scroll to top
    smoother.scrollTo(0, true);

    // Check when scrolling finishes
    const checkScroll = gsap.ticker.add(() => {
      // When it’s close enough to the top, stop checking
      if (smoother.scrollTop() <= 1) {
        if (isHomePage) {
          smoother.paused(true);
        }
        gsap.ticker.remove(checkScroll); // stop checking
      }
    });

  } else {
    // Fallback for no smoother
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

};

/* ---------------------------------------------------------
   DOM Ready
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initMainJs();

  if (Build === "Dev") {
    log("🧩 Running in Development Mode", "warn");
  }
});

/* ---------------------------------------------------------
   Export Helpers (optional, for modular apps)
--------------------------------------------------------- */
export {
  log,
  getLang,
  getMonthName,
  isRTL,
  isLTR,
  remToPx,
  pxToRem,
  isAbove,
  isBelow,
  getEl,
  getAll,
  sleep,
  random,
};


document.addEventListener("DOMContentLoaded", () => {
  if (window && window.location.pathname.includes("/ar")) {
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", "ar");
  } else {
    document.documentElement.setAttribute("dir", "ltr");
    document.documentElement.setAttribute("lang", "en");
  }

  browserDetect();

});

const animateDirectionalText = (action = "init", filterClass = null,) => {
  // ✅ Base selectors
  const baseSelector = ".animate-text-left, .animate-text-right";
  const allElements = document.querySelectorAll(baseSelector);

  // ✅ Filter: if filterClass provided, only include those
  const elements = filterClass
    ? Array.from(allElements).filter(el => el.closest(filterClass) || el.matches(filterClass))
    : allElements;

  // console.log('elements', elements);


  elements.forEach((wrapper) => {
    // ✅ 1. Auto-wrap text in <span> if not already
    if (!wrapper.querySelector("span")) {
      const text = wrapper.textContent.trim();
      const span = document.createElement("span");
      span.textContent = text;
      wrapper.textContent = "";
      wrapper.appendChild(span);
    }

    // ✅ 2. Styling for wrapper
    Object.assign(wrapper.style, {
      overflow: "hidden",
      display: "inline-block",
      verticalAlign: "top",
      width: "fit-content",
    });

    const el = wrapper.querySelector("span");
    const computed = window.getComputedStyle(el);
    const matrix = new DOMMatrixReadOnly(
      computed.transform === "none" ? "matrix(1,0,0,1,0,0)" : computed.transform
    );
    const originalX = matrix.m41 || 0;
    const originalY = matrix.m42 || 0;

    // ✅ 3. Cache data
    if (!el.dataset.originalX) {
      el.dataset.originalX = originalX;
      el.dataset.originalY = originalY;

      const isLeft = wrapper.classList.contains("animate-text-left");
      const offsetDistance = Math.abs(originalX || 100) * 8;
      el.dataset.offsetX = isLeft
        ? originalX - offsetDistance
        : originalX + offsetDistance;
    }

    const oX = parseFloat(el.dataset.originalX);
    const oY = parseFloat(el.dataset.originalY);
    const offX = parseFloat(el.dataset.offsetX);

    // ✅ 4. GSAP Animations
    if (action === "init" || action === "reset") {
      gsap.set(el, { x: offX, y: oY, display: "block", autoAlpha: 0 });
    }

    if (action === "play") {
      gsap.to(el, {
        x: oX,
        y: oY,
        duration: 1.6,
        ease: "power1.out",
        delay: 0.35,
        autoAlpha: 1
      });
    }

    if (action === "reverse") {
      gsap.to(el, {
        x: offX,
        y: oY,
        duration: 1.4,
        ease: "power3.in",
        autoAlpha: 0
      });
    }
  });
};

window.addEventListener("load", () => {

  animateDirectionalText("init", ".error-section-wrapper");
  animateDirectionalText("play", ".error-section-wrapper");
  initPageListingScroll();
  setupHeaderScrollAnimation(".header-box");


  initCircleTextAnimation();


  document.querySelectorAll(".message-slide-wrapper").forEach((sec, id) => {
    sec.classList.add(`message-${id}`);

    animateDirectionalTextScrub(`.message-${id}`, {
      // start: "top 90%",
      // end: "bottom 10%",
      scrub: 2,
      // markers: true,

      start: isBelow(992) ? "top bottom" : "top 90%",
      end: isBelow(992) ? "bottom top" : "bottom top",
      // scrub: isBelow(992) ? 0.5 : 2.5, // faster scrub for shorter scroll
      // shorten durations for small screens
      durationIn: isBelow(992) ? 1 : 2,
      holdDuration: isBelow(992) ? 1 : 0.5,
      durationOut: isBelow(992) ? 1 : 2,
    });
  });


  // Wait until all fonts are ready
  document.fonts.ready.then(() => {
    updateAllCurvedTexts();

    // Optional: re-render on resize
    window.addEventListener("resize", updateAllCurvedTexts);
  });

  zoomInCircleOnScroll(
    ".slide-4",
    "#slide-4-circle-1",
  );
  zoomInCircleOnScroll(
    ".slide-5",
    "#slide-5-circle-1",
  );
  zoomInCircleOnScroll(
    ".slide-7",
    "#slide-7-circle-1",
  );
  zoomInCircleOnScroll(
    ".slide-8",
    "#slide-8-circle-1",
  );

  zoomOutCircleOnScroll("#slide-6-circle-1");
  zoomOutCircleOnScroll("#slide-10-circle-1");

  rotateCurvedTextOnScroll();


  growSvgOnScroll("#line-1", ".slide-2");
  growSvgOnScroll(`#line-2`, "#line-2", {
    // 📱 responsive configuration
    start: isBelow(992) ? "top center" : "top center",
    end: isBelow(992) ? "bottom bottom" : "bottom bottom",
    // scrub: isBelow(992) ? 1 : 2.5,
    // markers: true,
    startHeight: "0%",
    endHeight: `${elementBetweenDistance("#slide-6 .slide-heading", "#slide-3 .slide-heading") - 120}px`,
    top: `${getTotalHeight("#slide-3 .slide-heading") + elementTopDistance("#slide-3 .slide-heading", "#slide-3") + 20}px`,
  });
  growSvgOnScroll(`#line-3`, "#line-3", {
    // 📱 responsive configuration
    start: isBelow(992) ? "top center" : "top center",
    end: isBelow(992) ? "bottom bottom" : "bottom bottom",
    // scrub: isBelow(992) ? 1 : 2.5,
    // markers: true,
    startHeight: "0%",
    endHeight: `${elementBetweenDistance("#slide-9 .slider-circle__background-title", "#slide-6 .slide-heading")}px`,
    top: `${getTotalHeight("#slide-6 .slide-heading") + elementTopDistance("#slide-6 .slide-heading", "#slide-6") + 20}px`,
  });
  growSvgOnScroll(`#line-4`, "#line-4", {
    // 📱 responsive configuration
    start: isBelow(992) ? "top center" : "top center",
    end: isBelow(992) ? "bottom bottom" : "bottom bottom",
    // scrub: isBelow(992) ? 1 : 2.5,
    // markers: true,
    startHeight: "0%",
    endHeight: `${elementBetweenDistance("#slide-11 .slide-heading", "#slide-9 .slider-circle__background-title") - (getTotalHeight("#slide-9 .slider-circle__background-title") + 200)}px`,
    top: `${getTotalHeight("#slide-9 .slider-circle__background-title") + 200}px`,
  });


  growSvgOnLoad("#line-6", {
    initialHeight: "0rem",
    finalHeight: isRTL() ? (isAbove(991) ? '25%' : isBelow(601) ? "20%" : "7%") : (isAbove(991) ? '35%' : isBelow(601) ? "24%" : "14%"),
  });

  marqueeInit();
  initMenuAnimation();

});

function growSvgOnLoad(svgSelector, options = {}) {
  const svg = document.querySelector(svgSelector);
  const line = svg?.querySelector('.red-line-wrap');

  if (!svg || !line) {
    console.warn(`⚠️ Missing elements in ${svgSelector}`);
    return;
  }

  // Default settings
  const defaults = {
    initialHeight: "2rem", // start height in rem
    finalHeight: "8rem",   // end height in rem
    duration: 1.5,
    ease: "power2.out",
  };

  const settings = { ...defaults, ...options };

  // Set initial height
  gsap.set(line, {
    height: settings.initialHeight,
    transformOrigin: "center top",
  });

  // Animate line growth on load
  gsap.to(line, {
    height: settings.finalHeight,
    duration: settings.duration,
    ease: settings.ease,
  });
}


function growSvgOnScroll(svgSelector, triggerSelector = svgSelector, options = {}) {
  const svg = document.querySelector(svgSelector);
  const arrow = svg?.querySelector('#Layer_2');
  const line = svg?.querySelector('.red-line-wrap');
  if (!svg) {
    console.warn(`⚠️ No SVG found at ${svgSelector}`);
    return;
  }

  // ✅ Default settings (can be overridden by options)
  const defaults = {
    startHeight: "25%",
    endHeight: isBelow(992) ? "91%" : "84%",
    transformOrigin: "center top",
    ease: "none",
    scrub: 2,
    markers: false,
    start: "top top",
    end: "bottom center",
  };

  // ✅ Merge user options with defaults
  const settings = { ...defaults, ...options };

  gsap.set(svg, {
    top: settings.top,
  });
  // ✅ Set initial properties
  gsap.set(line, {
    transformOrigin: settings.transformOrigin,
    height: settings.startHeight,
    top: settings.top,
  });
  gsap.set(arrow, {
    yPercent: -100,
    //  autoAlpha: 0,
  });

  // 🟢 Arrow animates once (not scrubbed)
  gsap.to(arrow, {
    yPercent: 0,
    duration: 1,
    // autoAlpha: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: triggerSelector,
      start: "top center", // triggers after a small scroll
      toggleActions: "play none none reverse", // play once on enter
      markers: settings.markers,
    },
  });

  // 🔴 Line grows with scrubbed scroll
  gsap.to(line, {
    height: settings.endHeight,
    ease: settings.ease,
    scrollTrigger: {
      trigger: triggerSelector,
      start: settings.start,
      end: `+=${settings.endHeight}`,
      scrub: settings.scrub,
      markers: settings.markers,
    },
  });
}



function initPageListingScroll() {
  const smoother = ScrollSmoother.get();
  const listItems = isBelow(600) ? document.querySelectorAll(".menu-items a") : document.querySelectorAll(".page-listing li");
  const scrollBox = document.querySelector(".scrollBox");
  const scrollDownArrow = document.querySelector(".scroll-down-wrapper");

  const sections = Array.from(
    document.querySelectorAll("section[id^='slide-'], div[id^='slide-']")
  ).filter((el) => !el.closest("[id^='slide-']:not(:scope)"));

  if (!smoother || !listItems.length || !sections.length) return;

  // ✅ Smooth scroll on li click (using data-target)
  listItems.forEach((li) => {
    li.addEventListener("click", () => {
      if (isAbove(991)) {
        const openModal = document.querySelector(".chp-modal.show");
        if (openModal) {
          closeModal(openModal);
        }
        // pauseScroll(false); // ▶️ resume scroll and re-enable overflow
        // document.querySelectorAll(".chp-modal.show").forEach((m) =>
        //   m.classList.remove("show")
        // );
      }
      if (isBelow(600)) {
        window.menuTlAnimation.reverse();
        document.querySelector(".header--wrapper .menu-items").style.display = "block";
        document.querySelector(".menu-toggle").classList.toggle("opend");
        document.querySelector(".menu-box .btn-label").classList.toggle("opend");
        ScrollSmoother.get().paused(false);
      }
      const targetId = li.getAttribute("data-target");
      let targetY = 0;

      if (targetId) {
        const targetSection = document.getElementById(targetId);
        if (!targetSection) return;
        targetY = smoother.offset(targetSection, "center center");
      }

      gsap.to(smoother, {
        scrollTop: isIOS() ? (targetY) : targetY,
        duration: 1.5,
        ease: "power2.inOut",
        overwrite: true,
      });

      listItems.forEach((item) => item.classList.remove("active"));
      li.classList.add("active");
    });
  });


  // ✅ ScrollBox click → scroll to next section
  if (scrollBox && sections[1]) {
    scrollBox.addEventListener("click", () => {
      const targetY = smoother.offset(sections[1], "center center");

      gsap.to(smoother, {
        scrollTop: isIOS() ? (targetY) : targetY,
        duration: 1.5,
        ease: "power2.inOut",
        overwrite: true,
      });
    });
  }

  // ✅ ScrollDownArrow click → scroll to next section
  if (scrollDownArrow && sections[1]) {
    scrollDownArrow.addEventListener("click", () => {
      const targetY = smoother.offset(sections[1], isBelow(992) ? (isBelow(600) ? "center center" : "top top") : "center center");
      // console.log(targetY)
      scrollDownArrow.style.pointerEvents = "none";
      gsap.to(smoother, {
        scrollTop: isIOS() ? (targetY) : targetY,
        duration: 1.5,
        ease: "power2.inOut",
        overwrite: true,
        onComplete: () => {
          scrollDownArrow.style.pointerEvents = "all";
        }
      });
    });
  }

  // ✅ Intersection Observer of Scrolltrigger to update active li on scroll
  listItems.forEach((li) => {
    const targetId = li.getAttribute("data-target");
    const section = document.getElementById(targetId);
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onEnter: (self) => {
        // console.log("Entered section:", self.trigger.id);
        setActive(li);
      },
      onEnterBack: (self) => {
        setActive(li);
      },
      markers: false,
    });
  });

  function setActive(activeLi) {
    // console.log(activeLi)
    listItems.forEach((li) => li.classList.remove("active"));
    activeLi.classList.add("active");
  }
}

// Generic directional text scrub animation
function animateDirectionalTextScrub(filterClass = null, opts = {}) {
  if (isBelow(1199)) {
    return;
  }
  const baseSelector = ".animate-text-left, .animate-text-right";
  const allElements = Array.from(document.querySelectorAll(baseSelector));

  // ✅ Filter only elements inside filterClass (if provided)
  const elements = filterClass
    ? allElements.filter(el => el.closest(filterClass))
    : allElements;

  if (!elements.length) return null;

  // ✅ Wrap text and compute positions
  elements.forEach((wrapper) => {
    if (!wrapper.querySelector("span")) {
      const text = wrapper.textContent.trim();
      const span = document.createElement("span");
      span.textContent = text;
      // span.style.paddingInline = "2px";
      wrapper.textContent = "";
      wrapper.appendChild(span);
    }

    Object.assign(wrapper.style, {
      overflow: "hidden",
      display: "inline-block",
      verticalAlign: "top",
      width: "fit-content",
    });

    const el = wrapper.querySelector("span");
    const computed = window.getComputedStyle(el);
    const matrix = new DOMMatrixReadOnly(computed.transform === "none" ? "matrix(1,0,0,1,0,0)" : computed.transform);
    const originalX = matrix.m41 || 0; const originalY = matrix.m42 || 0;

    // Cache original positions & offset if not cached 
    if (!el.dataset.originalX) {
      el.dataset.originalX = originalX; el.dataset.originalY = originalY;
      const isLeft = wrapper.classList.contains("animate-text-left");
      const moveFromLeft = isRTL() ? !isLeft : isLeft;
      const baseMultiplier = isBelow(1024) ? (isBelow(599) ? 4 : 4.5) : 8;
      const offsetDistance = Math.abs(originalX || 100) * baseMultiplier;
      // el.dataset.offsetX = isLeft ? originalX - offsetDistance : originalX + offsetDistance;
      el.dataset.offsetX = moveFromLeft ? originalX - offsetDistance : originalX + offsetDistance;
    }

  });


  // ✅ Collect spans and set initial state
  const spans = elements.map(w => w.querySelector("span"));
  spans.forEach((el) => {
    const offX = parseFloat(el.dataset.offsetX);
    const oY = parseFloat(el.dataset.originalY);
    gsap.set(el, { x: offX, y: oY, display: "block" });
  });

  // ✅ Determine trigger element
  const triggerEl =
    (filterClass && document.querySelector(filterClass)) ||
    elements[0].closest("section") ||
    elements[0].parentElement ||
    elements[0];

  // ✅ Kill old triggers for same element
  ScrollTrigger.getAll()
    .filter(st => st.trigger === triggerEl)
    .forEach(st => st.kill());

  // ✅ Timeline that scrubs both directions
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerEl,
      start: opts.start || "top 90%",
      end: opts.end || "bottom 10%",
      scrub: opts.scrub ?? 2,
      markers: opts.markers ?? false,
    },
  });

  // 🪄 3-phase animation: In → Hold → Out
  tl.fromTo(
    spans,
    {
      x: (i, el) => parseFloat(el.dataset.offsetX),
      // autoAlpha: 0,
    },
    {
      x: (i, el) => parseFloat(el.dataset.originalX),
      // autoAlpha: 1,
      ease: "none",
      stagger: opts.stagger || 0.12,
      duration: opts.durationIn || 2,
    },
    0
  )
    // ✨ Hold phase (keep visible)
    .to(
      spans,
      {
        x: (i, el) => parseFloat(el.dataset.originalX),
        // autoAlpha: 1,
        ease: "none",
        duration: opts.holdDuration || 0.5, // hold duration controls how long text stays fully visible
      },
      ">"
    )
    // 👋 Exit phase
    .to(
      spans,
      {
        x: (i, el) => parseFloat(el.dataset.offsetX),
        // autoAlpha: 0,
        ease: "none",
        stagger: opts.stagger || 0.12,
        duration: opts.durationOut || 2,
      },
      ">"
    );

  return tl;
}

//Generic curved text rotation animation
function rotateCurvedTextOnScroll() {
  // Select all curvedText elements
  const curvedTexts = Array.from(document.querySelectorAll(".curved-text.rotate"));

  // console.log('curvedTexts',curvedTexts);

  curvedTexts.forEach((curvedText, index) => {
    let rotateStart, rotateEnd;

    // 🌀 Set rotation ranges based on index
    switch (index) {
      case 0:
        rotateStart = 230;
        rotateEnd = 430;
        break;
      case 1:
        rotateStart = 240;
        rotateEnd = 440;
        break;
      case 2:
        rotateStart = 240;
        rotateEnd = 440;
        break;
      case 3:
        rotateStart = 0;
        rotateEnd = 200;
        break;
      case 4:
        rotateStart = 200;
        rotateEnd = 480;
        break;
      default:
        rotateStart = 160;
        rotateEnd = 350;
        break;
    }

    gsap.set(curvedText, {
      rotate: rotateStart,
      transformOrigin: "50% 50%",
      xPercent: isRTL() ? 50 : -50,          // center horizontally
      yPercent: isBelow(992) ? 0 : -50, // responsive vertical
      x: isRTL() ? 0 : 0,       // adjust horizontal for RTL if needed
      y: isRTL() ? 0 : 0,       // adjust horizontal for RTL if needed
    });

    // SELECT matching arrow

    const arrow = curvedText.parentElement.querySelector(".half-circle-arrow");

    if (arrow) {
      gsap.set(arrow, {
        rotate: rotateStart,
        transformOrigin: "50% 50%",
      });
    }

    // ScrollTrigger timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: curvedText,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        markers: false,
      },
    });

    // Animate rotation
    tl.to(curvedText, {
      rotate: rotateEnd,
      marginBottom: 0,
      height: isBelow(992) ? "30rem" : "33rem",
      width: isBelow(992) ? "30rem" : "33rem",
      ease: "none",
    });

    // rotate arrow *in sync*
    if (arrow) {
      tl.to(
        arrow,
        {
          rotate: rotateEnd,
          ease: "none",
        },
        "<" // <-- synchronize with curved-text rotation
      );
    }

  });

}

//slide 1 and 2 animation
function initCircleTextAnimation() {
  // ------------------------------
  // 1️⃣ SELECT MAIN ELEMENTS
  // ------------------------------
  const siderBar = document.querySelector(".siderBar--wrapper");
  const logoBox = document.querySelector(".header-box");
  const section = document.querySelector(".banner-wrapper");
  const slide1 = document.querySelector(".slide-1");
  const slide2 = document.querySelector(".slide-2");
  const circleRingWrapper = slide2?.querySelector(".curved-text.rotate");
  const motionCircle = document.querySelector("#introduction-circle");
  const lines = Array.from(document.querySelectorAll(".motion-circle__line"));
  const image = document.querySelector(".motion-circle__image");
  const slideText = document.querySelector(".text-slide-wrapper");
  const mainBackground = document.querySelector(".main-background");
  const scrollDownArrow = document.querySelector(".scroll-down-wrapper");
  const svgWraps = document.querySelectorAll('.svg-wraps');

  const textWrappers = gsap.utils.toArray(
    section?.querySelectorAll(".animate-text-left, .animate-text-right")
  );

  // ------------------------------
  // 2️⃣ BUILD IMAGE SLICES FOR REVEAL ANIMATION
  // ------------------------------
  const src = image?.getAttribute("src");
  const parent = image?.parentElement;

  const sliceWrapper = document.createElement("div");
  sliceWrapper.classList.add("motion-circle__image-slices");

  const sliceCount = 6;
  for (let i = 0; i < sliceCount; i++) {
    const slice = document.createElement("div");
    slice.classList.add("motion-circle__slice");
    slice.style.backgroundImage = `url(${src})`;
    slice.style.backgroundPosition = `${(i * 100) / (sliceCount - 1)}% top`;
    sliceWrapper.appendChild(slice);
  }

  parent?.appendChild(sliceWrapper);
  const slices = document.querySelectorAll(".motion-circle__slice");

  // ------------------------------
  // 3️⃣ PREPARE TEXT FOR ANIMATION
  // ------------------------------
  const textSpans = textWrappers.map((wrapper) => {
    // Wrap text in <span> if not already
    if (!wrapper.querySelector("span")) {
      const txt = wrapper.textContent.trim();
      wrapper.textContent = "";
      const span = document.createElement("span");
      span.textContent = txt;
      wrapper.appendChild(span);
    }

    // Style the wrapper
    Object.assign(wrapper.style, {
      overflow: "hidden",
      display: "inline-block",
      verticalAlign: "top",
      width: "fit-content",
    });

    const span = wrapper.querySelector("span");
    span.style.display = "inline-block";
    span.style.paddingInline = "2px";

    // Detect RTL
    const isRTL =
      document.dir === "rtl" ||
      document.documentElement.dir === "rtl" ||
      document.body.dir === "rtl";

    // Get computed transform (default to matrix identity if none)
    const computed = window.getComputedStyle(span);
    const matrix = new DOMMatrixReadOnly(
      computed.transform === "none" ? "matrix(1,0,0,1,0,0)" : computed.transform
    );
    const originalX = matrix.m41 || 0;
    const originalY = matrix.m42 || 0;

    // Direction logic — flipped for RTL
    const isLeft = wrapper.classList.contains("animate-text-left");
    const moveFromLeft = isRTL ? !isLeft : isLeft;

    // Offset distance (scaled)
    const offsetDistance = Math.abs(originalX || 100) * 8;
    const offsetX = moveFromLeft
      ? originalX - offsetDistance // from left
      : originalX + offsetDistance; // from right

    // Apply initial transform
    gsap.set(span, { x: offsetX, y: originalY, autoAlpha: 0 });

    // Return cache data for later use
    return { wrapper, span, originalX, originalY, offsetX };
  });

  //SET SCROLL ARROW INVISABLE
  gsap.set(scrollDownArrow, {
    pointerEvents: "none",
    opacity: 0,
    pointerEvents: "none",
  });

  // ------------------------------
  // 4️⃣ SET INITIAL FULLSCREEN STATE FOR CIRCLE
  // ------------------------------

  gsap.set(motionCircle, {
    position: "absolute",
    top: "50%",
    left: "50%",
    xPercent: isRTL() ? 50 : -50,
    yPercent: -50,
    // width: isBelow(1024) ? (isBelow(599) ? "250vw" : "185vw") : "130vw",
    // height: isBelow(1024) ? (isBelow(599) ? "250vw" : "185vw") : "130vw",
    opacity: 1,
    x: 0, // ensure no pixel offset
    y: 0, // ensure no pixel offset
  });


  // ------------------------------
  // 5️⃣ INTRO TIMELINE (AUTO PLAYS ON LOAD)
  // ------------------------------
  const introTl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
  });

  if (window.isHomePage) {
    // Lines grow
    introTl.to(lines, {
      height: "100%",
      duration: 1.6,
      ease: "power1.out",
      // stagger: 0.05,
    });


    introTl.to(lines,
      {
        opacity: 0,
        duration: 0.5,
        onStart: () => {
          // this._linesFaded = true;
        }
      });

    // Image slices reveal
    introTl.to(
      slices,
      {
        clipPath: isLTR() ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
        duration: 1.2,
        ease: "power2.inOut",
      },
      "-=0.3"
    );

    introTl.addLabel("textAndUI", "-=0.2"); // create label for clarity
  }

  // Hide them initially (before timeline plays)
  gsap.set(siderBar, { x: isRTL() ? -100 : 100, autoAlpha: 0 });
  gsap.set(logoBox, { y: -150, autoAlpha: 0 });
  gsap.set(slideText, { opacity: 1, width: "100%" });
  gsap.set(mainBackground, { opacity: 1 });
  gsap.set(svgWraps, { opacity: 1, });

  // Visable Scroll Drown Arrow
  introTl.to(scrollDownArrow, {
    opacity: 1
  }, "textAndUI");

  // Text slides in
  introTl.to(
    textSpans.map((t) => t.span),
    {
      x: 0,
      autoAlpha: 1,
      duration: 1.6,
      stagger: 0.12,
      ease: "power2.out",
      onComplete() {
        // Text animation complete
        setTimeout(function () { ScrollSmoother.get().paused(false); }, 500);
      }
    },
    "textAndUI"
  );

  // Animate both after text appears
  introTl.to(
    siderBar,
    {
      x: 0,
      autoAlpha: 1,
      duration: 1.6,
      ease: "power1.out",
    },
    "textAndUI"
  );

  introTl.to(
    logoBox,
    {
      y: 0,
      autoAlpha: 1,
      duration: 1.6,
      ease: "power1.out",
    },
    "textAndUI"
  );

  introTl.to(scrollDownArrow, {
    delay: 2,
    pointerEvents: "all",
  }, "textAndUI");

  // Cleanup slices and lines
  introTl.add(() => {
    try {
      sliceWrapper.remove();
    } catch (e) { }
    lines.forEach((l) => {
      try {
        l.remove();
      } catch (e) { }
    });
  });

  // Initialize scroll timeline after intro
  introTl.call(() => {
    createScrollTimeline();
  });

  // ------------------------------
  // 6️⃣ SCROLL TRIGGER TIMELINE
  // ------------------------------
  function createScrollTimeline() {
    // Kill any existing scroll triggers
    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger === section) st.kill();
    });

    // Timeline 1: Pin slide-1 and animate text out
    const textScrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: slide1,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: slide1,
        // markers: true,
        pinSpacing: false,
        anticipatePin: 1,
      },
    });

    // Text reverses out
    textScrollTl.to(
      textSpans.map((t) => t.span),
      {
        x: (i, el) => {
          const found = textSpans.find((ts) => ts.span === el);
          return found ? found.offsetX : 150;
        },
        autoAlpha: 0,
        ease: "none",
      }
    );

    // Animate and Hide Scroll Arrow when Scroll
    textScrollTl.to(scrollDownArrow, {
      opacity: 0,
      y: 50,
    }, 0);

    // Timeline 2: Pin motionCircle until slide-2 center reaches viewport center
    const circleScrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: slide2,
        start: "top center", // When slide-2 top hits center of viewport
        end: "top top", // Until slide-2 center hits viewport center
        scrub: 1,
        markers: false,
        // pin: motionCircle,
        pinSpacing: false,
        invalidateOnRefresh: true,

      },
    });


    circleScrollTl
      // motionCircle moves first
      .to(
        motionCircle,
        {
          y: 0,
          position: "absolute",
          top: isBelow(992) ? (isBelow(600) ? "19rem" : "19rem") : "50%",
          left: "50%",
          xPercent: isRTL() ? 50 : -50,
          yPercent: -50,
          ease: "power2.out",
          immediateRender: false,
        },
        0 // starts immediately
      )
      // wrapper clipPath starts *slightly later*
      .to(
        motionCircle?.querySelector(".motion-circle__wrapper"),
        {
          clipPath: isBelow(992) ? (isBelow(600) ? "circle(21% at 50% 50%)" : "circle(18% at 50% 50%)") : isBelow(1200) ? (isAboveHeight(1000) ? "circle(12% at 50% 50%)" : "circle(16% at 50% 50%)") : "circle(17% at 50% 50%)",
          ease: "power2.out",
          immediateRender: false,
        },
        isBelow(992) ? 0 : "<+0.2" // start 0.2s after motionCircle begins
      );


    // Before timeline plays
    const scrollBox = document.querySelector(".scrollBox");
    const pageListing = document.querySelector(".page-listing");


    const scrollBoxTl = gsap.timeline({
      scrollTrigger: {
        trigger: slide2,
        start: "top center", // When slide-2 top hits center of viewport
        end: "top top", // Until slide-2 center hits viewport center
        scrub: 1,
        // markers: true,
      },
    });
    // Set initial states
    gsap.set(scrollBox, { top: "50%", autoAlpha: 1 });
    gsap.set(pageListing, { top: "60%", y: 0, autoAlpha: 0, });

    // Add to intro timeline
    scrollBoxTl.to(scrollBox, {
      top: "25%",              // ⬅️ move scrollBox up to 30%
      duration: 1.2,
      autoAlpha: 0,
      ease: "power2.inOut",
    }, 0);

    scrollBoxTl.to(pageListing, {
      yPercent: -50,           // ⬅️ translateY(-50%)
      autoAlpha: 1,            // ⬅️ makes opacity: 1 and visibility: visible
      duration: 1.2,
      top: "50%",
      ease: "power2.inOut",
    }, 0);


    // Timeline 3: Circle ring animation
    const ringScrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: circleRingWrapper,
        start: "top center", // When element top hits center of viewport
        end: "bottom top",
        scrub: 1,
        // markers: true,
      },
    });

    gsap.set(".slide-2 .curved-text.rotate", {
      rotate: 160,
    });

    // ringScrollTl.to(".slide-2 .curved-text", {
    //   marginBottom: 0,
    //   height: isBelow(992) ? "28rem" : "31.1875rem",
    //   width: isBelow(992) ? "28rem" : "31.1875rem",
    //   rotate: 350,
    //   ease: "none",
    // });
  }
}

// Generic function to zoom in circle on scroll
function zoomInCircleOnScroll(parent, circle) {
  if (isBelow(992)) {
    return;
  }
  const parentElement = document.querySelector(parent);
  const curvedText = parentElement?.querySelector(".curved-text.rotate");
  const motionCircle = document.querySelector(circle);

  if (!parentElement || !motionCircle) {
    console.warn("⚠️ Missing parent or motion circle element");
    return;
  }

  const wrapper = motionCircle.querySelector(".motion-circle__wrapper");

  // ✅ Initialize both elements
  gsap.set(motionCircle, { scale: isBelow(992) ? 0.9 : 0.8, transformOrigin: "center center" });
  gsap.set(wrapper, { scale: 1, transformOrigin: "center center" });

  // ✅ Create ScrollTrigger
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parentElement,
      start: "top bottom",
      end: "bottom center",
      scrub: 1.2,
      markers: false,
    },
  });

  tl.to(motionCircle, {
    scale: 1,
    transformOrigin: "center center",
    ease: "none",
    onUpdate: () => {
      const currentScale = gsap.getProperty(motionCircle, "scale");
      gsap.set(wrapper, { scale: 1 / currentScale }); // inverse scale to cancel inheritance
    },
  });
}

// ✅ Generic function to zoom OUT circle on scroll (reverse effect)
function zoomOutCircleOnScroll(circle) {
  const motionCircle = document.querySelector(circle);

  if (!motionCircle) {
    console.warn("⚠️ Missing parent or motion circle element");
    return;
  }

  const wrapper = motionCircle.querySelector(".motion-circle__wrapper");

  // ✅ Initialize both elements
  gsap.set(motionCircle, { scale: 0.6, transformOrigin: "center center" });
  gsap.set(wrapper, { scale: 1 / 0.6, transformOrigin: "center center" }); // counter-scale initially

  // ✅ Create ScrollTrigger
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: motionCircle,
      start: "top bottom",
      end: "bottom center",
      scrub: 1.2,
      // markers: true,
    },
  });

  tl.to(motionCircle, {
    scale: 1,
    transformOrigin: "center center",
    ease: "none",
    onUpdate: () => {
      const currentScale = gsap.getProperty(motionCircle, "scale");
      gsap.set(wrapper, { scale: 1 / currentScale }); // inverse scale to keep same visual size
    },
  });
}


function initGlobalAnimations() {
  // data-animate="slide-left" data-delay="0.7" data-duration="1.8"

  // 🔸 Helper: debounce (avoid re-triggering too often)
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  window.initAnimations = function (mode = "all") {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    const shouldAnimate = (el) => {
      if (mode === "all") return true;
      if (mode === "onlyRepeated") return el.classList.contains("animation-repeat");
      if (mode === "newOnce") return !el.classList.contains("animation-done");
      return false;
    };

    const markAnimated = (el) => el.classList.add("animation-done");

    // =====================================================
    // 1️⃣ GENERIC ANIMATIONS (Fade, Slide, Scale, etc.)
    // =====================================================
    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => {
      if (!shouldAnimate(el)) return;

      const type = el.dataset.animate;
      const delay = parseFloat(el.dataset.delay) || 0; // NEW
      const duration = parseFloat(el.dataset.duration) || 1.2; // NEW

      gsap.killTweensOf(el);

      let startValue = el.dataset.start || "top 90%";

      // ScrollTrigger base config
      const scroll = {
        trigger: el,
        start: startValue,
        end: "bottom 60%", // distance of scrub effect
        scrub: el.dataset.scrub === "true" ? 1 : false, // 🧩 scrub if data-scrub="true"
        // markers: true,
      };

      const defaultVars = {
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: scroll,
        // markers: true,
      };

      switch (type) {
        case "fade-in":
          gsap.fromTo(
            el,
            {
              yPercent: isBelow(1199) ? 0 : 50,
              opacity: isBelow(1199) ? 1 : 0,
            }, // start below and invisible
            {
              yPercent: 0,
              opacity: 1,
              ...defaultVars,
            }
          );
          break;

        case "fade-up": // 🆕 NEW animation
          gsap.fromTo(
            el,
            { opacity: 0, y: 60 }, // slightly more lift for upward feel
            { opacity: 1, y: 0, ...defaultVars }
          );
          break;

        case "slide-left":
          gsap.fromTo(
            el,
            { x: 60, opacity: 0 },
            { x: 0, opacity: 1, ...defaultVars }
          );
          break;

        case "slide-right":
          {
            const startX = isRTL() ? 100 : -100;

            gsap.fromTo(
              el, // 👈 always include the target element
              { xPercent: startX, opacity: 0 }, // start offscreen to the right
              {
                xPercent: 0,
                opacity: 1,
                ...defaultVars,
                ease: "power2.out",
              }
            );
          }
          break;


        case "scale-up":
          gsap.fromTo(
            el,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, ...defaultVars, ease: "back.out(1.7)" }
          );
          break;

        default:
          gsap.fromTo(
            el,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, ...defaultVars }
          );
      }

      markAnimated(el);
    });

    // ScrollTrigger.refresh();
  };

  // 🔸 Optional re-run on resize/orientation change
  const handleResize = debounce(() => window.initAnimations("all"), 500);
  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", handleResize);
}

document.addEventListener("DOMContentLoaded", () => {
  initGlobalAnimations();
  window.initAnimations(); // Run once after DOM is ready
});


function marqueeInit() {
  document.querySelectorAll(".marquee").forEach((marquee, index) => {
    marquee.classList.add(`marquee-${index}`);

    const promiseElement = document.querySelector(".js-commitmentWrapper");

    // Remove previously cloned items if any
    let allItems = Array.from(marquee.querySelectorAll(".marquee__item"));
    if (marquee.dataset.cloned === "true") {
      const originalCount = allItems.length / 2;
      const clonedItems = allItems.slice(originalCount);
      clonedItems.forEach((item) => item.remove());
      marquee.dataset.cloned = "false";
      allItems = allItems.slice(0, originalCount);
    }

    // Reset animation classes
    allItems.forEach((item) => {
      item.classList.remove("marquee-animate", "marquee-animate-reverse");
    });

    // Calculate total width of original items
    let totalWidth = 0;
    allItems.forEach((item, idx) => {
      const itemWidth = item.getBoundingClientRect().width;
      totalWidth += itemWidth;
      if (idx < allItems.length - 1) totalWidth += 10; // spacing
    });

    // if (totalWidth > window.innerWidth) {
    // Clone original items
    allItems.forEach((item, idx) => {
      const clone = item.cloneNode(true);
      clone.style.setProperty("--marquee-item-index", allItems.length + idx);
      marquee.appendChild(clone);
    });

    marquee.style.setProperty("--marquee-count", (allItems.length * 2));
    marquee.dataset.cloned = "true";
    promiseElement.classList.remove("wrapper");

    // ✅ Every odd marquee reversed
    const animationClass = index % 2 === 0 ? "marquee-animate" : "marquee-animate-reverse";

    marquee
      .querySelectorAll(".marquee__item")
      .forEach((item) => item.classList.add(animationClass));
    // } else {
    //   promiseElement.classList.add("wrapper");
    // }
  });
}

// Initialize for all canvases
function updateCurvedText(curvedTextEl) {
  const cnv = curvedTextEl;
  const ctx = cnv.getContext("2d");
  let isMicro = curvedTextEl.classList.contains("micro-circle")
  let isMini = curvedTextEl.classList.contains("mini-circle")
  let flipWords = curvedTextEl.classList.contains("flip-words");

  // Convert rem → px
  function remToPx(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  // Match drawing size to CSS rem size
  const style = getComputedStyle(cnv);
  const cssWidthRem = parseFloat(style.width) / parseFloat(getComputedStyle(document.documentElement).fontSize);
  const cssHeightRem = parseFloat(style.height) / parseFloat(getComputedStyle(document.documentElement).fontSize);

  const widthPx = remToPx(cssWidthRem);
  const heightPx = remToPx(cssHeightRem);
  cnv.width = widthPx;
  cnv.height = heightPx;

  // Clear before redraw
  ctx.clearRect(0, 0, cnv.width, cnv.height);

  const centerX = cnv.width / 2;
  const centerY = cnv.height / 2;
  const fontSize =
    isMicro ? (isAbove(991) ? remToPx(1.3) : remToPx(1.86)) :
      (isMini ? (isAbove(991) ? remToPx(1.5) : remToPx(1.65)) :
        (isLTR() ? remToPx(2.35) : (isBelow(991) ? remToPx(1.9) : remToPx(1.8))));
  const fontFamily = isRTL() ? `ABCFavoritArabic` : `ABCFavoritCondensed`;
  const lineHeight = 1;

  // ✅ Use full canvas, minus half font height so letters touch edges
  // Reduce radius a bit more when flipped and RTL to keep letters inside
  const radiusReduction = (flipWords && isRTL()) ? fontSize * 0.8 : fontSize / 2 * lineHeight;
  const radius = Math.min(cnv.width, cnv.height) / 2 - radiusReduction;

  function drawTextAlongArc(text, centerX, centerY, radius, colorRanges = [], defaultColor = "white") {
    text = isRTL() ? text : text.toUpperCase();
    ctx.font = `normal ${fontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Apply vertical flip if flipWords is true
    if (flipWords) {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(1, -1);
      ctx.translate(-centerX, -centerY);
    }

    // If RTL, split into words and rotate words instead of letters
    if (isRTL()) {
      const words = text.split(' ');
      let totalWidth = 0;
      const wordWidths = [];

      for (let word of words) {
        const width = ctx.measureText(word).width;
        wordWidths.push(width);
        totalWidth += width;
      }

      const wordSpacing = isMicro ? ((isAbove(991) ? (fontSize * (0.75)) : (fontSize * (0.65)))) :
        (isMini ? ((isAbove(991) ? (fontSize * (0.48)) : (fontSize * (0.4)))) :
          fontSize * 0.5);

      const totalArcNeeded = (totalWidth + wordSpacing * (words.length - 1)) / radius;
      const startAngle = -Math.PI / 2 - totalArcNeeded / 2;
      let currentAngle = startAngle;
      let charIndex = 0;

      for (let i = words.length - 1; i >= 0; i--) {
        const word = words[i];
        const wordWidth = wordWidths[i];

        // Determine word color from colorRanges
        ctx.fillStyle = defaultColor;
        for (let range of colorRanges) {
          if (charIndex >= range.start && charIndex <= range.end) {
            ctx.fillStyle = range.color;
            break;
          }
        }

        const angleOffset = wordWidth / radius;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(currentAngle + angleOffset / 2 + Math.PI / 2);
        ctx.translate(0, -radius);
        if (flipWords) {
          ctx.scale(1, -1);
        }
        ctx.fillText(word, 0, fontSize * 0.15);
        ctx.restore();

        currentAngle += angleOffset + wordSpacing / radius;
        charIndex += word.length + 1; // +1 for space
      }
    } else {
      // LTR: Draw letter by letter (original logic)
      let totalWidth = 0;
      const charWidths = [];

      for (let i = 0; i < text.length; i++) {
        const width = ctx.measureText(text[i]).width;
        charWidths.push(width);
        totalWidth += width;
      }

      const charSpacing = isMicro ? ((isAbove(991) ? (fontSize * (0.75)) : (fontSize * (0.65)))) :
        (isMini ? ((isAbove(991) ? (fontSize * (0.62)) : (fontSize * (0.55)))) :
          fontSize * 0.02);

      const totalArcNeeded = (totalWidth + charSpacing * (text.length - 1)) / radius;
      const startAngle = -Math.PI / 2 - totalArcNeeded / 2;
      let currentAngle = startAngle;

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const charWidth = charWidths[i];

        ctx.fillStyle = defaultColor;
        for (let range of colorRanges) {
          if (i >= range.start && i <= range.end) {
            ctx.fillStyle = range.color;
            break;
          }
        }

        const angleOffset = charWidth / radius;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(currentAngle + angleOffset / 2 + Math.PI / 2);
        ctx.translate(0, -radius);
        if (flipWords) {
          ctx.scale(1, -1);
        }
        ctx.fillText(char, 0, 0);
        ctx.restore();
        currentAngle += angleOffset + charSpacing / radius;
      }
    }

    // Restore context if flip was applied
    if (flipWords) {
      ctx.restore();
    }
  }

  function parseColoredText(text, defaultColor = "white") {
    const regex = /<colored color="([^"]+)">([^<]+)<\/colored>/g;
    let cleanText = "";
    let colorRanges = [];
    let offset = 0;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const beforeText = text.substring(lastIndex, match.index);
      cleanText += beforeText;
      offset += beforeText.length;

      const coloredText = match[2];
      const color = match[1];
      colorRanges.push({
        start: offset,
        end: offset + coloredText.length - 1,
        color: color
      });
      cleanText += coloredText;
      offset += coloredText.length;

      lastIndex = regex.lastIndex;
    }

    cleanText += text.substring(lastIndex);
    return { cleanText, colorRanges, defaultColor };
  }

  const text = curvedTextEl.dataset.text;
  const { cleanText, colorRanges, defaultColor } = parseColoredText(text, "#0C0608");
  drawTextAlongArc(cleanText, centerX, centerY, radius, colorRanges, defaultColor);
}
function updateAllCurvedTexts() {
  document.querySelectorAll(".curved-text").forEach(updateCurvedText);
}


function setupHeaderScrollAnimation(targetSelector) {
  const header = document.querySelector(targetSelector);
  const headerWrapper = document.querySelector(".header--wrapper");
  const btnLabel = document.querySelector(".btn-label");

  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false; // flag for requestAnimationFrame

  function updateHeaderStyles(scrollY) {
    const headerBox = document.querySelector(".header-box");

    if (scrollY > 20) {
      // show ::after overlay
      headerBox.style.setProperty("--after-opacity", 1);
      // change btn-label color
      if (btnLabel) btnLabel.style.color = "#0C0608"; // replace with your scroll color
    } else {
      headerBox.style.setProperty("--after-opacity", 0);
      if (btnLabel) btnLabel.style.color = ""; // reset to original
    }
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollingDown = currentScrollY > lastScrollY + 5; // small threshold to prevent micro flickers
        const scrollingUp = currentScrollY < lastScrollY - 5;

        if (scrollingDown) {
          if (!(document.querySelector(".menu-toggle.opend"))) {
            gsap.to(header, {
              y: "-150%",
              duration: 1.2,
              ease: "power2.out",
              onStart: () => {
                if (headerWrapper) {
                  headerWrapper.style.pointerEvents = 'none';
                }
              }
            });
          }
        } else if (scrollingUp) {
          gsap.to(header, {
            y: "0%",
            duration: 1.2,
            ease: "power2.out",
            onStart: () => {
              if (headerWrapper) {
                headerWrapper.style.pointerEvents = 'auto';
              }
            }
          });
        }

        // update after opacity and btn color
        updateHeaderStyles(currentScrollY);

        lastScrollY = currentScrollY;
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
}



//Snake Animation
class TextOnPath {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d", { alpha: true });
    this.path = isRTL() ? document.getElementById("snakePathRTL") : document.getElementById("snakePathLTR");
    this.text = isRTL() ? this.canvas.dataset.text : (this.canvas.dataset.text).toUpperCase();
    this.isArabic = isRTL(); // Set to true for Arabic text
    this.fontSize = isAbove(991) ? (isBelow(600) ? remToPx(1.3) : remToPx(1)) : remToPx(2.5);
    this.letterSpacing = isRTL() ? remToPx(0.15) : remToPx(0.8);
    this.direction = (isRTL() ? 'rtl' : 'ltr'); // 'ltr' or 'rtl'
    this.speed = 60 * (this.direction === 'rtl' ? 1 : -1); // Negative speed for RTL
    this.offset = 0;
    this.lastTime = performance.now();

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.pathLen = 0;
    this.points = [];
    this.segments = []; // For Arabic: words, for English: characters
    this.segmentWidths = [];
    this.textLength = 0;
    this.isInViewport = false;
    this.animationId = null;
    this.init();
  }

  init() {
    this.setupCanvas();
    this.precomputePath();
    this.measureText();
    this.setupIntersectionObserver();

    // window.addEventListener('resize', () => this.handleResize());
  }

  setupIntersectionObserver() {
    // Use scroll-based detection for GSAP ScrollSmoother compatibility
    this.checkViewport = () => {
      const rect = this.canvas.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;

      // Check if canvas is in viewport with some margin
      const isVisible = (
        rect.top < windowHeight + 50 &&
        rect.bottom > -50 &&
        rect.left < windowWidth &&
        rect.right > 0
      );

      if (isVisible && !this.isInViewport) {
        this.isInViewport = true;
        this.canvas.setAttribute('data-animation', 'playing');
        this.lastTime = performance.now();
        this.animate(this.lastTime);
      } else if (!isVisible && this.isInViewport) {
        this.isInViewport = false;
        this.canvas.setAttribute('data-animation', 'paused');
        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
          this.animationId = null;
        }
      }
    };

    // Check on scroll (works with ScrollSmoother)
    window.addEventListener('scroll', this.checkViewport, { passive: true });

    // Initial check
    this.checkViewport();
  }

  setupCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const viewWidth = 2300;
    const viewHeight = 900;
    const scale = Math.min(
      window.innerWidth / viewWidth,
      window.innerHeight / viewHeight
    ) * (isAbove(991) ? 1.5 : (isBelow(600) ? 3 : 2));

    this.canvas.width = viewWidth * scale * this.dpr;
    this.canvas.height = viewHeight * scale * this.dpr;
    this.canvas.style.width = `${viewWidth * scale}px`;
    this.canvas.style.height = `${viewHeight * scale}px`;

    this.scale = scale * this.dpr;
    this.ctx.scale(this.scale, this.scale);
  }

  precomputePath() {
    this.pathLen = this.path.getTotalLength();
    const step = 0.5;
    this.points = [];

    for (let d = 0; d <= this.pathLen; d += step) {
      const p = this.path.getPointAtLength(d);
      this.points.push({ x: p.x, y: p.y });
    }
  }

  measureText() {
    this.ctx.font = isRTL() ? `${this.fontSize}px ABCFavoritArabic` : `${this.fontSize}px ABCFavoritCondensed`;
    this.segments = [];
    this.segmentWidths = [];

    if (this.isArabic) {
      // For Arabic: split by spaces to keep words connected
      const words = this.text.split(' ').reverse();
      for (let i = 0; i < words.length; i++) {
        if (words[i]) {
          const width = this.ctx.measureText(words[i]).width;
          this.segments.push(words[i]);
          this.segmentWidths.push(width + this.letterSpacing);
        }
        // Add space as separate segment
        if (i < words.length - 1) {
          const spaceWidth = this.ctx.measureText(' ').width;
          this.segments.push(' ');
          this.segmentWidths.push(spaceWidth + this.letterSpacing);
        }
      }
    } else {
      // For English: individual characters
      for (let i = 0; i < this.text.length; i++) {
        const width = this.ctx.measureText(this.text[i]).width;
        this.segments.push(this.text[i]);
        this.segmentWidths.push(width + this.letterSpacing);
      }
    }

    this.textLength = this.segmentWidths.reduce((a, b) => a + b, 0);
  }

  getPointAt(d) {
    if (d < 0) d = this.pathLen + (d % this.pathLen);
    d = d % this.pathLen;
    const i = Math.floor(d / 0.5);
    return this.points[Math.min(i, this.points.length - 1)];
  }

  animate(time) {
    if (!this.isInViewport) return;

    const delta = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    this.offset += this.speed * delta;
    // Ensure offset wraps correctly for both directions
    if (this.direction === 'ltr') {
      if (this.offset < 0) this.offset += this.textLength;
    } else {
      this.offset %= this.textLength;
    }

    this.ctx.clearRect(0, 0, 2300, 900);

    this.ctx.font = isRTL() ? `${this.fontSize}px ABCFavoritArabic` : `${this.fontSize}px ABCFavoritCondensed`;
    this.ctx.fillStyle = "#D9D0C7";
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";

    let currentLength = -this.offset;

    while (currentLength < this.pathLen + this.textLength) {
      for (let i = 0; i < this.segments.length; i++) {
        const segment = this.segments[i];
        const w = this.segmentWidths[i];
        const half = w / 2;
        const midLen = currentLength + half;

        if (midLen >= 0 && midLen <= this.pathLen) {
          const p1 = this.getPointAt(midLen - 2);
          const p2 = this.getPointAt(midLen + 2);
          const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
          const pos = this.getPointAt(midLen);

          this.ctx.save();
          this.ctx.translate(pos.x, pos.y);
          this.ctx.rotate(angle);
          this.ctx.fillText(segment, 0, 0);
          this.ctx.restore();
        }

        currentLength += w;
      }
    }

    this.animationId = requestAnimationFrame((t) => this.animate(t));
  }

  handleResize() {
    // this.setupCanvas();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.fonts.ready.then(() => {
    const snakeCanvasAll = document.querySelectorAll(".snakeCanvas");

    snakeCanvasAll.forEach((canvas, index) => {
      new TextOnPath(canvas);

      if (index === snakeCanvasAll.length - 1) {
        document.querySelector("#snakeSvg").remove()
      }
    });
  });
});



function initMenuAnimation() {
  const menuToggle = document.querySelector(".menu-toggle");
  const menuOverlay = document.querySelector(".menu-overlay");
  const menuItems = document.querySelectorAll(".menu-items .item");
  const headerWrapper = document.querySelector(".header--wrapper");

  if (!menuToggle || !menuOverlay || !headerWrapper) return;

  const smoother = ScrollSmoother.get();
  const tl = gsap.timeline({
    paused: true, reversed: true,
    onReverseComplete: () => {
      gsap.set(menuItems, { pointerEvents: "none" });
    },
  });

  // Initial state
  gsap.set(menuOverlay, { top: "-120%", opacity: 0 });
  gsap.set(menuItems, { opacity: 0, x: 30, });

  // ✅ Define open animation
  tl.to(".header-box", {
    y: "0%",
    duration: 0,
    ease: "power2.out",
  })
    .to(menuOverlay, {
      duration: 0.8,
      top: 0,
      opacity: 1,
      ease: "power3.out",
    })
    .to(
      menuItems,
      {
        opacity: 1,
        x: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
        pointerEvents: "all"
      },
      "-=0.3"
    );

  window.menuTlAnimation = tl;

  // ✅ Toggle animation on click
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent immediate close
    const isOpened = menuToggle.classList.toggle("opend");
    document.querySelector(".menu-box .btn-label").classList.toggle("opend");

    if (isOpened) {
      if (smoother?.paused) smoother.paused(true);
      else if (smoother?.stop) smoother.stop();

      document.querySelector(".header--wrapper .menu-items").style.display = "block";
      tl.play();
    } else {
      closeMenu();
    }
  });

  // ✅ Close when clicking outside of .header--wrapper
  ["click", "touchstart"].forEach((eventType) => {
    document.addEventListener(eventType, (e) => {
      const isOpened = menuToggle.classList.contains("opend");

      if (isOpened && !headerWrapper.contains(e.target)) {
        closeMenu();
      }
    });
  });

  function closeMenu() {
    menuToggle.classList.remove("opend");
    tl.reverse();

    tl.eventCallback("onReverseComplete", () => {
      document.querySelector(".header--wrapper .menu-items").style.display = "none";
      if (smoother?.paused) smoother.paused(false);
      else if (smoother?.start) smoother.start();
    });
  }
}


function initSlide2Slider() {
  if (isAbove(991)) return;

  const el = document.querySelector(".js-simple-slider");
  if (!el) return;

  const wrapper = el.querySelector(".swiper-wrapper");
  const slides = wrapper.querySelectorAll(".swiper-slide");

  if (slides.length < 6) {
    const currentHTML = wrapper.innerHTML;
    for (let i = 0; i < 3; i++) {
      wrapper.innerHTML += currentHTML;
    }
  }

  ScrollTrigger.create({
    trigger: "#slide-2 .story-content .js-simple-slider",
    start: "top bottom-=20%",
    markers: false,
    onEnter: () => {
      initSlider();
    },
    once: true
  });

  function initSlider() {
    el.classList.remove("viewport-animation")
    const swiper = new Swiper(el, {
      slidesPerView: isBelow(600) ? 2.28 : 2.65,
      spaceBetween: remToPx(1.33),
      loop: true,
      speed: 1200,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      },
    });

    const slides = el.querySelectorAll(".swiper-slide");
    let canClick = true;

    slides.forEach((slide, index) => {
      slide.addEventListener("click", () => {
        if (!canClick) return;

        canClick = false;
        swiper.slideToLoop(index);

        setTimeout(() => {
          canClick = true;
        }, 1000);
      });
    });
  }
}

function applyMaskAndLiquidPaths(svgElement, gElement) {
  if (!svgElement || !gElement) return;

  // Generate a unique random ID for the mask
  const maskId = "mask_" + Math.random().toString(36).substr(2, 9);

  // 1. Create the <mask> element
  const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
  mask.setAttribute("id", maskId);

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", "0");
  rect.setAttribute("y", "0");
  rect.setAttribute("width", "100%");
  rect.setAttribute("height", "0%");
  rect.setAttribute("fill", "white");
  rect.setAttribute("style", "fill:white; height:0%; width:100%;");

  mask.appendChild(rect);

  // Append mask to the SVG
  svgElement.appendChild(mask);

  // 2. Clone the <g> and apply the mask
  const clonedG = gElement.cloneNode(true);
  clonedG.setAttribute("mask", `url(#${maskId})`);

  // Append the cloned <g> to the SVG
  svgElement.appendChild(clonedG);

  // 3. Set original <g> paths to a base color
  gElement.querySelectorAll("path").forEach(path => {
    path.style.fill = "#DAD1C7";
  });
}


document.addEventListener("DOMContentLoaded", initSlide2Slider);
document.addEventListener("DOMContentLoaded", () => {
  initStatisticsTabs();
  initVisionMissionTabs();
  sliderWithCircle();
});

function initStatisticsTabs() {

  const tabs = Array.from(document.querySelectorAll(".statistics__tabs .tab-btn"));
  const contents = Array.from(document.querySelectorAll(".statistics__content .tab-content"));
  const progressTime = 5000; // ms
  let currentIndex = 0;
  let timer = null;
  let swiper = null;

  const isMobileView = () => window.innerWidth <= 991;

  setTimeout(function () {
    const svgs = document.querySelectorAll(isAbove(991) ? ".image-wrapper svg.desk" : ".image-wrapper svg.mob");
    svgs.forEach(svg => {
      const g = svg.querySelector("g");
      if (g) {
        applyMaskAndLiquidPaths(svg, g);
      }
    });
  }, 2000);

  // ----- Progress helpers -----
  function resetAllProgressInstant() {
    if (isMobileView()) return;
    tabs.forEach(tab => {
      const span = tab.querySelector(".progress-bar span");
      if (span) {
        span.style.transition = "none";
        span.style.width = "0%";
      }
    });
  }

  function startProgressFor(index) {
    if (isMobileView()) return;

    const tab = tabs[index];
    if (!tab) return;
    const span = tab.querySelector(".progress-bar span");
    if (!span) return;

    // reset others instantly
    tabs.forEach((t, i) => {
      const s = t.querySelector(".progress-bar span");
      if (s) {
        s.style.transition = "none";
        s.style.width = i === index ? "0%" : "0%";
      }
    });

    // small timeout to allow the "none" to apply before starting the transition
    setTimeout(() => {
      span.style.transition = `width ${progressTime}ms linear`;
      span.style.width = "100%";
    }, 50);
  }

  function clearProgressTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function scheduleNext() {
    clearProgressTimer();
    timer = setTimeout(() => {
      currentIndex = (currentIndex + 1) % tabs.length;
      activateTab(currentIndex);
    }, progressTime);
  }

  let currentSlideIndex = 0;
  let previousIndex = null;
  let previousTl = null;

  function activateTab(index, slide = true, centerTab = true) {
    if (index < 0 || index >= tabs.length || index === currentSlideIndex) return;
    previousIndex = currentSlideIndex;
    currentSlideIndex = index;
    // --- Animate previous tab in reverse ---
    if (previousTl != null) {
      previousTl.eventCallback("onReverseComplete", () => {
        updateTabClassesAndContent(index, slide, centerTab);
        animateCurrentTab();
      });

      previousTl.timeScale(2);
      previousTl.reverse()
    } else {
      // first tab, no previous animation
      updateTabClassesAndContent(index, slide, centerTab);
      animateCurrentTab();
    }
  }

  // --- Update classes and swiper ---
  function updateTabClassesAndContent(index, slide, centerTab) {
    if (index < 0 || index >= tabs.length) return;
    currentIndex = index;

    // update tab active classes and aria
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });

    // update content classes (for desktop)
    contents.forEach((content, i) => {
      content.classList.toggle("active", i === index);
      content.setAttribute("aria-hidden", i === index ? "false" : "true");
    });

    if (!isMobileView()) {
      startProgressFor(index);
    }

    // if mobile and swiper exists, slide to it
    if (swiper && slide) {
      swiper.slideTo(index);
    }

    if(centerTab){
      scrollActiveTabIntoView();
    }

    // Only desktop: auto-advance
    if (!isMobileView() && isAbove(1199)) {
      scheduleNext();
    }

  }

  // --- Animate current tab ---
  function animateCurrentTab() {
    const numbersWrap = contents[currentSlideIndex].querySelector(".stat-number-wrap");
    const contextText = contents[currentSlideIndex].querySelectorAll(".content-text-item");
    const contextSvg = contents[currentSlideIndex].querySelectorAll(isAbove(991) ? ".image-wrapper svg.desk" : ".image-wrapper svg.mob");
    const contextCanvas = contents[currentSlideIndex].querySelectorAll("canvas");

    // console.log('numbersWrap',numbersWrap);

    // Wrap each number span individually if not already
    numbersWrap.querySelectorAll('span').forEach(span => {
      if (!span.dataset.animated) {
        span.dataset.animated = "true"; // mark as wrapped/animated
      }
    });

    // Animate number spans
    const numSpans = numbersWrap.querySelectorAll("span");

    // Wrap text spans if not done
    const textSpans = [];
    contents[currentSlideIndex].querySelectorAll(".content-text-item-wrap").forEach((el) => {
      el.querySelectorAll('p').forEach(p => {
        if (!p.querySelector("span")) {
          p.innerHTML = `<span>${p.textContent.trim()}</span>`;
        }
        textSpans.push(p.querySelector("span"));
      });
    });

    // Animate current
    const tl = gsap.timeline();
    previousTl = tl;

    numSpans.forEach(span => {
      tl.fromTo(
        span,
        { y: 100, opacity: 0, display: "inline-block" },
        { y: 0, opacity: 1, duration: 1.2, ease: "power2.out" },
        0
      );
    });

    contextText.forEach(span => {
      tl.fromTo(
        span,
        { y: 80, opacity: 0, display: "inline-block" },
        { y: 0, opacity: 1, duration: 1.2, ease: "power2.out" },
        0
      );
    });

    if (contextSvg.length) {
      tl.fromTo(
        contextSvg,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power2.out" },
        0
      );

      contextSvg.forEach(svg => {
        const mask = svg.querySelector("mask rect");

        tl.fromTo(
          mask,
          { height: "0%" },
          { height: "100%", duration: 2, ease: "power1.out" },
          "0+=0.5"
        );
      });
    }

    if (contextCanvas.length) {
      tl.fromTo(
        contextCanvas,
        {
          clipPath: isRTL() ? "inset(0% 100% 0% 0%)" : "inset(0% 100% 0% 0%)"
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 2,
          ease: "power2.out"
        },
        "0+=0.25"
      );
    }
  }



  // ----- Tab click handlers -----
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", (ev) => {
      ev.preventDefault();
      // when user clicks, immediately activate and reset timer
      activateTab(i, true, false);

    });

  });

  if (isMobileView()) {
    // Allow native horizontal scrolling inside the tabs wrapper
    gsap.utils.toArray(".statistics__tabs__wrapper").forEach((el) => {
      el.addEventListener("touchstart", (e) => e.stopPropagation());
    });

    ScrollSmoother.get().effects(".statistics__tabs__wrapper", {
      preventDefault: false
    });
  }

  function scrollActiveTabIntoView() {
    const activeTab = tabs[currentIndex];
    const wrapper = document.querySelector(".statistics__tabs__wrapper");

    if (isMobileView() && activeTab && wrapper) {
      const wrapperRect = wrapper.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();

      const offset = tabRect.left - wrapperRect.left - (wrapperRect.width / 2 - tabRect.width / 2);

      wrapper.scrollTo({
        left: wrapper.scrollLeft + offset,
        behavior: "smooth",
      });
    }
  }


  // ----- Swiper init/destroy and event handling -----
  function initSwiper() {
    if (isMobileView() && !swiper) {

      swiper = new Swiper(".statistics__content", {
        slidesPerView: 1,
        autoHeight: false,
        speed: 500,
        spaceBetween: 0,
        on: {
          slideChange() {
            // sync tabs when user swipes
            currentIndex = this.activeIndex;
            activateTab(currentIndex, false, true); // false so it doesn't call slideTo again
            // scrollActiveTabIntoView();
          },
          touchStart() {
            // user interacting -> stop timer and reset progress so they can read
            clearProgressTimer();
            resetAllProgressInstant();
          }
        }
      });

      // clicking a tab should slide the swiper (if mobile)
      tabs.forEach((tab, i) => {
        tab.addEventListener("click.swiperSync", () => {
          if (swiper) swiper.slideTo(i);
          // scrollActiveTabIntoView();
        });
      });

    } else if (!isMobileView() && swiper) {
      // remove added handlers
      tabs.forEach((tab) => {
        tab.removeEventListener("click.swiperSync", () => { });
      });
      swiper.destroy(true, true);
      swiper = null;
    }
  }

  // throttle resize slightly
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initSwiper();
      activateTab(currentIndex, false, false);
    }, 120);
  });

  function initCharts() {
    const el1 = document.getElementById("textileChart-1");
    const el2 = document.getElementById("textileChart-2");

    if (!el1 || !el2 || typeof Chart === "undefined") return;

    const labels1 = el1.dataset.labels.split(",");
    const values1 = el1.dataset.values.split(",").map(Number);

    const labels2 = el2.dataset.labels.split(",");
    const values2 = el2.dataset.values.split(",").map(Number);


    const makeGradient = (canvas) => {
      const ctx = canvas.getContext("2d");
      const g = ctx.createLinearGradient(0, 0, 0, 320);
      g.addColorStop(0, "rgba(229,57,53,0.4)");
      g.addColorStop(1, "rgba(229,57,53,0)");
      return g;
    };

    const chart1 = new Chart(el1.getContext("2d"), {
      type: "line",
      data: {
        labels: labels1,
        datasets: [{
          data: values1,
          borderColor: "#e53935",
          borderWidth: 3,
          fill: true,
          backgroundColor: makeGradient(el1),
          tension: 0.4,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          y: {
            display: false,
            min: Math.min(...values1) - 50,
            max: Math.max(...values1) + 0
          }, x: { ticks: { color: "transparent" }, grid: { display: true } }
        },
        animation: { duration: 0 }
      }
    });

    const chart2 = new Chart(el2.getContext("2d"), {
      type: "line",
      data: {
        labels: labels2,
        datasets: [{
          data: values2,
          borderColor: "#e53935",
          borderWidth: 3,
          fill: true,
          backgroundColor: makeGradient(el2),
          tension: 0.4,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          y: {
            display: false, min: Math.min(...values2) - 50,
            max: Math.max(...values2) + 0
          }, x: { ticks: { color: "transparent" }, grid: { display: true } }
        },
        animation: { duration: 0 }
      }
    });

  }

  // ----- Start everything -----
  initSwiper();
  initCharts();
  resetAllProgressInstant();
  // start with first tab active

  const tabTriggerInstance = ScrollTrigger.create({
    trigger: ".statistics",
    start: "top bottom",
    markers: false,
    onEnter: () => {
      updateTabClassesAndContent(0, false);
      animateCurrentTab();
      // Destroy this ScrollTrigger so it won't trigger again
      tabTriggerInstance.kill();
    }
  });

  function resetMobileCSSProgress() {
    tabs.forEach(tab => {
      const span = tab.querySelector(".progress-bar span");
      span.style.transition = "";
      span.style.width = "";
    });
  }

  if (isMobileView()) {
    resetMobileCSSProgress();
  }

}

function initVisionMissionTabs() {
  if (isAbove(991)) {
    return;
  }
  console.log('initVisionMissionTabs');

  document.querySelectorAll(".vision-mission").forEach((component) => {

    const vm_tabs = Array.from(component.querySelectorAll(".vision-mission__tabs .tab-btn"));
    const vm_contents = Array.from(component.querySelectorAll(".vision-mission__content .tab-content"));
    const vm_contentWrapper = component.querySelector(".vision-mission__content");

    let vm_currentIndex = 0;
    let vm_swiper = null;

    const vm_isMobileView = () => window.innerWidth <= 991;

    function vm_activate(index, slide = true, centerTab = true) {
      if (index < 0 || index >= vm_tabs.length) return;

      vm_currentIndex = index;

      vm_tabs.forEach((tab, i) => tab.classList.toggle("active", i === index));
      vm_contents.forEach((content, i) => content.classList.toggle("active", i === index));

      if (vm_swiper && slide) vm_swiper.slideTo(index);

      if (centerTab && window.innerWidth <= 991) {
        const activeTab = vm_tabs[index];
        const wrapper = component.querySelector(".vision-mission__tabs__wrapper");

        if (!activeTab || !wrapper) return;

        const wrapperRect = wrapper.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();

        // desired center position
        let targetScroll =
          wrapper.scrollLeft +
          (tabRect.left - wrapperRect.left) -
          (wrapperRect.width / 2 - tabRect.width / 2);

        // ✅ Clamp to valid scroll range (prevents iOS bounce bugs)
        const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

        wrapper.scrollTo({
          left: targetScroll,
          behavior: "smooth"
        });
      }

    }


    vm_tabs.forEach((tab, i) => {
      tab.addEventListener("click", (ev) => {
        ev.preventDefault();
        // vm_activate(i);
        vm_activate(i, true, false);
      });
    });

    // Allow native horizontal scrolling inside the tabs wrapper
    gsap.utils.toArray(".vision-mission__tabs__wrapper").forEach((el) => {
      el.addEventListener("touchstart", (e) => e.stopPropagation());
    });

    ScrollSmoother.get().effects(".vision-mission__tabs__wrapper", {
      preventDefault: false
    });

    function getMostVisibleSlideIndex(wrapperEl) {
      const slides = Array.from(wrapperEl.querySelectorAll('.swiper-slide'));
      const wrapperRect = wrapperEl.getBoundingClientRect();

      let bestIndex = 0;
      let bestOverlap = -1;

      slides.forEach((slide, i) => {
        const r = slide.getBoundingClientRect();

        const left = Math.max(r.left, wrapperRect.left);
        const right = Math.min(r.right, wrapperRect.right);
        const overlap = Math.max(0, right - left); // visible width

        if (overlap > bestOverlap) {
          bestOverlap = overlap;
          bestIndex = i;
        }
      });

      return { index: bestIndex, overlap: bestOverlap };
    }

    function vm_initSwiper() {
      if (vm_isMobileView() && !vm_swiper) {
        vm_swiper = new Swiper(vm_contentWrapper, {
          slidesPerView: 'auto',
          speed: 500,
          watchSlidesProgress: true,
          roundLengths: true,
          slideToClickedSlide: true,

          on: {
            // when user is dragging and then finishes touch/pointer
            touchEnd() {
              // small delay to allow DOM to settle
              setTimeout(() => {
                const { index } = getMostVisibleSlideIndex(vm_contentWrapper);
                if (index !== vm_currentIndex) {
                  vm_swiper.slideTo(index);
                  vm_activate(index, false);
                } else {
                  // still ensure tab class sync
                  vm_activate(index, false);
                }
              }, 30);
            },

            // when transition completes (in case of momentum)
            transitionEnd() {
              const { index } = getMostVisibleSlideIndex(vm_contentWrapper);
              if (index !== vm_currentIndex) {
                vm_activate(index, false);
              }
            },

            // fallback: when swiper updates (e.g. resize)
            update() {
              const { index } = getMostVisibleSlideIndex(vm_contentWrapper);
              if (index !== vm_currentIndex) {
                vm_activate(index, false, false); // centerTab = false → prevents snap-back
              }

            }
          }
        });

        // (use passive: true to avoid blocking)
        const wrapperEl = vm_contentWrapper.querySelector('.swiper-wrapper') || vm_contentWrapper;
        if (wrapperEl) {
          wrapperEl.addEventListener('scroll', () => {
            // debounce a little
            clearTimeout(wrapperEl._vmScrollTimer);
            wrapperEl._vmScrollTimer = setTimeout(() => {
              const { index } = getMostVisibleSlideIndex(vm_contentWrapper);
              if (index !== vm_currentIndex) {
                // snap to the most visible slide
                vm_swiper.slideTo(index);
                vm_activate(index, false);
              }
            }, 70);
          }, { passive: true });
        }

      } else if (!vm_isMobileView() && vm_swiper) {
        vm_swiper.destroy(true, true);
        vm_swiper = null;
      }
    }

    let vm_resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(vm_resizeTimer);
      vm_resizeTimer = setTimeout(() => {
        vm_initSwiper();
        vm_activate(vm_currentIndex, false);
      }, 120);
    });

    vm_initSwiper();
    vm_activate(0, false);
  });
}

function sliderWithCircle() {
  if (isBelow(991)) return;

  const progressObj = { val: 0 };
  let progressTween = null;
  const wrapper = document.querySelector(".js-slider-with-circle");
  if (!wrapper) return;

  const circleProgress = wrapper.querySelector(".circle-progress");
  const circleAllDescriptions = wrapper.querySelectorAll(".slider-circle__description-text");
  const SliderItems = wrapper.querySelectorAll(".slider-circle__item");
  const backgroundElement = document.querySelector(".js-slider-with-circle-background");
  const SliderItemsImages = wrapper.querySelectorAll(".js-slider-with-circle-images img");

  circleAllDescriptions.forEach(el => {
    const parent = el.parentElement;
    if (parent) {
      const style = window.getComputedStyle(el);
      const height = el.offsetHeight;
      const marginTop = parseFloat(style.marginTop);
      const marginBottom = parseFloat(style.marginBottom);
      parent.setAttribute("data-height", (height + marginTop + marginBottom));
    }
  });

  // Set initial state for ALL items (collapsed by default)
  SliderItems.forEach((item) => {
    const content = item.querySelector(".slider-circle__item-content");
    const description = item.querySelector(".slider-circle__description");

    gsap.set(content, { width: remToPx(12.5) });
    gsap.set(description, { height: "0px", opacity: 0, width: "0%" });
  });


  // initSwiper for slider
  const swiper = new Swiper(".js-slider-with-circle .swiper-container", {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: remToPx(1),
    loop: false,
    autoplay: false,
  });


  if (isAbove(1199)) {
    ScrollTrigger.create({
      trigger: ".js-slider-with-circle",
      start: "top bottom",     // when slider enters viewport
      end: "top top",    // when slider leaves viewport
      markers: false,
      onEnter: () => {
        swiper.autoplay.start();
      }
    });
  }

  // onClick Slide change
  SliderItems.forEach((slide, index) => {
    slide.addEventListener("click", () => {
      if (swiper.activeIndex !== index) {
        swiper.slideTo(index);
      }
    });
  });

  let previousIndex = swiper.activeIndex;

  // 1st item Animation Intially

  gsap.to(backgroundElement, {
    backgroundImage: `url(${SliderItemsImages[0].src})`,
    duration: 0,
  });

  gsap.to(SliderItems[0].querySelector(".slider-circle__item-content"), {
    width: remToPx(20),
    onComplete: () => swiper.update()
  });

  gsap.to(SliderItems[0].querySelector(".slider-circle__description"), {
    height: SliderItems[0].querySelector(".slider-circle__description").dataset.height + "px",
    width: "100%",
    opacity: 1,
    onComplete: () => swiper.update()
  });

  gsap.to(SliderItems[0].querySelector(".slider-circle__icon"), {
    marginBottom: remToPx(2.5),
    duration: 0.5,
    ease: "power2.out",
    onComplete: () => swiper.update()
  });

  // slide change Animations
  swiper.on('slideChange', () => {
    const currentSlide = swiper.slides[swiper.activeIndex];
    const prevSlide = swiper.slides[previousIndex];

    // Kill previous progress tween if running
    if (progressTween) {
      progressTween.kill();
      progressTween = null;
    }

    let currentValue = parseFloat(circleProgress.dataset.value || "0");

    currentValue = Math.max(0, Math.min(100, currentValue));

    const progressObj = { value: currentValue };

    progressTween = gsap.to(progressObj, {
      value: 0,
      duration: 1.5, // smooth quick drop
      ease: "power2.out",
      onUpdate: () => window.animateProgress(progressObj.value),
      onComplete: () => {

        if (progressTween) progressTween.kill();

        progressTween = gsap.to(progressObj, {
          value: 100,
          duration: 5,
          ease: "power2.out",
          onUpdate: () => window.animateProgress(progressObj.value),
          onComplete: () => {
          }
        });

      }
    });


    gsap.to(backgroundElement, {
      backgroundImage: `url(${SliderItemsImages[swiper.activeIndex].src})`,
      duration: 0,
    });

    gsap.to(prevSlide.querySelector(".slider-circle__item-content"), {
      width: remToPx(12.5),
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => swiper.update()
    });


    gsap.to(prevSlide.querySelector(".slider-circle__icon"), {
      marginBottom: remToPx(1),
      duration: 0,
      ease: "none",
      onComplete: () => swiper.update()
    });

    gsap.to(prevSlide.querySelector(".slider-circle__description"), {
      height: "0px",
      width: "0%",
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => swiper.update()
    });

    gsap.to(currentSlide.querySelector(".slider-circle__item-content"), {
      width: remToPx(20),
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => swiper.update() // <-- update continuously during animation
    });

    gsap.to(currentSlide.querySelector(".slider-circle__icon"), {
      marginBottom: remToPx(2.5),
      duration: 0,
      ease: "none",
      onComplete: () => swiper.update()
    });

    gsap.to(currentSlide.querySelector(".slider-circle__description"), {
      height: currentSlide.querySelector(".slider-circle__description").dataset.height + "px",
      width: "100%",
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => swiper.update()
    });

    previousIndex = swiper.activeIndex;
  });


  if (!circleProgress) throw new Error("Circle element not found");
  if (circleProgress.classList.contains("initialized-animation")) {
    // already initialized
  } else {
    circleProgress.classList.add("initialized-animation");
  }

  function animateProgress(value) {
    const v = Math.max(0, Math.min(100, value));
    circleProgress.dataset.value = v;

    circleProgress.style.background =
      `conic-gradient(#0C0608 0% ${v}%, transparent ${v}% 100%)`;
  }
  window.animateProgress = animateProgress;
  window.animateProgress(100)
};