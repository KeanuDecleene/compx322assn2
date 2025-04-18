<?php
header('Content-Type: application/json');

$jsondata = file_get_contents('php://input');
$data = json_decode($jsondata, true);

$apiKey = 'RD689CV36KI14LRO';  //api key
$commodityCode = $data['code'];

//check if there is a commodity code
if (!$commodityCode) {
    echo json_encode(['error' => 'Missing commodity code']);
    exit;
}

//set up API call
$URL = "https://www.alphavantage.co/query?function={$commodityCode}&interval=monthly&apikey={$apiKey}";
$response = file_get_contents($URL);

//check if there was response from the API
if (!$response) {
    echo json_encode(['error' => 'Failed to contact Alpha Vantage']);
    exit;
}

$decoded = json_decode($response, true); //decode the response

//check if the API rate limit is exceeded
if (isset($decoded['Information'])) {
    echo json_encode(['error' => 'API rate limit exceeded']);
    exit;
}

if (!isset($decoded['data']) || !is_array($decoded['data'])) {
    echo json_encode(['error' => 'Unexpected API format or no data']);
    exit;
}

//extract the date/value pairs
$priceData = array_map(function ($entry) {
    return [
        'date' => $entry['date'],
        'value' => $entry['value']
    ];
}, $decoded['data']);

echo json_encode($priceData);
?>