<?php
session_start();

if (isset($_POST["sicherheitscode"]) && $_POST["sicherheitscode"] == $_SESSION['captcha_spam']) {
    unset($_SESSION['captcha_spam']); // Captcha-Sitzung löschen

    // Sende eine Erfolgsmeldung zurück oder leite weiter
    echo "success";
} else {
    // Sende eine Fehlermeldung zurück
    echo "error";
}
?>