<?php
// Database connection settings
 $servername = "localhost";    // MySQL server address
 $username = "root";          // MySQL username
 $password = "";             // MySQL password (empty by default for local setup)
 $db_name = "firstdb";      // Database name
 $conn = new mysqli($servername, $username, $password, $db_name);
 //message in case of error
 if($conn->connect_error){
     die("Connection failed".$conn->connect_error);
 }


// Close the database connection
//$conn->close();
?>