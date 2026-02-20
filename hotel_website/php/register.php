<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = sanitizeInput($_POST['username']);
    $email = sanitizeInput($_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    // Validation
    $errors = [];

    if (empty($username)) {
        $errors[] = "Username is required.";
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Valid email is required.";
    }

    if (empty($password)) {
        $errors[] = "Password is required.";
    } elseif (strlen($password) < 6) {
        $errors[] = "Password must be at least 6 characters long.";
    }

    if ($password !== $confirm_password) {
        $errors[] = "Passwords do not match.";
    }

    if (empty($errors)) {
        $conn = getDBConnection();

        // Check if username or email already exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $stmt->bind_param("ss", $username, $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $errors[] = "Username or email already exists.";
        } else {
            // Hash password
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);

            // Insert new user
            $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $username, $email, $hashed_password);

            if ($stmt->execute()) {
                // Registration successful, redirect to login
                header("Location: ../login.html?success=1");
                exit();
            } else {
                $errors[] = "Registration failed. Please try again.";
            }
        }

        $stmt->close();
        $conn->close();
    }

    // If there are errors, redirect back with errors
    if (!empty($errors)) {
        $error_string = implode("&error[]=", $errors);
        header("Location: ../register.html?error[]=" . urlencode($error_string));
        exit();
    }
} else {
    // If not POST request, redirect to register page
    header("Location: ../register.html");
    exit();
}
?>
