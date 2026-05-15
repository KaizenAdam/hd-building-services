<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://hdbuildingservices.co.uk');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Sanitise inputs
$name    = strip_tags(trim($_POST['name']    ?? ''));
$phone   = strip_tags(trim($_POST['phone']   ?? ''));
$email   = strip_tags(trim($_POST['email']   ?? ''));
$service = strip_tags(trim($_POST['service'] ?? ''));
$message = strip_tags(trim($_POST['message'] ?? ''));

// Basic validation
if (empty($name) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['error' => 'Name and phone are required']);
    exit;
}

$to      = 'Harleydean@hdbuilding-services.com';
$subject = 'New Quote Request — HD Building Services';

$body  = "You have a new quote request from your website.\n\n";
$body .= "Name:    $name\n";
$body .= "Phone:   $phone\n";
$body .= "Email:   $email\n";
$body .= "Service: $service\n\n";
$body .= "Message:\n$message\n";

$headers  = "From: website@hdbuildingservices.co.uk\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Mail failed to send']);
}
