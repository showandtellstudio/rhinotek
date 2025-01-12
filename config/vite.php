<?php
use craft\helpers\App;

$isDev = App::env('CRAFT_ENVIRONMENT') === 'dev';
return [
    'useDevServer' => $isDev,
    'manifestPath' => '@webroot/assets/dist/.vite/manifest.json',
    'devServerPublic' => 'https://localhost:3000/',
    'serverPublic' => Craft::getAlias('@web').'/assets/dist/',
    'errorEntry' => '',
    'cacheKeySuffix' => '',
    'devServerInternal' => '',
    'checkDevServer' => false,
    'includeReactRefreshShim' => false,
    'includeModulePreloadShim' => false
];