<?php
/**
 * One-time script to create the first admin user.
 * DELETE this file from the server after use.
 *
 * Usage: https://yourdomain.com/api/create_admin.php?email=you@email.com&password=yourpassword&secret=CHANGE_THIS
 */

define('SETUP_SECRET', 'fal2026setup'); // Change this before uploading

require_once __DIR__ . '/config.php';

if (($_GET['secret'] ?? '') !== SETUP_SECRET) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
}

$email    = trim($_GET['email'] ?? '');
$password = $_GET['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(['error' => 'email and password are required']);
    exit;
}


$hash = password_hash($password, PASSWORD_BCRYPT);

$stmt = db()->prepare(
    'INSERT INTO admins (email, password_hash) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)'
);
$stmt->execute([$email, $hash]);

echo json_encode(['ok' => true, 'email' => $email, 'message' => 'Admin created. DELETE this file now.']);
