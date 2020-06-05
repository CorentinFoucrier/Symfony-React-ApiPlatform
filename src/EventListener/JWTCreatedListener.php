<?php

namespace App\EventListener;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

/**
 * @see https://github.com/lexik/LexikJWTAuthenticationBundle/blob/master/Resources/doc/2-data-customization.md#eventsjwt_created---adding-custom-data-or-headers-to-the-jwt
 */
class JWTCreatedListener
{
    public function onJWTCreated(JWTCreatedEvent $jWTCreatedEvent)
    {
        /** @var User */
        $user = $jWTCreatedEvent->getUser();

        $data = $jWTCreatedEvent->getData();
        $data['firstName'] = $user->getFirstName();
        $data['lastName'] = $user->getLastName();

        $jWTCreatedEvent->setData($data);
    }
}
