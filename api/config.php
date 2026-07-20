<?php
// ── Database credentials ────────────────────────────────────────────────────────
// Reads from .env.php one level above public_html (never web-accessible).
$_envFile = dirname($_SERVER['DOCUMENT_ROOT']) . '/.env.php';
if (file_exists($_envFile)) {
    $env = parse_ini_file($_envFile);
    define('DB_HOST',      $env['DB_HOST']      ?? 'localhost');
    define('DB_NAME',      $env['DB_NAME']      ?? '');
    define('DB_USER',      $env['DB_USER']      ?? '');
    define('DB_PASS',      $env['DB_PASS']      ?? '');
    define('HMAC_SECRET',  $env['HMAC_SECRET']  ?? '');
} else {
    define('DB_HOST',     'localhost');
    define('DB_NAME',     '');
    define('DB_USER',     '');
    define('DB_PASS',     '');
    define('HMAC_SECRET', '');
}

// ── HMAC authentication ────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS' && HMAC_SECRET !== '') {
    $ts  = $_SERVER['HTTP_X_TIMESTAMP'] ?? '';
    $sig = $_SERVER['HTTP_X_SIGNATURE'] ?? '';
    $now = (int) round(microtime(true) * 1000);

    if ($ts === '' || abs($now - (int) $ts) > 300000) {
        http_response_code(401);
        echo json_encode(['error' => 'Não autorizado.']);
        exit;
    }

    $expected = hash_hmac('sha256', $ts, HMAC_SECRET);
    if (!hash_equals($expected, $sig)) {
        http_response_code(401);
        echo json_encode(['error' => 'Não autorizado.']);
        exit;
    }
}

define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('UPLOAD_URL', '/uploads/');

// ── CORS ───────────────────────────────────────────────────────────────────────
$allowed_origin = 'https://fabricadealimentos.com.br';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if ($origin === $allowed_origin) {
    header('Access-Control-Allow-Origin: ' . $allowed_origin);
    header('Vary: Origin');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );
    }
    return $pdo;
}

function json_out($data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function error_out(string $message, int $status = 400): void {
    json_out(['error' => $message], $status);
}

function require_auth(): void {
    if (session_status() === PHP_SESSION_NONE) session_start();
    if (empty($_SESSION['admin_email'])) {
        error_out('Não autorizado.', 401);
    }
}

function uuid(): string {
    $data    = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}
