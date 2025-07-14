<?php 
    include("database.php");
    include("signup_logic.php");
    ?>
<!DOCTYPE html>    
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" type="text/css" href="style.css">
        <title>Registration </title>
       
    </head>
    <body>
        
        <div id="form">
            <h1>Sign Up</h1>


            <form name="form" action="signup_logic.php" onsubmit="return isvalid()" method="POST">
                <label>Username: </label>
                <input type="text" id="user" name="user"></br></br>
                <label>Password: </label>
                <input type="password" id="pass" name="pass"></br></br>
                <label>Email: </label>
                <input type="text" id="email" name="email"></br></br>
                <input type="submit" id="btn" value="Register" name = "submit"/>
                <p>I have an account <a href="index.php">Login</a> </p>
            </form>
        </div>
        <!-- check if the input is valid/not empty -->
        <script>
            function isvalid(){
                var user = document.form.user.value;
                var pass = document.form.pass.value;
                var email = document.form.email.value;
                if(user.length===0 && pass.length===0 && email.length===0){
                    alert(" Username, password and email field is empty!!!");
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
                else if(email.length===0){
                    alert(" Email field is empty!!!");
                    return false;
                }
                
            }
        </script>
    </body>
</html>