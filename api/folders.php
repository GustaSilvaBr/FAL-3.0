<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// Public read
if ($method === 'GET') {
    $rows = db()->query('SELECT * FROM folders ORDER BY name')->fetchAll();
    foreach ($rows as &$r) {
        if ($r['keywords'] !== null) {
            $r['keywords'] = json_decode($r['keywords'], true);
        }
    }
    json_out($rows);
}

require_auth();

if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];
    $name = trim($body['name'] ?? '');
    if (!$name) error_out('Nome é obrigatório.');

    $newId    = uuid();
    $order    = (int) ($body['order'] ?? 0);
    $parentId = $body['parentId'] ?? null;
    $keywords = isset($body['keywords']) ? json_encode($body['keywords']) : null;

    db()->prepare('INSERT INTO folders (id, name, `order`, parentId, keywords) VALUES (?,?,?,?,?)')
        ->execute([$newId, $name, $order, $parentId, $keywords]);

    json_out(['id' => $newId, 'name' => $name, 'order' => $order, 'parentId' => $parentId], 201);
}

if ($method === 'PUT' && $id) {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];
    $name = trim($body['name'] ?? '');
    if (!$name) error_out('Nome é obrigatório.');

    $order    = (int) ($body['order'] ?? 0);
    $parentId = $body['parentId'] ?? null;
    $keywords = isset($body['keywords']) ? json_encode($body['keywords']) : null;

    db()->prepare('UPDATE folders SET name=?, `order`=?, parentId=?, keywords=? WHERE id=?')
        ->execute([$name, $order, $parentId, $keywords, $id]);

    json_out(['ok' => true]);
}

if ($method === 'DELETE' && $id) {
    db()->prepare('DELETE FROM folders WHERE id=?')->execute([$id]);
    json_out(['ok' => true]);
}

error_out('Método não permitido.', 405);
