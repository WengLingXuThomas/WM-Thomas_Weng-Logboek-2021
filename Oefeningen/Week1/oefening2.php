<!DOCTYPE html>
<html>
<body>
    <?php
    echo "<h1>Assortiment</h1>";
    ?>
    <style>
        .rij{
            clear: both;
            float: left;
            margin-left: 0.25em;
            margin-right: 0.25em;
        }
        .kolom1, .kolom3{
            display: inline-block;
            width: 3em;
            background-color: lightblue;
        }
        .kolom2, .kolom4{
            display: inline-block;
            width: 15em;
            background-color: lightcyan;
        }
    </style>
    <?php
    // verbinding maken met databank
    $servername = "ftp.mydomain-lingxube.webhosting.be";
    $username ="ID328937_mydb";
    $password ="E4ZUvb72X6vz!Ug";
    $dbname ="ID328937_mydb";

    // connectie maken

    $conn = mysqli_connect($servername, $username, $password, $dbname) or die
    (mysqli_connect_error());

    function fetchData($sql, $conn){

        $return = array();
        if(!$conn){
            die("geen verbinding");
        }else{
            $result = $conn -> query($sql);
            while ($row = $result -> fetch_assoc()){
                $return[count($return)] = $row;
            }
        }
        return $return;
    }

    $resultaat = fetchData("SELECT p.pr_id, p.pr_naam, p.pr_prijs, c.ct_naam FROM Producten p INNER JOIN Categorieen c ON p.pr_ct_id = c.ct_id", $conn);

    echo "<span class = 'rij'>
    <span class='kolom1'>ID</span>
    <span class='kolom2'>PRODUCT</span>
    <span class ='kolom3'>PRIJS</span>
    <span class ='kolom4'>CATEGORIE</span>
    </span>";

    for ($i=0; $i < count($resultaat); $i++) { 
        echo "<span class = 'rij'>
        <span class='kolom1'>".$resultaat[$i]["pr_id"]."</span>
        <span class='kolom2'>".$resultaat[$i]["pr_naam"]."</span>
        <span class ='kolom3'>€ ".$resultaat[$i]["pr_prijs"]."</span>
        <span class ='kolom4'>".$resultaat[$i]["ct_naam"]."</span>
        </span>";
    }
    
    ?>
    <div>
        <p>Product toevoegen</p>
        <form action="form.php" method="post">
        Product naam: <input type="text" name="name"><br>
        Prijs: <input type="text" name="prijs"><br>
        Categorie: <input type="text" name="categorie"><br>
        <input value= "toevoegen" type="submit">
        </form>
    </div>
</body>
</html>