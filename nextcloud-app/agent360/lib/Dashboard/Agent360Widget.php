<?php
declare(strict_types=1);

namespace OCA\Agent360\Dashboard;

use OCP\Dashboard\IWidget;
use OCP\IL10N;
use OCP\IURLGenerator;
use OCP\Util;

class Agent360Widget implements IWidget {
  public function __construct(
    private IL10N $l10n,
    private IURLGenerator $urlGenerator
  ) {}

  public function getId(): string {
    return 'agent360_widget';
  }

  public function getTitle(): string {
    return $this->l10n->t('Agent360 AI Teammates');
  }

  public function getOrder(): int {
    return 10;
  }

  public function getIconClass(): string {
    return 'icon-agent360';
  }

  public function getUrl(): ?string {
    return $this->urlGenerator->linkToRoute('agent360.Page.index');
  }

  public function load(): void {
    Util::addStyle('agent360', 'agent360');
    Util::addScript('agent360', 'assistant-widget');
  }
}
