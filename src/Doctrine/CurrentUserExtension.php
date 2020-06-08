<?php

namespace App\Doctrine;

use App\Entity\User;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;

/**
 * Prenvent to have (with GET) everbody invoices from a specific logged user.
 * This class will bind invoices that belong to the current user.
 */
class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
    private Security $security;

    private AuthorizationCheckerInterface $auth;

    public function __construct(Security $security, AuthorizationCheckerInterface $authorizationChecker)
    {
        $this->security = $security;
        $this->auth = $authorizationChecker;
    }

    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass)
    {
        $user = $this->security->getUser();
        if (($resourceClass === Customer::class || $resourceClass === Invoice::class) &&
            !$this->auth->isGranted('ROLE_ADMIN') &&
            $user instanceof User
        ) {
            $rootAliase = $queryBuilder->getRootAliases()[0];
            if ($resourceClass === Customer::class) {
                $queryBuilder->andWhere("$rootAliase.user = :user");
            } elseif ($resourceClass === Invoice::class) {
                $queryBuilder->join("$rootAliase.customer", "c")
                    ->andWhere("c.user = :user");
            }
            $queryBuilder->setParameter('user', $user);
            //dd($queryBuilder);
        }
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?string $operationName = null)
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, ?string $operationName = null, array $context = [])
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }
}
