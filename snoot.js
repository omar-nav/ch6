/*
* Florist
* functions
*
* filename: snoot.js
*/

"use strict"; // interpret document contents in JavaScript strict mode

/* global variables */
var twentyNine = document.createDocumentFragment();
var thirty = document.createDocumentFragment();
var thirtyOne = document.createDocumentFragment();
var formValidity = true;

/* set up node building blocks for selection list of days */
function setupDays() {
    var dates = document.getElementById("delivDy").getElementsByTagName("option");
    twentyNine.appendChild(dates[28].cloneNode(true));
    // add 29th
    thirty.appendChild(dates[28].cloneNode(true));
    thirty.appendChild(dates[29].cloneNode(true));
    // add 29th & 30th
    thirtyOne.appendChild(dates[28].cloneNode(true));
    thirtyOne.appendChild(dates[29].cloneNode(true));
    thirtyOne.appendChild(dates[30].cloneNode(true));
    // add 29th, 30th, & 31st
}

function updateDays() {
    var deliveryDay = document.getElementById("delivDy");
    var dates = deliveryDay.getElementsByTagName("option");
    var deliveryMonth = document.getElementById("delivMo");
    var deliveryYear = document.getElementById("delivYr");
    var selectedMonth = deliveryMonth.options[deliveryMonth.selectedIndex].value;
    while(dates[28]) {
        // remove child with index of 28 until this index is empty
        deliveryDay.removeChild(dates[28]);
    }
    if (deliveryYear.selectedIndex === -1) {
        // if no year is selected, choose the default year so length of Feb can be determined
        deliveryYear.selectedIndex = 0;
    }
    if (selectedMonth === "2" && deliveryYear.options[deliveryYear.selectedIndex].value === "2018") {
        // if leap year, Feb has 29 days
        deliveryDay.appendChild(twentyNine.cloneNode(true));
    }
    else if (selectedMonth === "4" || selectedMonth === "6" || selectedMonth === "9" || selectedMonth === "11") {
        // these months have 30 days
        deliveryDay.appendChild(thirty.cloneNode(true));
    }
    else if (selectedMonth === "1" || selectedMonth === "3" || selectedMonth === "5" || selectedMonth === "7" || selectedMonth === "8" || selectedMonth === "10" || selectedMonth === "12") {
        // these months have 31 days
        deliveryDay.appendChild(thirtyOne.cloneNode(true));
    }
}

/* remove default values and formatting from state and delivery date selection lists */
function removeSelectDefaults() {
    var emptyBoxes = document.getElementsByTagName("select");
    for (var i = 0; i < emptyBoxes.length; i++) {
        emptyBoxes[i].selectedIndex = -1;
    }
}

/*remove fallback placeholder text*/
function zeroPlaceholder() {
    var messageBox = document.getElementById("customText");
    messageBox.style.color = "black";
    if (messageBox.value === messageBox.placeholder){
        messageBox.value = "";
    }
}

/* restore placeholder text if box contains no user entry */
function checkPlaceholder() {
    var messageBox = document.getElementById("customText");
    if (messageBox.value === "") {
        messageBox.style.color = "rgb(178, 184, 183)";
        messageBox.value = messageBox.placeholder;
    }
}

function generatePlaceholder() {
    if (!Modernizr.input.placeholder) {
        var messageBox = document.getElementById("customText");
        messageBox.value = messageBox.placeholder;
        messageBox.style.color = "rgb(178,184,183)";
        if (messageBox.addEventListener) {
            messageBox.addEventListener("focus", zeroPlaceholder, false);
            messageBox.addEventListener("blur", checkPlaceholder, false);
        } else if (messageBox.attachEvent) {
            messageBox.attachEvent("onfocus", zeroPlaceholder);
            messageBox.addEventListener("onblur", checkPlaceholder, false);
        }
    }
}

/* automatically check Custom message check box if user makes entry in customText box */
function autocheckCustom() {
    var messageBox = document.getElementById("customText");
    if (messageBox.value !== "" && messageBox.value !== messageBox.placeholder) {
        // if user entry in text area, check Custom check box
        document.getElementById("custom").checked = "checked";
    }
}

