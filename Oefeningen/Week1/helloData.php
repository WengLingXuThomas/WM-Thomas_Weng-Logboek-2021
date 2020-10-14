<?php
echo "<h1> Hallo odisee!</h1>";
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
    .kolom2{
        display: inline-block;
        width: 15em;
        background-color: darkcyan;
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

$resultaat = fetchData("SELECT * from test", $conn);

for ($i=0; $i < count($resultaat); $i++) { 
    echo "<span class = 'rij'>
    <span class='kolom1'>".$resultaat[$i]["id"]."</span>
    <span class='kolom2'>".$resultaat[$i]["datum"]."</span>
    <span class ='kolom3'>".$resultaat[$i]["aantal"]."</span>
    </span>";
}
?>