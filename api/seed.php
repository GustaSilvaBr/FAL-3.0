<?php
/**
 * Seed the database with initial folders and products from seed-data.json.
 *
 * Requires admin session (login via auth.php first).
 *
 * Images are optional: if you place the product images under api/seed-images/
 * (same folder structure as src/assets/products/), they will be copied to
 * uploads/products/{id}/ automatically. Otherwise products are seeded without images.
 *
 * DELETE or disable this file after use.
 */

require_once __DIR__ . '/config.php';
require_auth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_out('Método não permitido.', 405);
}

$jsonPath = __DIR__ . '/seed-data.json';
if (!file_exists($jsonPath)) {
    error_out('seed-data.json não encontrado na pasta api/.', 500);
}

$data = json_decode(file_get_contents($jsonPath), true);
if (!$data || !isset($data['folders'], $data['products'])) {
    error_out('seed-data.json inválido.', 500);
}

$db = db();
$results = ['folders' => [], 'products' => [], 'errors' => []];

// ── 1. Folders ─────────────────────────────────────────────────────────────────

foreach ($data['folders'] as $folder) {
    try {
        $db->prepare(
            'INSERT INTO folders (id, name, `order`, parentId, keywords)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE name = VALUES(name), `order` = VALUES(`order`), parentId = VALUES(parentId)'
        )->execute([
            $folder['id'],
            $folder['name'],
            $folder['order'] ?? 0,
            $folder['parentId'] ?? null,
            isset($folder['keywords']) ? json_encode($folder['keywords']) : null,
        ]);

        $results['folders'][] = $folder['id'];
    } catch (Throwable $e) {
        $results['errors'][] = "Folder {$folder['id']}: " . $e->getMessage();
    }
}

// ── 2. Products ────────────────────────────────────────────────────────────────

$seedImagesDir = __DIR__ . '/seed-images/';
$hasImages     = is_dir($seedImagesDir);

foreach ($data['products'] as $product) {
    try {
        $imageUrl  = '';
        $imagePath = '';

        // Try to copy the image if seed-images/ folder is present
        if ($hasImages && !empty($product['localImagePath'])) {
            $sourcePath = $seedImagesDir . $product['localImagePath'];

            if (file_exists($sourcePath)) {
                $ext    = strtolower(pathinfo($sourcePath, PATHINFO_EXTENSION));
                $destDir = UPLOAD_DIR . 'products/' . $product['id'] . '/';

                if (!is_dir($destDir)) {
                    mkdir($destDir, 0755, true);
                }

                // Remove old image in that slot
                foreach (glob($destDir . 'image.*') as $old) {
                    unlink($old);
                }

                $destFile = $destDir . 'image.' . $ext;

                if (copy($sourcePath, $destFile)) {
                    $imagePath = '/uploads/products/' . $product['id'] . '/image.' . $ext;
                    $protocol  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
                    $imageUrl  = $protocol . '://' . $_SERVER['HTTP_HOST'] . $imagePath;
                }
            }
        }

        $db->prepare(
            'INSERT INTO products (id, name, weight, folderId, imageUrl, imagePath, nutrition)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               name      = VALUES(name),
               weight    = VALUES(weight),
               folderId  = VALUES(folderId),
               imageUrl  = IF(VALUES(imageUrl) != \'\', VALUES(imageUrl), imageUrl),
               imagePath = IF(VALUES(imagePath) != \'\', VALUES(imagePath), imagePath)'
        )->execute([
            $product['id'],
            $product['name'],
            $product['weight'] ?? '',
            $product['folderId'],
            $imageUrl,
            $imagePath,
            json_encode(new stdClass()),
        ]);

        $results['products'][] = $product['id'];
    } catch (Throwable $e) {
        $results['errors'][] = "Product {$product['id']}: " . $e->getMessage();
    }
}

json_out([
    'ok'       => empty($results['errors']),
    'folders'  => count($results['folders']),
    'products' => count($results['products']),
    'errors'   => $results['errors'],
]);
