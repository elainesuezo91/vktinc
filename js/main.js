document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  document.querySelectorAll('.nav-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var nav = btn.closest('.site-nav');
      var links = nav.querySelector('.nav-links');
      links.classList.toggle('open');
    });
  });

  // Homepage scenario stepper
  var tabs = document.querySelectorAll('[data-tab]');
  if (tabs.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var group = tab.closest('[data-tabgroup]');
        var id = tab.getAttribute('data-tab');
        group.querySelectorAll('[data-tab]').forEach(function (t) {
          t.classList.toggle('active', t === tab);
        });
        group.querySelectorAll('[data-panel]').forEach(function (p) {
          p.hidden = p.getAttribute('data-panel') !== id;
        });
      });
    });
  }

  // FAQ accordions
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var isOpen = !a.hidden;
      item.closest('.faq').querySelectorAll('.faq-a').forEach(function (other) {
        other.hidden = true;
      });
      item.closest('.faq').querySelectorAll('.faq-q .icon').forEach(function (icon) {
        icon.textContent = '+';
      });
      a.hidden = isOpen;
      q.querySelector('.icon').textContent = isOpen ? '+' : String.fromCharCode(8722);
    });
  });

  // Field Notes topic filter
  var filterGroup = document.querySelector('[data-topic-filters]');
  if (filterGroup) {
    var chips = filterGroup.querySelectorAll('.topic-chip');
    var rows = document.querySelectorAll('[data-topic]');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.toggle('active', c === chip); });
        var topic = chip.getAttribute('data-topic-filter');
        rows.forEach(function (row) {
          row.hidden = topic !== 'all' && row.getAttribute('data-topic') !== topic;
        });
      });
    });
  }

  // Talk to Us — multi-select chips (visual only, no backend)
  document.querySelectorAll('.chip-row .chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      chip.classList.toggle('selected');
    });
  });
});
