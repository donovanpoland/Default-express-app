// Add class for showing navigation on hamburger button click
const navButton = document.querySelector('#ham-btn');
const navBar = document.querySelector('#nav-bar');

if (navButton && navBar) {
    navButton.addEventListener('click', () => {
        navButton.classList.toggle('show');
        navBar.classList.toggle('show');   
    });

    // Listen for window resize and remove show class
    window.addEventListener("resize", () => {
        navButton.classList.remove('show');
        navBar.classList.remove('show');
    });
}

// Get caps lock element
const capsLockId = document.querySelector("#caps-lock");
const passwordInput = document.querySelector("#password");
const togglePasswordButton = document.querySelector("#toggle-password");

// update caps lock message
const updateCapsLockMessage = (event) => {
    // if there is no caps lock id exit function
    if (!capsLockId) return;

    // Returns true if Caps Lock is on, false if off
    const isCapsLockOn = event.getModifierState('CapsLock');

    // if caps lock is 
    if (isCapsLockOn) {
        // Add text to id and and display block, set color of text
        capsLockId.textContent = "Caps lock is on!";
        capsLockId.style.display = 'inline';
        capsLockId.style.color = "red";
    }
    else{
        // remove text and hide element
        capsLockId.textContent = "";
        capsLockId.style.display = 'none';
    }
};

// listen for key events for caps lock
if (passwordInput) {
    passwordInput.addEventListener('keydown', updateCapsLockMessage);
}
    
// check for movement away from tab
window.addEventListener("blur", () => {
    // if there is no caps lock id exit function
    if (!capsLockId) return;
    // remove text and hide element
    capsLockId.textContent = "";
    capsLockId.style.display = "none";
});

if (passwordInput && togglePasswordButton) {
    togglePasswordButton.addEventListener("click", () => {
        const passwordIsHidden = passwordInput.type === "password";
        passwordInput.type = passwordIsHidden ? "text" : "password";
        togglePasswordButton.textContent = passwordIsHidden ? "Hide password" : "Show password";
    });
}

    

    

    
    
    
    

