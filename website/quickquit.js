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



