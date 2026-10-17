/**
 * Agent360 Assistant Widget & Overlay Sidebar for Nextcloud
 * Provides:
 *  - Floating Action Button (FAB) on bottom-right of every Nextcloud page
 *  - Dual-mode container:
 *      * Compact Popover (default: 420x600px, responsive chat-only focus)
 *      * Right Sidebar Docking (expanded: 540px, 100vh full height)
 *  - Responsive query parameters passed to iframe (?compact=1 / ?compact=0)
 */
(function () {
  'use strict';

  if (window.Agent360WidgetInitialized) return;
  window.Agent360WidgetInitialized = true;

  function initAgent360Overlay() {
    if (document.getElementById('agent360-fab-trigger')) return;

    // 1. Floating Action Button
    var fab = document.createElement('div');
    fab.id = 'agent360-fab-trigger';
    fab.setAttribute('title', 'Mở trợ lý Agent360 (GrokBot)');
    fab.setAttribute('role', 'button');
    fab.setAttribute('aria-label', 'Agent360 AI Assistant');
    fab.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"></path>' +
      '<circle cx="9" cy="10" r="1"></circle>' +
      '<circle cx="15" cy="10" r="1"></circle>' +
      '</svg>' +
      '<span id="agent360-fab-badge"></span>';

    // 2. Backdrop for expanded mode
    var backdrop = document.createElement('div');
    backdrop.id = 'agent360-overlay-backdrop';

    // 3. Assistant Container
    var container = document.createElement('div');
    container.id = 'agent360-assistant-container';
    container.className = 'mode-compact'; // default to compact popover

    var webRoot = (window.OC && window.OC.webroot) ? window.OC.webroot : '';
    var baseAppUrl = webRoot + '/index.php/apps/agent360/';
    var compactAppUrl = baseAppUrl + '?compact=1';
    var fullAppUrl = baseAppUrl + '?compact=0';

    container.innerHTML =
      '<div class="agent360-control-bar">' +
      '  <div class="agent360-control-bar__title">' +
      '    <span>Agent360</span>' +
      '    <span class="agent360-control-bar__badge" id="agent360-badge-mode">COMPACT CHAT</span>' +
      '  </div>' +
      '  <div class="agent360-control-actions">' +
      '    <button type="button" class="agent360-btn-icon" id="agent360-mode-toggle" title="Phóng to Right Sidebar / Thu nhỏ">' +
      '      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '        <polyline points="15 3 21 3 21 9"></polyline>' +
      '        <polyline points="9 21 3 21 3 15"></polyline>' +
      '        <line x1="21" y1="3" x2="14" y2="10"></line>' +
      '        <line x1="3" y1="21" x2="10" y2="14"></line>' +
      '      </svg>' +
      '    </button>' +
      '    <button type="button" class="agent360-btn-icon" id="agent360-btn-close" title="Đóng">' +
      '      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '        <line x1="18" y1="6" x2="6" y2="18"></line>' +
      '        <line x1="6" y1="6" x2="18" y2="18"></line>' +
      '      </svg>' +
      '    </button>' +
      '  </div>' +
      '</div>' +
      '<iframe class="agent360-frame-content" id="agent360-iframe" src="' + compactAppUrl + '" loading="lazy" title="Agent360 Workspace"></iframe>';

    document.body.appendChild(backdrop);
    document.body.appendChild(container);
    document.body.appendChild(fab);

    var isOpen = false;
    var isSidebar = false;
    var iframe = container.querySelector('#agent360-iframe');
    var badgeMode = container.querySelector('#agent360-badge-mode');

    function toggleOpen() {
      isOpen = !isOpen;
      if (isOpen) {
        container.classList.add('is-open');
        if (isSidebar) backdrop.classList.add('is-open');
      } else {
        container.classList.remove('is-open');
        backdrop.classList.remove('is-open');
      }
    }

    function toggleMode() {
      isSidebar = !isSidebar;
      if (isSidebar) {
        container.classList.remove('mode-compact');
        container.classList.add('mode-sidebar');
        if (isOpen) backdrop.classList.add('is-open');
        if (badgeMode) badgeMode.textContent = 'SIDEBAR WORKSPACE';
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({ type: 'AGENT360_SET_MODE', compact: false }, '*');
        }
      } else {
        container.classList.remove('mode-sidebar');
        container.classList.add('mode-compact');
        backdrop.classList.remove('is-open');
        if (badgeMode) badgeMode.textContent = 'COMPACT CHAT';
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({ type: 'AGENT360_SET_MODE', compact: true }, '*');
        }
      }
    }

    fab.addEventListener('click', toggleOpen);
    backdrop.addEventListener('click', function () {
      if (isOpen) toggleOpen();
    });

    var closeBtn = container.querySelector('#agent360-btn-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', toggleOpen);
    }

    var modeToggleBtn = container.querySelector('#agent360-mode-toggle');
    if (modeToggleBtn) {
      modeToggleBtn.addEventListener('click', toggleMode);
    }

    // Keyboard shortcut Escape to close
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        toggleOpen();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAgent360Overlay);
  } else {
    initAgent360Overlay();
  }
})();
