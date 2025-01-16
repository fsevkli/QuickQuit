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