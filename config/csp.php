<?php
use craft\helpers\UrlHelper;

return [
  '*' => [
    'cspEnabled' => false,
    'cspMode' => 'header', /* header|tag|report */
    'cspOptions' => [ /* enabled options */
      'defaultSrc',
    ],
    'protectionEnabled' => true,
    'headerProtection' => [
      ['Strict-Transport-Security', 'max-age=31536000;includeSubDomains;preload'],
      ['X-Content-Type-Options', 'nosniff'],
      ['X-Frame-Options', 'SAMEORIGIN'],
      ['X-Xss-Protection', '1; mode=block'],
    ],
    'defaultSrc' => [
      ["'none'"],
    ],
  ],
];
