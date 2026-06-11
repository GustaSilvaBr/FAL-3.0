<?php
require_once __DIR__ . '/config.php';
require_auth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_out('Método não permitido.', 405);
}

if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    error_out('Nenhum arquivo enviado.');
}

$file     = $_FILES['file'];
$type     = $_POST['type'] ?? 'products'; // 'products' or 'banners'
$entityId = $_POST['id']   ?? uuid();

// Validate MIME type by reading the actual file, not the browser-reported type
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime  = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

$allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
if (!in_array($mime, $allowed)) {
    error_out('Tipo de arquivo não permitido. Use JPG, PNG, WebP ou GIF.');
}

$ext = match ($mime) {
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
    default      => 'jpg',
};

$subDir = UPLOAD_DIR . $type . '/' . $entityId . '/';
if (!is_dir($subDir)) {
    mkdir($subDir, 0755, true);
}

// Remove any previous image in that slot
foreach (glob($subDir . 'image.*') as $old) {
    unlink($old);
}

$filename = 'image.' . $ext;
$destPath = $subDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    error_out('Erro ao salvar arquivo.', 500);
}

$relativePath = '/uploads/' . $type . '/' . $entityId . '/' . $filename;
$protocol     = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$imageUrl     = $protocol . '://' . $_SERVER['HTTP_HOST'] . $relativePath;

json_out([
    'imageUrl'  => $imageUrl,
    'imagePath' => $relativePath,
    'id'        => $entityId,
]);
