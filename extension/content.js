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


chrome.runtime.sendMessage(
  { action: "checkExtensionStatus" },
  function (response) {
    if (response && response.installed) {
      console.log("Quick Quit extension is installed.");
    } else {
      console.log("Quick Quit extension is NOT installed.");
      promptInstallExtension();
    }
  }
);

function promptInstallExtension() {
  const userChoice = confirm(
    "The Quick Quit extension is not installed. Would you like to go to the Chrome Web Store to install it?"
  );
  if (userChoice) {
    // Redirect to Chrome Web Store for the Quick Quit extension
    window.open(
      "https://chrome.google.com/webstore/detail/Quick-Quit/jkopnadgemphpbajoidaabeabomfakdm"
    );
  } else {
    console.log("User declined to install the Quick Quit extension.");
  }
}