const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}


/* =========================================================
   DOM ELEMENTS
========================================================= */

// Sidebar
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const openSidebarButton = document.getElementById("openSidebarButton");
const closeSidebarButton = document.getElementById("closeSidebarButton");

// Sidebar menu
const usersMenuButton = document.getElementById("usersMenuButton");
const addUserMenuButton = document.getElementById("addUserMenuButton");
const changePasswordMenuButton = document.getElementById("changePasswordMenuButton");
const logoutButton = document.getElementById("logoutButton");

// Page header
const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");

// Sections
const usersSection = document.getElementById("usersSection");
const changePasswordSection = document.getElementById("changePasswordSection");

// Users
const usersTableBody = document.getElementById("usersTableBody");
const emptyUsers = document.getElementById("emptyUsers");
const addUserButton = document.getElementById("addUserButton");
const emptyAddUserButton = document.getElementById("emptyAddUserButton");

// Global message
const globalMessage = document.getElementById("globalMessage");

// User modal
const userModal = document.getElementById("userModal");
const modalTitle = document.getElementById("modalTitle");
const closeModalButton = document.getElementById("closeModalButton");
const userForm = document.getElementById("userForm");

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const userNameInput = document.getElementById("userName");
const passwordInput = document.getElementById("password");

const passwordFormGroup = document.getElementById("passwordFormGroup");

const modalMessage = document.getElementById("modalMessage");
const cancelButton = document.getElementById("cancelButton");
const saveUserButton = document.getElementById("saveUserButton");

// Delete modal
const deleteModal = document.getElementById("deleteModal");
const deleteMessage = document.getElementById("deleteMessage");
const cancelDeleteButton = document.getElementById("cancelDeleteButton");
const confirmDeleteButton = document.getElementById("confirmDeleteButton");

// Change password
const changePasswordForm = document.getElementById("changePasswordForm");
const currentPasswordInput = document.getElementById("currentPassword");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const changePasswordButton = document.getElementById("changePasswordButton");
const clearPasswordButton = document.getElementById("clearPasswordButton");
const changePasswordMessage = document.getElementById("changePasswordMessage");


/* =========================================================
   STATE
========================================================= */

let editingUserId = null;
let deletingUserId = null;


/* =========================================================
   INITIAL LOAD
========================================================= */

loadUsers();


/* =========================================================
   SIDEBAR
========================================================= */

openSidebarButton.addEventListener("click", openSidebar);

closeSidebarButton.addEventListener("click", closeSidebar);

sidebarOverlay.addEventListener("click", closeSidebar);


function openSidebar() {
    sidebar.classList.add("open");
    sidebarOverlay.classList.add("show");
}


function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("show");
}


/* =========================================================
   NAVIGATION
========================================================= */

usersMenuButton.addEventListener("click", function () {

    showSection("users");

    closeSidebar();
});


addUserMenuButton.addEventListener("click", function () {

    showSection("users");

    closeSidebar();

    setTimeout(() => {
        openAddUserModal();
    }, 100);
});


changePasswordMenuButton.addEventListener("click", function () {

    showSection("changePassword");

    closeSidebar();
});


function showSection(sectionName) {

    removeActiveMenu();


    if (sectionName === "users") {

        usersSection.classList.add("active");
        usersMenuButton.classList.add("active");

        pageTitle.textContent = "مدیریت کاربران";
        pageSubtitle.textContent = "مدیریت کاربران سیستم";

        loadUsers();

        return;
    }


    if (sectionName === "changePassword") {

        changePasswordSection.classList.add("active");
        changePasswordMenuButton.classList.add("active");

        pageTitle.textContent = "تغییر رمز عبور";
        pageSubtitle.textContent =
            "رمز عبور حساب کاربری خود را تغییر دهید.";

        return;
    }
}


function removeActiveMenu() {

    usersMenuButton.classList.remove("active");
    addUserMenuButton.classList.remove("active");
    changePasswordMenuButton.classList.remove("active");

    usersSection.classList.remove("active");
    changePasswordSection.classList.remove("active");
}


