<?php
require_once __DIR__ . '/config.php';

if (session_status() === PHP_SESSION_NONE) session_start();

function require_manager(): void {
    if (empty($_SESSION['admin_email'])) {
        error_out('Não autorizado.', 401);
    }
    $stmt = db()->prepare('SELECT can_manage_admins FROM admins WHERE email = ?');
    $stmt->execute([$_SESSION['admin_email']]);
    $row = $stmt->fetch();
    if (!$row || !$row['can_manage_admins']) {
        error_out('Sem permissão para gerenciar admins.', 403);
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$body   = json_decode(file_get_contents('php://input'), true) ?? [];

// ── GET — list all admins ──────────────────────────────────────────────────────
if ($method === 'GET') {
    require_manager();
    $rows = db()->query(
        'SELECT email, can_manage_admins, created_at FROM admins ORDER BY created_at ASC'
    )->fetchAll();
    json_out(array_map(function($r) {
        return [
            'email'             => $r['email'],
            'can_manage_admins' => (bool) $r['can_manage_admins'],
            'created_at'        => $r['created_at'],
        ];
    }, $rows));
}

// ── POST — create admin ────────────────────────────────────────────────────────
if ($method === 'POST') {
    require_manager();

    $email     = trim($body['email'] ?? '');
    $password  = $body['password'] ?? '';
    $canManage = !empty($body['can_manage_admins']) ? 1 : 0;

    if (!$email || !$password)                        error_out('Email e senha são obrigatórios.');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL))   error_out('Email inválido.');
    if (strlen($password) < 6)                        error_out('Senha deve ter no mínimo 6 caracteres.');

    $hash = password_hash($password, PASSWORD_BCRYPT);

    try {
        $stmt = db()->prepare(
            'INSERT INTO admins (email, password_hash, can_manage_admins) VALUES (?, ?, ?)'
        );
        $stmt->execute([$email, $hash, $canManage]);
        json_out(['email' => $email, 'can_manage_admins' => (bool) $canManage], 201);
    } catch (\PDOException $e) {
        if ($e->getCode() === '23000') error_out('Este email já está cadastrado.', 409);
        throw $e;
    }
}

// ── PUT — update admin ─────────────────────────────────────────────────────────
if ($method === 'PUT') {
    require_manager();

    $email     = $_GET['email'] ?? '';
    $canManage = !empty($body['can_manage_admins']) ? 1 : 0;

    if (!$email) error_out('Parâmetro email é obrigatório.');

    if ($email === $_SESSION['admin_email'] && !$canManage) {
        error_out('Você não pode remover sua própria permissão de gerenciar admins.');
    }

    if (!empty($body['password'])) {
        if (strlen($body['password']) < 6) error_out('Senha deve ter no mínimo 6 caracteres.');
        $hash = password_hash($body['password'], PASSWORD_BCRYPT);
        $stmt = db()->prepare('UPDATE admins SET password_hash = ?, can_manage_admins = ? WHERE email = ?');
        $stmt->execute([$hash, $canManage, $email]);
    } else {
        $stmt = db()->prepare('UPDATE admins SET can_manage_admins = ? WHERE email = ?');
        $stmt->execute([$canManage, $email]);
    }

    json_out(['ok' => true]);
}

// ── DELETE — remove admin ──────────────────────────────────────────────────────
if ($method === 'DELETE') {
    require_manager();

    $email = $_GET['email'] ?? '';
    if (!$email) error_out('Parâmetro email é obrigatório.');
    if ($email === $_SESSION['admin_email']) error_out('Você não pode excluir sua própria conta.');

    $stmt = db()->prepare('DELETE FROM admins WHERE email = ?');
    $stmt->execute([$email]);
    json_out(['ok' => true]);
}

error_out('Método não permitido.', 405);
