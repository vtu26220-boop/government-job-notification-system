const API = "http://localhost:8080/api";

// ================= SAMPLE JOBS IF DATABASE EMPTY =================
const sampleJobs = [
    { id: 1, title: "Electrician", category: "Technical", eligibility: "ITI / Diploma", examDate: "2026-05-10", deadline: "2026-04-30", description: "Electrician job opening in government department.", status: "APPROVED" },
    { id: 2, title: "Police Constable", category: "Police", eligibility: "10th / 12th Pass", examDate: "2026-06-01", deadline: "2026-05-15", description: "Police constable recruitment notification.", status: "APPROVED" },
    { id: 3, title: "Bank Clerk", category: "Banking", eligibility: "Any Degree", examDate: "2026-05-20", deadline: "2026-05-01", description: "Bank clerk government recruitment.", status: "APPROVED" },
    { id: 4, title: "Railway Technician", category: "Railway", eligibility: "ITI / Diploma", examDate: "2026-07-12", deadline: "2026-06-20", description: "Railway technician vacancy notification.", status: "APPROVED" },
    { id: 5, title: "Junior Assistant", category: "State Government", eligibility: "Any Degree", examDate: "2026-08-05", deadline: "2026-07-10", description: "Junior assistant recruitment notification.", status: "APPROVED" },
    { id: 6, title: "Government Teacher", category: "Education", eligibility: "B.Ed / D.Ed", examDate: "2026-09-01", deadline: "2026-08-10", description: "Teacher recruitment for government schools.", status: "APPROVED" }
];

// ================= REGISTER =================
function register() {
    const name = document.getElementById("name")?.value;
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    const confirmPassword = document.getElementById("confirmPassword")?.value;
    const terms = document.getElementById("terms");

    if (!name || !email || !password) {
        alert("Please fill all required fields");
        return;
    }

    if (confirmPassword !== undefined && confirmPassword !== "" && password !== confirmPassword) {
        alert("Password and Confirm Password do not match");
        return;
    }

    if (terms && !terms.checked) {
        alert("Please accept Terms & Conditions");
        return;
    }

    fetch(API + "/auth/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, email, password })
    })
    .then(res => res.json())
    .then(data => {
        alert("Registration successful");
        window.location.href = "login.html";
    })
    .catch(err => {
        alert("Registration failed");
        console.log(err);
    });
}

// ================= LOGIN =================
function login() {
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    fetch(API + "/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data && data.id) {
            localStorage.setItem("userId", data.id);
            localStorage.setItem("name", data.name);
            localStorage.setItem("email", data.email);
            localStorage.setItem("role", data.role);

            if (data.role === "ADMIN") {
                window.location.href = "admin.html";
                return;
            }

            const savedJobId = localStorage.getItem("applyJobId");

            if (savedJobId) {
                localStorage.removeItem("applyJobId");
                window.location.href = "dashboard.html?apply=" + savedJobId;
            } else {
                window.location.href = "dashboard.html";
            }
        } else {
            alert("Invalid email or password");
        }
    })
    .catch(err => {
        alert("Login failed");
        console.log(err);
    });
}

// ================= LOAD JOBS =================
function loadJobs() {
    fetch(API + "/jobs/approved")
    .then(res => res.json())
    .then(data => {
        if (!data || data.length === 0) {
            showJobs(sampleJobs);
        } else {
            showJobs(data);
        }

        autoOpenApplyForm();
    })
    .catch(err => {
        console.log("Backend jobs not loaded, showing sample jobs", err);
        showJobs(sampleJobs);
        autoOpenApplyForm();
    });
}

function showJobs(data) {
    const jobsBox = document.getElementById("jobs");
    if (!jobsBox) return;

    let html = "";

    data.forEach(job => {
        html += `
            <div class="job-card">
                <h3>${job.title}</h3>
                <p><b>Category:</b> ${job.category}</p>
                <p><b>Eligibility:</b> ${job.eligibility}</p>
                <p><b>Exam Date:</b> ${job.examDate}</p>
                <p><b>Deadline:</b> ${job.deadline}</p>
                <p>${job.description}</p>
                <button onclick="openApplyForm(${job.id})">Apply Now</button>
            </div>
        `;
    });

    jobsBox.innerHTML = html;
}