/* =========================================================
   LOGOUT
========================================================= */

logoutButton.addEventListener("click", function () {

    logout();
});


function logout() {

    localStorage.removeItem("token");

    window.location.href = "index.html";
}


/* =========================================================
   LOAD USERS
========================================================= */

async function loadUsers() {

    try {

        const response = await fetch("/api/users", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });


        /*
         * فقط در اینجا 401/403 را Logout می‌کنیم.
         * چون این درخواست اصلی احراز هویت صفحه است.
         */
        if (response.status === 401 || response.status === 403) {

            logout();

            return;
        }


        const text = await response.text();

        let data = null;

        try {
            data = text ? JSON.parse(text) : null;
        } catch {
            data = null;
        }


        if (!response.ok) {

            showGlobalMessage(
                extractErrorMessages(data, text),
                "error"
            );

            return;
        }


        renderUsers(data);

    } catch (error) {

        console.error(error);

        showGlobalMessage(
            "ارتباط با سرور برقرار نشد.",
            "error"
        );
    }
}


/* =========================================================
   RENDER USERS
========================================================= */

function renderUsers(users) {

    usersTableBody.innerHTML = "";


    if (!Array.isArray(users) || users.length === 0) {

        emptyUsers.style.display = "block";

        return;
    }


    emptyUsers.style.display = "none";


    users.forEach(user => {

        /*
         * ID را برای عملیات داخلی نگه می‌داریم
         * ولی به کاربر نمایش نمی‌دهیم.
         */
        const userId =
            user.id ??
            user.userId ??
            user.userSn;


        const row = document.createElement("tr");


        row.innerHTML = `
            <td>${escapeHtml(user.firstName ?? "")}</td>

            <td>${escapeHtml(user.lastName ?? "")}</td>

            <td>${escapeHtml(user.userName ?? "")}</td>

            <td>
                <div class="action-buttons">

                    <button
                        type="button"
                        class="edit-button"
                        data-id="${escapeHtml(userId ?? "")}"
                        data-first-name="${escapeHtml(user.firstName ?? "")}"
                        data-last-name="${escapeHtml(user.lastName ?? "")}"
                        data-user-name="${escapeHtml(user.userName ?? "")}">
                        ویرایش
                    </button>

                    <button
                        type="button"
                        class="delete-button"
                        data-id="${escapeHtml(userId ?? "")}"
                        data-name="${escapeHtml(
            `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
        )}">
                        حذف
                    </button>

                </div>
            </td>
        `;


        usersTableBody.appendChild(row);
    });
}


/* =========================================================
   USER TABLE ACTIONS
========================================================= */

usersTableBody.addEventListener("click", function (event) {

    const editButton = event.target.closest(".edit-button");


    if (editButton) {

        const id = editButton.dataset.id;

        const firstName = editButton.dataset.firstName;
        const lastName = editButton.dataset.lastName;
        const userName = editButton.dataset.userName;


        openEditUserModal(
            id,
            firstName,
            lastName,
            userName
        );

        return;
    }


    const deleteButton = event.target.closest(".delete-button");


    if (deleteButton) {

        const id = deleteButton.dataset.id;
        const name = deleteButton.dataset.name;

        openDeleteModal(id, name);
    }
});


/* =========================================================
   ADD USER
========================================================= */

addUserButton.addEventListener("click", openAddUserModal);

emptyAddUserButton.addEventListener("click", openAddUserModal);


function openAddUserModal() {

    editingUserId = null;

    modalTitle.textContent = "افزودن کاربر";

    saveUserButton.textContent = "ذخیره کاربر";

    passwordFormGroup.style.display = "block";

    userForm.reset();

    clearInputErrors();

    hideModalMessage();

    showModal(userModal);

    firstNameInput.focus();
}


/* =========================================================
   EDIT USER
========================================================= */

function openEditUserModal(
    id,
    firstName,
    lastName,
    userName
) {

    /*
     * اینجا دیگر GET /api/users/{id} نمی‌زنیم.
     *
     * اطلاعات مورد نیاز از همان لیست کاربران گرفته می‌شود.
     */
    if (!id) {

        showGlobalMessage(
            "شناسه کاربر دریافت نشد.",
            "error"
        );

        return;
    }


    editingUserId = id;

    modalTitle.textContent = "ویرایش کاربر";

    saveUserButton.textContent = "ذخیره تغییرات";

    passwordFormGroup.style.display = "none";

    clearInputErrors();

    hideModalMessage();


    firstNameInput.value = firstName || "";
    lastNameInput.value = lastName || "";
    userNameInput.value = userName || "";
    passwordInput.value = "";


    showModal(userModal);

    firstNameInput.focus();
}


/* =========================================================
   SAVE USER
========================================================= */

userForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    clearInputErrors();

    hideModalMessage();


    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const userName = userNameInput.value.trim();
    const password = passwordInput.value;


    let hasError = false;


    if (!firstName) {

        firstNameInput.classList.add("input-error");

        hasError = true;
    }


    if (!lastName) {

        lastNameInput.classList.add("input-error");

        hasError = true;
    }


    if (!userName) {

        userNameInput.classList.add("input-error");

        hasError = true;
    }


    if (!editingUserId && !password.trim()) {

        passwordInput.classList.add("input-error");

        hasError = true;
    }


    if (hasError) {

        showModalMessage(
            "لطفاً اطلاعات الزامی را وارد نمایید.",
            "error"
        );

        return;
    }


    const payload = {
        firstName: firstName,
        lastName: lastName,
        userName: userName
    };


    let url;
    let method;


    if (editingUserId) {

        url = `/api/users/${encodeURIComponent(editingUserId)}`;

        method = "PUT";

    } else {

        url = "/api/users";

        method = "POST";

        payload.password = password;
    }


    setButtonLoading(saveUserButton, true);


    try {

        const response = await fetch(url, {
            method: method,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });


        /*
         * اینجا دیگر Logout نمی‌کنیم.
         * اگر Backend خطا بدهد، پیام واقعی را نشان می‌دهیم.
         */

        const text = await response.text();

        let data = null;

        try {
            data = text ? JSON.parse(text) : null;
        } catch {
            data = null;
        }


        if (!response.ok) {

            showModalMessage(
                extractErrorMessages(data, text),
                "error"
            );

            return;
        }


        closeModal(userModal);

        await loadUsers();


        showGlobalMessage(
            editingUserId
                ? "اطلاعات کاربر با موفقیت ویرایش شد."
                : "کاربر با موفقیت ایجاد شد.",
            "success"
        );


    } catch (error) {

        console.error(error);

        showModalMessage(
            "ارتباط با سرور برقرار نشد.",
            "error"
        );

    } finally {

        setButtonLoading(saveUserButton, false);
    }
});


/* =========================================================
   DELETE USER
========================================================= */

function openDeleteModal(id, name) {

    if (!id) {

        showGlobalMessage(
            "شناسه کاربر دریافت نشد.",
            "error"
        );

        return;
    }


    deletingUserId = id;


    deleteMessage.textContent =
        `آیا از حذف کاربر «${name || "این کاربر"}» مطمئن هستید؟`;


    showModal(deleteModal);
}


confirmDeleteButton.addEventListener(
    "click",
    async function () {

        if (!deletingUserId) {
            return;
        }


        setButtonLoading(confirmDeleteButton, true);


        try {

            const response = await fetch(
                `/api/users/${encodeURIComponent(deletingUserId)}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );


            /*
             * مهم:
             * اینجا دیگر 401/403 باعث Logout نمی‌شود.
             * خطای واقعی Backend نمایش داده خواهد شد.
             */

            const text = await response.text();

            let data = null;

            try {
                data = text ? JSON.parse(text) : null;
            } catch {
                data = null;
            }


            if (!response.ok) {

                closeModal(deleteModal);

                showGlobalMessage(
                    extractErrorMessages(data, text),
                    "error"
                );

                return;
            }


            closeModal(deleteModal);

            deletingUserId = null;

            await loadUsers();


            showGlobalMessage(
                "کاربر با موفقیت حذف شد.",
                "success"
            );


        } catch (error) {

            console.error(error);

            closeModal(deleteModal);

            showGlobalMessage(
                "ارتباط با سرور برقرار نشد.",
                "error"
            );

        } finally {

            setButtonLoading(confirmDeleteButton, false);
        }
    }
);


