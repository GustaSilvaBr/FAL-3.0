<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// Public read
if ($method === 'GET') {
    if ($id) {
        $stmt = db()->prepare('SELECT * FROM products WHERE id = ?');
        $stmt->execute([$id]);
        $product = $stmt->fetch();
        if (!$product) error_out('Produto não encontrado.', 404);
        $product['nutrition'] = json_decode($product['nutrition'], true);
        json_out($product);
    } else {
        $rows = db()->query('SELECT * FROM products ORDER BY name')->fetchAll();
        foreach ($rows as &$r) {
            $r['nutrition'] = json_decode($r['nutrition'], true);
        }
        json_out($rows);
    }
}

require_auth();

if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];
    $name = trim($body['name'] ?? '');
    if (!$name) error_out('Nome é obrigatório.');
    if (empty($body['folderId'])) error_out('Pasta é obrigatória.');

    $newId = uuid();
    db()->prepare(
        'INSERT INTO products (id, name, weight, folderId, imageUrl, imagePath, nutrition) VALUES (?,?,?,?,?,?,?)'
    )->execute([
        $newId,
        $name,
        $body['weight']    ?? '',
        $body['folderId'],
        $body['imageUrl']  ?? '',
        $body['imagePath'] ?? '',
        json_encode($body['nutrition'] ?? new stdClass()),
    ]);

    json_out(['id' => $newId], 201);
}

if ($method === 'PUT' && $id) {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];
    $name = trim($body['name'] ?? '');
    if (!$name) error_out('Nome é obrigatório.');

    db()->prepare(
        'UPDATE products SET name=?, weight=?, folderId=?, imageUrl=?, imagePath=?, nutrition=? WHERE id=?'
    )->execute([
        $name,
        $body['weight']    ?? '',
        $body['folderId']  ?? '',
        $body['imageUrl']  ?? '',
        $body['imagePath'] ?? '',
        json_encode($body['nutrition'] ?? new stdClass()),
        $id,
    ]);

    json_out(['ok' => true]);
}

if ($method === 'DELETE' && $id) {
    $stmt = db()->prepare('SELECT imagePath FROM products WHERE id=?');
    $stmt->execute([$id]);
    $product = $stmt->fetch();

    if ($product && $product['imagePath']) {
        $filePath = __DIR__ . '/../' . ltrim($product['imagePath'], '/');
        if (file_exists($filePath)) unlink($filePath);
    }

    db()->prepare('DELETE FROM products WHERE id=?')->execute([$id]);
    json_out(['ok' => true]);
}

error_out('Método não permitido.', 405);
