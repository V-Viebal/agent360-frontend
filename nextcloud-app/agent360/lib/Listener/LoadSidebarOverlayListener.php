<?php
declare(strict_types=1);

namespace OCA\Agent360\Listener;

use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\IUserSession;
use OCP\Util;

/**
 * Injects Agent360 Assistant Widget & Overlay Sidebar across all Nextcloud surfaces (Files, Deck, Talk, etc.)
 */
class LoadSidebarOverlayListener implements IEventListener {
  public function __construct(private IUserSession $userSession) {}

  public function handle(Event $event): void {
    if (!($event instanceof BeforeTemplateRenderedEvent)) {
      return;
    }

    if (!$this->userSession->isLoggedIn()) {
      return;
    }

    // Inject global CSS and Script for the Bot Assistant Drawer / Floating Widget
    Util::addStyle('agent360', 'assistant-widget');
    Util::addScript('agent360', 'assistant-widget');
  }
}
