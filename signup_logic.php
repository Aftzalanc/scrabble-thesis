<?php
    include('database.php');

    // Get POST data
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $username = $_POST['user'];
        $password = $_POST['pass'];
        $email = $_POST['email'];

        // Check if email already exists
        $email_check = $conn->prepare("SELECT email FROM user WHERE email = ?");
        $email_check->bind_param("s", $email);
        $email_check->execute();
        $email_check->store_result();

        if ($email_check->num_rows > 0) {
            echo "<script>alert('This email already exists.');
            window.location.href = 'signup.php';</script>";
            $email_check->close();
            $conn->close();
            exit();
        }
        $email_check->close();


        // Check if username already exists
        $username_check = $conn->prepare("SELECT username FROM user WHERE username = ?");
        $username_check->bind_param("s", $username);
        $username_check->execute();
        $username_check->store_result();

        if ($username_check->num_rows > 0) {
            echo "<script>
                alert('This username is already in use.');
                window.location.href = 'signup.php';
            </script>";
            $username_check->close();
            $conn->close();
            exit();
        }
        $username_check->close();

      // Insert new user
        $insert = $conn->prepare("INSERT INTO user (username, password, email) VALUES (?, ?, ?)");
        $insert->bind_param("sss", $username, $password, $email);
        

        if ($insert->execute()) {
        echo "<script>alert('Registration successful! Redirecting to Login page');
            window.location.href = 'index.php';</script>";
        } else {
        echo "Error: " . $insert->error;
        }


        $insert->close();
        $conn->close();
    }
    ?>