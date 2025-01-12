<?php
namespace cloudgrayau\base;

use cloudgrayau\base\assetbundles\BaseAsset;

use Craft;
use craft\base\Plugin;
use craft\events\ModelEvent;
use craft\events\TemplateEvent;
use craft\services\Fields;
use craft\events\RegisterComponentTypesEvent;
use craft\web\View;

use yii\base\Event;

class Base extends Plugin {

  public static $plugin;
  public string $schemaVersion = '1.0.0';
  public bool $hasCpSettings = false;
  public bool $hasCpSection = false;
  
  // Public Methods
  // =========================================================================
  
  public function init(): void {
    parent::init();
    self::$plugin = $this;
    $this->_registerAsset(); 
  }
  
  // Private Methods
  // =========================================================================
  
  private function _registerAsset(): void {
    if (!Craft::$app->getRequest()->getIsCpRequest()) {
      return;
    }
    Event::on(
      View::class,
      View::EVENT_BEFORE_RENDER_PAGE_TEMPLATE,
      function (TemplateEvent $event) {
        $view = Craft::$app->getView();
        $view->registerAssetBundle(BaseAsset::class);  
      }
    );
  }
  
  // Protected Methods
  // =========================================================================

}
