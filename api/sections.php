<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

if (!$id) error_out('ID da seção é obrigatório.');

$valid = ['novidades', 'pipoca-gravata', 'brands', 'banners', 'instagram'];
if (!in_array($id, $valid)) error_out('Seção não encontrada.', 404);

// Public read
if ($method === 'GET') {
    $stmt = db()->prepare('SELECT data FROM sections WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) json_out(new stdClass());
    json_out(json_decode($row['data'], true));
}

// Protected write
if ($method === 'POST') {
    require_auth();
    $body = json_decode(file_get_contents('php://input'), true) ?? [];

    db()->prepare(
        'INSERT INTO sections (id, data) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE data = VALUES(data), updatedAt = NOW()'
    )->execute([$id, json_encode($body, JSON_UNESCAPED_UNICODE)]);

    json_out(['ok' => true]);
}

error_out('Método não permitido.', 405);
