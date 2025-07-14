<?php
    include('database.php');
    if (isset($_POST['submit'])) {
        $username = $_POST['user'];
        $password = $_POST['pass'];

        //check if user exists in db

        $sql = "select * from user where username = '$username' and password = '$password'";  
        $result = mysqli_query($conn, $sql);  
        $row = mysqli_fetch_array($result, MYSQLI_ASSOC);  
        $count = mysqli_num_rows($result);  
        
        if($count == 1){ 
			// Start the session
            session_start();
            $_SESSION['username'] = $username; // Set after successful login
            header("Location: scrabbleGame.html"); 
            exit;
            echo "<script> window.location.assign('scrabbleGame.html'); </script>";
    
        } 
        //login error -> back to index page 
        else{  
            echo  '<script>
                        window.location.href = "index.php";
                        alert("Login failed. Invalid username or password!!")
                    </script>';
        }     
    }
    ?>