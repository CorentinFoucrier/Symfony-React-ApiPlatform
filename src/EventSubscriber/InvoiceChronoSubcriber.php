<?php

namespace App\EventSubscriber;

use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class InvoiceChronoSubcriber implements EventSubscriberInterface
{
    private Security $security;

    private InvoiceRepository $repository;

    public function __construct(Security $security, InvoiceRepository $invoiceRepository)
    {
        $this->security = $security;
        $this->repository = $invoiceRepository;
    }

    public static function getSubscribedEvents()
    {
        // An Invoice need a Chrone, give it one automaticaly before data validation (i.e. Symfony validation component)
        return [
            KernelEvents::VIEW => ["setChronoForInvoice", EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoice(ViewEvent $viewEvent)
    {
        $result = $viewEvent->getControllerResult();
        $method = $viewEvent->getRequest()->getMethod();

        if ($result instanceof Invoice && $method = "POST") {
            $nextChrono = $this->repository->findNextChrono($this->security->getUser());
            $result->setChrono($nextChrono);
            if (empty($result->getSentAt())) {
                $result->setSentAt(new \DateTime());
            }
        }
    }
}
