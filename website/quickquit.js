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
});