/* =========================================================
   CHANGE PASSWORD
========================================================= */

changePasswordForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        clearPasswordInputs();

        hideChangePasswordMessage();


        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;


        let hasError = false;


        if (!currentPassword.trim()) {

            currentPasswordInput.classList.add("input-error");

            hasError = true;
        }


        if (!newPassword.trim()) {

            newPasswordInput.classList.add("input-error");

            hasError = true;
        }


        if (!confirmPassword.trim()) {

            confirmPasswordInput.classList.add("input-error");

            hasError = true;
        }


        if (hasError) {

            showChangePasswordMessage(
                "لطفاً تمام فیلدها را تکمیل نمایید.",
                "error"
            );

            return;
        }


        if (newPassword !== confirmPassword) {

            newPasswordInput.classList.add("input-error");
            confirmPasswordInput.classList.add("input-error");

            showChangePasswordMessage(
                "رمز عبور جدید و تکرار آن یکسان نیستند.",
                "error"
            );

            return;
        }


        const payload = {
            currentPassword: currentPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        };


        setButtonLoading(changePasswordButton, true);


        try {

            const response = await fetch(
                "/api/users/change-password",
                {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );


            if (response.status === 401 ||
                response.status === 403) {

                logout();

                return;
            }


            const text = await response.text();

            let data = null;

            try {
                data = text ? JSON.parse(text) : null;
            } catch {
                data = null;
            }


            if (!response.ok) {

                showChangePasswordMessage(
                    extractErrorMessages(data, text),
                    "error"
                );

                return;
            }


            showChangePasswordMessage(
                data?.message ||
                "رمز عبور با موفقیت تغییر کرد.",
                "success"
            );


            changePasswordForm.reset();

            clearPasswordInputs();


        } catch (error) {

            console.error(error);

            showChangePasswordMessage(
                "ارتباط با سرور برقرار نشد.",
                "error"
            );

        } finally {

            setButtonLoading(changePasswordButton, false);
        }
    }
);


