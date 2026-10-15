(function () {
  "use strict";

  function tr(key, fallback) {
    return window.HiitI18n && window.HiitI18n.t ? window.HiitI18n.t(key) : fallback;
  }

  function tf(key, vars, fallback) {
    if (window.HiitI18n && window.HiitI18n.tf) return window.HiitI18n.tf(key, vars);
    return fallback;
  }

  function escapeHtml(s) {
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function getQueryId() {
    var params = new URLSearchParams(window.location.search);
    return params.get("id") || "";
  }

  function renderDetail() {
    var root = document.getElementById("detail-root");
    if (!root || typeof window.getCardById !== "function") return;

    var id = getQueryId();
    var card = window.getCardById(id);

    if (!card) {
      root.innerHTML =
        '<div class="not-found">' +
        "<p>" +
        escapeHtml(tr("detail_not_found", "No workout found for this ID.")) +
        "</p>" +
        '<p><a href="index.html">' +
        escapeHtml(tr("detail_back_board", "Back to board")) +
        "</a></p>" +
        "</div>";
      document.title = tr("page_title_not_found", "Not found · HIIT");
      return;
    }

    document.title = card.title + " · HIIT";
    var oldModal = document.querySelector(".exercise-modal");
    if (oldModal) oldModal.remove();

    var hp =
      window.HiitProgress ||
      {
        getChecksForCard: function (id, n) {
          return new Array(n).fill(false);
        },
        setChecksForCard: function () {},
      };
    var checks = hp.getChecksForCard(card.id, card.exercises.length);
    var doneCount = checks.filter(Boolean).length;
    var total = card.exercises.length;

    var exerciseModal = document.createElement("div");
    exerciseModal.className = "exercise-modal";
    exerciseModal.setAttribute("role", "dialog");
    exerciseModal.setAttribute("aria-modal", "true");
    exerciseModal.setAttribute("aria-labelledby", "exercise-modal-title");
    exerciseModal.hidden = true;

    var modalBackdrop = document.createElement("div");
    modalBackdrop.className = "exercise-modal__backdrop";

    var modalPanel = document.createElement("div");
    modalPanel.className = "exercise-modal__panel";

    var modalClose = document.createElement("button");
    modalClose.type = "button";
    modalClose.className = "exercise-modal__close";
    modalClose.setAttribute("aria-label", tr("modal_close", "Close"));
    modalClose.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';

    var modalTitle = document.createElement("h2");
    modalTitle.id = "exercise-modal-title";
    modalTitle.className = "exercise-modal__title";

    var modalFigure = document.createElement("div");
    modalFigure.className = "exercise-modal__figure";
    modalFigure.setAttribute("aria-hidden", "true");

    var modalEmpty = document.createElement("p");
    modalEmpty.className = "exercise-modal__empty";
    modalEmpty.textContent = tr("modal_no_illust", "No reference illustration for this line.");
    modalEmpty.hidden = true;

    modalPanel.appendChild(modalClose);
    modalPanel.appendChild(modalTitle);
    modalPanel.appendChild(modalFigure);
    modalPanel.appendChild(modalEmpty);
    exerciseModal.appendChild(modalBackdrop);
    exerciseModal.appendChild(modalPanel);

    var modalFocusBefore = null;

    function onModalKeydown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeExerciseModal();
      }
    }

    function closeExerciseModal() {
      exerciseModal.hidden = true;
      document.documentElement.classList.remove("exercise-modal-open");
      document.removeEventListener("keydown", onModalKeydown);
      if (modalFocusBefore && typeof modalFocusBefore.focus === "function") {
        modalFocusBefore.focus();
      }
      modalFocusBefore = null;
    }

    function openExerciseModal(line, meta, triggerEl) {
      modalFocusBefore = triggerEl || document.activeElement;
      modalTitle.textContent = line;
      var art = meta && window.HiitExerciseArt ? window.HiitExerciseArt.render(line) : null;
      modalFigure.innerHTML = art || "";
      modalFigure.classList.toggle("exercise-modal__figure--art", !!art);
      if (art) {
        modalEmpty.hidden = true;
        modalFigure.hidden = false;
      } else if (meta && window.applyExerciseThumbStyles) {
        modalEmpty.hidden = true;
        modalFigure.hidden = false;
        window.applyExerciseThumbStyles(modalFigure, meta);
      } else {
        modalFigure.hidden = true;
        modalEmpty.hidden = false;
      }
      exerciseModal.hidden = false;
      document.documentElement.classList.add("exercise-modal-open");
      document.addEventListener("keydown", onModalKeydown);
      modalClose.focus();
    }

    modalBackdrop.addEventListener("click", closeExerciseModal);
    modalClose.addEventListener("click", closeExerciseModal);
    function makeExerciseRow(line, index) {
      var li = document.createElement("li");
      li.className = "exercise-item";
      li.setAttribute("role", "listitem");

      var row = document.createElement("div");
      row.className = "exercise-row";

      var label = document.createElement("label");
      label.className = "exercise-label";

      var inputId = "ex-" + String(card.id) + "-" + index;
      var input = document.createElement("input");
      input.type = "checkbox";
      input.className = "exercise-input";
      input.id = inputId;
      input.setAttribute("data-exercise-index", String(index));
      input.checked = checks[index] || false;

      var text = document.createElement("span");
      text.className = "exercise-name";
      text.textContent = line;

      label.appendChild(input);
      label.appendChild(text);
      row.appendChild(label);

      if (window.getExerciseThumbMeta) {
        var meta = window.getExerciseThumbMeta(line);
        if (meta) {
          var infoBtn = document.createElement("button");
          infoBtn.type = "button";
          infoBtn.className = "exercise-info-btn";
          infoBtn.setAttribute("aria-haspopup", "dialog");
          infoBtn.setAttribute(
            "aria-label",
            window.HiitI18n && window.HiitI18n.tf
              ? window.HiitI18n.tf("detail_view_illust", { name: line })
              : "View illustration: " + line
          );
          infoBtn.innerHTML =
            '<svg class="exercise-info-btn__icon" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>';
          infoBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            openExerciseModal(line, meta, infoBtn);
          });
          row.appendChild(infoBtn);
        }
      }

      li.appendChild(row);
      return li;
    }

    var exerciseHost;
    if (card.workoutSections && card.workoutSections.length > 0) {
      exerciseHost = document.createElement("div");
      exerciseHost.className = "workout-blocks";
      var globalIndex = 0;
      card.workoutSections.forEach(function (sec, si) {
        var h3 = document.createElement("h3");
        h3.className = "workout-block-title";
        h3.textContent = sec.label;
        var ul = document.createElement("ul");
        ul.className = "exercise-list";
        ul.setAttribute("role", "list");
        if (si === 0) ul.setAttribute("aria-describedby", "exercise-list-hint");
        sec.lines.forEach(function (line) {
          ul.appendChild(makeExerciseRow(line, globalIndex));
          globalIndex += 1;
        });
        exerciseHost.appendChild(h3);
        exerciseHost.appendChild(ul);
      });
    } else {
      exerciseHost = document.createElement("ul");
      exerciseHost.className = "exercise-list";
      exerciseHost.setAttribute("role", "list");
      exerciseHost.setAttribute("aria-describedby", "exercise-list-hint");
      card.exercises.forEach(function (line, index) {
        exerciseHost.appendChild(makeExerciseRow(line, index));
      });
    }

    var summaryId = "exercise-progress-summary";
    var summary = document.createElement("p");
    summary.id = summaryId;
    summary.className = "exercise-summary";
    summary.setAttribute("aria-live", "polite");
    summary.setAttribute("aria-atomic", "true");
    summary.textContent = tf(
      "detail_progress",
      { done: doneCount, total: total },
      doneCount + " of " + total + " exercises marked done."
    );

    function readChecksFromUl() {
      var arr = [];
      exerciseHost.querySelectorAll(".exercise-input").forEach(function (inp) {
        arr.push(inp.checked);
      });
      return arr;
    }

    function updateSummary() {
      var inputs = exerciseHost.querySelectorAll(".exercise-input");
      var c = 0;
      inputs.forEach(function (inp) {
        if (inp.checked) c += 1;
      });
      summary.textContent = tf(
        "detail_progress",
        { done: c, total: total },
        c + " of " + total + " exercises marked done."
      );
    }

    function isFullyComplete(checks) {
      if (hp.isFullyComplete) return hp.isFullyComplete(checks);
      return checks && checks.length > 0 && checks.every(Boolean);
    }

    function celebrateCompletion() {
      if (typeof confetti !== "function") return;
      var count = 110;
      var defaults = { origin: { y: 0.72 }, zIndex: 9999 };
      confetti(
        Object.assign({}, defaults, {
          particleCount: count,
          spread: 76,
          startVelocity: 38,
        })
      );
      window.setTimeout(function () {
        confetti(
          Object.assign({}, defaults, {
            particleCount: count * 0.45,
            angle: 60,
            spread: 52,
            origin: { x: 0, y: 0.72 },
            zIndex: 9999,
          })
        );
        confetti(
          Object.assign({}, defaults, {
            particleCount: count * 0.45,
            angle: 120,
            spread: 52,
            origin: { x: 1, y: 0.72 },
            zIndex: 9999,
          })
        );
      }, 180);
    }

    function persistProgressFromDom() {
      var before = hp.getChecksForCard(card.id, total);
      var arr = readChecksFromUl();
      hp.setChecksForCard(card.id, arr);
      updateSummary();
      if (isFullyComplete(arr) && !isFullyComplete(before)) {
        celebrateCompletion();
        if (hp.recordCompletion) hp.recordCompletion(card.id);
      } else if (isFullyComplete(before) && !isFullyComplete(arr) && hp.removeLastCompletionForCard) {
        hp.removeLastCompletionForCard(card.id);
      }
    }

    exerciseHost.addEventListener("change", persistProgressFromDom);

    var notesBlock = null;
    if (card.notes && card.notes.length) {
      var nb = document.createElement("div");
      nb.className = "notes-block";
      var nh = document.createElement("h2");
      nh.textContent = tr("detail_notes", "Notes");
      var nu = document.createElement("ul");
      card.notes.forEach(function (n) {
        var nli = document.createElement("li");
        nli.textContent = n;
        nu.appendChild(nli);
      });
      nb.appendChild(nh);
      nb.appendChild(nu);
      notesBlock = nb;
    }

    root.innerHTML = "";

    var header = document.createElement("header");
    header.className = "detail-back";
    var back = document.createElement("a");
    back.className = "back-link";
    back.href = "index.html";
    back.textContent = tr("detail_back_link", "← Workout board");
    var headerInner = document.createElement("div");
    headerInner.className = "detail-back-inner";
    headerInner.appendChild(back);
    var headerActions = document.createElement("div");
    headerActions.className = "detail-header-actions";
    if (window.HiitTheme && typeof window.HiitTheme.createToggleButton === "function") {
      headerActions.appendChild(window.HiitTheme.createToggleButton());
    }
    var badgesLink = document.createElement("a");
    badgesLink.href = "badges.html";
    badgesLink.className = "header-badges-link";
    badgesLink.setAttribute("aria-label", tr("header_badges_aria", "Open badges"));
    badgesLink.innerHTML =
      '<svg class="header-badges-link__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>' +
      '<path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>' +
      '<path d="M4 22h16"/>' +
      '<path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>' +
      '<path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>' +
      '<path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>' +
      "</svg>";
    headerActions.appendChild(badgesLink);
    if (window.HiitUserMenu && typeof window.HiitUserMenu.createElement === "function") {
      headerActions.appendChild(window.HiitUserMenu.createElement());
    }
    headerInner.appendChild(headerActions);
    header.appendChild(headerInner);

    var article = document.createElement("article");
    article.className = "detail-article";

    var idP = document.createElement("p");
    idP.className = "detail-id";
    idP.textContent = "#" + String(card.id);

    var titleRow = document.createElement("div");
    titleRow.className = "detail-title-row";

    var headline = document.createElement("div");
    headline.className = "detail-title-row__headline";
    var h1 = document.createElement("h1");
    h1.textContent = card.title;
    headline.appendChild(h1);
    if (card.subtitle) {
      var sub = document.createElement("p");
      sub.className = "detail-subtitle";
      sub.textContent = card.subtitle;
      headline.appendChild(sub);
    }

    if (window.HiitSaved && typeof window.HiitSaved.createSaveButton === "function") {
      headline.appendChild(window.HiitSaved.createSaveButton(card.id));
    }

    var hint = document.createElement("p");
    hint.id = "exercise-list-hint";
    hint.className = "exercise-list-hint";
    hint.textContent = tr(
      "detail_hint",
      "Use the checkbox for each line to mark exercises you completed. Tap the info icon to see a pose reference. Progress saves as you go; tap Save when you want to return to the workout board."
    );
    headline.appendChild(hint);

    var shareUrl = new URL(
      "detail.html?id=" + encodeURIComponent(card.id),
      window.location.href
    ).href;

    var shareBlock = document.createElement("div");
    shareBlock.className = "detail-share-qr";
    var canvasWrap = document.createElement("div");
    canvasWrap.className = "detail-share-qr__canvas-wrap";
    var qrCanvas = document.createElement("canvas");
    qrCanvas.className = "detail-share-qr__canvas";
    qrCanvas.setAttribute("role", "img");
    qrCanvas.setAttribute(
      "aria-label",
      tr("detail_share_qr_aria", "QR code linking to this workout session")
    );
    canvasWrap.appendChild(qrCanvas);
    shareBlock.appendChild(canvasWrap);

    var shareLink = document.createElement("a");
    shareLink.className = "detail-share-qr__link";
    shareLink.href = shareUrl;
    shareLink.textContent = shareUrl;
    shareLink.setAttribute("rel", "noopener");
    shareLink.setAttribute(
      "aria-label",
      tr("detail_share_qr_fail", "QR could not be generated — open this link instead.")
    );

    titleRow.appendChild(headline);
    titleRow.appendChild(shareBlock);

    var topRow = document.createElement("div");
    topRow.className = "detail-top";
    topRow.appendChild(idP);
    if (window.HiitLikes) topRow.appendChild(window.HiitLikes.createButton(card.id, { large: true }));

    article.appendChild(topRow);
    article.appendChild(titleRow);

    var QR_SIZE = 96;
    if (typeof QRCode !== "undefined" && typeof QRCode.toCanvas === "function") {
      QRCode.toCanvas(
        qrCanvas,
        shareUrl,
        {
          width: QR_SIZE,
          margin: 1,
          errorCorrectionLevel: "M",
          color: { dark: "#111111", light: "#ffffff" },
        },
        function (err) {
          if (err && shareBlock.isConnected) {
            shareBlock.appendChild(shareLink);
          }
        }
      );
    } else if (shareBlock.isConnected) {
      shareBlock.appendChild(shareLink);
    }

    var exercisesHeading = document.createElement("h2");
    exercisesHeading.className = "exercises-section-title";
    exercisesHeading.textContent =
      card.workoutSections && card.workoutSections.length
        ? tr("detail_workout", "Workout")
        : tr("detail_exercises", "Exercises");

    article.appendChild(exercisesHeading);
    article.appendChild(summary);
    article.appendChild(exerciseHost);

    var saveRow = document.createElement("div");
    saveRow.className = "detail-save-row";
    var markAllBtn = document.createElement("button");
    markAllBtn.type = "button";
    markAllBtn.className = "detail-mark-all-done";
    markAllBtn.textContent = tr("detail_mark_all", "Mark all as done");
    markAllBtn.setAttribute(
      "aria-label",
      tr(
        "detail_mark_all_aria",
        "Mark every line in this workout as completed and save progress"
      )
    );
    markAllBtn.disabled = total === 0;
    markAllBtn.addEventListener("click", function () {
      if (total === 0) return;
      exerciseHost.querySelectorAll(".exercise-input").forEach(function (inp) {
        inp.checked = true;
      });
      persistProgressFromDom();
    });
    var saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "profile-save";
    saveBtn.textContent = tr("detail_save", "Save");
    saveBtn.setAttribute(
      "aria-label",
      tr("detail_save_aria", "Save and return to workout dashboard")
    );
    saveBtn.addEventListener("click", function () {
      persistProgressFromDom();
      window.location.href = "index.html";
    });
    saveRow.appendChild(markAllBtn);
    saveRow.appendChild(saveBtn);
    article.appendChild(saveRow);

    if (notesBlock) article.appendChild(notesBlock);

    root.appendChild(header);
    root.appendChild(article);

    document.body.appendChild(exerciseModal);

    updateSummary();
  }

  renderDetail();
  window.addEventListener("hiit-langchange", renderDetail);
})();
