$(document).ready(function () {
    document.querySelectorAll('.navbar a').forEach((link) => {
        link.addEventListener('click', (event) => {
            const currentPath = window.location.pathname + window.location.search; // Include query params if any
            const targetPath = new URL(event.target.href).pathname;

            if (currentPath === targetPath) {
                event.preventDefault(); // Prevent page reload
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to the top
            }
        });
    });


    // copy to clipboard function
    $("#copyButton").click(function () {
        console.log("Hello world!");
        var copyText = document.getElementById("copyableCode").innerHTML;
        console.log(copyText);

        // Select the text field
        // copyText.select();
        // copyText.setSelectionRange(0, 99999); // For mobile devices

        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText);

        //= Alert the copied text
        alert("Code copied sucessfully");
    });

    // view extension on chrome web store function
    $("#viewExtensionButton").click(function () {
        window.open("https://chromewebstore.google.com/detail/session-buddy/edacconmaakjimmfgnblocblbcdcpbko", "_blank");
    });

    // view github function
    $("#viewGitHubButton").click(function () {
        window.open("https://github.com/fsevkli/getMeOut", "_blank");
    });

    // Update Code Function
    const safeContentCheckboxes = document.querySelectorAll('.safeContent');
    function updateCode() {
        const selectedSafeContent = Array.from(safeContentCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value)
            .join(',');

      // Update displayed code
      codeBlock.innerHTML = `
<code class="language-html">
&lt;button id="quickQuitButton" style="
  position: fixed;
  bottom: 10px;
  right: 10px;
  background-color: red;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  z-index: 1000;"&gt;Get Me Out!&lt;/button&gt;

&lt;script
  src="https://yourdomain.com/static/js/quickquit.js"
  data-domains="justlife.org.uk,lifeshare.org.uk"
  data-safe-content="${selectedSafeContent}"
  data-exit-site="https://example.com"&gt;
&lt;/script&gt;
</code>`
    }

    // Add Event Listeners
    safeContentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateCode);
      });
});