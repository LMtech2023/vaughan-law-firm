(function () {
  "use strict";

  var NAV_BREAKPOINT = 1200;

  var topbar = document.querySelector(".topbar");
  var header = document.querySelector(".header");
  var burger = document.querySelector(".header__burger");
  var nav = document.querySelector(".header__nav");
  var overlay = document.querySelector(".header__overlay");
  var navLinks = document.querySelectorAll(".header__nav-link");
  var body = document.body;

  function setChromeHeight() {
    var height = 0;
    if (topbar) height += topbar.offsetHeight;
    if (header) height += header.offsetHeight;
    document.documentElement.style.setProperty(
      "--site-chrome-height",
      height + "px"
    );
  }

  function observeChrome() {
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", setChromeHeight);
      setChromeHeight();
      return;
    }

    var observer = new ResizeObserver(setChromeHeight);
    if (topbar) observer.observe(topbar);
    if (header) observer.observe(header);
    setChromeHeight();
  }

  function isMenuOpen() {
    return body.classList.contains("is-menu-open");
  }

  function isMobileNav() {
    return window.innerWidth <= NAV_BREAKPOINT;
  }

  function syncNavAria(open) {
    var mobile = isMobileNav();
    if (burger) {
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    if (nav) {
      nav.setAttribute("aria-hidden", mobile && !open ? "true" : "false");
    }
    if (overlay) {
      overlay.setAttribute("aria-hidden", open ? "false" : "true");
    }
  }

  function openMenu() {
    body.classList.add("is-menu-open");
    syncNavAria(true);
  }

  function closeMenu() {
    body.classList.remove("is-menu-open");
    syncNavAria(false);
  }

  function toggleMenu() {
    if (isMenuOpen()) closeMenu();
    else openMenu();
  }

  function onResize() {
    if (!isMobileNav() && isMenuOpen()) {
      closeMenu();
    } else {
      syncNavAria(isMenuOpen());
    }
  }

  if (burger) {
    burger.addEventListener("click", toggleMenu);
  }

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isMenuOpen()) {
      closeMenu();
    }
  });

  window.addEventListener("resize", onResize);

  syncNavAria(false);
  observeChrome();
  window.addEventListener("load", setChromeHeight);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(setChromeHeight);
  }
})();
