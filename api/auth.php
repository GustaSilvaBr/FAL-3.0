<?php
require_once __DIR__ . '/config.php';

if (session_status() === PHP_SESSION_NONE) session_start();

$method = $_SERVER['REQUEST_METHOD'];
$body   = json_decode(file_get_contents('php://input'), true) ?? [];

// GET — return current session state
if ($method === 'GET') {
    if (!empty($_SESSION['admin_email'])) {
        json_out(['email' => $_SESSION['admin_email']]);
    }
    json_out(['email' => null]);
}

if ($method === 'POST') {
    $action = $body['action'] ?? '';

    // Login
    if ($action === 'login') {
        $email    = trim($body['email'] ?? '');
        $password = $body['password'] ?? '';

        if (!$email || !$password) {
            error_out('Email e senha são obrigatórios.');
        }

        $stmt = db()->prepare('SELECT password_hash FROM admins WHERE email = ?');
        $stmt->execute([$email]);
        $admin = $stmt->fetch();

        if (!$admin || !password_verify($password, $admin['password_hash'])) {
            error_out('Email ou senha incorretos.', 401);
        }

        $_SESSION['admin_email'] = $email;
        json_out(['email' => $email]);
    }

    // Logout
    if ($action === 'logout') {
        session_destroy();
        json_out(['ok' => true]);
    }
}

error_out('Método não permitido.', 405);
