<?php
header('Content-Type: application/json');

$host = "localhost";  //MySQL server address
$user = "root";          // MySQL username
$pass = "";    // MySQL password (empty by default for local setup)
$dbname = "firstdb";      // Database name

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);
$words = $input['words'] ?? [];

// Create the MySQL connection
$conn = new mysqli($host, $user, $pass, $dbname);
 //message in case of error
if ($conn->connect_error) {
    echo json_encode(["error" => "DB connection failed" . $conn->connect_error]);
    exit;
}

// Prepare output array
$validWords = [];
// === Check Each Word Against 'wordbank' Table ===
foreach ($words as $word) {
   // Escape the input to avoid SQL injection
    $safeWord = $conn->real_escape_string($word);
     // Query: Check if word exists in column word
    $query = "SELECT 1 FROM wordbank WHERE word = '$safeWord' LIMIT 1";
    $result = $conn->query($query);
    // If the word is found, consider it valid
    if ($result && $result->num_rows > 0) {
        $validWords[] = $word;
    }
}

// Return the valid words as JSON
echo json_encode(["validWords" => $validWords]);
// Close the database connection
//$conn->close();
?>
