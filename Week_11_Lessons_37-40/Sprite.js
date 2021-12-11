/*
 Copyright 2015, CompuScholAr, Inc. and Homeschool Programming, Inc.

 Author: Chris Yust
 Last updated:  05/16/2017
 
 This source is provided as-is under the GNU 3.0 General Public License:
 http://www.gnu.org/licenses/gpl-3.0.en.html
 
 CompuScholar, Inc., Homeschool Programming, Inc. and the Author
 make no warranty and assume no liability regarding the functionality 
 of this program.  Please keep this header at the top of the source file
 in every distribution.

*/


function Sprite(imageFile, numFrames)
{
  var sprite_self = this;

  if (numFrames===undefined)
  {
    numFrames = 1;
  }

  // Declare public variables that the user may access directly
  sprite_self.x = 0;
  sprite_self.y = 0;

  sprite_self.dx = 0;
  sprite_self.dy = 0;

  sprite_self.width = 0;
  sprite_self.height = 0;

  sprite_self.isAlive = true;
  
  // Declare internal variables that should not be accessed directly
  sprite_self.myImage = new Image();
  sprite_self.myImage.src = imageFile;

  sprite_self.numFrames = numFrames;
  sprite_self.currentFrame = 0;
  sprite_self.animationInterval = 0;
  sprite_self.lastAnimationTime = 0;
  sprite_self.continuousAnimation = true;
  sprite_self.animationShortStarted = false;
  sprite_self.animationShortStopFrame = 0;
  sprite_self.animationShortFinalFrame = 0;
    
  sprite_self.imageWidth = 0;
  sprite_self.imageHeight = 0;
  sprite_self.scale = 1.0;

  // This function will be called when the image is finished loading from disk
  // and will give us a chance to calculate true width and height
  sprite_self.myImage.onload = function()
  {
    sprite_self.imageWidth = this.width / numFrames;
    sprite_self.imageHeight = this.height;

    sprite_self.width = sprite_self.imageWidth * sprite_self.scale;
    sprite_self.height = sprite_self.imageHeight * sprite_self.scale;
  }

  // this method will launch a "short" animation sequence starting 
  // at the specified frame and stopping at the specified frame.  After the
  // animation ends the image will revert to the static "final" frame
  sprite_self.startAnimationShort = function(startFrame, stopFrame, finalFrame)
  {
      // set starting frame as current frame
      sprite_self.currentFrame = startFrame;

      // store other input variables
      sprite_self.animationShortStopFrame = stopFrame;
      sprite_self.animationShortFinalFrame = finalFrame;

      // launch the short animation!
      sprite_self.animationShortStarted = true;
  }

  // this method will return true if the image is animating either
  // continuously or is amidst a "short" animation sequence
  sprite_self.isAnimating = function()
  {
      return (sprite_self.animationShortStarted || sprite_self.continuousAnimation);
  }

  // change the animation to the next frame 
  sprite_self.advanceFrame = function()
  {
      // get the current time
      var now = new Date().getTime();

      // if we have not yet reached our next scheduled frame change
      if (now < (sprite_self.lastAnimationTime + sprite_self.animationInterval))
      {
          return; // not time to advance frame yet
      }

      // figure out our last frame based on continuous or "short" mode
      var endFrame = sprite_self.numFrames - 1;   // default for continuous animation
      if (sprite_self.animationShortStarted)
      {
          endFrame = sprite_self.animationShortStopFrame;
      }

      // if we are not yet done with this sequence
      if (sprite_self.currentFrame < endFrame)
      {
          sprite_self.currentFrame += 1;  // move to the next frame
      }
      else
      {
          // if continuous animation, reset sequence to 0
          if (sprite_self.continuousAnimation)
          {
              sprite_self.currentFrame = 0;
          }
          else
          {
              // for animation short, set current frame to final frame
              sprite_self.currentFrame = sprite_self.animationShortFinalFrame;
              sprite_self.animationShortStarted = false;  // no longer animating
          }
      }

      // update last animation time
      sprite_self.lastAnimationTime = now;
  }

  // Check to see if this sprite is drawable and advance
  // animation frame if needed
  sprite_self.isDrawable = function()
  {
    if (!sprite_self.isAlive) return false; // don't do anything if not active

    // if we are currently supposed to be animating for any reason
    if (sprite_self.isAnimating())
    {
        // advance to the next frame if enough game time has elapsed
        sprite_self.advanceFrame();
    }

    if ((sprite_self.width <= 0) || (sprite_self.height <= 0))
    {
      return false; // image probably not loaded yet, don't draw
    }
    
    return true;
  }
  
  // The Draw function will paint the current image using the current location and scaled size
  sprite_self.draw = function(ctx)
  {
    if (sprite_self.isDrawable())
    {
      // draw the image using the current animation frame (if or the whole image, if not animating)
      ctx.drawImage(sprite_self.myImage,
                    sprite_self.currentFrame * sprite_self.width,0,sprite_self.imageWidth,sprite_self.imageHeight,
                    sprite_self.x,sprite_self.y,sprite_self.width,sprite_self.height);
    }
  }

  // The drawWithViewport function will paint the current image using the current location and scaled size
  sprite_self.drawWithViewport = function(ctx, view)
  {
    if (!sprite_self.isDrawable()) return;
    
    // Only draw the sprite if some part of it is visible on the screen
    if (view.isVisible(sprite_self.x,sprite_self.y,sprite_self.width,sprite_self.height))
    {
      // temporarily change the sprite's location based on the drawWithViewport view
      sprite_self.x -= view.x;
      sprite_self.y -= view.y;
      
      sprite_self.x += view.ScreenX;
      sprite_self.y += view.ScreenY;
      
      // The viewport might not cover the entire screen, and we 
      // don't want to draw outside the viewport. So we need to
      // clip the sprite image to the visible viewport.
      
      // establish default values for the parameters to drawImage()
      // (assumes no clipping needed)
      var sourceX = sprite_self.currentFrame * sprite_self.width;
      var sourceY = 0;
      var sourceWidth = sprite_self.imageWidth;
      var sourceHeight = sprite_self.imageHeight;
      var targetX = sprite_self.x;
      var targetY = sprite_self.y;
      var targetWidth = sprite_self.width;
      var targetHeight = sprite_self.height;
      
      // All of these calculations are done in screen coordinates

      // if left side of sprite is to the left of visible area
      if (targetX < view.ScreenX)
      {
        var delta = view.ScreenX - targetX;
        sourceX += delta / sprite_self.scale;
        sourceWidth -= delta / sprite_self.scale;
        targetX += delta; 
        targetWidth -= delta;
      }
              
      // if right side of sprite is to the right of visible area
      if ((targetX+targetWidth) > (view.ViewWidth + view.ScreenX))
      {
        var delta = (targetX+targetWidth) - (view.ViewWidth + view.ScreenX);
        sourceWidth -= delta / sprite_self.scale;
        targetWidth -= delta;
      }
              
      // if top side of sprite is above visible area
      if (targetY < view.ScreenY)
      {
        var delta = view.ScreenY - targetY;
        sourceY += delta / sprite_self.scale;
        sourceHeight -= delta / sprite_self.scale;
        targetY += delta; 
        targetHeight -= delta;
      }
              
      // if bottom side of sprite is below visible area
      if ((targetY+targetHeight) > (view.ViewHeight + view.ScreenY))
      {
        var delta = (targetY+targetHeight) - (view.ViewHeight + view.ScreenY);
        sourceHeight -= delta / sprite_self.scale;
        targetHeight -= delta;
      }
              
      // draw the image using the current animation frame (if or the whole image, if not animating)
      ctx.drawImage(sprite_self.myImage,
                    sourceX, sourceY, sourceWidth, sourceHeight,
                    targetX, targetY, targetWidth, targetHeight);
      
      // restore the sprite's true location in world coordinates
      sprite_self.x += view.x;
      sprite_self.y += view.y;

      sprite_self.x -= view.ScreenX;
      sprite_self.y -= view.ScreenY;
    }
  }


  // The drawBoundingRectangle function will outline the sprite with a thin black border
  // so you can see the edges of the image (for testing purposes)
  sprite_self.drawBoundingRectangle = function(ctx)
  {
    if (!sprite_self.isAlive) return; // don't do anything if not active

  	ctx.lineWidth = 1;
  	ctx.strokeStyle = 'black';
  	ctx.strokeRect(sprite_self.x, sprite_self.y, sprite_self.width, sprite_self.height);
  }

  // The setScale function will increase or decrease the apparent size of the image
  // using a multiplication factor (e.g. 1.0 = 100%)
  sprite_self.setScale = function(mult)
  {
    sprite_self.scale = mult;

    sprite_self.width = sprite_self.imageWidth * sprite_self.scale;
    sprite_self.height = sprite_self.imageHeight * sprite_self.scale;
  }

  // The moveAndVanish function will update the current position using the current velocity (dx, dy)
  // and if the image has left the screen, sets isAlive = false
  sprite_self.moveAndVanish = function(maxWidth, maxHeight)
  {
    sprite_self.updateTTL();  // handle any TTL configuration

    if (!sprite_self.isAlive) return; // don't do anything if not active

    // update the current block position using current deltas
    sprite_self.x += sprite_self.dx;
    sprite_self.y += sprite_self.dy;

    if (sprite_self.x > maxWidth)   // if the X value is too large
    {
        sprite_self.isAlive = false;  // this sprite is now disabled
    }
              
    if (sprite_self.y > maxHeight)  // if the Y value is too large
    {
        sprite_self.isAlive = false;  // this sprite is now disabled
    }
              
    if (sprite_self.x < -sprite_self.width)  // if the X value is too small
    {
        sprite_self.isAlive = false;  // this sprite is now disabled
    }
              
    if (sprite_self.y < -sprite_self.height) // if the Y value is too small
    {
        sprite_self.isAlive = false;  // this sprite is now disabled
    }
  }

  // The moveAndWrap function will update the current position using the current velocity (dx, dy)
  // and also wrap the image around the screen if it runs off an edge        
  sprite_self.moveAndWrap = function(maxWidth, maxHeight)
  {
    sprite_self.updateTTL();  // handle any TTL configuration

    if (!sprite_self.isAlive) return; // don't do anything if not active

    // update the current block position using current deltas
    sprite_self.x += sprite_self.dx;
    sprite_self.y += sprite_self.dy;

    if (sprite_self.x > maxWidth)   // if the X value is too large
    {
        sprite_self.x = -sprite_self.width; // reset it to -width
    }
              
    if (sprite_self.y > maxHeight)  // if the Y value is too large
    {
        sprite_self.y = -sprite_self.height; // reset it to -height
    }
              
    if (sprite_self.x < -sprite_self.width)  // if the X value is too small
    {
        sprite_self.x = maxWidth;   // reset it to maxWidth
    }
              
    if (sprite_self.y < -sprite_self.height) // if the Y value is too small
    {
        sprite_self.y = maxHeight;  // reset it to maxHeight
    }
  }

  // The moveAndBounce function will update the current position using the current velocity (dx, dy)
  // and bounce it off an edge of the screen
  sprite_self.moveAndBounce = function (maxWidth, maxHeight) 
  {
    sprite_self.updateTTL();  // handle any TTL configuration

    if (!sprite_self.isAlive) return; // don't do anything if not active

    // update the current block position using current deltas
    sprite_self.x += sprite_self.dx;
    sprite_self.y += sprite_self.dy;

    if (sprite_self.x > maxWidth)  // if the X value is too large
    {
        sprite_self.dx *= -1;      // reverse X direction
    }
              
    if (sprite_self.y > maxHeight) // if the Y value is too large
    {
        sprite_self.dy *= -1;      // reverse Y direction
    }
              
    if (sprite_self.x < 0)         // if the X value is too small
    {
        sprite_self.dx *= -1;      // reverse X direction
    }
              
    if (sprite_self.y < 0)         // if the Y value is too small
    {
        sprite_self.dy *= -1;      // reverse Y direction
    }
  }

  // The isCollided function will return true if this sprite's bounding rectangle
  // overlaps with the target sprite's bounding rectangle
  sprite_self.isCollided = function (otherSprite) 
  {
    // don't do anything if not active
    if (!sprite_self.isAlive) return false; // don't do anything if not active
    if (!otherSprite.isAlive) return false;
    
    var notCollided = otherSprite.x > (sprite_self.x+sprite_self.width-1) || 
                      (otherSprite.x+otherSprite.width-1) < sprite_self.x || 
                      otherSprite.y > (sprite_self.y+sprite_self.height-1) || 
                      (otherSprite.y+otherSprite.height-1) < sprite_self.y;
        
    return !notCollided;
  }

  // This function will set the sprite's time-to-live value equal to the current
  // time plus the specified number of milliseconds
  sprite_self.setTTL = function (milliseconds)
  {
    sprite_self.ttlElapse = new Date().getTime() + milliseconds;
  }
  
  // This function will check the current time against the TTL elapse value
  // and inactive the sprite if it has exceeded its TTL span
  sprite_self.updateTTL = function()
  {
    if (sprite_self.ttlElapse != 0)
    {
      if (new Date().getTime() >= sprite_self.ttlElapse)
      {
        sprite_self.isAlive = false;  // this TTL has elapsed
      }
    }
  }

  // This function will modify the current dx and dy values to remain within
  // the indicated maximum speed
  sprite_self.setMaxSpeed = function(maxSpeed)
  {
    // calculate current speed
    var currentSpeed = Math.sqrt(sprite_self.dx * sprite_self.dx + sprite_self.dy * sprite_self.dy);
    
    // if current speed is too high
    if (currentSpeed > maxSpeed)
    {
      // scale down dx and dy values
      sprite_self.dx = maxSpeed * sprite_self.dx / currentSpeed;
      sprite_self.dy = maxSpeed * sprite_self.dy / currentSpeed;
    }
  }
}          