document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("loginForm");

    const userNameInput = document.getElementById("userName");
    const passwordInput = document.getElementById("password");

    const messageBox = document.getElementById("message");


    // =========================================
    // Login Form Submit
    // =========================================

    form.addEventListener("submit", async function (event) {

        // جلوگیری از Reload شدن صفحه
        event.preventDefault();

        // پاک کردن خطاهای قبلی
        clearValidation();

        const userName = userNameInput.value.trim();
        const password = passwordInput.value;

        const errors = [];


        // =========================================
        // Username Validation
        // =========================================

        if (!userName) {

            userNameInput.classList.add("input-error");

            errors.push("نام کاربری را وارد کنید.");
        }


        // =========================================
        // Password Validation
        // =========================================

        if (!password) {

            passwordInput.classList.add("input-error");

            errors.push("رمز عبور را وارد کنید.");
        }


        // =========================================
        // اگر Validation خطا داشت
        // =========================================

        if (errors.length > 0) {

            showErrors(errors);

            return;
        }


        // =========================================
        // Send Login Request
        // =========================================

        try {

            const response = await fetch("/api/users/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    userName: userName,
                    password: password
                })
            });


            // پاسخ خام سرور
            const responseText = await response.text();

            let data = null;


            // تلاش برای تبدیل پاسخ به JSON
            try {

                data = responseText
                    ? JSON.parse(responseText)
                    : null;

            } catch {

                data = null;
            }


            // =========================================
            // Login Failed
            // =========================================

            if (!response.ok) {


                // Username یا Password اشتباه
                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    showErrors([
                        "نام کاربری یا رمز عبور اشتباه است."
                    ]);

                    return;
                }


                // اگر Backend خودش Message فرستاده
                if (data && data.message) {

                    showErrors([
                        data.message
                    ]);

                    return;
                }


                // اگر پاسخ سرور Text بود
                if (responseText) {

                    showErrors([
                        responseText
                    ]);

                    return;
                }


                // سایر خطاهای HTTP
                showErrors([
                    "خطایی در ورود به سیستم رخ داد."
                ]);

                return;
            }


            // =========================================
            // Login Successful
            // =========================================

            if (data && data.token) {

                // ذخیره Token
                localStorage.setItem("token", data.token);

                // انتقال به صفحه Users
                window.location.href = "/users.html";

                return;
            }


            // =========================================
            // Login موفق بود ولی Token دریافت نشد
            // =========================================

            showErrors([
                "پاسخ نامعتبر از سرور دریافت شد."
            ]);

        }
        catch (error) {

            // فقط خطای واقعی ارتباط با سرور
            console.error("Login Error:", error);

            showErrors([
                "ارتباط با سرور برقرار نشد."
            ]);
        }

    });


    // =========================================
    // Username Input
    // =========================================

    userNameInput.addEventListener("input", function () {

        if (userNameInput.value.trim()) {

            userNameInput.classList.remove("input-error");

            updateMessage();
        }

    });


    // =========================================
    // Password Input
    // =========================================

    passwordInput.addEventListener("input", function () {

        if (passwordInput.value) {

            passwordInput.classList.remove("input-error");

            updateMessage();
        }

    });


    // =========================================
    // Show Errors
    // =========================================

    function showErrors(errors) {

        messageBox.innerHTML = `
            <ul>
                ${errors
            .map(error => `<li>${error}</li>`)
            .join("")}
            </ul>
        `;

        messageBox.classList.add("show");
    }


    // =========================================
    // Update Message
    // =========================================

    function updateMessage() {

        const errors = [];


        // Username
        if (!userNameInput.value.trim()) {

            errors.push("نام کاربری را وارد کنید.");
        }


        // Password
        if (!passwordInput.value) {

            errors.push("رمز عبور را وارد کنید.");
        }


        if (errors.length > 0) {

            showErrors(errors);

        }
        else {

            clearValidation();
        }

    }


    // =========================================
    // Clear Validation
    // =========================================

    function clearValidation() {

        userNameInput.classList.remove("input-error");

        passwordInput.classList.remove("input-error");

        messageBox.innerHTML = "";

        messageBox.classList.remove("show");
    }

});