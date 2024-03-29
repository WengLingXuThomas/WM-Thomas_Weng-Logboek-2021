<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// de vars ophalen die via POST meegestuurd zijn
// $_POST werkt niet als de data via Volley gestuurd is :-(
// Dit is nodig wanneer je native Android gebruikt.

$body = file_get_contents('php://input');
$postvars = json_decode($body, true);
$id = $postvars["id"];
$table = $postvars["table"];
$bewerking = $postvars["bewerking"];

// het volgende is ook nodig als we met F7 ipv jquery werken :
$PR_CT_ID = $postvars["PR_CT_ID"];
$PR_naam = $postvars["PR_naam"];
$prijs = $postvars["prijs"];



// de volgende lijnen zijn zodat we ook vanuit gewone
// ajax requests met POST kunnen werken.
//if($id == null || $id == ''){
    if(isset($_POST['id'])){
        $id = $_POST['id'];
    }
//}
//if($table == null || $itable == ''){
    if(isset($_POST['table'])){
        $table = $_POST['table'];
    }
//}
//if($bewerking == null || $bewerking == ''){
    if(isset($_POST['bewerking'])){
        $bewerking = $_POST['bewerking'];
    }
//}


// De volgende tests dienen enkel om de php
// pagina te testen in de browser door er GET variabelen aan
// mee te geven. 
// Als alternatief kan je werken met een POST formulier dat
// deze pagina aanspreekt.
// Haal deze weg in productie omgevingen.

/* 
if(!isset($postvars["id"])){
    $id = $_GET['id'];
}
if(!isset($postvars["table"])){
    $table = $_GET['table'];
}
if(!isset($postvars["bewerking"])){
    $bewerking = $_GET['bewerking'];
}

 */

if (isset($id) || isset($table) || isset($bewerking)) {
    //echo json_encode($_POST['id']);
} else {
    if (!empty($postvars)) {

    } else {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            //die('{"POSTed":' . json_encode($_POST) . ',"postvars":'. json_encode($postvars) .'}');
        } else {
            die('{"error":"Geen POST","status":"fail"}');
        }

    }

}

if (isset($bewerking) && isset($table)) {
    if($table !== 'producten2' && $table !== 'categorieen'){
        // table mag enkel 1 van deze 2 zijn
        die('{"error":"wrong table","status":"fail"}');
    }
} else {
    die('{"error":"missing data","table":"'. $table. '", "bewerking":"' . $bewerking . '","status":"fail"}');
}

// de DB connectie leggen
require "dbcon.php";

