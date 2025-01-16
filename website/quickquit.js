$(document).ready(function () {
    // enabling tooltip bootstrap
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    // Navbar link handling\
    const navbarLinks = document.querySelectorAll('.navbar a');
    if (navbarLinks.length > 0) {
        navbarLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                const currentPath = window.location.pathname + window.location.search; // Include query params if any
                const targetPath = new URL(event.currentTarget.href).pathname; // Use currentTarget to get the anchor href

                if (currentPath === targetPath) {
                    event.preventDefault(); // Prevent page reload
                    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to the top
                }
            });
        });
    }

    // Copy to clipboard function
    $("#copyButton").click(function () {
        var html = document.querySelector('#copyableCode').textContent;
        html = unescape(html);
        
        // // Copy the text inside the text field
        navigator.clipboard.writeText(html);

        // Alert the text copied
        const tooltip = bootstrap.Tooltip.getInstance('#copyButton') // Returns a Bootstrap tooltip instance
        // setContent example
        tooltip.setContent({ '.tooltip-inner': 'Copied!' })
    });

    // Escape HTML entities
    function unescape(str) {
        return str.replace(/&lt;/g, "<")
                  .replace(/&gt;/g, ">")
                  .replace(/&quot;/g, '"')
                  .replace(/&amp;/g, "&");
    }

    // Open Chrome extension page
    $("#viewExtensionButton").click(function () {
        window.open("https://chromewebstore.google.com/detail/session-buddy/edacconmaakjimmfgnblocblbcdcpbko", "_blank");
    });

    // Open GitHub repository
    $("#viewGitHubButton").click(function () {
        window.open("https://github.com/fsevkli/getMeOut", "_blank");
    });

    // Update code block based on user input
    const safeContentCheckboxes = document.querySelectorAll('.safeContent');
    const domainText = document.getElementById('domainTextarea');
    const redirectText = document.getElementById('redirectTextarea');
    const codeBlock = document.getElementById('codeBlock');

    function updateCode() {
        const domainGet = domainText.value || 'https://quickquit.app';
        const domains = domainGet.replace(/\s+/g, "");
        const redirect = redirectText.value || 'https://www.google.com';
        const selectedSafeContent = Array.from(safeContentCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value)
            .join(',') || 'news,videos';

        // Updating displayed code
        codeBlock.innerHTML = `&lt;!-- Quick Quit Button --&gt;
&lt;!-- Below ID for Custom Styling --&gt;        
&lt;button id="quickQuitButton" style="position: fixed; bottom: 10px; right: 10px; background-color: red; color: white; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer; z-index: 1000;"&gt;Get Me Out!&lt;/button&gt;
&lt;!-- Quick Quit Script --&gt;
&lt;script src="https://quickquit.app/static/js/quickquit.js" data-domains="${domains}" data-safe-content="${selectedSafeContent}" data-exit-site="${redirect}"&gt;&lt;/script&gt;`;

        // Refreshes PrismJS to make code look good
        Prism.highlightAll();
    }

    // Attach event listeners if elements exist
    if (safeContentCheckboxes.length > 0) {
        safeContentCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateCode);
        });
    }

    if (domainText) {
        domainText.addEventListener('input', updateCode);
    }

    if (redirectText) {
        redirectText.addEventListener('input', updateCode);
    }
});

const extensionId = 'jkopnadgemphpbajoidaabeabomfakdm'; // Quick Quit extension ID
const cookieName = "extensionInstalled";

// Ask the user if they allow cookies
function askIfAllowCookies() {
    const userConsent = confirm("Do you allow cookies to be used for the Quick Quit extension?");

    if (!userConsent) {
        console.log("User declined cookie usage.");
        return; // Stop execution if cookies are not allowed
    }

    // Proceed with checking the extension installation if cookies are allowed
    checkExtensionInstalled();
}

// Check if Quick Quit is installed by looking through the list of installed extensions
function checkExtensionInstalled() {
    // First, check if we already have a cookie indicating the extension installation
    const isExtensionInstalled = getCookie(cookieName);

    // If the extension is installed (from cookie), skip the prompt
    if (isExtensionInstalled === "true") {
        console.log("Quick Quit extension is installed, no need to prompt.");
        return;
    }

    // Try using chrome.management.getAll() to find the extension
    if (chrome.management) {
        chrome.management.getAll(function(extensions) {
            const extension = extensions.find(ext => ext.id === extensionId);
            if (extension) {
                console.log("Quick Quit extension is installed.");
                setCookie(cookieName, "true", 365); // Mark the extension as installed in the cookie
            } else {
                console.log("Quick Quit extension not installed.");
                promptInstallExtension();
            }
        });
    } else {
        console.log("Chrome management API is not available.");
        promptInstallExtension();
    }
}

// Prompt the user to install the Quick Quit extension from the Chrome Web Store
function promptInstallExtension() {
    const userChoice = confirm("The Quick Quit extension is not installed. Would you like to go to the Chrome Web Store to install it?");
    if (userChoice) {
        // Redirect to Chrome Web Store for the Quick Quit extension
        window.open("https://chrome.google.com/webstore/detail/Quick-Quit/jkopnadgemphpbajoidaabeabomfakdm");
    } else {
        console.log("User declined to install the Quick Quit extension.");
    }
}

// Get a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Set a cookie with a specific name, value, and expiration (in days)
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}

// Ask the user if they allow cookies when the page loads
askIfAllowCookies();


