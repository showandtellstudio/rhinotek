<?php
/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here. You can see a
 * list of the available settings in vendor/craftcms/cms/src/config/GeneralConfig.php.
 *
 * @see \craft\config\GeneralConfig
 */

use craft\config\GeneralConfig;
use craft\helpers\App;

$isDev = App::env('CRAFT_ENVIRONMENT') === 'dev';
$isProd = App::env('CRAFT_ENVIRONMENT') === 'production';
return GeneralConfig::create()
    ->defaultWeekStartDay(1)
    ->omitScriptNameInUrls()
    ->cpTrigger(App::env('CP_TRIGGER') ?: 'admin')
    ->devMode($isDev)
    ->allowAdminChanges($isDev)
    ->disallowRobots(!$isProd)
    ->preloadSingles()
    ->preventUserEnumeration()
    ->storeUserIps()
    ->sendPoweredByHeader(false)
    ->isSystemLive(1)
    ->aliases([
        '@webroot' => dirname(__DIR__) . '/web',
    ])
;
