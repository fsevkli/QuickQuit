$(document).ready(function () {

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

    // Get values from checkboxes for replacing content
    $("#replaceButton").click(function (){
        var checked = $('input[type="checkbox"]:checked');

        checked.each(function() {
            console.log(this.value);
        });
    });
});