// ================= SEARCH CATEGORY =================
function searchCategory() {
    const category = document.getElementById("search")?.value;

    if (!category) {
        loadJobs();
        return;
    }

    fetch(API + "/jobs/category/" + category)
    .then(res => res.json())
    .then(data => {
        if (!data || data.length === 0) {
            const filtered = sampleJobs.filter(job =>
                job.category.toLowerCase().includes(category.toLowerCase())
            );
            showJobs(filtered);
        } else {
            showJobs(data.filter(job => job.status === "APPROVED"));
        }
    })
    .catch(err => {
        const filtered = sampleJobs.filter(job =>
            job.category.toLowerCase().includes(category.toLowerCase())
        );
        showJobs(filtered);
    });
}

// ================= OPEN APPLICATION FORM =================
function openApplyForm(jobId) {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        localStorage.setItem("applyJobId", jobId);
        window.location.href = "login.html";
        return;
    }

    const modal = document.getElementById("applyModal");
    const applyJobId = document.getElementById("applyJobId");
    const appEmail = document.getElementById("appEmail");

    if (!modal || !applyJobId) {
        window.location.href = "dashboard.html?apply=" + jobId;
        return;
    }

    applyJobId.value = jobId;
    modal.style.display = "block";

    if (appEmail) {
        appEmail.value = localStorage.getItem("email") || "";
    }
}

// ================= AUTO OPEN FORM AFTER LOGIN =================
function autoOpenApplyForm() {
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get("apply");

    if (jobId && localStorage.getItem("userId")) {
        setTimeout(() => {
            openApplyForm(jobId);
        }, 400);
    }
}

// ================= CLOSE APPLICATION FORM =================
function closeApplyForm() {
    const modal = document.getElementById("applyModal");
    if (modal) modal.style.display = "none";
}

// ================= SHOW EXPERIENCE BOX =================
function showExperienceBox() {
    const exp = document.getElementById("hasExperience")?.value;
    const expBox = document.getElementById("experienceDetails");

    if (!expBox) return;

    if (exp === "Yes") {
        expBox.style.display = "block";
    } else {
        expBox.style.display = "none";
        expBox.value = "";
    }
}

// ================= SUBMIT APPLICATION =================
function submitApplication() {
    const application = {
        userId: localStorage.getItem("userId"),
        jobId: document.getElementById("applyJobId")?.value,
        firstName: document.getElementById("firstName")?.value,
        middleName: document.getElementById("middleName")?.value,
        lastName: document.getElementById("lastName")?.value,
        email: document.getElementById("appEmail")?.value,
        whatsappNo: document.getElementById("whatsappNo")?.value,
        gender: document.getElementById("gender")?.value,
        currentStatus: document.getElementById("currentStatus")?.value,
        hasExperience: document.getElementById("hasExperience")?.value,
        experienceDetails: document.getElementById("experienceDetails")?.value,
        qualification: document.getElementById("qualification")?.value,
        address: document.getElementById("address")?.value
    };

    if (!application.userId) {
        window.location.href = "login.html";
        return;
    }

    if (
        !application.firstName ||
        !application.lastName ||
        !application.email ||
        !application.whatsappNo ||
        !application.gender ||
        !application.currentStatus ||
        !application.hasExperience ||
        !application.qualification ||
        !application.address
    ) {
        alert("Please fill all required details");
        return;
    }

    fetch(API + "/applications/apply", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(application)
    })
    .then(res => res.json())
    .then(data => {
        alert("Application submitted successfully");
        closeApplyForm();
    })
    .catch(err => {
        alert("Application failed");
        console.log(err);
    });
}

// ================= ADMIN ADD JOB =================
function addJob() {
    const job = {
        title: document.getElementById("title")?.value,
        category: document.getElementById("category")?.value,
        eligibility: document.getElementById("eligibility")?.value,
        examDate: document.getElementById("examDate")?.value,
        deadline: document.getElementById("deadline")?.value,
        description: document.getElementById("description")?.value
    };

    if (!job.title || !job.category || !job.eligibility || !job.deadline) {
        alert("Please fill job details");
        return;
    }

    fetch(API + "/jobs/add", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(job)
    })
    .then(res => res.json())
    .then(data => {
        alert("Job added successfully");
        loadAllJobs();
    });
}

