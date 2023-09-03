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

async function loadPlugins(page) {
    await fetchAsync(`https://api.modrinth.com/v2/search?facets=[["versions: ${serverversionInput.value}"],["project_type:plugin"],["categories:paper"]]&query=`).then((data) => {
        if (!data) return;

        console.log(data)
    });
}

loadPlugins(0);

function openPage(page) {
    if (page === "default") {
        let page1 = document.getElementById("page-1");
        let page2 = document.getElementById("page-2");
        let page3 = document.getElementById("page-3");

        page1.classList.add("shown");
        page2.classList.remove("shown");
        page3.classList.remove("shown");

        document.getElementById("bottomRow").innerHTML = `
        <button type="button" onclick="closeWindow()">Cancel</button>
        <button type="button" onclick="openPage('properties')" class="next">Next</button>`
    }

    if (page === 'properties') {
        let page1 = document.getElementById("page-1");
        let page2 = document.getElementById("page-2");
        let page3 = document.getElementById("page-3");

        page1.classList.remove("shown");
        page2.classList.add("shown");
        page3.classList.remove("shown");

        document.getElementById("bottomRow").innerHTML = `
        <button type="button" onclick="openPage('default')">Back</button>
        <button type="button" onclick="openPage('plugins')" class="next">Next</button>`
    }

    if (page === 'plugins') {
        let page1 = document.getElementById("page-1");
        let page2 = document.getElementById("page-2");
        let page3 = document.getElementById("page-3");

        page1.classList.remove("shown");
        page2.classList.remove("shown");
        page3.classList.add("shown");

        document.getElementById("bottomRow").innerHTML = `
        <button type="button" onclick="openPage('properties')">Back</button>
        <button type="button" onclick="finishCreate()" class="next">Create</button>`
    }
}