let projects = [];

    function saveProjects() {
        localStorage.setItem("projects", JSON.stringify(projects));
    }

    function loadProjects() {
        let savedProjects = localStorage.getItem("projects");
        if (savedProjects) {
            projects = JSON.parse(savedProjects);
            displayProjects();
        }
    }

    function displayProjects() {
        let tbody = document.getElementById("projectTableBody");
        tbody.innerHTML = "";

        projects.forEach((project, index) => {
            let tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${project.name}</td>
                <td>${project.image}</td>
                <td>${project.link}</td>
                <td>${project.tags.map(tag => `<button class="btn btn-secondary btn-sm tag-btn" disabled>${tag}</button>`).join("")}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteProject(${index})">Delete</button>
                    <button class="btn btn-info btn-sm" onclick="editProject(${index})">Update</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function addProject() {
        let projectName = document.getElementById("projectName").value;
        let imageUrl = document.getElementById("imageUrl").value;
        let link = document.getElementById("link").value;
        let tags = document.getElementById("tags").value.split(",").map(tag => tag.trim());

        if (projectName && imageUrl && link && tags.length > 0) {
            let newProject = { name: projectName, image: imageUrl, link: link, tags: tags };
            projects.push(newProject);
            saveProjects();
            displayProjects();
        } else {
            alert("Please fill in all fields.");
        }
    }

    function editProject(index) {
        let newName = prompt("Enter new project name:", projects[index].name);
        let newImageUrl = prompt("Enter new image URL:", projects[index].image);
        let newLink = prompt("Enter new link:", projects[index].link);
        let newTagsInput = prompt("Enter new tags (separated by commas):", projects[index].tags.join(', '));
        let newTags = newTagsInput ? newTagsInput.split(",").map(tag => tag.trim()) : projects[index].tags;

        if (newName !== null && newImageUrl !== null && newLink !== null && newTags !== null) {
            projects[index].name = newName || projects[index].name;
            projects[index].image = newImageUrl || projects[index].image;
            projects[index].link = newLink || projects[index].link;
            projects[index].tags = newTags.length > 0 ? newTags : projects[index].tags;
            saveProjects();
            displayProjects();
        } else {
            alert("Operation canceled. No changes made.");
        }
    }

    function deleteProject(index) {
        if (confirm("Are you sure you want to delete this project?")) {
            projects.splice(index, 1);
            saveProjects();
            displayProjects();
        }
    }

    loadProjects();