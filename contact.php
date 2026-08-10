<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // ফর্মের ডেটা সংগ্রহ
    $name = isset($_POST['Name']) ? $_POST['Name'] : '';
    $email = isset($_POST['Email']) ? $_POST['Email'] : '';
    $interest = isset($_POST['Interest']) ? $_POST['Interest'] : '';
    $message = isset($_POST['Message']) ? $_POST['Message'] : '';
    
    // ভ্যালিডেশন
    if (empty($name) || empty($email) || empty($message)) {
        echo "error";
        exit;
    }
    
    // ইমেইল ঠিকানা
    $to = "info@alhazmarine.com";
    $subject = "New Inquiry from " . $name;
    
    // ইমেইল বডি
    $body = "===========================================\n";
    $body .= "NEW INQUIRY FROM ALHAZ MARINE WEBSITE\n";
    $body .= "===========================================\n\n";
    $body .= "Name: " . $name . "\n";
    $body .= "Email: " . $email . "\n";
    $body .= "Interest: " . $interest . "\n\n";
    $body .= "Message:\n" . $message . "\n";
    $body .= "\n-------------------------------------------\n";
    $body .= "Sent from: " . $_SERVER['HTTP_HOST'] . "\n";
    $body .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
    $body .= "Date: " . date('Y-m-d H:i:s') . "\n";
    
    // হেডার
    $headers = "From: " . $email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    
    // ইমেইল পাঠান
    if (mail($to, $subject, $body, $headers)) {
        echo "success";
    } else {
        // লগ তৈরি করুন (যদি ইমেইল না যায়)
        error_log("Mail failed to: $to from: $email");
        echo "error";
    }
} else {
    // সরাসরি PHP ফাইল ওপেন করলে
    header("Location: index.html");
    exit;
}
?>