// Check connection
if (!$conn) {
    die('{"error":"Connection failed","mysqlError":"' . json_encode($conn -> error) .'","status":"fail"}');
} else {
    if ($bewerking == "get") {
        // Haal de lijst met producten of categorieën op.
        // Een verbetering voor deze bewerking, zou het uitsplitsen zijn van 'get' naar:
        // - getAll
        // - getOne
        // Dan moet je niet meer apart testen op $id 
        if($id == null){
            // prepare statement
            if(!($stmt = $conn -> prepare("SELECT * FROM $table"))){
                die('{"error":"Prepared Statement failed","errNo":"' . json_encode($conn -> errno) .'",mysqlError":"' . json_encode($conn -> error) .'","status":"fail"}');
            }
        } else {
            // prepare statement
            if(!($stmt = $conn -> prepare("SELECT * FROM $table where PR_ID = ?"))){
                die('{"error":"Prepared Statement failed","errNo":"' . json_encode($conn -> errno) .'",mysqlError":"' . json_encode($conn -> error) .'","status":"fail"}');
            }
        }

        if($id !== null){
            // bind parameters
            // s staat voor string
            // i staat voor integer
            // d staat voor double
            // b staat voor blob
            if(!$stmt -> bind_param("i", $id)){
                die('{"error":"Prepared Statement bind failed","errNo":"' . json_encode($conn -> errno) .'",mysqlError":"' . json_encode($conn -> error) .'","status":"fail"}');
            }
        }
        if(!$stmt -> execute()){
            die('{"error":"Prepared Statement execute failed","errNo":"' . json_encode($conn -> errno) .'",mysqlError":"' . json_encode($conn -> error) .'","status":"fail"}');
        }
        $result = $stmt->get_result();

        // maak van de inhoud van deze result een json object waarvan
        // ook in android de juiste gegeventypes herkend worden
        $return = getJsonObjFromResult($result);
        // maak geheugenresources vrij :
        mysqli_free_result($result);
        // sluit het prepared statement
        $stmt -> close();
        // return het resultaat
        die($return);

    } elseif ($bewerking == "delete") {
        // verwijder data
        if ($id === null) {
            die('{"error":"missing data","status":"fail"}');
        }
        // prepare statement
        if(!($stmt = $conn -> prepare("delete FROM $table where PR_ID = ?"))){
            die('{"error":"Prepared Statement failed","errNo":"' . json_encode($conn -> errno) .'",mysqlError":"' . json_encode($conn -> error) .'","status":"fail"}');
        }
        // bind parameters
        if(!$stmt -> bind_param("i", $id)){
            die('{"error":"Prepared Statement bind failed","errNo":"' . json_encode($conn -> errno) .'","mysqlError":"' . json_encode($conn -> error) .'","status":"fail"}');
        }
        // execute statement
        if(!$stmt-> execute()){
            // delete failed
            $stmt -> close();
            die('{"error":"Prepared Statement failed","errNo":"' . json_encode($conn -> errno) .'","mysqlError":"' . json_encode($conn -> error) .'","status":"fail"}');
        }
        // record successfully deleted
        $stmt -> close();
        die('{"data":"ok","message":"Record deleted successfully","status":"ok"}');
        
    } elseif ($bewerking == "add") {

        /* De volgende lijnen zijn in commentaar geplaatst omdat de methode die we bij
           framework7 gebruikte, de form data niet als POST verzond. (De variabelen 
           zitten niet in de $_POST variabele)
           Om een idee te geven van wat je wel kan doen als je wel met POST verzendt,
           staan de lijnen hieronder nog in commentaar.
           Let hierbij ook naar de code op lijnen 18 tot 20. 
           */
        //$PR_naam = null;
        //$PR_CT_ID = null;
        //$prijs = null;
        //if (isset($_POST['PR_naam']) && isset($_POST['PR_CT_ID'])
        //&& isset($_POST['prijs'])) {
        if ($PR_naam && $PR_CT_ID && $prijs) {  
            // hier kan je extra controle plaatsen om ongewenste input te voorkomen
            $PR_naam = htmlentities($PR_naam);
            
            //$PR_CT_ID = $_POST['PR_CT_ID'];
            //$prijs = $_POST['prijs'];
            if($PR_naam === null || $PR_CT_ID === null || $prijs === null) {
                die('{"error":"missing data","status":"fail"}');
            }
        } else {
            die('{"error":"missing data","status":"fail","PR_naam":"'.$PR_naam.'","PR_CT_ID":"'.$PR_CT_ID.'","prijs":"'.$prijs.'"}');
        }
        // product toevoegen
        if(!$stmt = $conn->prepare("insert into producten2 (PR_naam, PR_CT_ID, prijs) values(?,?,?)")){
            die('{"error":"Prepared Statement failed","errNo":"' . json_encode($conn -> errno) .'","mysqlError":"' . json_encode($conn -> error) .'","status":"fail"}');
        }
        // bind parameters
        // s staat voor string
        // i staat voor integer
        // d staat voor double
        // b staat voor blob
        // "sid" staat dus voor string, integer, double
        if(!$stmt -> bind_param("sid", $PR_naam, $PR_CT_ID, $prijs)){
            die('{"error":"Prepared Statement bind failed","errNo":"' . json_encode($conn -> errno) .'","mysqlError":"' . json_encode($conn -> error) .'","status":"fail"}');
        }
        if(!$stmt -> execute()) {
            // add failed
            $stmt -> close();
            die('{"error":"Prepared Statement failed","errNo":"' . json_encode($conn -> errno) .'","mysqlError":"' . json_encode($conn -> error) .'","status":"fail"}');
        }
        // added
        $stmt -> close();
        die('{"data":"ok","message":"Record added successfully","status":"ok"}');

    } elseif ($bewerking == "modify") {

        if ($id && $PR_naam && $PR_CT_ID && $prijs) {  
         
            $PR_naam = htmlentities($PR_naam);
            
            //$PR_CT_ID = $_POST['PR_CT_ID'];
            //$prijs = $_POST['prijs'];
            if($id === "" || $PR_naam === "" || $PR_CT_ID === "" || $prijs === "") {
                die('{"error":"missing data","status":"fail"}');
            }
        } else {
            die('{"error":"missing data","status":"fail","PR_ID":"'.$id.'","PR_naam":"'.$PR_naam.'","PR_CT_ID":"'.$PR_CT_ID.'","prijs":"'.$prijs.'"}');
        }
        // product wijzigen
        
        if(!$stmt = $conn -> prepare("update $table set PR_CT_ID = ?, PR_naam = ?, prijs = ? where PR_ID = ?")){
            die('{"error":"Prepared Statement failed","errNo":"' . json_encode($conn -> errno) .'","mysqlError":"' . json_encode($conn -> error) .'","status":"fail"}');
        }
        // bind parameters
        // s staat voor string
        // i staat voor integer
        // d staat voor double
        // b staat voor blob
        // "sid" staat dus voor string, integer, double
        if(!$stmt -> bind_param("isdi", $PR_CT_ID, $PR_naam, $prijs, $id)){
            die('{"error":"Prepared Statement bind failed ","errNo":"' . json_encode($conn -> errno) .'","mysqlError":"' . json_encode($conn -> error) .'","status":"fail"}');
        }
        if(!$stmt -> execute()) {
            // modify failed
            $stmt -> close();
            die('{"error":"Prepared Statement failed","errNo":"' . json_encode($conn -> errno) .'","mysqlError":"' . json_encode($conn -> error) .'","status":"fail"}');
        }
        // modified
        $stmt -> close();
        die('{"data":"ok","message":"Record successfully modified","status":"ok"}');
    }else {
        die(json_encode('{"error":"Unknown argument","arg":"' . json_encode($bewerking) .'","status":"fail"}'));
    }

}

