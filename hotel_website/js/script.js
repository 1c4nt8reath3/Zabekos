// Form validation and interactivity for the hotel website

// Login form validation
document.getElementById("loginForm").addEventListener("submit", function (e) {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    e.preventDefault();
    alert("Please fill in all fields.");
    return;
  }

  // Additional client-side validation can be added here
});

// Registration form validation
document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirm_password")
      .value.trim();

    if (!username || !email || !password || !confirmPassword) {
      e.preventDefault();
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      e.preventDefault();
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      e.preventDefault();
      alert("Password must be at least 6 characters long.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      e.preventDefault();
      alert("Please enter a valid email address.");
      return;
    }
  });

// Booking form validation
document.getElementById("bookingForm").addEventListener("submit", function (e) {
  const roomType = document.getElementById("room_type").value;
  const checkIn = document.getElementById("check_in").value;
  const checkOut = document.getElementById("check_out").value;

  if (!roomType || !checkIn || !checkOut) {
    e.preventDefault();
    alert("Please fill in all fields.");
    return;
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();

  if (checkInDate < today) {
    e.preventDefault();
    alert("Check-in date cannot be in the past.");
    return;
  }

  if (checkOutDate <= checkInDate) {
    e.preventDefault();
    alert("Check-out date must be after check-in date.");
    return;
  }
});

// Function to check if user is logged in (for future use)
function checkLoginStatus() {
  // This would typically check a session or cookie
  // For now, we'll assume the user needs to be redirected to login if not authenticated
  // This can be enhanced with AJAX calls to check session status
}

// Add any additional interactivity here
// For example, dynamic room price calculation based on dates
document
  .getElementById("check_in")
  .addEventListener("change", updateTotalPrice);
document
  .getElementById("check_out")
  .addEventListener("change", updateTotalPrice);
document
  .getElementById("room_type")
  .addEventListener("change", updateTotalPrice);

function updateTotalPrice() {
  const roomType = document.getElementById("room_type").value;
  const checkIn = document.getElementById("check_in").value;
  const checkOut = document.getElementById("check_out").value;

  if (!roomType || !checkIn || !checkOut) return;

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil(
    (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24),
  );

  let pricePerNight = 0;
  switch (roomType) {
    case "Single":
      pricePerNight = 100;
      break;
    case "Double":
      pricePerNight = 150;
      break;
    case "Suite":
      pricePerNight = 250;
      break;
    case "Family":
      pricePerNight = 200;
      break;
  }

  const totalPrice = nights * pricePerNight;

  // Display total price (you might want to add a span in the HTML for this)
  const totalElement = document.getElementById("total-price");
  if (totalElement) {
    totalElement.textContent = `Total: $${totalPrice}`;
  }
}
