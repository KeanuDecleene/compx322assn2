<?php
include 'db_connect.php';
header('Content-Type: application/json');

try {
    $sql = "SELECT * FROM commodities"; 
    $query = $conn->query($sql);
    //empty array to store results
    $commodities = [];
    //check if query has any rows
    if ($query->rowCount() > 0) {
        //fetch each row into the commodities array
        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            $commodities[] = $row;
        }
    } else {
        echo json_encode(["message" => "No commodities found."]);
        exit;
    }
    echo json_encode($commodities);
} catch (PDOException $e) {
    echo json_encode(["error" => "Query failed: " . $e->getMessage()]);
}
$conn = null;
?>
