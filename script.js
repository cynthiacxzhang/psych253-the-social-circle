// The Social Circle — minimal enhancements. Nothing is stored or sent anywhere.
(function () {
  "use strict";

  // Select an element's text so the user can copy it manually.
  function selectText(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  // Try the Clipboard API, then the legacy copy command. Resolves true/false.
  function copyText(text, el) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () { return true; },
        function () { return legacyCopy(el); }
      );
    }
    return Promise.resolve(legacyCopy(el));
  }

  function legacyCopy(el) {
    try {
      selectText(el);
      return document.execCommand("copy");
    } catch (e) {
      return false;
    }
  }

  function showResult(ok, statusEl, sourceEl) {
    if (ok) {
      statusEl.textContent = "✓ Copied. You can paste it wherever you like.";
    } else {
      selectText(sourceEl);
      statusEl.textContent =
        "Couldn’t copy automatically. The text is selected: press Ctrl+C (Cmd+C on Mac), or press and hold to copy on a phone.";
    }
  }

  // Starter message copy buttons
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    var source = document.getElementById(btn.dataset.copyTarget);
    var status = btn.parentElement.querySelector(".status");
    btn.hidden = false;
    btn.addEventListener("click", function () {
      status.textContent = "";
      copyText(source.textContent.trim(), source).then(function (ok) {
        showResult(ok, status, source);
      });
    });
  });

  // Optional plan
  var form = document.getElementById("plan-form");
  if (!form) return;
  form.hidden = false;

  var fields = [
    { input: document.getElementById("plan-who"), out: document.getElementById("out-who"),
      error: document.getElementById("plan-who-error"), blank: "person or service",
      msg: "Add who you’ll contact, like a person or a service." },
    { input: document.getElementById("plan-when"), out: document.getElementById("out-when"),
      error: document.getElementById("plan-when-error"), blank: "day/time",
      msg: "Add a day or time, like “Friday after class”." }
  ];
  var status = document.getElementById("plan-status");
  var sentence = form.querySelector(".plan-sentence");

  function render() {
    fields.forEach(function (f) {
      var v = f.input.value.trim();
      f.out.textContent = v || f.blank;
      f.out.classList.toggle("empty", !v);
      if (v && f.input.getAttribute("aria-invalid") === "true") {
        f.input.removeAttribute("aria-invalid");
        f.error.textContent = "";
      }
    });
  }

  fields.forEach(function (f) { f.input.addEventListener("input", render); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "";
    var firstInvalid = null;
    fields.forEach(function (f) {
      var empty = !f.input.value.trim();
      f.error.textContent = empty ? f.msg : "";
      if (empty) {
        f.input.setAttribute("aria-invalid", "true");
        if (!firstInvalid) firstInvalid = f.input;
      } else {
        f.input.removeAttribute("aria-invalid");
      }
    });
    if (firstInvalid) {
      status.textContent = "Fill in both boxes first, then copy your plan.";
      firstInvalid.focus();
      return;
    }
    var text = sentence.textContent.replace(/\s+/g, " ").trim();
    copyText(text, sentence).then(function (ok) { showResult(ok, status, sentence); });
  });

  form.addEventListener("reset", function () {
    // Wait for the browser to clear the inputs, then update the preview.
    setTimeout(function () {
      fields.forEach(function (f) { f.input.removeAttribute("aria-invalid"); f.error.textContent = ""; });
      status.textContent = "";
      render();
    }, 0);
  });
})();
