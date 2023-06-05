<?php
$dbconfig = parse_ini_file("../.env");
$db_host = $dbconfig["DB_HOST"];
$db_user = $dbconfig["DB_USER"];
$db_pass = $dbconfig["DB_PW"];
$db_name = $dbconfig["DB_NAME"];


$link = new mysqli($db_host, $db_user, $db_pass, $db_name);
$charset = "utf8";
$link->set_charset($charset);