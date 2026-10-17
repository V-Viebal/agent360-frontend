<?php
declare(strict_types=1);

namespace OCA\Agent360\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\IRequest;
use OCP\IConfig;
use OCP\IUserSession;
use OCP\Util;

class PageController extends Controller {
  public function __construct(
    string $appName,
    IRequest $request,
    private IConfig $config,
    private IUserSession $userSession
  ) {
    parent::__construct($appName, $request);
  }

  #[NoAdminRequired, NoCSRFRequired]
  public function index(): TemplateResponse {
    Util::addStyle('agent360', 'agent360');
    Util::addScript('agent360', 'agent360');

    $backendUrl = $this->config->getAppValue('agent360', 'backend_url', 'https://ai.hmz.one');
    $user = $this->userSession->getUser();
    $userId = $user ? $user->getUID() : 'guest';

    return new TemplateResponse('agent360', 'index', [
      'backendUrl' => $backendUrl,
      'userId' => $userId,
      'appVersion' => '1.0.0',
    ]);
  }
}
