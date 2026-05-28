const taskbar = document.getElementById("item-holder")
const windows = document.querySelectorAll("win-main")
const desktop = document.getElementsByTagName("desktop-icon")

let focusPriority = []

function changeFocus(to){
    if(focusPriority[0] === to.id){return}
    
    if (focusPriority.indexOf(to.id) !== -1){
        focusPriority.splice(focusPriority.indexOf(to.id), 1);
    }
    focusPriority.unshift(to.id)
    console.log(focusPriority)

    alignTaskbarAndArray()

}

function alignTaskbarAndArray(){
    for (let i = 0; i < taskbar.children.length; i++){
        // Set pressed in style on taskbar for focused window 
        if (taskbar.children[i].dataset.id === focusPriority[0]){
            taskbar.children[i].classList.add("active")
        }else if (taskbar.children[i].classList.contains("active")){
            taskbar.children[i].classList.remove("active")
        }
        // Realign z-indexes
        document.getElementById(focusPriority[i]).style.zIndex = focusPriority.length - i
    }
}

function addItem(src, text, id){
    let item = document.createElement("task-item")
    item.dataset.src = src
    item.dataset.title = text
    item.dataset.id = id
    item.classList.add("active")
    taskbar.appendChild(item)


    item.addEventListener("click", event => {
        let i
        for (i = 0; i < windows.length; i++) {
            if (windows[i].id === item.dataset.id){
                changeFocus(windows[i])
            }
        }
    })
}

function removeItem(id){

    for (let i = 0; i < taskbar.children.length; i++){
        if (taskbar.children[i].dataset.id === id){
            taskbar.children[i].remove()
            focusPriority.splice(focusPriority.indexOf(id), 1);
            console.log(focusPriority) 
            alignTaskbarAndArray()
        }
    }


}

function unMaximize(currwindow){
    currwindow.classList.remove("max")
    currwindow.style.left = currwindow.dataset.left
    currwindow.style.top = currwindow.dataset.top 
}

// Code to open windows on desktop icon click #############################################################################################
document.querySelectorAll("desktop-icon").forEach(element => {
    element.addEventListener("click", event => {
        let i;
        for (i = 0; i < desktop.length; i++) {
            if (desktop[i] === element){
                changeFocus(windows[i])
                if(!windows[i].classList.contains("open")) {
                    windows[i].classList.add("open")
                    addItem(desktop[i].firstChild.src, windows[i].getElementsByTagName("win-nav")[0].dataset.title, windows[i].id)
                }
            }
        }
    })
});

// Windows controls #######################################################################################################################

document.querySelectorAll("win-main").forEach(element => {
    element.addEventListener("mousedown", event => {
        changeFocus(element)
    })
});


document.querySelectorAll("button[aria-label='close']").forEach(element => {
    element.addEventListener("click", event => {
        let currwindow = element.parentElement.parentElement.parentElement

        if (currwindow.classList.contains("open")) {
            currwindow.classList.remove("open")
            if (currwindow.classList.contains("max")) {
                unMaximize(currwindow)
            }

            removeItem(currwindow.id)
        }
    })
});

document.querySelectorAll("button[aria-label='maximize']").forEach(element => {
    element.addEventListener("click", event => {
        let currwindow = element.parentElement.parentElement.parentElement

        if (!currwindow.classList.contains("max")) {
            currwindow.dataset.left = currwindow.style.left
            currwindow.dataset.top = currwindow.style.top
            currwindow.style.left = 0
            currwindow.style.top = 0
            currwindow.classList.add("max")
        } else {
            unMaximize(currwindow)
        }
    })
});

document.querySelectorAll("button[aria-label='minimize']").forEach(element => {
    element.addEventListener("click", event => {
        let currwindow = element.parentElement.parentElement.parentElement

        unMaximize(currwindow)
        currwindow.classList.add("minimized")
    })
});

windows.forEach(element => {
    dragElement(element);
    resize(element);
    element.style.top = element.offsetTop + "px"
    element.style.left = element.offsetLeft + "px"
})


// i was lazy
// https://www.w3schools.com/howto/howto_js_draggable.asp
function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    if (elmnt.querySelector("win-nav")) {
        // if present, the header is where you move the DIV from:
        elmnt.querySelector("win-nav").onmousedown = dragMouseDown;
        elmnt.querySelector("win-nav").ontouchstart = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.Event;
        if (elmnt.classList.contains('max') || e.target.tagName === "BUTTON") { return }
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.ontouchend = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.Event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        if((elmnt.offsetTop - pos2) < 0){pos2 = 0}
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function resize(elmnt) {
    let objX = 0, objY = 0, mouseX = 0, mouseY = 0;

    if (elmnt.querySelector("win-nav")) {
        // if present, the header is where you move the DIV from:
        elmnt.querySelector(".drag").onmousedown = dragMouseDown;
        elmnt.querySelector(".drag").ontouchstart = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.Event;
        if (elmnt.classList.contains('max')) { return }
        e.preventDefault();
        // get the mouse cursor position at startup:
        mouseX = e.clientX;
        mouseY = e.clientY;
        objX = parseInt(elmnt.style.left);
        objY = parseInt(elmnt.style.top);
        document.onmouseup = closeDragElement;
        document.ontouchend = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.Event;
        e.preventDefault();
        mouseX = e.clientX;
        mouseY = e.clientY;
        // set the element's new position:
        elmnt.style.width = (mouseX - objX) + "px";
        elmnt.style.height =  (mouseY - objY) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
