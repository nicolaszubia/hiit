(function () {
  "use strict";

  /**
   * Site footer, injected into every <div data-site-footer></div>.
   * Mock for now: the social hrefs are placeholders ("#") and the legal pages are stubs.
   */

  // Replace the "#" hrefs with the real profile URLs; links that start with http open in a new tab.
  var SOCIAL = [
    {
      name: "Instagram",
      href: "#",
      icon: '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
    },
    {
      name: "TikTok",
      href: "#",
      icon: '<path d="M21 7.917v4.034a9.948 9.948 0 0 1-5-1.951v4.5a6.5 6.5 0 1 1-8-6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z"/>',
    },
    {
      name: "YouTube",
      href: "#",
      icon: '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
    },
    {
      name: "Facebook",
      href: "#",
      icon: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    },
  ];

  var COLUMNS = [
    {
      title: "footer_col_company",
      links: [
        { label: "footer_about", href: "about.html" },
        { label: "footer_contact", href: "contact.html" },
      ],
    },
    {
      title: "footer_col_legal",
      links: [
        { label: "footer_terms", href: "terms.html" },
        { label: "footer_privacy", href: "privacy.html" },
        { label: "footer_health", href: "health-disclaimer.html" },
      ],
    },
    {
      title: "footer_col_explore",
      links: [
        { label: "footer_sessions", href: "index.html" },
        { label: "menu_badges", href: "badges.html" },
        { label: "menu_profile", href: "profile.html" },
      ],
    },
  ];

  function t(key) {
    return window.HiitI18n && window.HiitI18n.t ? window.HiitI18n.t(key) : key;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function socialHtml() {
    return SOCIAL.map(function (s) {
      var external = /^https?:/.test(s.href);
      return (
        "<li><a href=\"" +
        esc(s.href) +
        '"' +
        (external ? ' target="_blank" rel="noopener noreferrer"' : "") +
        ' aria-label="' +
        esc(s.name) +
        '"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
        s.icon +
        "</svg></a></li>"
      );
    }).join("");
  }

  function columnsHtml() {
    return COLUMNS.map(function (col, i) {
      var headingId = "site-footer-h" + i;
      return (
        '<nav class="site-footer__col" aria-labelledby="' +
        headingId +
        '"><h2 id="' +
        headingId +
        '" class="site-footer__heading" data-i18n="' +
        col.title +
        '"></h2><ul class="site-footer__links">' +
        col.links
          .map(function (l) {
            return '<li><a href="' + esc(l.href) + '" data-i18n="' + l.label + '"></a></li>';
          })
          .join("") +
        "</ul></nav>"
      );
    }).join("");
  }

  function footerHtml() {
    return (
      '<footer class="site-footer"><div class="site-footer__inner">' +
      '<div class="site-footer__top">' +
      '<div class="site-footer__brand">' +
      '<a class="brand brand--link" href="index.html">' +
      '<div class="brand-mark" aria-hidden="true">HI</div>' +
      '<div class="brand-text"><strong>HIIT ME UP</strong></div></a>' +
      '<p class="site-footer__tagline" data-i18n="footer_tagline"></p>' +
      '<ul class="site-footer__social" aria-label="' +
      esc(t("footer_social_aria")) +
      '">' +
      socialHtml() +
      "</ul></div>" +
      columnsHtml() +
      "</div>" +
      '<div class="site-footer__bottom">' +
      '<p class="site-footer__copy"></p>' +
      '<p class="site-footer__note" data-i18n="footer_health_note"></p>' +
      "</div></div></footer>"
    );
  }

  function inject(host) {
    host.innerHTML = footerHtml();
    var copy = host.querySelector(".site-footer__copy");
    if (copy) {
      copy.textContent = window.HiitI18n.tf("footer_copyright", { year: new Date().getFullYear() });
    }
    window.HiitI18n.apply(host);
  }

  document.querySelectorAll("[data-site-footer]").forEach(inject);
})();
