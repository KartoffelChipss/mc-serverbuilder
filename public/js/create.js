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

async function fetchAsync(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

function changeServerFileLoc() {
    window.api.selectFolder().then(result => {
        if (result) {
            let locationInput = document.getElementById("location");
            locationInput.value = result;
            locationInput.style.width = (locationInput.value.length) + 'ch';
        }
    })
}

async function loadVersions() {
    let serversoftwareInput = document.getElementById("serversoftware");
    let serverversionInput = document.getElementById("serverversion");
    let serversoftwarebuildInput = document.getElementById("serversoftwarebuild");

    await fetchAsync(`https://api.papermc.io/v2/projects/${serversoftwareInput.value}`).then(async (data) => {
        if (!data) return;

        let availableVersions = data.versions.reverse();

        serverversionInput.innerHTML = "";

        availableVersions.forEach((version, index) => {
            if (index === 0) {
                serverversionInput.innerHTML += `<option value="${version}" selected>${version}</option>`
                return;
            }

            serverversionInput.innerHTML += `<option value="${version}" >${version}</option>`;
        });

        await fetchAsync(`https://api.papermc.io/v2/projects/${serversoftwareInput.value}/versions/${serverversionInput.value}/builds`).then((data) => {
            if (!data) return;

            let availableBuilds = data.builds.reverse();

            serversoftwarebuildInput.innerHTML = "";

            availableBuilds.forEach((build, index) => {
                if (index === 0) {
                    serversoftwarebuildInput.innerHTML += `<option value="${build.build}" selected>${build.build}</option>`
                    return;
                }

                serversoftwarebuildInput.innerHTML += `<option value="${build.build}" >${build.build}</option>`;
            });
        });
    })
}

loadVersions()

async function loadBuilds() {
    let serversoftwareInput = document.getElementById("serversoftware");
    let serverversionInput = document.getElementById("serverversion");
    let serversoftwarebuildInput = document.getElementById("serversoftwarebuild");

    await fetchAsync(`https://api.papermc.io/v2/projects/${serversoftwareInput.value}/versions/${serverversionInput.value}/builds`).then((data) => {
        if (!data) return;

        let availableBuilds = data.builds.reverse();

        serversoftwarebuildInput.innerHTML = "";

        availableBuilds.forEach((build, index) => {
            if (index === 0) {
                serversoftwarebuildInput.innerHTML += `<option value="${build.build}" selected>${build.build}</option>`
                return;
            }

            serversoftwarebuildInput.innerHTML += `<option value="${build.build}" >${build.build}</option>`;
        });
    });
}