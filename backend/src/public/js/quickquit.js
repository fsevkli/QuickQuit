(function () {
    // Fetch the current script tag
    const currentScript = document.currentScript;
  
    // Extract configuration from the script tag's data attributes
    const domains = currentScript.getAttribute("data-domains")
      ? currentScript.getAttribute("data-domains").split(",").map(d => d.trim())
      : [];
    const safeContent = currentScript.getAttribute("data-safe-content")
      ? currentScript.getAttribute("data-safe-content").split(",").map(c => c.trim())
      : [];
    const exitSite = currentScript.getAttribute("data-exit-site") || "https://www.google.com";
  
    if (domains.length === 0) {
      console.error("Quick Quit: No domains specified. Aborting.");
      return;
    }
  
    if (safeContent.length === 0) {
      console.error("Quick Quit: No safe content specified. Using default 'news'.");
      safeContent.push("news");
    }
  
    // Attach event listener to the button
    const button = document.getElementById("quickQuitButton");
    if (!button) {
      console.error("Quick Quit: No button with ID 'quickQuitButton' found on the page.");
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
  
      // Redirect the user to the exit site
      setTimeout(() => {
        window.location.href = exitSite;
      }, 100);
    });
  
    console.log("Quick Quit script loaded successfully.");
  })();