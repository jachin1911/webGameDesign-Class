/*
 Copyright 2016, CompuScholar, Inc. and Homeschool Programming, Inc.

 Author: Chris Yust
 Last updated:  05/16/2017
 
 This source is provided as-is under the GNU 3.0 General Public License:
 http://www.gnu.org/licenses/gpl-3.0.en.html
 
 CompuScholar, Inc., Homeschool Programming, Inc. and the Author
 make no warranty and assume no liability regarding the functionality 
 of this program.  Please keep this header at the top of the source file
 in every distribution.

*/

function Viewport(vWidth, vHeight, wWidth, wHeight, screenX, screenY)
{
  
    if (screenX === undefined)
    {
      screenX = 0;
    }
    if (screenY === undefined)
    {
      screenY = 0;
    }
  
    var viewportstate_self = this;

    // the world position of the upper-left coordinate of the viewport
    viewportstate_self.x = 0;
    viewportstate_self.y = 0;

    // the screen position of the upper-left coordinate of the viewport
    viewportstate_self.ScreenX = screenX;
    viewportstate_self.ScreenY = screenY;

    // these variables are used to keep the viewport view within
    // valid world coordinates
    viewportstate_self.ViewWidth = vWidth;
    viewportstate_self.ViewHeight = vHeight;
    viewportstate_self.WorldWidth = wWidth;
    viewportstate_self.WorldHeight = wHeight;

    // this function will move the viewport view and 
    // prevent the viewport's display from straying
    // outside the bounds of world coordinates
    this.setView = function(newX, newY)
    {
        viewportstate_self.x = newX;
        viewportstate_self.y = newY;
      
        if (viewportstate_self.x < 0)
        {
            viewportstate_self.x = 0;
        }
        if ((viewportstate_self.x + viewportstate_self.ViewWidth) > viewportstate_self.WorldWidth)
        {
            viewportstate_self.x = viewportstate_self.WorldWidth - viewportstate_self.ViewWidth;
        }

        if (viewportstate_self.y < 0)
        {
            viewportstate_self.y = 0;
        }
        if ((viewportstate_self.y + viewportstate_self.ViewHeight) > viewportstate_self.WorldHeight)
        {
            viewportstate_self.y = viewportstate_self.WorldHeight - viewportstate_self.ViewHeight;
        }
    }

    // this utility method will return true if the specified object is at all 
    // visible within the viewport view
    this.isVisible = function(objectx, objecty, objectWidth, objectHeight)
    {
        // all coordinates are in world coordinates
        var notCollided = objectx > (viewportstate_self.x + viewportstate_self.ViewWidth - 1) || 
                          (objectx + objectWidth - 1) < (viewportstate_self.x) || 
                          objecty > (viewportstate_self.y + viewportstate_self.ViewHeight - 1) || 
                          (objecty + objectHeight - 1) < (viewportstate_self.y);
            
        return !notCollided;
    }

}