// ================= ADMIN LOAD ALL JOBS =================
function loadAllJobs() {
    fetch(API + "/jobs/all")
    .then(res => res.json())
    .then(data => {
        let html = "";

        data.forEach(job => {
            html += `
                <div class="card">
                    <h3>${job.title}</h3>
                    <p><b>Category:</b> ${job.category}</p>
                    <p><b>Eligibility:</b> ${job.eligibility}</p>
                    <p><b>Status:</b> ${job.status}</p>
                    <p><b>Deadline:</b> ${job.deadline}</p>
                    <p>${job.description}</p>
                    <button onclick="approveJob(${job.id})">Approve</button>
                    <button onclick="rejectJob(${job.id})">Reject</button>
                    <button onclick="deleteJob(${job.id})">Delete</button>
                </div>
            `;
        });

        const allJobs = document.getElementById("allJobs");
        if (allJobs) allJobs.innerHTML = html;
    });
}

// ================= APPROVE / REJECT / DELETE =================
function approveJob(id) {
    fetch(API + "/jobs/approve/" + id, { method: "PUT" })
    .then(res => res.json())
    .then(data => {
        alert("Job approved");
        loadAllJobs();
    });
}

function rejectJob(id) {
    fetch(API + "/jobs/reject/" + id, { method: "PUT" })
    .then(res => res.json())
    .then(data => {
        alert("Job rejected");
        loadAllJobs();
    });
}

function deleteJob(id) {
    fetch(API + "/jobs/delete/" + id, { method: "DELETE" })
    .then(res => res.text())
    .then(data => {
        alert("Job deleted");
        loadAllJobs();
    });
}

// ================= PROFILE =================

function loadProfile() {
    const userId = localStorage.getItem("userId");

    fetch(API + "/auth/user/" + userId)
    .then(res => res.json())
    .then(data => {
        const name = data.name || "Not Provided";
        const email = data.email || "Not Provided";
        const role = data.role || "USER";

        if (document.getElementById("pname")) document.getElementById("pname").innerText = name;
        if (document.getElementById("pname2")) document.getElementById("pname2").innerText = name;
        if (document.getElementById("pemail")) document.getElementById("pemail").innerText = email;
        if (document.getElementById("prole")) document.getElementById("prole").innerText = role;
        if (document.getElementById("prole2")) document.getElementById("prole2").innerText = role;
    });
}
// ================= HISTORY =================
function loadHistory() {
    const userId = localStorage.getItem("userId");

    fetch(API + "/applications/user/" + userId)
    .then(res => res.json())
    .then(data => {
        let html = "";

        if (!data || data.length === 0) {
            html = `
                <div class="empty-history">
                    <h2>No Applications Found</h2>
                    <p>You have not applied for any job yet.</p>
                    <button onclick="window.location.href='dashboard.html'">Browse Jobs</button>
                </div>
            `;
        } else {
            data.forEach(app => {
                html += `
                    <div class="application-card">
                        <div class="card-top">
                            <div>
                                <h2>Application #${app.id}</h2>
                                <p>Job ID: ${app.jobId}</p>
                            </div>
                            <span class="status-badge">${app.applicationStatus || "APPLIED"}</span>
                        </div>

                        <div class="app-details">
                            <p><b>Name</b><span>${app.firstName || "Not Provided"} ${app.middleName || ""} ${app.lastName || ""}</span></p>
                            <p><b>Email</b><span>${app.email || "Not Provided"}</span></p>
                            <p><b>WhatsApp</b><span>${app.whatsappNo || "Not Provided"}</span></p>
                            <p><b>Gender</b><span>${app.gender || "Not Provided"}</span></p>
                            <p><b>Current Status</b><span>${app.currentStatus || "Not Provided"}</span></p>
                            <p><b>Experience</b><span>${app.hasExperience || "Not Provided"}</span></p>
                            <p><b>Experience Details</b><span>${app.experienceDetails || "N/A"}</span></p>
                            <p><b>Qualification</b><span>${app.qualification || "Not Provided"}</span></p>
                            <p><b>Address</b><span>${app.address || "Not Provided"}</span></p>
                            <p><b>Applied Date</b><span>${app.appliedDate || "Not Provided"}</span></p>
                        </div>
                    </div>
                `;
            });
        }

        document.getElementById("history").innerHTML = html;
    });
}

// ================= POPUP =================
function showPopup() {
    const popup = document.getElementById("popup");
    if (popup) popup.style.display = "block";
}

function closePopup() {
    const popup = document.getElementById("popup");
    if (popup) popup.style.display = "none";
}

function goHome() {
    window.location.href = "index.html";
}

// ================= LANGUAGE =================
function changeLanguage() {
    const lang = document.getElementById("languageSelect")?.value || "en";
    localStorage.setItem("selectedLanguage", lang);
    applyLanguage(lang);
}

