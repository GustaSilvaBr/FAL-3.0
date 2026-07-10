<?php
/**
 * Populate the nutrition field for products using nutrition-data.json.
 *
 * Requires admin session (login via auth.php first).
 * Only products present in nutrition-data.json are updated; others are untouched.
 *
 * DELETE or disable this file after use.
 */

require_once __DIR__ . '/config.php';
require_auth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_out('Método não permitido.', 405);
}

$nutritionPath = __DIR__ . '/nutrition-data.json';
if (!file_exists($nutritionPath)) {
    error_out('nutrition-data.json não encontrado na pasta api/.', 500);
}

$nutritionMap = json_decode(file_get_contents($nutritionPath), true);
if (!is_array($nutritionMap)) {
    error_out('nutrition-data.json inválido.', 500);
}

$db      = db();
$updated = [];
$skipped = [];
$errors  = [];

$stmt = $db->prepare('UPDATE products SET nutrition = ? WHERE id = ?');

foreach ($nutritionMap as $productId => $nutritionTable) {
    try {
        $stmt->execute([json_encode($nutritionTable), $productId]);

        if ($stmt->rowCount() > 0) {
            $updated[] = $productId;
        } else {
            $skipped[] = $productId;
        }
    } catch (Throwable $e) {
        $errors[] = "$productId: " . $e->getMessage();
    }
}

json_out([
    'ok'      => empty($errors),
    'updated' => count($updated),
    'skipped' => count($skipped),
    'errors'  => $errors,
    'detail'  => [
        'updated' => $updated,
        'skipped' => $skipped,
    ],
]);
