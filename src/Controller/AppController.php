<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class AppController extends AbstractController
{
    /**
     * @Route("/", name="app")
     */
    public function index()
    {
        return $this->render('app/index.html.twig');
    }

    /**
     * @Route("/logout", name="logout", methods={"POST"})
     */
    public function logout()
    {
        $response = new Response(
            'Content',
            Response::HTTP_OK,
            ['content-type' => 'application/json']
        );
        $response->headers->clearCookie('__Host-JWT', '/', null, true, true);
        $response->headers->set('Content-Type', 'application/json');
        return $response->setContent(json_encode(['data' => 'logout']));
    }
}