function applyLanguage(lang) {
    const translations = {
        en: { home: "⌂ HOME", jobs: "💼 JOBS", jobfair: "🎓 JOB FAIR", loginBtn: "Login ▼", loginTitle: "Login as Candidate", registerTitle: "Sign Up as Candidate", emailLabel: "E-mail / Mobile Number *", emailPlaceholder: "E-mail / Mobile Number", passwordLabel: "Password *", passwordPlaceholder: "Password", loginOnly: "Login", registerOnly: "Register" },
        ta: { home: "⌂ முகப்பு", jobs: "💼 வேலைகள்", jobfair: "🎓 வேலைவாய்ப்பு முகாம்", loginBtn: "உள்நுழை ▼", loginTitle: "விண்ணப்பதாரர் உள்நுழைவு", registerTitle: "விண்ணப்பதாரர் பதிவு", emailLabel: "மின்னஞ்சல் / கைபேசி எண் *", emailPlaceholder: "மின்னஞ்சல் / கைபேசி எண்", passwordLabel: "கடவுச்சொல் *", passwordPlaceholder: "கடவுச்சொல்", loginOnly: "உள்நுழை", registerOnly: "பதிவு செய்" },
        hi: { home: "⌂ होम", jobs: "💼 नौकरियां", jobfair: "🎓 जॉब फेयर", loginBtn: "लॉगिन ▼", loginTitle: "उम्मीदवार लॉगिन", registerTitle: "उम्मीदवार पंजीकरण", emailLabel: "ईमेल / मोबाइल नंबर *", emailPlaceholder: "ईमेल / मोबाइल नंबर", passwordLabel: "पासवर्ड *", passwordPlaceholder: "पासवर्ड", loginOnly: "लॉगिन", registerOnly: "रजिस्टर" },
        te: { home: "⌂ హోమ్", jobs: "💼 ఉద్యోగాలు", jobfair: "🎓 ఉద్యోగ మేళా", loginBtn: "లాగిన్ ▼", loginTitle: "అభ్యర్థి లాగిన్", registerTitle: "అభ్యర్థి నమోదు", emailLabel: "ఇమెయిల్ / మొబైల్ నంబర్ *", emailPlaceholder: "ఇమెయిల్ / మొబైల్ నంబర్", passwordLabel: "పాస్‌వర్డ్ *", passwordPlaceholder: "పాస్‌వర్డ్", loginOnly: "లాగిన్", registerOnly: "నమోదు" },
        kn: { home: "⌂ ಮುಖಪುಟ", jobs: "💼 ಉದ್ಯೋಗಗಳು", jobfair: "🎓 ಉದ್ಯೋಗ ಮೇಳ", loginBtn: "ಲಾಗಿನ್ ▼", loginTitle: "ಅಭ್ಯರ್ಥಿ ಲಾಗಿನ್", registerTitle: "ಅಭ್ಯರ್ಥಿ ನೋಂದಣಿ", emailLabel: "ಇಮೇಲ್ / ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *", emailPlaceholder: "ಇಮೇಲ್ / ಮೊಬೈಲ್ ಸಂಖ್ಯೆ", passwordLabel: "ಪಾಸ್‌ವರ್ಡ್ *", passwordPlaceholder: "ಪಾಸ್‌ವರ್ಡ್", loginOnly: "ಲಾಗಿನ್", registerOnly: "ನೋಂದಣಿ" }
    };

    const selected = translations[lang] || translations.en;

    document.querySelectorAll("[data-key]").forEach(element => {
        const key = element.getAttribute("data-key");
        if (selected[key]) element.innerText = selected[key];
    });

    document.querySelectorAll("[data-placeholder]").forEach(element => {
        const key = element.getAttribute("data-placeholder");
        if (selected[key]) element.placeholder = selected[key];
    });
}

// ================= PAGE LOAD =================
document.addEventListener("DOMContentLoaded", function () {
    const savedLang = localStorage.getItem("selectedLanguage") || "en";

    const languageSelect = document.getElementById("languageSelect");
    if (languageSelect) languageSelect.value = savedLang;

    applyLanguage(savedLang);

    if (document.getElementById("jobs")) {
        loadJobs();
    }

    if (document.getElementById("popup")) {
        showPopup();
    }
});

function logout() {
    // clear user data
    localStorage.clear();

    // go to login page
    window.location.href = "login.html";
}
