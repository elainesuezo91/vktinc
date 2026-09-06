document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  document.querySelectorAll('.nav-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var nav = btn.closest('.site-nav');
      var links = nav.querySelector('.nav-links');
      var open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // Homepage scenario stepper
  document.querySelectorAll('[data-tabgroup]').forEach(function (group) {
    var tabs = group.querySelectorAll('[data-tab]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var id = tab.getAttribute('data-tab');
        tabs.forEach(function (t) {
          var active = t === tab;
          t.classList.toggle('active', active);
          t.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        group.querySelectorAll('[data-panel]').forEach(function (p) {
          p.hidden = p.getAttribute('data-panel') !== id;
        });
      });
    });
  });

  // FAQ accordions (single-open per .faq group)
  document.querySelectorAll('.faq').forEach(function (faq) {
    faq.querySelectorAll('.faq-item').forEach(function (item) {
      var q = item.querySelector('.faq-q');
      var a = item.querySelector('.faq-a');
      if (!q || !a) return;
      q.addEventListener('click', function () {
        var isOpen = !a.hidden;
        faq.querySelectorAll('.faq-a').forEach(function (other) { other.hidden = true; });
        faq.querySelectorAll('.faq-q').forEach(function (otherQ) {
          otherQ.setAttribute('aria-expanded', 'false');
          var icon = otherQ.querySelector('.icon');
          if (icon) icon.textContent = '+';
        });
        a.hidden = isOpen;
        q.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        q.querySelector('.icon').textContent = isOpen ? '+' : String.fromCharCode(8722);
      });
    });
  });

  // Talk to Us — multi-select chips (visual only)
  document.querySelectorAll('.chip-row .chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      chip.classList.toggle('selected');
    });
  });

  // Carousels (AnyDB mobile): sync dot indicators to scroll position
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var dotsWrap = document.querySelector('[data-carousel-dots="' + carousel.getAttribute('data-carousel') + '"]');
    if (!dotsWrap) return;
    var dots = dotsWrap.querySelectorAll('span[data-dot]');
    var items = carousel.querySelectorAll('.carousel-item');
    var setActive = function (i) {
      dots.forEach(function (d, idx) { d.classList.toggle('active', idx === i); });
    };
    carousel.addEventListener('scroll', function () {
      var scrollLeft = carousel.scrollLeft;
      var closest = 0, closestDist = Infinity;
      items.forEach(function (item, idx) {
        var dist = Math.abs(item.offsetLeft - carousel.offsetLeft - scrollLeft);
        if (dist < closestDist) { closestDist = dist; closest = idx; }
      });
      setActive(closest);
    }, { passive: true });
  });

  // Talk to Us — form state machine (editing / sent / failed)
  var talkForm = document.querySelector('[data-talk-form]');
  if (talkForm) {
    var editingPanel = document.querySelector('[data-state="editing"]');
    var sentPanel = document.querySelector('[data-state="sent"]');
    var failedPanel = document.querySelector('[data-state="failed"]');

    var showState = function (name) {
      [editingPanel, sentPanel, failedPanel].forEach(function (panel) {
        if (panel) panel.hidden = true;
      });
      var target = name === 'sent' ? sentPanel : name === 'failed' ? failedPanel : editingPanel;
      if (target) target.hidden = false;
      window.scrollTo({ top: talkForm.closest('[data-talk-region]').offsetTop - 20, behavior: 'smooth' });
    };

    var fillReceipt = function (data) {
      document.querySelectorAll('[data-echo="friction"]').forEach(function (el) { el.textContent = data.friction; });
      document.querySelectorAll('[data-echo="name"]').forEach(function (el) { el.textContent = data.name; });
      document.querySelectorAll('[data-echo="business"]').forEach(function (el) { el.textContent = data.business; });
    };

    talkForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var friction = talkForm.querySelector('[name="friction"]').value.trim();
      var name = talkForm.querySelector('[name="name"]').value.trim();
      var contact = talkForm.querySelector('[name="contact"]').value.trim();
      var business = talkForm.querySelector('[name="business"]').value.trim();
      var errorEl = talkForm.querySelector('.form-error');

      // Minimum: a contact method and one of the two open questions (per design spec)
      if (!contact || !friction) {
        if (errorEl) errorEl.textContent = 'Tell us what’s harder than it should be, and how to reach you.';
        return;
      }
      if (errorEl) errorEl.textContent = '';

      fillReceipt({ friction: friction, name: name || 'You', business: business || 'your business' });

      // TODO: no backend wired up yet — replace this with a real submit
      // (fetch to an API/Formspree/etc). On network failure, call showState('failed')
      // instead so the entered values (still in the DOM) stay visible and editable.
      showState('sent');
    });

    document.querySelectorAll('[data-try-again]').forEach(function (btn) {
      btn.addEventListener('click', function () { showState('editing'); });
    });
    document.querySelectorAll('[data-send-another]').forEach(function (btn) {
      btn.addEventListener('click', function (e) { e.preventDefault(); showState('editing'); });
    });
  }
});
