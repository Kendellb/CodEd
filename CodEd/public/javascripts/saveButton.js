//https://discuss.codemirror.net/t/how-to-get-editor-content-from-the-browser/3840
document.getElementById("saveButton").addEventListener("click", function() {
    console.log(Array.from(document.querySelectorAll(".cm-line")).map(e => e.textContent).join("\n"));
});