/* =========================================================
   PASSWORD INPUT EVENTS
========================================================= */

currentPasswordInput.addEventListener("input", function () {
    currentPasswordInput.classList.remove("input-error");
});

newPasswordInput.addEventListener("input", function () {
    newPasswordInput.classList.remove("input-error");
    confirmPasswordInput.classList.remove("input-error");
});

confirmPasswordInput.addEventListener("input", function () {
    confirmPasswordInput.classList.remove("input-error");
});


/* =========================================================
   TOGGLE PASSWORD
========================================================= */

document.querySelectorAll(".toggle-password")
    .forEach(button => {

        button.addEventListener("click", function () {

            const targetId = button.dataset.target;
            const input = document.getElementById(targetId);


            if (input.type === "password") {

                input.type = "text";

                button.textContent = "🙈";

            } else {

                input.type = "password";

                button.textContent = "👁";
            }
        });
    });


/* =========================================================
   CLEAR PASSWORD
========================================================= */

clearPasswordButton.addEventListener("click", function () {

    changePasswordForm.reset();

    clearPasswordInputs();

    hideChangePasswordMessage();
});


/* =========================================================
   INPUT ERROR CLEARING
========================================================= */

firstNameInput.addEventListener("input", function () {
    firstNameInput.classList.remove("input-error");
});

lastNameInput.addEventListener("input", function () {
    lastNameInput.classList.remove("input-error");
});

userNameInput.addEventListener("input", function () {
    userNameInput.classList.remove("input-error");
});

passwordInput.addEventListener("input", function () {
    passwordInput.classList.remove("input-error");
});


/* =========================================================
   MODAL CONTROLS
========================================================= */

closeModalButton.addEventListener("click", function () {
    closeModal(userModal);
});


cancelButton.addEventListener("click", function () {
    closeModal(userModal);
});


