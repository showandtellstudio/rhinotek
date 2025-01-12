<?php
namespace cloudgrayau\base\assetbundles;

use craft\web\AssetBundle;

class BaseAsset extends AssetBundle {
    
    // Public Methods
    // =========================================================================

    public function init(): void {
      $this->sourcePath = "@cloudgrayau/base/resources";
      $this->css = [
        'cp.css',
      ];
      parent::init();
    }
}
