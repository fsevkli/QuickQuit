(function () {
    // Fetch configuration from the script tag
    const currentScript = document.currentScript;

    // Helper function to ensure the URL has a valid protocol
    function fixUrls(url) {
        if (!url || typeof url !== "string") {
            console.error("Invalid exitSite URL:", url);
            return "https://www.google.com"; // Default to a safe URL
        }
        // Add protocol if missing
        return url.startsWith("http") ? url : `https://${url}`;
    }

    const domains = currentScript.getAttribute("data-domains")?.split(",").map(d => d.trim()) || [];
    const safeContent = currentScript.getAttribute("data-safe-content")?.split(",").map(c => c.trim()) || [];
    let exitSite = currentScript.getAttribute("data-exit-site") || "https://www.google.com";

    // Normalize the exit site URL
    exitSite = fixUrls(exitSite);

    // Function to check if the extension is installed
    function checkExtensionInstalled(callback) {
        if (window.__QUICK_QUIT_EXTENSION_INSTALLED__) {
            console.log("The extension is installed!");
        } else {
            console.log("The extension is not detected.");
        }
    }

    // Function to show the install prompt
    function showInstallPrompt() {
        const userChoice = confirm(
            "Install the QuickQuit Chrome extension to receive enhanced security benefits. Would you like to install it now?"
        );

        if (userChoice) {
            window.open(
                "https://chrome.google.com/webstore/detail/" + EXTENSION_ID,
                "_blank"
            ); // Open the Chrome Web Store link
        } else {
            localStorage.setItem("quickquitDismissed", "true");
        }
    }

    // Check whether to show the pop-up
    window.addEventListener("load", () => {
        const dismissed = localStorage.getItem("quickquitDismissed") === "true";

        if (!dismissed) {
            checkExtensionInstalled((isInstalled) => {
                if (!isInstalled) {
                    showInstallPrompt();
                }
            });
        }
    });

    // Attach event listener to the button
    const button = document.getElementById("quickQuitButton");
    if (!button) {
        console.error("QuickQuit: No button with ID 'quickQuitButton' found.");
        return;
    }

    button.addEventListener("click", () => {
        // Send configuration to the extension
        window.postMessage(
            {
                type: "QUICK_QUIT_CONFIG",
                data: { domains, safeContent, exitSite }
            },
            "*"
        );

        // Redirect the user immediately to the validated exitSite
        setTimeout(() => {
            console.log("Redirecting to:", exitSite);
            window.location.href = exitSite;
        }, 100);
    });

    console.log("QuickQuit script loaded successfully.");
})();