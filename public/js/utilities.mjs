export function setupPasswordToggle(btnId = "pswdBtn", inputId = "password", iconId = "pswdIcon") {
    const pswdBtn = document.getElementById(btnId);
    const pswdInput = document.getElementById(inputId);
    const pswdIcon = document.getElementById(iconId);
    if (pswdBtn && pswdInput && pswdIcon) {
        pswdBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            const type = pswdInput.getAttribute("type");
            if (type === "password") {
                pswdInput.setAttribute("type", "text");
                pswdIcon.classList.remove("fa-eye");
                pswdIcon.classList.add("fa-eye-slash");
            } else {
                pswdInput.setAttribute("type", "password");
                pswdIcon.classList.remove("fa-eye-slash");
                pswdIcon.classList.add("fa-eye");
            }
        });
    }
}