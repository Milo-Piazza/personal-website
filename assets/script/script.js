const createInterval = 800;
const moveMinInterval = 100;
const moveMaxInterval = 200;
const matrixTextHeight = 14;
const matrixTextWidth = 10;
const textChangeInterval = 100;
const garbageCollectHeight = 20;
const maxMatrixText = 30;
const timeToFadeOut = 1200;

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

class FallingText {
    constructor(cssClass, left, moveInterval, timestamp, text) {
        this.cssClass = cssClass;
        this.moveInterval = moveInterval;
        this.nextMove = timestamp + moveInterval;
        this.nextTextChange = timestamp + textChangeInterval;
        $("#matrix-container").append("<div class=\"matrix-text " + this.cssClass + "\">" + text + "</div>"); // jQuery Function Number 1
        $("." + this.cssClass).css("top", "0px"); // jQuery Function Number 2
        $("." + this.cssClass).css("left", left + "px");
        this.changeText(timestamp);
    }
    update(timestamp) {
        if (timestamp >= this.nextTextChange) {
            this.changeText(timestamp);
        }
        if (timestamp >= this.nextMove) {
            return this.moveDown(timestamp);
        }
        return false;
    }
    moveDown(timestamp) {
        //TODO: Handle case when it goes below the screen -- removeText(); return false
        let position = $("." + this.cssClass).position(); // jQuery Function Number 3
        let top = position.top;
        let left = position.left;
        if (document.body.scrollHeight < (top + matrixTextHeight * 2)) { //if the text would go beyond the screen
            $("." + this.cssClass).remove();
            return true; //caller should dealloc this object
        }
        $("." + this.cssClass).css("top", (top + matrixTextHeight) + "px");
        let currText = $("." + this.cssClass).text();
        $("#matrix-container").prepend("<div class=\"fading-text ftext-" + this.cssClass + "-" + top + "-" + left + "\">" + currText + "</div>"); // jQuery Function Number 4
        $("." + "ftext-" + this.cssClass + "-" + top + "-" + left).css("top", top);
        $("." + "ftext-" + this.cssClass + "-" + top + "-" + left).css("left", left);
        //remove the fading-text garbageCollectHeight lines above
        if ((top - (garbageCollectHeight * matrixTextHeight) > 0) && ($("." + "ftext-" + this.cssClass + "-" + (top - (garbageCollectHeight * matrixTextHeight)) + "-" + left).css("opacity") == 0)) {
            $("." + "ftext-" + this.cssClass + "-" + (top - (garbageCollectHeight * matrixTextHeight)) + "-" + left).remove();
        }
        this.nextMove += this.moveInterval;
        return false;
    }
    changeText(timestamp) {
        let asciiValue = getRndInteger(33, 126);
        let newChar = String.fromCharCode(asciiValue);
        $("." + this.cssClass).text(newChar); // jQuery Function Number 5
        this.nextTextChange += textChangeInterval;
    }
}

function createNewFallingText(set, timestamp, count) {
    let left = getRndInteger(0, parseInt($(window).width() / matrixTextWidth)) * matrixTextWidth;
    let cssClass = "ftext-" + count;
    let moveInterval = getRndInteger(moveMinInterval, moveMaxInterval);
    let asciiValue = getRndInteger(33, 126);
    let newChar = String.fromCharCode(asciiValue);
    let newText = new FallingText(cssClass, left, moveInterval, timestamp, newChar);
    set.add(newText);
}

$(document).ready(function() {
    let timestamp = (new Date).getTime();
    let nextTextCreate = timestamp + createInterval;
    let textObjects = new Set();
    let count = 0;
    createNewFallingText(textObjects, timestamp, count);
    count = (count + 1) % maxMatrixText;
    setInterval(function() {
        timestamp = (new Date).getTime();
        if (timestamp >= nextTextCreate) {
            nextTextCreate += createInterval;
            createNewFallingText(textObjects, timestamp, count);
            count = (count + 1) % maxMatrixText;
        }
        for (let textObj of textObjects) {
            if (textObj.update(timestamp)) {
                textObjects.delete(textObj);
            }
        }
    }, 75);
    /*for (int i = 0; i < 15; i++) {

    }
    $("#projects-link").hover(function () {

    });
    $("#projects-link").hover(function () {

    });*/
});