/* copy values for billing address fields to delivery address fields */
function copyBillingAddress() {
    var billingInputElements = document.querySelectorAll("#billingAddress input");
    var deliveryInputElements = document.querySelectorAll("#deliveryAddress input");
    if (document.getElementById("sameAddr").checked) {
        for (var i = 0; i < billingInputElements.length; i++) {
            deliveryInputElements[i+1].value = billingInputElements[i].value;
        }
        document.querySelector("#deliveryAddress select").value = document.querySelector("#billingAddress select").value;
    } else {
        for (var i = 0; i < billingInputElements.length; i++) {
            deliveryInputElements[i + 1].value = "";
        }
        document.querySelector("#deliveryAddress select").selectedIndex = -1;
    }
}

/* validate address fieldsets */
function validateAddress(fieldsetId) {
    var inputElements = document.querySelectorAll("#" + fieldsetId + " input");
    var errorDiv = document.querySelectorAll("#" + fieldsetId + " .errorMessage")[0];
    var fieldsetValidity = true;
    var elementCount = inputElements.length;
    var currentElement;
    try {
        for (var i = 0; i < elementCount; i++) {
            // validate all input elements in fieldset
            currentElement = inputElements[i];
            if (currentElement.value === "") {
                currentElement.style.background = "rgb(255,233,233)";
                fieldsetValidity = false;
            } else {
                currentElement.style.background = "white";
            }
        }
        if (fieldsetValidity === false) {
            // throw appropriate message based on current fieldset
            if (fieldsetId === "billingAddress") {
                throw ("Please complete all Billing Address information");
            } else {
                throw ("Please complete all Delivery Address information");
            }
        } else {
            errorDiv.style.display = "none";
            errorDiv.innerHTML = "";
        }
    }
    catch(msg) {
        errorDiv.style.display = "block";
        errorDiv.innerHTML = msg;
        formValidity = false;
    }
}

/* validate form */
function validateForm(evt) {
    if (evt.preventDefault) {
        evt.preventDefault(); // prevent from submitting
    } else {
        evt.returnValue = false; // prevent form from submitting in IE8
    }
    formValidity = true; // reset value for revalidation
    validateAddress("billingAddress");
    validateAddress("deliveryAddress");
    if (formValidity === true) {
        document.getElementById("errorText").innerHTML = "";
        document.getElementById("errorText").style.display = "none";
        document.getElementsByTagName("form")[0].submit();
    } else {
        document.getElementById("errorText").innerHTML = "Please fix the indicated problems and then resubmit your order.";
        document.getElementById("errorText").style.display = "block";
        scroll(0,0);
    }
}

/* create event listeners */
function createEventListeners() {
    var deliveryMonth = document.getElementById("delivMo");
    var messageBox = document.getElementById("customText");
    var same = document.getElementById("sameAddr");
    var form = document.getElementsByTagName("form")[0];
    if (form.addEventListener) {
        form.addEventListener("submit", validateForm, false);
    } else if (form.attachEvent) {
        form.attachEvent("onsubmit", validateForm);
    }
    if (same.addEventListener) {
        same.addEventListener("click", copyBillingAddress, false);
    } else if (same.attachEvent) {
        same.attachEvent("onclick", copyBillingAddress);
    }
    if (messageBox.addEventListener) {
        messageBox.addEventListener("blur", autocheckCustom, false);
    } else if (messageBox.attachEvent) {
        messageBox.attachEvent("onblur", autocheckCustom);
    }
    if (deliveryMonth.addEventListener) {
        deliveryMonth.addEventListener("change", updateDays, false);
    } else if (deliveryMonth.attachEvent) {
        deliveryMonth.attachEvent("onchange", updateDays);
    }
    var deliveryYear = document.getElementById("delivYr");
    if (deliveryYear.addEventListener) {
        deliveryYear.addEventListener("change", updateDays, false);
    } else if (deliveryYear.attachEvent) {
        deliveryYear.attachEvent("onchange", updateDays);
    }
}

/*run initial form configuration functions*/
function setUpPage() {
    removeSelectDefaults();
    setupDays();
    createEventListeners();
    generatePlaceholder();
}

/* run setup function when page finishes loading */
if (window.addEventListener) {
    window.addEventListener("load", setUpPage, false);
} else if (window.attachEvent) {
    window.attachEvent("onload", setUpPage);
}











