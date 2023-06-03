<?php

/**
 * @author Fred
 */
function login($user, $pass, $link)
{
    $req = $link->prepare("SELECT * FROM user WHERE name = ? AND password = ?");
    $req->bind_param("ss", $user, $pass);
        
    $req->execute();

    $result = $req->get_result();

    if($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        $_SESSION["ID_user"] = $user["id"];
        echo json_encode(array("success" => "Utilisateur OK", "user" => $user));   
    }
    else {
        echo json_encode(array("error" => "Utilisateur non valide!"));   
    }
}