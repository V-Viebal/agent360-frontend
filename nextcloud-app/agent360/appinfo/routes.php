<?php
declare(strict_types=1);

return [
  'routes' => [
    ['name' => 'Page#index', 'url' => '/', 'verb' => 'GET'],
    ['name' => 'Api#agents', 'url' => '/api/v1/agents', 'verb' => 'GET'],
    ['name' => 'Api#chats', 'url' => '/api/v1/chats', 'verb' => 'GET'],
    ['name' => 'Api#agentChats', 'url' => '/api/v1/agents/{agentId}/chats', 'verb' => 'GET'],
    ['name' => 'Api#chatDetail', 'url' => '/api/v1/chats/{id}', 'verb' => 'GET'],
    ['name' => 'Api#sendMessage', 'url' => '/api/v1/chat', 'verb' => 'POST'],
    ['name' => 'Api#skills', 'url' => '/api/v1/skills', 'verb' => 'GET'],
  ],
];