cancelDeleteButton.addEventListener("click", function () {

    closeModal(deleteModal);

    deletingUserId = null;
});


document.querySelectorAll(".modal-overlay")
    .forEach(overlay => {

        overlay.addEventListener("click", function () {

            const modal = overlay.closest(".modal");

            if (modal) {
                closeModal(modal);
            }
        });
    });


function showModal(modal) {

    modal.classList.add("show");

    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
}


function closeModal(modal) {

    modal.classList.remove("show");

    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
}


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener("keydown", function (event) {

    if (event.key !== "Escape") {
        return;
    }


    if (userModal.classList.contains("show")) {

        closeModal(userModal);

        return;
    }


    if (deleteModal.classList.contains("show")) {

        closeModal(deleteModal);

        deletingUserId = null;

        return;
    }


    closeSidebar();
});


/* =========================================================
   GLOBAL MESSAGE
========================================================= */

function showGlobalMessage(message, type) {

    globalMessage.textContent = message;

    globalMessage.className =
        `global-message show ${type}`;


    setTimeout(() => {

        globalMessage.classList.remove("show");

    }, 5000);
}


/* =========================================================
   MODAL MESSAGE
========================================================= */

function showModalMessage(message, type) {

    modalMessage.textContent = message;

    modalMessage.className =
        `modal-message show ${type}`;
}


function hideModalMessage() {

    modalMessage.textContent = "";

    modalMessage.className = "modal-message";
}


/* =========================================================
   CHANGE PASSWORD MESSAGE
========================================================= */

function showChangePasswordMessage(message, type) {

    changePasswordMessage.textContent = message;

    changePasswordMessage.className =
        `form-message show ${type}`;
}


function hideChangePasswordMessage() {

    changePasswordMessage.textContent = "";

    changePasswordMessage.className = "form-message";
}


/* =========================================================
   CLEAR INPUT ERRORS
========================================================= */

function clearInputErrors() {

    firstNameInput.classList.remove("input-error");
    lastNameInput.classList.remove("input-error");
    userNameInput.classList.remove("input-error");
    passwordInput.classList.remove("input-error");
}


function clearPasswordInputs() {

    currentPasswordInput.classList.remove("input-error");
    newPasswordInput.classList.remove("input-error");
    confirmPasswordInput.classList.remove("input-error");
}


/* =========================================================
   ERROR EXTRACTION
========================================================= */

function extractErrorMessages(data, responseText) {

    if (data?.message) {
        return data.message;
    }


    if (typeof data === "string") {
        return data;
    }


    if (data && typeof data === "object") {

        const messages = [];


        Object.values(data).forEach(value => {

            if (Array.isArray(value)) {

                value.forEach(item => {

                    if (item) {
                        messages.push(
                            translateErrorMessage(item)
                        );
                    }
                });

            } else if (typeof value === "string") {

                messages.push(
                    translateErrorMessage(value)
                );
            }
        });


        if (messages.length > 0) {
            return messages.join("، ");
        }
    }


    if (responseText) {
        return translateErrorMessage(responseText);
    }


    return "خطایی رخ داده است.";
}


/* =========================================================
   ERROR TRANSLATION
========================================================= */

function translateErrorMessage(message) {

    if (!message) {
        return "";
    }


    const text = String(message);


    if (
        text.includes(
            "Password must contain at least one uppercase letter"
        )
    ) {

        return "رمز عبور باید حداقل شامل یک حرف بزرگ، یک حرف کوچک، یک عدد و یک کاراکتر خاص باشد.";
    }


    if (
        text.includes("must not be blank") ||
        text.includes("must not be empty")
    ) {

        return "لطفاً این فیلد را تکمیل نمایید.";
    }


    return text;
}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   BUTTON LOADING
========================================================= */

function setButtonLoading(button, loading) {

    if (loading) {

        button.dataset.originalText =
            button.textContent;

        button.disabled = true;

        button.textContent =
            "در حال انجام...";

    } else {

        button.disabled = false;

        if (button.dataset.originalText) {

            button.textContent =
                button.dataset.originalText;
        }
    }
}