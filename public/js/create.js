function closeWindow() {
    window.api.invoke("closeWindow", {
        window: "create",
    });
}

function minimizeWindow() {
    window.api.invoke("minimize", {
        window: "create",
    });
}

function toggleMaxWindow() {
    window.api.invoke("togglemaxwindow", {
        window: "create",
    });
}

function resizeInput() {
    let locationInput = document.getElementById("location");
    locationInput.style.width = (locationInput.value.length) + 'ch';
}
  
window.onload = resizeInput();