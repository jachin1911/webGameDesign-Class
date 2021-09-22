/*
 Copyright 2015, CompuScholar, Inc. and Homeschool Programming, Inc.

 Author: Chris Yust
 Last updated:  11/16/2015
 
 This source is provided as-is under the GNU 3.0 General Public License:
 http://www.gnu.org/licenses/gpl-3.0.en.html
 
 CompuScholar, Inc., Homeschool Programming, Inc. and the Author
 make no warranty and assume no liability regarding the functionality 
 of this program.  Please keep this header at the top of the source file
 in every distribution.

*/

function MouseState(canvas) {
    // buttonNummber:
    // 0 = left;
    // 1 = middle;
    // 2 = right;

    var mousestate_self = this;
    mousestate_self.currentButtons = [];
    mousestate_self.oldButtons = [];
    mousestate_self.mouseX = 0;
    mousestate_self.mouseY = 0;
    mousestate_self.parent = canvas;

    this.onMouseDown = function (e) {
        // flag this button as being held down
        mousestate_self.currentButtons[e.button] = true;

        // save current cursor coordinates
        mousestate_self.saveCoordinates(e);
        return false;
    }

    this.onMouseUp = function (e) {
        // flag this button as being released
        mousestate_self.currentButtons[e.button] = false;

        // save current cursor coordinates
        mousestate_self.saveCoordinates(e);
        return false;
    }

    this.onMouseMove = function (e) {
        // save current cursor coordinates
        mousestate_self.saveCoordinates(e);
        return false;
    }
    this.onMouseClick = function (e) {
        return false; // don't process this event
    }
    this.onMouseContextMenu = function (e) {
        return false; // don't process this event
    }
    this.onMouseDoubleClick = function (e) {
        return false; // don't process this event
    }

    this.isButtonDown = function (buttonNumber) {
        if (typeof mousestate_self.currentButtons[buttonNumber] == 'undefined') {
            return false; // button has never been pressed
        }
        // return true if the button is down or false otherwise
        return mousestate_self.currentButtons[buttonNumber];
    }

    this.wasButtonClicked = function (buttonNumber) {
        if ((typeof mousestate_self.currentButtons[buttonNumber] == 'undefined') ||
            (typeof mousestate_self.oldButtons[buttonNumber] == 'undefined')) {
            return false; // button has never been pressed and released
        }
        // return true if the button was down and is now up
        return !mousestate_self.currentButtons[buttonNumber] && mousestate_self.oldButtons[buttonNumber];
    }

    this.getX = function () {
        return mousestate_self.mouseX;
    }

    this.getY = function () {
        return mousestate_self.mouseY;
    }

    this.saveState = function () {
        // copy current button state to old button state
        mousestate_self.oldButtons = mousestate_self.currentButtons.slice();
    }

    this.saveCoordinates = function (e) {
        // save current cursor coordinates, adjusting to make 0,0 the top-left corner of the parent element

        mousestate_self.mouseX = e.clientX - mousestate_self.parent.offsetLeft + window.pageXOffset;;
        mousestate_self.mouseY = e.clientY - mousestate_self.parent.offsetTop + window.pageYOffset;;

    }

    // register this object's functions as mouse event handlers
    canvas.addEventListener("mousedown", this.onMouseDown);
    canvas.addEventListener("mouseup", this.onMouseUp);
    canvas.addEventListener("mousemove", this.onMouseMove);
    canvas.addEventListener("mouseclick", this.onMouseClick);
    canvas.addEventListener("contextmenu", this.onMouseContextMenu);
    canvas.addEventListener("dblclick", this.onMouseDoubleClick);

}