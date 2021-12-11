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

function KeyState() {
    var keystate_self = this;
    keystate_self.currentKeys = [];
    keystate_self.oldKeys = [];

    this.onKeyDown = function (e) {
        // flag this key as being held down
        keystate_self.currentKeys[e.keyCode] = true;
    }

    this.onKeyUp = function (e) {
        // flag this key as being released
        keystate_self.currentKeys[e.keyCode] = false;
    }

    this.isKeyDown = function (keyCode) {
        if (typeof keystate_self.currentKeys[keyCode] == 'undefined') {
            return false; // key has never been pressed
        }
        // return true if the key is down or false otherwise
        return keystate_self.currentKeys[keyCode];
    }

    this.wasKeyClicked = function (keyCode) {
        if ((typeof keystate_self.oldKeys[keyCode] == 'undefined') ||
            (typeof keystate_self.currentKeys[keyCode] == 'undefined')) {
            return false; // key has never been pressed and released
        }
        // return true if the key was down and is now up
        return !keystate_self.currentKeys[keyCode] && keystate_self.oldKeys[keyCode];
    }

    this.saveState = function () {
        keystate_self.oldKeys = keystate_self.currentKeys.slice(); // copy current keys state to old keys state
    }

    // register this object's functions as key event handlers
    addEventListener("keydown", this.onKeyDown);
    addEventListener("keyup", this.onKeyUp);

}