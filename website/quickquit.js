$(document).ready(function () {
    const navbarLinks = document.querySelectorAll('.navbar a');
    if (navbarLinks.length > 0) {
        navbarLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
            const currentPath = window.location.pathname + window.location.search; // Include query params if any
            const targetPath = new URL(event.target.href).pathname;

                if (currentPath === targetPath) {
                event.preventDefault(); // Prevent page reload
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to the top
                }
            });
        });
    }


    // copy to clipboard function
    $("#copyButton").click(function () {
        var html = document.querySelector('#copyableCode').textContent;
        html = unescape(html);

        // var copyText = document.getElementById("copyableCode").innerHTML;
        // console.log(copyText);
        
        // // Copy the text inside the text field
        navigator.clipboard.writeText(html);

        //= Alert the copied text
        alert("Code copied sucessfully");
    });

    function unescape(str){
        return str.replace(/&lt;/g, "<")
                  .replace(/&gt;/g, ">")
                  .replace(/&quot;/g, '"')
                  .replace(/&amp;/g, "&");
    }

    // view extension on chrome web store function
    $("#viewExtensionButton").click(function () {
        window.open("https://chromewebstore.google.com/detail/session-buddy/edacconmaakjimmfgnblocblbcdcpbko", "_blank");
    });

    // view github function
    $("#viewGitHubButton").click(function () {
        window.open("https://github.com/fsevkli/getMeOut", "_blank");
    });

    // Updating code block based on user input
    // Getting values of content checkboxes
    const safeContentCheckboxes = document.querySelectorAll('.safeContent');
    // Getting what the user typed in the domains textbox
    const domainText = document.getElementById('domainTextarea');
    // Getting what the user typed in the saafe website textbox
    const redirectText = document.getElementById('redirectTextarea');
    // Code block where copiable code is displayed
    const codeBlock = document.getElementById('codeBlock');

    // Updates codeblock based off user input
    function updateCode() {
        // Choses default value or user input if there is any
        const domainGet = domainText.value || 'https://quickquit.app';
        // Removes spaces incase user puts them (scenario like google.com, yahoo.com, etc)
        // doesnt work rn
        const domains =  domainGet.replace(/\s+/g, "");
        const redirect = redirectText.value || 'https://www.google.com'
        // Gets each value from all the checkboxes and adds them to string with comma separated
        const selectedSafeContent = Array.from(safeContentCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value)
            .join(',') || 'news,videos';

        // Updating displayed code
        codeBlock.innerHTML = `&lt;!-- Quick Quit Button --&gt;
&lt;!-- Below ID for Custom Styling --&gt;        
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

&lt;!-- Quick Quit Script --&gt;
&lt;script
  src="https://quickquit.app/static/js/quickquit.js"
  data-domains="${domains}"
  data-safe-content="${selectedSafeContent}"
  data-exit-site="${redirect}"&gt;
&lt;/script&gt;`;

        // Refreshes PrismJS to make code look good
        Prism.highlightAll();
    }

    // Event listeners to update code block when user does something
    // All checkboxes
    safeContentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateCode);
    });
    // Domain text area
    domainText.addEventListener('input', updateCode);
    // Redirect text area
    redirectText.addEventListener('input', updateCode);
});