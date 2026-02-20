<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = sanitizeInput($_POST['username']);
    $password = $_POST['password'];

    // Validation
    $errors = [];

    if (empty($username)) {
        $errors[] = "Username is required.";
    }

    if (empty($password)) {
        $errors[] = "Password is required.";
    }

    if (empty($errors)) {
        $conn = getDBConnection();

        // Get user from database
        $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 1) {
            $user = $result->fetch_assoc();

            // Verify password
            if (password_verify($password, $user['password'])) {
                // Login successful, start session
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $username;

                // Redirect to booking page or home
                header("Location: ../book.html?success=1");
                exit();
            } else {
                $errors[] = "Invalid username or password.";
            }
        } else {
            $errors[] = "Invalid username or password.";
        }

        $stmt->close();
        $conn->close();
    }

    // If there are errors, redirect back with errors
    if (!empty($errors)) {
        $error_string = implode("&error[]=", $errors);
        header("Location: ../login.html?error[]=" . urlencode($error_string));
        exit();
    }
} else {
    // If not POST request, redirect to login page
    header("Location: ../login.html");
    exit();
}
?>
