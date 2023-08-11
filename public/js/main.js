function closeWindow() {
    window.api.invoke("closeWindow", {
        window: "main",
    });
}

function minimizeWindow() {
    window.api.invoke("minimize", {
        window: "main",
    });
}

function toggleMaxWindow() {
    window.api.invoke("togglemaxwindow", {
        window: "main",
    });
}