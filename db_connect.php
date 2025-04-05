<?php
$servername = "learn-mysql.cms.waikato.ac.nz";  
$username = "kd258";         
$password = "my395645sql";             
$dbname = "kd258"; 

//create a new PDO instance
try {
    //DSN (Data Source Name) for the PDO connection
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    
    //set PDO to throw exceptions on errors
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    //default fetch mode
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
