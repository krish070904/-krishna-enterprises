<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $inquiry = htmlspecialchars($_POST['inquiry']);
    $message = htmlspecialchars($_POST['message']);

    $to = "your_email@example.com"; // Replace with your email
    $subject = "New Contact Form Submission";
    $body = "
        You have received a new message from your contact form.\n\n
        Name: $name\n
        Email: $email\n
        Inquiry: $inquiry\n
        Message:\n$message
    ";
    $headers = "From: $email";

    if (mail($to, $subject, $body, $headers)) {
        echo "success";
    } else {
        echo "error";
    }
} else {
    header("Location: contact.html"); // Redirect back to the contact page if accessed directly
    exit;
}
?>
