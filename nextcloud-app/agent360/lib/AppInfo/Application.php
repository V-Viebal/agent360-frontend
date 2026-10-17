<?php
declare(strict_types=1);

namespace OCA\Agent360\AppInfo;

use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;
use OCA\Agent360\Listener\LoadSidebarOverlayListener;

class Application extends App implements IBootstrap {
  public const APP_ID = 'agent360';

  public function __construct(array $urlParams = []) {
    parent::__construct(self::APP_ID, $urlParams);
  }

  public function register(IRegistrationContext $context): void {
    // Hook global template render to inject Floating Bot Assistant & Drawer Sidebar across all Nextcloud apps
    $context->registerEventListener(
      BeforeTemplateRenderedEvent::class,
      LoadSidebarOverlayListener::class
    );
  }

  public function boot(IBootContext $context): void {
    // Runtime initialization
  }
}
