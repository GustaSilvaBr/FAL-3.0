<?php
require_once __DIR__ . '/config.php';

if (session_status() === PHP_SESSION_NONE) session_start();

$method = $_SERVER['REQUEST_METHOD'];
$body   = json_decode(file_get_contents('php://input'), true) ?? [];

// GET — return current session state
if ($method === 'GET') {
    if (!empty($_SESSION['admin_email'])) {
        // Refresh can_manage_admins from DB if missing in session (e.g. after migration)
        if (!isset($_SESSION['can_manage_admins'])) {
            $stmt = db()->prepare('SELECT can_manage_admins FROM admins WHERE email = ?');
            $stmt->execute([$_SESSION['admin_email']]);
            $row = $stmt->fetch();
            $_SESSION['can_manage_admins'] = (bool) ($row['can_manage_admins'] ?? false);
        }
        json_out([
            'email'             => $_SESSION['admin_email'],
            'can_manage_admins' => (bool) $_SESSION['can_manage_admins'],
        ]);
    }
    json_out(['email' => null, 'can_manage_admins' => false]);
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

        $stmt = db()->prepare('SELECT password_hash, can_manage_admins FROM admins WHERE email = ?');
        $stmt->execute([$email]);
        $admin = $stmt->fetch();

        if (!$admin || !password_verify($password, $admin['password_hash'])) {
            error_out('Email ou senha incorretos.', 401);
        }

        $_SESSION['admin_email']       = $email;
        $_SESSION['can_manage_admins'] = (bool) $admin['can_manage_admins'];
        json_out([
            'email'             => $email,
            'can_manage_admins' => (bool) $admin['can_manage_admins'],
        ]);
    }

    // Logout
    if ($action === 'logout') {
        session_destroy();
        json_out(['ok' => true]);
    }
}

error_out('Método não permitido.', 405);
