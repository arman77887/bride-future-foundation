<?php

return [
    'contact_recipient' => env('CONTACT_MESSAGE_EMAIL', 'tha.crypticx.official@gmail.com'),
    'notification_recipients' => array_values(array_filter(array_map(
        'trim',
        explode(',', env(
            'MAIL_NOTIFICATION_RECIPIENTS',
            'tha.crypticx.official@gmail.com,dyppomahadi2000@gmail.com'
        ))
    ))),
    'default' => env('MAIL_MAILER', 'smtp'),
    'mailers' => [
        'smtp' => [
            'transport' => 'smtp',
            'host' => env('MAIL_HOST', 'smtp.mailgun.org'),
            'port' => env('MAIL_PORT', 587),
            'encryption' => env('MAIL_ENCRYPTION', 'tls'),
            'username' => env('MAIL_USERNAME'),
            'password' => env('MAIL_PASSWORD'),
            'timeout' => null,
            'auth_mode' => null,
        ],
        'log' => [
            'transport' => 'log',
            'channel' => env('MAIL_LOG_CHANNEL'),
        ],
        'array' => [
            'transport' => 'array',
        ],
    ],
    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'no-reply@bff.org.bd'),
        'name' => env('MAIL_FROM_NAME', 'Bright Future Foundation'),
    ],
];
