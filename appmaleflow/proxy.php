<?php
// ===============================
// FemFlow Proxy — Versão Oficial
// ===============================

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Cache OFF (CRÍTICO)
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  header("Content-Type: application/json; charset=UTF-8");
  http_response_code(200);
  echo json_encode(["ok" => true]);
  exit;
}

// Endpoint público do backend (Cloudflare Worker)
$API = "https://appmaleflow.falling-wildflower-a8c0.workers.dev";

// Método
$method = $_SERVER['REQUEST_METHOD'];

// Query string (GET)
$query = $_SERVER['QUERY_STRING'] ?? "";

// Corpo (POST)
$body = file_get_contents("php://input");

// Monta URL final
$url = $API . ($query ? "?" . $query : "");

// cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

if ($method === "POST" && !empty($body)) {
  curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}

curl_setopt($ch, CURLOPT_HTTPHEADER, [
  "Content-Type: application/json",
  "X-FemFlow-Proxy: php",
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false) {
  header("Content-Type: application/json; charset=UTF-8");
  http_response_code(502);
  echo json_encode([
    "ok" => false,
    "error" => "proxy_error",
    "status" => 502
  ]);
  exit;
}

$decoded = json_decode($response, true);
$isJson = json_last_error() === JSON_ERROR_NONE;

// Retorno
http_response_code($httpCode);
header("Content-Type: application/json; charset=UTF-8");

if (!$isJson) {
  echo json_encode([
    "ok" => false,
    "error" => "non_json_response",
    "status" => $httpCode,
    "raw" => $response
  ]);
  exit;
}

echo $response;
