<?php

namespace App\EventSubscriber;

use App\Entity\Customer;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * @see https://api-platform.com/docs/core/events/
 */
class CustomerUserSubcriber implements EventSubscriberInterface
{
    private Security $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public static function getSubscribedEvents()
    {
        // A Customer need a User, give the current User to the Customer just before data validation (i.e. Symfony validation component)
        return [
            KernelEvents::VIEW => ["setUserForCurstom", EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setUserForCurstom(ViewEvent $viewEvent)
    {
        $result = $viewEvent->getControllerResult();
        $method = $viewEvent->getRequest()->getMethod();

        if ($result instanceof Customer && $method === "POST") {
            $user = $this->security->getUser(); // Current logged user
            $result->setUser($user);
        }
    }
}
