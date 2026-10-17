<?php
declare(strict_types=1);

namespace OCA\Agent360\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\IRequest;
use OCP\IConfig;
use OCP\Http\Client\IClientService;

class ApiController extends Controller {
  public function __construct(
    string $appName,
    IRequest $request,
    private IConfig $config,
    private IClientService $clientService
  ) {
    parent::__construct($appName, $request);
  }

  private function getBackendUrl(): string {
    return rtrim($this->config->getAppValue('agent360', 'backend_url', 'https://ai.hmz.one'), '/');
  }

  private function proxyGet(string $path, array $query = []): DataResponse {
    $client = $this->clientService->newClient();
    $url = $this->getBackendUrl() . $path;
    try {
      $response = $client->get($url, [
        'query' => $query,
        'headers' => ['Accept' => 'application/json'],
        'timeout' => 15,
      ]);
      $body = json_decode($response->getBody(), true);
      return new DataResponse($body, $response->getStatusCode());
    } catch (\Throwable $e) {
      return new DataResponse(['error' => $e->getMessage()], Http::STATUS_BAD_GATEWAY);
    }
  }

  #[NoAdminRequired]
  public function agents(): DataResponse {
    return $this->proxyGet('/api/agents');
  }

  #[NoAdminRequired]
  public function chats(): DataResponse {
    return $this->proxyGet('/api/chats');
  }

  #[NoAdminRequired]
  public function agentChats(string $agentId): DataResponse {
    return $this->proxyGet('/api/agents/' . urlencode($agentId) . '/chats');
  }

  #[NoAdminRequired]
  public function chatDetail(string $id): DataResponse {
    return $this->proxyGet('/api/chats/' . urlencode($id));
  }

  #[NoAdminRequired]
  public function skills(): DataResponse {
    return $this->proxyGet('/api/skills');
  }
}
