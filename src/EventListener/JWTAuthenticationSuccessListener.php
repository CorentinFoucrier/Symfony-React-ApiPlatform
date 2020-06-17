<?php

namespace App\EventListener;

use Exception;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\HttpFoundation\Cookie;

/**
 * Class JWTAuthenticationSuccessListener
 * @package App\EventListener
 */
class JWTAuthenticationSuccessListener
{
    private int $tokenLifetime;

    public function __construct(int $tokenLifetime)
    {
        $this->tokenLifetime = $tokenLifetime;
    }

    /**
     * Sets JWT as a cookie on successful authentication.
     * 
     * @param AuthenticationSuccessEvent $event
     * @throws Exception
     */
    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event): void
    {
        $event->getResponse()->headers->setCookie(
            new Cookie(
                '__Host-JWT', // Cookie name, should be the same as in config/packages/lexik_jwt_authentication.yaml.
                $event->getData()['token'], // cookie value
                time() + $this->tokenLifetime, // expiration
                '/', // path
                null, // domain, null means that Symfony will generate it on its own.
                true, // secure
                true, // httpOnly - disallow javascript to access cookie from browsers
                false, // raw
                'lax' // same-site parameter, can be 'lax' or 'strict'.
            )
        );
    }
}