<?php
use craft\helpers\App;

$isDev = App::env('CRAFT_ENVIRONMENT') === 'dev';
return [
  'advancedCache' => !$isDev,
  'cacheDir' => ($isDev) ? '@storage/pitch' : '@webroot/cache'
];