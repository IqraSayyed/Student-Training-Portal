// Get HTML elements
const studentForm = document.getElementById("studentForm");
const formMessage = document.getElementById("formMessage");
const studentList = document.getElementById("studentList");
const studentCount = document.getElementById("studentCount");

const searchStudent = document.getElementById("searchStudent");
const filterCourse = document.getElementById("filterCourse");


// Array to store student data
let students = JSON.parse(localStorage.getItem("students")) || [];


// When the registration form is submitted
studentForm.addEventListener("submit", function (event) {

    // Prevent page from refreshing
    event.preventDefault();


    // Get values entered in the form
    const name = document.getElementById("studentName").value.trim();

    const email = document.getElementById("studentEmail").value.trim();

    const mobile = document.getElementById("studentMobile").value.trim();

    const course = document.getElementById("studentCourse").value;


    // Check empty fields
    if (
        name === "" ||
        email === "" ||
        mobile === "" ||
        course === ""
    ) {

        showMessage("Please fill in all fields.", "red");

        return;
    }


    // Email validation
    if (!email.includes("@") || !email.includes(".")) {

        showMessage(
            "Please enter a valid email address.",
            "red"
        );

        return;
    }


    // Mobile number validation
    if (!/^[0-9]{10}$/.test(mobile)) {

        showMessage(
            "Mobile number must contain exactly 10 digits.",
            "red"
        );

        return;
    }


    // Create a student object
    const student = {

        id: Date.now(),

        name: name,

        email: email,

        mobile: mobile,

        course: course
    };


    // Add student to the students array
    students.push(student);

    localStorage.setItem("students", JSON.stringify(students));

    // Display all students
    displayStudents();


    // Show success message
    showMessage(
        "Student registered successfully!",
        "green"
    );


    // Clear the form
    studentForm.reset();

});


function displayStudents() {

    // Clear old student cards
    studentList.innerHTML = "";

    // Get search text
    const searchValue = searchStudent.value.toLowerCase();

    // Get selected course
    const selectedCourse = filterCourse.value;


    // Filter students by name and course
    const filteredStudents = students.filter(function (student) {

        const matchesName = student.name
            .toLowerCase()
            .includes(searchValue);

        const matchesCourse =
            selectedCourse === "All" ||
            student.course === selectedCourse;

        return matchesName && matchesCourse;
    });


    // Display filtered students using map()
    filteredStudents.map(function (student) {

        const studentCard = document.createElement("div");

        studentCard.classList.add("student-card");

        studentCard.innerHTML = `

            <h3>${student.name}</h3>

            <p>
                <strong>Email:</strong> ${student.email}
            </p>

            <p>
                <strong>Mobile:</strong> ${student.mobile}
            </p>

            <p>
                <strong>Course:</strong> ${student.course}
            </p>

            <div class="student-actions">

                <button
                    class="edit-btn"
                    onclick="editStudent(${student.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteStudent(${student.id})">
                    Delete
                </button>

            </div>

        `;

        studentList.appendChild(studentCard);
    });


    // Count total students using reduce()
    const totalStudents = students.reduce(
        function (total) {
            return total + 1;
        },
        0
    );

    studentCount.textContent = totalStudents;
}


// Function to display form messages
function showMessage(message, color) {

    formMessage.textContent = message;

    formMessage.style.color = color;

}

// Delete a student
function deleteStudent(id) {

    students = students.filter(function (student) {
        return student.id !== id;
    });

    localStorage.setItem("students", JSON.stringify(students));

    displayStudents();

    showMessage(
        "Student deleted successfully!",
        "red"
    );
}

// Edit a student
function editStudent(id) {

    const student = students.find(function (student) {
        return student.id === id;
    });

    document.getElementById("studentName").value =
        student.name;

    document.getElementById("studentEmail").value =
        student.email;

    document.getElementById("studentMobile").value =
        student.mobile;

    document.getElementById("studentCourse").value =
        student.course;


    // Remove old student before updating
    students = students.filter(function (student) {
        return student.id !== id;
    });


    displayStudents();

    showMessage(
        "Update the details and click Register Student.",
        "#2563eb"
    );


    // Scroll back to registration form
    document
        .getElementById("studentForm")
        .scrollIntoView({
            behavior: "smooth"
        });
}

// Search students when user types
searchStudent.addEventListener("input", function () {
    displayStudents();
});


// Filter students when course changes
filterCourse.addEventListener("change", function () {
    displayStudents();
});

// Display saved students when the page loads
displayStudents();

// ===== DARK / LIGHT THEME =====

const themeToggle = document.getElementById("themeToggle");

// Get saved theme
const savedTheme = localStorage.getItem("theme");

// Apply saved theme when page loads
if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
}

// Change theme when button is clicked
themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️";

    } else {

        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙";

    }
});

// ===== FETCH API =====

const apiUserList = document.getElementById("apiUserList");

// Fetch user data from public API
fetch("https://jsonplaceholder.typicode.com/users")
    .then(function (response) {

        // Check if the response is successful
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        return response.json();
    })

    .then(function (users) {

        // Display first 6 users
        users.slice(0, 6).forEach(function (user) {

            const userCard = document.createElement("div");

            userCard.classList.add("api-user-card");

            userCard.innerHTML = `
                <h3>${user.name}</h3>

                <p>
                    <strong>Email:</strong>
                    ${user.email}
                </p>

                <p>
                    <strong>City:</strong>
                    ${user.address.city}
                </p>

                <p>
                    <strong>Company:</strong>
                    ${user.company.name}
                </p>
            `;

            apiUserList.appendChild(userCard);
        });
    })

    .catch(function (error) {

        apiUserList.innerHTML =
            "<p>Unable to load API data. Please try again later.</p>";

        console.error("API Error:", error);
    });