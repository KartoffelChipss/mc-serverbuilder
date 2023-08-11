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