<?php

/**
 * Function that check user if they exist </br>
 * check the password
 * @author Fred
 */
function login($user, $pass, $link)
{

    $req = $link->prepare("SELECT * FROM user WHERE name = ?");
    $req->bind_param("s", $user);

    $req->execute();

    $result = $req->get_result();

    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        if (password_verify($pass, $user["password"])) {
            // Password verification successful
            $_SESSION["ID_user"] = $user["id"];
            echo json_encode(array("success" => "Utilisateur OK", "user" => $user));
        } else {
            // Password verification failed
            echo json_encode(array("error" => "Incorrect password!"));
        }
    } else {
        echo json_encode(array("error" => "Invalid user or incorrect password!"));
    }
}

/**
 * Create a secured hashed password
 */
function hashUserPassword($user, $pass, $link)
{
    $hashedPassword = password_hash($pass, PASSWORD_BCRYPT);
    $req = $link->prepare("UPDATE user SET password = ? WHERE name = ? ");
    $req->bind_param("ss", $hashedPassword, $user);

    $req->execute();
}

function fetchReservation($link)
{
    $req = $link->prepare("SELECT *, c.name AS c_name FROM reservation AS r"
        . " LEFT JOIN chalets AS c ON c.id = r.chalet_id"
        . " LEFT JOIN reservation_status AS rs ON rs.id = r.status_id");
    $req->execute();
    $result = $req->get_result();

    if ($result->num_rows >= 1) {
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode(array("rsv" => $data));
    } else {
        echo json_encode(array("error" => "No data Found!"));
    }
}
