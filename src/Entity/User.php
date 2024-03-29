<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 * @ApiResource(
 *  normalizationContext={"groups"={"users_read"}}
 * )
 * @UniqueEntity("email", message="This email is already taken!")
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"users_read" ,"customers_read", "invoices_read", "invoices_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     * @Groups({"users_read" ,"customers_read", "invoices_read", "invoices_subresource"})
     * @Assert\NotBlank(message="Le champs ne peux pas être vide!")
     * @Assert\Email(message="Vous devez entrer un email valide.")
     */
    private $email;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     * @Assert\NotBlank(message="Le champs ne peux pas être vide!")
     */
    private $password;

    /**
     * @var string The hashed password
     * @Assert\NotBlank(message="Le champs ne peux pas être vide!")
     * @Assert\IdenticalTo(propertyPath="password", message="La confirmation du mot de passe n'est pas valide")
     */
    private $confirmPassword;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"users_read" ,"customers_read", "invoices_read", "invoices_subresource"})
     * @Assert\NotBlank(message="Le champs ne peux pas être vide!")
     * @Assert\Length(
     *      min=2,
     *      max=255,
     *      minMessage="Votre prénom dois contenir plus de 2 caractères.",
     *      maxMessage="Votre prénom ne dois pas dépasser 255 caractères.",
     *      allowEmptyString=true
     *  )
     * @Assert\Type(type={"string", "alpha"}, message="Votre prénom ne peux contenir que des lettres.")
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"users_read" ,"customers_read", "invoices_read", "invoices_subresource"})
     * @Assert\NotBlank(message="Le champs ne peux pas être vide!")
     * @Assert\Length(
     *      min=2,
     *      max=255,
     *      minMessage="Votre nom dois contenir plus de 2 caractères.",
     *      maxMessage="Votre nom ne dois pas dépasser 255 caractères.",
     *      allowEmptyString=true
     *  )
     * @Assert\Type(type={"string", "alpha"}, message="Votre nom ne peux contenir que des lettres.")
     */
    private $lastName;

    /**
     * @ORM\OneToMany(targetEntity=Customer::class, mappedBy="user")
     */
    private $customers;

    public function __construct()
    {
        $this->customers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getConfirmPassword(): string
    {
        return (string) $this->confirmPassword;
    }

    public function setConfirmPassword(string $confirmPassword): self
    {
        $this->confirmPassword = $confirmPassword;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    /**
     * @return Collection|Customer[]
     */
    public function getCustomers(): Collection
    {
        return $this->customers;
    }

    public function addCustomer(Customer $customer): self
    {
        if (!$this->customers->contains($customer)) {
            $this->customers[] = $customer;
            $customer->setUser($this);
        }

        return $this;
    }

    public function removeCustomer(Customer $customer): self
    {
        if ($this->customers->contains($customer)) {
            $this->customers->removeElement($customer);
            // set the owning side to null (unless already changed)
            if ($customer->getUser() === $this) {
                $customer->setUser(null);
            }
        }

        return $this;
    }
}
