// Applies functions to all members of a class
  applyWindow(document.getElementsByClassName("desktop-window"));
  
  function applyWindow(windows) {
    for (let i = 0; i < windows.length; i++) {
      const window = windows[i];
      // Get the ID of the current element
      const windowId = window.id; 
      // Insert functions here
      setDragSize(windowId);
      dragElement(document.getElementById(windowId));
    }
  }

// ----- SECTION -----
//Makes elements draggagle - Credit: W3Schools
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
  if (document.getElementById(elmnt.id + "-drag")) {
    /* if present, this is where you move the DIV from:*/
    document.getElementById(elmnt.id + "-drag").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
    }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Sets size for draggable area in title bar
function setDragSize(id) {
  document.getElementById(id + "-drag").style.height = (document.getElementById(id + "-title").offsetHeight + "px");
  document.getElementById(id + "-drag").style.width = ((document.getElementById(id + "-title").offsetWidth) - 52) + 'px';
}

// ----- SECTION -----  
// Opens desktop window and sets drag area size  
function openTab(id) {
  bringToTop(id);
  document.getElementById(id).style.display = "block";
  setDragSize(id);
  // Opens taskbar button
  document.getElementById(id + "-btn").style.display = "flex"
}

// Closes desktop window 
function closeTab(id) {
  document.getElementById(id).style.display = "none";
  document.getElementById(id + "-btn").style.display = "none"
}

// Minimizes desktop window 
function minTab(id) {
  document.getElementById(id).style.display = "none";
  document.getElementById(id).classList.remove("open");
}

function taskbarClick(win) {

  if (document.getElementById(win).classList.contains("open")){
    if (document.getElementById(win + "-btn").classList.contains("active")){
      minTab(win);
    }
    else {
      bringToTop(win);
    }
  }
  // if not open
  else {
    if (document.getElementById(win + "-btn").classList.contains("active")){
      document.getElementById(win + "-btn").classList.remove("active");
    }
    else {
      bringToTop(win);
    }
  }
}

// ----- SECTION -----  
// Closes start menu & sets btn to inactive, changes function
function closeStart() {
  document.getElementById("startmenu").style.display = "none";
  document.getElementById("startbtn").classList.remove("active");
  document.getElementById("startbtn").setAttribute("onClick", "javascript: openStart();");
}

// Opens start menu & sets btn to active, changes function
function openStart() {
  document.getElementById("startmenu").style.display = "block";
  document.getElementById("startbtn").classList.add("active");
  document.getElementById("startbtn").setAttribute("onClick", "javascript: closeStart();");
}

// Brings windows to the top when clicked on
// Also adds "inactive" class to all other windows
function bringToTop(topId) {
  const windows = document.getElementsByClassName("desktop-window");
  for (let i = 0; i < windows.length; i++) {
    var window = windows[i];
    // Sets all windows to inactive at the back
    document.getElementById(window.id).style.zIndex = "1";
    document.getElementById(window.id + "-title").classList.add("inactive");
    // Sets all taskbar btns to inactive 
    document.getElementById(window.id + "-btn").classList.remove("active");
  }

  // Sets clicked on window to top window and removes "inactive" class
  document.getElementById(topId).style.display = "block";
  document.getElementById(topId).style.zIndex = "10";
  document.getElementById(topId + "-title").classList.remove("inactive");

  // Sets clicked on window's taskbar btn to active
  document.getElementById(topId + "-btn").classList.add("active");
  document.getElementById(topId).classList.add("open");
  
  // Removes overlay from icon (if selected) and closes start menu (if open)
  document.activeElement.blur();
  closeStart('startmenu');
}

// Allows clicking on (local) embedded content to bring window to top
function iframeclick(id) {
  document.getElementById(id).contentWindow.document.body.onclick = function() {
    bringToTop(id)
  }
}

// Clock Code
(function () {

  var clockElement = document.getElementById( "clock" );

  function updateClock ( clock ) {
    clock.innerHTML = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  setInterval(function () {
      updateClock( clockElement );
  }, 1000);

}());

window.addEventListener("DOMContentLoaded", () => {
  // Only handle one particular tablist; if you have multiple tab
  // lists (might even be nested), you have to apply this code for each one
  const tabList = document.querySelector('[role="tablist"]');
  const tabs = tabList.querySelectorAll(':scope > [role="tab"]');

  // Add a click event handler to each tab
  tabs.forEach((tab) => {
    tab.addEventListener("click", changeTabs);
  });

  // Enable arrow navigation between tabs in the tab list
  let tabFocus = 0;

  tabList.addEventListener("keydown", (e) => {
    // Move right
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      tabs[tabFocus].setAttribute("tabindex", -1);
      if (e.key === "ArrowRight") {
        tabFocus++;
        // If we're at the end, go to the start
        if (tabFocus >= tabs.length) {
          tabFocus = 0;
        }
        // Move left
      } else if (e.key === "ArrowLeft") {
        tabFocus--;
        // If we're at the start, move to the end
        if (tabFocus < 0) {
          tabFocus = tabs.length - 1;
        }
      }

      tabs[tabFocus].setAttribute("tabindex", 0);
      tabs[tabFocus].focus();
    }
  });
});

// Tablist

window.addEventListener("DOMContentLoaded", () => {
  // Only handle one particular tablist; if you have multiple tab
  // lists (might even be nested), you have to apply this code for each one
  const tabList = document.querySelector('[role="tablist"]');
  const tabs = tabList.querySelectorAll(':scope > [role="tab"]');

  // Add a click event handler to each tab
  tabs.forEach((tab) => {
    tab.addEventListener("click", changeTabs);
  });

  // Enable arrow navigation between tabs in the tab list
  let tabFocus = 0;

  tabList.addEventListener("keydown", (e) => {
    // Move right
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      tabs[tabFocus].setAttribute("tabindex", -1);
      if (e.key === "ArrowRight") {
        tabFocus++;
        // If we're at the end, go to the start
        if (tabFocus >= tabs.length) {
          tabFocus = 0;
        }
        // Move left
      } else if (e.key === "ArrowLeft") {
        tabFocus--;
        // If we're at the start, move to the end
        if (tabFocus < 0) {
          tabFocus = tabs.length - 1;
        }
      }

      tabs[tabFocus].setAttribute("tabindex", 0);
      tabs[tabFocus].focus();
    }
  });
});

function changeTabs(e) {
  const targetTab = e.target;
  const tabList = targetTab.parentNode;
  const tabGroup = tabList.parentNode;

  // Remove all current selected tabs
  tabList
    .querySelectorAll(':scope > [aria-selected="true"]')
    .forEach((t) => t.setAttribute("aria-selected", false));

  // Set this tab as selected
  targetTab.setAttribute("aria-selected", true);

  // Hide all tab panels
  tabGroup
    .querySelectorAll(':scope > [role="tabpanel"]')
    .forEach((p) => p.setAttribute("aria-hidden", true));

  // Show the selected panel
  tabGroup
    .querySelector(`#${targetTab.getAttribute("aria-controls")}`)
    .removeAttribute("aria-hidden");
}

// Font options
const fontOptions = document.querySelectorAll('input[name="font-options"]');
const body = document.getElementById('body');

for(const fontOption of fontOptions){
    fontOption.addEventListener('change', changeFont);
}        

function changeFont(e) {
    console.log(e);
    if (this.checked) {
        console.log(e.target.id);
        body.className = "";
        body.classList.add(e.target.id);
    }
}