function getJsonObjFromResult(&$result){
    // de & voor de parameter zorgt er voor dat we de de parameter
    // by reference doorgeven, waardoor deze niet gekopieerd word
    // naar een nieuwe variabele voor deze functie.

    $fixed = array();
    
    $typeArray = array(
                    MYSQLI_TYPE_TINY, MYSQLI_TYPE_SHORT, MYSQLI_TYPE_INT24,    
                    MYSQLI_TYPE_LONG, MYSQLI_TYPE_LONGLONG,
                    MYSQLI_TYPE_DECIMAL, 
                    MYSQLI_TYPE_FLOAT, MYSQLI_TYPE_DOUBLE );
    $fieldList = array();
    // haal de veldinformatie van de velden in deze resultset op
    while($info = $result->fetch_field()){
        $fieldList[] = $info;
    }
    // haal de data uit de result en pas deze aan als het veld een
    // getaltype zou moeten bevatten
    while ($row = $result -> fetch_assoc()) {
        $fixedRow = array();
        $teller = 0;

        foreach ($row as $key => $value) {
            if (in_array($fieldList[$teller] -> type, $typeArray )) {
                $fixedRow[$key] = 0 + $value;
            } else {
                $fixedRow[$key] = $value;
            }
            $teller++;
        }
        $fixed[] = $fixedRow;
    }

    // geef een json object terug
    return '{"data":'.json_encode($fixed).',"status":"ok"}';
}
?>
