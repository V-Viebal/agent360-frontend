<?php
declare(strict_types=1);
/** @var array $data */
$data = $_ ?? [];
$backendUrl = isset($data['backendUrl']) ? htmlspecialchars((string)$data['backendUrl'], ENT_QUOTES, 'UTF-8') : '';
$userId = isset($data['userId']) ? htmlspecialchars((string)$data['userId'], ENT_QUOTES, 'UTF-8') : '';
$appVersion = isset($data['appVersion']) ? htmlspecialchars((string)$data['appVersion'], ENT_QUOTES, 'UTF-8') : '';
?>
<div id="agent360-root" 
     class="agent360-nextcloud-container" 
     data-backend-url="<?php echo $backendUrl; ?>" 
     data-user-id="<?php echo $userId; ?>" 
     data-version="<?php echo $appVersion; ?>">
  <!-- Nextcloud native app canvas for Agent360 -->
  <div id="root" style="width: 100%; height: 100%; min-height: 100vh;"></div>
</div>
