
    <?php
        $servername = "ftp.mydomain-lingxube.webhosting.be";
        $username ="ID328937_mydb";
        $password ="E4ZUvb72X6vz!Ug";
        $dbname ="ID328937_mydb";
    
        $conn = mysqli_connect($servername, $username, $password, $dbname) or die
        (mysqli_connect_error());
        
        function InsertData($sql, $conn){
            if(!$conn){
                die("geen verbinding");
            }else{
                if ($conn->query($sql) === TRUE) {
                    echo '<script type="text/javascript">';
                    echo ' alert("New record created successfully")';
                    echo '</script>';
                  } else {
                    echo "Error: " . $sql . "<br>" . $conn->error;
                    echo '<script type="text/javascript">';
                    echo ' alert("Error: "'.$sql. "<br>". $conn->error.")";
                    echo '</script>';
                  }
                  $conn->close();
            }
        }
    $pr_naam =$_POST['name'];
    $pr_prijs =$_POST['prijs'];
    $pr_categorie =$_POST['categorie'];

    $insertQuery = "INSERT INTO `Producten` (`pr_id`, `pr_naam`, `pr_prijs`, `pr_ct_id`) VALUES (NULL, '$pr_naam', '$pr_prijs', '$pr_categorie');";

    InsertData($insertQuery,$conn)
    ?>