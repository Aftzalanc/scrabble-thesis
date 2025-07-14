<?php 
    include("database.php");
    include("login.php");
    ?>
<!DOCTYPE html>    
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" type="text/css" href="style.css">
        <title>Home Page </title>
       
    </head>
    <body>
        
        <div id="form">
            <h1>Login</h1>


            <form name="form" action="login.php" onsubmit="return isvalid()" method="POST">
                <label>Username: </label>
                <input type="text" id="user" name="user"></br></br>
                <label>Password: </label>
                <input type="password" id="pass" name="pass"></br></br>
                <input type="submit" id="btn" value="Login" name = "submit"/>
                <p>Don't have an account? <a href="signup.php">Register</a> </p>
            </form>
        </div>
        <!-- check if the input is valid/not empty -->
        <script>
            function isvalid(){
                var user = document.form.user.value;
                var pass = document.form.pass.value;
                if(user.length===0 && pass.length===0){
                    alert(" Username and password field is empty!!!");
                    return false;
                }
                else if(user.length===0){
                    alert(" Username field is empty!!!");
                    return false;
                }
                else if(pass.length===0){
                    alert(" Password field is empty!!!");
                    return false;
                }
                
            }
        </script>
    </body>
</html>