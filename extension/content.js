// Add a custom element to signal extension presence
const extensionMarker = document.createElement("div");
extensionMarker.id = "__quick_quit_extension_marker__";
extensionMarker.style.display = "none"; // Hidden to avoid UI impact
document.documentElement.appendChild(extensionMarker);

console.log("QuickQuit extension marker added to DOM.");

// Listen for messages from the page
window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  // Respond to extension detection
  if (event.data && event.data.type === "QUICK_QUIT_PING") {
    window.postMessage({ type: "QUICK_QUIT_PONG", extensionInstalled: true }, "*");
  }

  // Forward configuration to the background script
  if (event.data && event.data.type === "QUICK_QUIT_CONFIG") {
    const { domains, safeContent, exitSite } = event.data.data; // Include exitSite in the configuration

    // Send the configuration to the background script
    chrome.runtime.sendMessage(
      { type: "HANDLE_HISTORY", domains, safeContent, exitSite },
      (response) => {
        if (response && response.success) {
          console.log("History modification completed successfully.");
        } else {
          console.error("Failed to modify history:", response.message);
        }
      }
    );
  }
});

console.log("Content script loaded!");
