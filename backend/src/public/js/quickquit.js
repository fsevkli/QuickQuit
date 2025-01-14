(function () {
    // Fetch configuration from the script tag
    const currentScript = document.currentScript;
    const domains = currentScript.getAttribute("data-domains")?.split(",").map(d => d.trim()) || [];
    const safeContent = currentScript.getAttribute("data-safe-content")?.split(",").map(c => c.trim()) || [];
    const exitSite = currentScript.getAttribute("data-exit-site") || "https://www.google.com";

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

        // Optionally redirect the user immediately
        setTimeout(() => {
            window.location.href = exitSite;
        }, 100);
    });

    console.log("QuickQuit script loaded successfully.");
})();