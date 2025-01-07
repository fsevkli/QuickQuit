Quick Quit Chrome Extension

Quick Quit is a Chrome extension designed to replace the URL of the current tab with a randomly generated URL.
Installation

To install the Quick Quit Chrome extension:

    Download the source code or clone this repository to your local machine.
    Open Google Chrome and navigate to chrome://extensions.
    Enable Developer mode by toggling the switch in the top-right corner.
    Click on the "Load unpacked" button and select the directory where you saved the extension's source code.

Usage

Once installed, the Quick Quit extension adds a button to your browser's toolbar. Clicking this button will replace the URL of the current tab with a randomly generated URL. This can be useful for quickly quitting out of websites so if you need to quickly get out of a website and have its history place it is quick and easy.

How it Works

The extension works by injecting a script (randomURLGenerator.js) into the current tab. This script generates a random URL to replace the current tab's URL. The process involves the following steps:

    Get Active Tab URL Domain: Retrieves the hostname of the current tab's URL.
    Remove Domain Entries From History: Removes all instances of the specified domain from the browsing history and replaces them with randomly generated URLs.
    Button Clicked Function: Executes the above functions when the extension's button is clicked.
