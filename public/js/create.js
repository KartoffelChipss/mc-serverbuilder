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

    let serversoftwarebuildbox = document.getElementById("serversoftwarebuildbox");

    serversoftwarebuildbox.classList.add("loading");

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

            serversoftwarebuildbox.classList.remove("loading");
        });
    })
}

loadVersions()

async function loadBuilds() {
    let serversoftwareInput = document.getElementById("serversoftware");
    let serverversionInput = document.getElementById("serverversion");
    let serversoftwarebuildInput = document.getElementById("serversoftwarebuild");

    let serversoftwarebuildbox = document.getElementById("serversoftwarebuildbox");
    
    serversoftwarebuildbox.classList.add("loading");

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

        serversoftwarebuildbox.classList.remove("loading");
    });
}

function openPage(page) {
    if (page === "default") {
        let pastPage = document.getElementById("page-2");
        let newPage = document.getElementById("page-1");

        pastPage.classList.remove("shown");
        newPage.classList.add("shown");

        document.getElementById("bottomRow").innerHTML = `
        <button type="button" onclick="closeWindow()">Cancel</button>
        <button type="button" onclick="openPage('properties')" class="next">Next</button>`
    }

    if (page === 'properties') {
        let pastPage = document.getElementById("page-1");
        let newPage = document.getElementById("page-2");

        pastPage.classList.remove("shown");
        newPage.classList.add("shown");

        document.getElementById("bottomRow").innerHTML = `
        <button type="button" onclick="openPage('default')">Back</button>
        <button type="button" onclick="openPage('plugins')" class="next">Next</button>`
    }
}