import { clickEvents, unselect, disableLink } from "../scripts/clickEvents";
import { changeText } from "./changeStyles";

var id = 0; 

function save(user) {
    setTimeout(function(){
        const container = document.getElementById(document.getElementById("Template").getAttribute("data-selected"));
        if (container) { unselect(container); }

        if (user) { user = JSON.parse(user); }
        
        let template = {
            "name": document.getElementById("template-name").value,
            "elements": document.getElementById("Template").innerHTML,
            "owner": user?user.id:"null",
        }

        fetch("http://127.0.0.1:8000/api/templates/" + id + "/", {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(template),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Success:", data);
            alert("Saved " + template.name + "!")
        })
        .catch(err=>console.log(err))
    }, 200);
}

function load(loadId, setElements) {
    if (setElements) {
        setElements([]);
    }

    fetch("http://127.0.0.1:8000/api/templates/" + loadId + "/") 
    .then(response => response.json())
    .then(data => {
        console.log("Success:", data);
        const template = document.getElementById("Template");
        id = data.id;
        template.name = data.name;
        document.getElementById("template-name").innerText = template.name;
        document.getElementById("template-name").value = template.name;
        template.innerHTML = data.elements;
        template.style.zIndex = -1;
        template.setAttribute("data-selected", null);
        
        var elems = document.getElementsByClassName("element");
        for (const elem of elems) 
        {
            clickEvents(elem);
            changeText(elem);
            disableLink(elem);
        }

        document.getElementById("link-input").disabled = true;
    }); 
}

function newPage(setKey, setElements, user) {
    if (setKey && setElements) {
        setKey(0);
        setElements([]);
    }

    if (user) { user = JSON.parse(user); }

    let newTemplate = {
        "name": "New template",
        "elements": "<div id='Background' style='width: 100%; height: 100%; z-index: 0;'></div>",
        "owner": user?user.id:"null",
    }

    fetch("http://127.0.0.1:8000/api/templates/", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(newTemplate),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success:", data);
        id = data.id;
        const template = document.getElementById("Template");
        template.name = "New template";
        document.getElementById("template-name").innerText = "New Template";
        document.getElementById("template-name").value = "New Template";
        template.innerHTML = newTemplate.elements;
        template.style = null;
        template.setAttribute("data-selected", null);
        document.getElementById("link-input").disabled = true;
    })
    .catch(err=>console.log(err))
}

function download() {
    const container = document.getElementById(document.getElementById("Template").getAttribute("data-selected"));
    if (container) { unselect(container); }

    const template = document.getElementById("Template");
    for (const elem of [...template.getElementsByClassName("element")]) {
        elem.style.cursor = "auto";
    }

    const link = document.createElement("a");
    var content = template.innerHTML;
    content = content.concat(
        `<style>
            body {
                margin: 0;
                padding: 0;
                zoom: ${1920/(1920 - 160)};
                -moz-transform: scale${1920/(1920 - 160)};
                -moz-transform-origin: 0 0;
                font-family: Arial;
            }
            .element {
                width: 500px;
                position: absolute;
                display: inline-block;
                overflow: visible;
                white-space: normal;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                z-index: 1;
                margin-top: -${template.offsetTop}px;
                cursor: auto;
            }
            .element a {
                all: unset;
                margin: 7px 10px;
                cursor: pointer;
            }
            .element p {
                margin: 10px 10px;
                line-height: 1.5;
            }
            #Background {
                width: 100%;
                height: 100%;
                z-index: 0;
                margin: 0;
                position: absolute;
            }
        </style>`
    )
    const file = new Blob([content], { type: 'application/html' });
    link.href = URL.createObjectURL(file);
    link.download = template.name + ".html";
    link.target = "_blank";
    link.click();
    URL.revokeObjectURL(link.href);

    for (const elem of [...template.getElementsByClassName("element")]) {
        elem.style.cursor = "move";
    }
}

function clone(elements, user) {
    if (user) { user = JSON.parse(user); }

    let newTemplate = {
        "name": "New template",
        "elements": elements,
        "owner": user?user.id:"null",
    }
    console.log(newTemplate);

    fetch("http://127.0.0.1:8000/api/templates/", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(newTemplate),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success:", data);
        id = data.id;
        const template = document.getElementById("Template");
        template.name = "New template";
        document.getElementById("template-name").innerText = "New Template";
        document.getElementById("template-name").value = "New Template";
        template.innerHTML = newTemplate.elements;
        template.style = null;
        template.setAttribute("data-selected", null);
        document.getElementById("link-input").disabled = true;

        var elems = document.getElementsByClassName("element");
        for (const elem of elems) 
        {
            clickEvents(elem);
            changeText(elem);
            disableLink(elem);
        }

        document.getElementById("link-input").disabled = true;
    })
    .catch(err=>console.log(err))

    return document.getElementsByClassName("element").length
}

function deleteTemplate(delId = id) {
    fetch("http://127.0.0.1:8000/api/templates/" + delId + "/", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: "null",
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success:", data);
        alert("The template has been removed from the database.");
    })
    .catch(err=>console.log(err))
}

function findKey() {
    const elements = document.getElementsByClassName('element');
    if (elements.length === 0) { return 0; }
    const elementIds = Array.from(elements).map(element => element.id);
    const lastId = elementIds[elementIds.length - 1];

    const firstDigit = lastId.search(/\d/);
    return parseInt(lastId.substring(firstDigit), 10) + 1;
}

export { save, load, newPage, download, clone, deleteTemplate, findKey };