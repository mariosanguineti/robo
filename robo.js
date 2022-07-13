/*
Instructions
1. You are required to simulate a toy robot moving on a square tabletop, of dimensions 5 units x 5 units.
2. There are no other obstructions on the table surface. The robot is free to roam around the surface of the table, but must be prevented from falling to destruction.
3. Any movement that would result in the robot falling from the table must be prevented, however further valid movement commands must still be allowed.
4. All commands should be discarded until a valid place command has been executed.
5. The solution can be written in Javascript, Typescript, C#, C++ or Python. Ideally, it will be written in your strongest language.
6. The UI can be provided via CLI, however you are free to expand on this.
7. Keep it simple, keep it DRY, but don’t over complicate or over engineer, comment and test as much as possible.
8. Include a README file with instructions on how to build/compile your solution and how to run it.
9. Share your code via a public GitHub repository, git bundle or zip file.
10. We like to see how you work, not just the end result.
Commands
1.All commands should provide output indicating whether or not they succeeded.
PLACE X,Y,DIRECTION
2. X and Y are integers that indicate a location on the tabletop.
DIRECTION is a string indicating which direction the robot should face. It it one of the four cardinal directions: NORTH, EAST, SOUTH or WEST.
3. MOVE
Instructs the robot to move 1 square in the direction it is facing.
4. LEFT
Instructs the robot to rotate 90° anticlockwise/counterclockwise.
5.RIGHT
Instructs the robot to rotate 90° clockwise.
6.REPORT
Outputs the robot's current location on the tabletop and the direction it is facing.
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Robot 9th-July-2020 / Mario Barthlomew Sanguineti
////////////////////////////////////////////////////////////////////////////////////////////////////////
var rSquareSize = 75;
var sCurrentDir = "East";
var iTableTopSize = 5;
var xCurrent = rSquareSize / 2;
var yCurrent = rSquareSize / 2;
var rBoundary = iTableTopSize * rSquareSize;
////////////////////////////////////////////////////////////////////////////////////////////////////////
// Main
////////////////////////////////////////////////////////////////////////////////////////////////////////
var canvas = document.getElementById("myCanvas");
canvas.width = rBoundary + 3;
canvas.height = rBoundary + 3;

var ctx = canvas.getContext("2d");
ctx.beginPath();
DrawSquares();
PlaceRobot(xCurrent, yCurrent, sCurrentDir, "Show");
Report();
ctx.stroke();
////////////////////////////////////////////////////////////////////////////////////////////////////////
// setup mouse down event
////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function () {
   document.getElementById("myCanvas").style.cursor = "pointer";
   $("#myCanvas").bind("mousedown", function (e) {
      canvasClick(e);
   });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////
// place robot on any square with mouse
////////////////////////////////////////////////////////////////////////////////////////////////////////
function canvasClick(e) {
var { iRow, iCol } = GetRowCol(e.offsetX, e.offsetY);
console.log('x,y=' + e.offsetX + ', ' + e.offsetY);
console.log('iRow,iCol=' + iRow + ', ' + iCol);

   if (iRow > 0 && iCol > 0)  {
      var x = (iCol - 1) * rSquareSize + rSquareSize / 2;
      var y = (iRow - 1) * rSquareSize + rSquareSize / 2;

      PlaceRobot(xCurrent, yCurrent, sCurrentDir, "Erase");
      PlaceRobot(x, y, sCurrentDir, "Show");
      xCurrent = x;
      yCurrent = y;
      BoundaryHit("Clear");
   } else {
      BoundaryHit("Outside");
   }
   Report();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
// report robots status
////////////////////////////////////////////////////////////////////////////////////////////////////////
function Report() {
   var { iRow, iCol } = GetRowCol(xCurrent, yCurrent);
   var sReport = `Report<br>Direction Facing: ${sCurrentDir} <br>X=${xCurrent}, Y=${yCurrent} <br>Row=${iRow}, Col=${iCol}`;
   if (iRow > 0 && iCol > 0) {
      document.getElementById("ReportId").innerHTML = sReport + "<br>Success!";
   } else {
      document.getElementById("ReportId").innerHTML = sReport + "<br>Failure!";
   }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
// given robots x,y return row,col of grid
////////////////////////////////////////////////////////////////////////////////////////////////////////
function GetRowCol(x, y) {
   var iCol = 0;
   var iRow = 0;

   for (i = 1; i <= iTableTopSize; i++) {
      for (j = 1; j <= iTableTopSize; j++) {
         var xPos = (i - 1) * rSquareSize + 2;
         var yPos = (j - 1) * rSquareSize + 2;
         if (x >= xPos && x <= xPos + rSquareSize) {
            if (y >= yPos && y <= yPos + rSquareSize) {
               iCol = i;
               iRow = j;
               i = iTableTopSize;
               break;
            }
         }
      }
   }

   return { iRow, iCol };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
// Draw the 5x5 grid/squares
////////////////////////////////////////////////////////////////////////////////////////////////////////
function DrawSquares() {
   var i, j;
   for (i = 1; i <= iTableTopSize; i++) {
      for (j = 1; j <= iTableTopSize; j++) {
         var xPos = (i - 1) * rSquareSize + 2;
         var yPos = (j - 1) * rSquareSize + 2;
         ctx.rect(xPos, yPos, rSquareSize, rSquareSize);
      }
   }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
// rotate robot clockwise
////////////////////////////////////////////////////////////////////////////////////////////////////////
function MoveRight() {
   PlaceRobot(xCurrent, yCurrent, sCurrentDir, "Erase");
   if (sCurrentDir == "North") {
      sCurrentDir = "East";
   } else if (sCurrentDir == "East") {
      sCurrentDir = "South";
   } else if (sCurrentDir == "South") {
      sCurrentDir = "West";
   } else if (sCurrentDir == "West") {
      sCurrentDir = "North";
   }
   PlaceRobot(xCurrent, yCurrent, sCurrentDir, "Show");
   Report();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
// rotate robot anti-clockwise
////////////////////////////////////////////////////////////////////////////////////////////////////////
function MoveLeft() {
   PlaceRobot(xCurrent, yCurrent, sCurrentDir, "Erase");
   if (sCurrentDir == "North") {
      sCurrentDir = "West";
   } else if (sCurrentDir == "West") {
      sCurrentDir = "South";
   } else if (sCurrentDir == "South") {
      sCurrentDir = "East";
   } else if (sCurrentDir == "East") {
      sCurrentDir = "North";
   }
   PlaceRobot(xCurrent, yCurrent, sCurrentDir, "Show");
   Report();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
// move robot direction facing 1 square
////////////////////////////////////////////////////////////////////////////////////////////////////////
function MoveRobot() {
   //
   // erase current position
   //
   PlaceRobot(xCurrent, yCurrent, sCurrentDir, "Erase");
   //
   // move to new location
   //
   var xPos = xCurrent;
   var yPos = yCurrent;
   if (sCurrentDir == "North") {
      if (yPos - rSquareSize > 0) {
         yPos = yPos - rSquareSize;
         BoundaryHit("Clear");
      } else {
         BoundaryHit("North");
      }
   } else if (sCurrentDir == "South") {
      if (yPos + rSquareSize < rBoundary) {
         yPos = yPos + rSquareSize;
         BoundaryHit("Clear");
      } else {
         BoundaryHit("South");
      }
   } else if (sCurrentDir == "West") {
      if (xPos - rSquareSize > 0) {
         xPos = xPos - rSquareSize;
         BoundaryHit("Clear");
      } else {
         BoundaryHit("West");
      }
   } else if (sCurrentDir == "East") {
      if (xPos + rSquareSize < rBoundary) {
         xPos = xPos + rSquareSize;
         BoundaryHit("Clear");
      } else {
         BoundaryHit("East");
      }
   }
   PlaceRobot(xPos, yPos, sCurrentDir, "Show");
   //
   // update new location
   //
   xCurrent = xPos;
   yCurrent = yPos;
   Report();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
// robot message when hits Wall
////////////////////////////////////////////////////////////////////////////////////////////////////////
function BoundaryHit(sDir) {
   if (sDir == "Clear") {
      document.getElementById("BoundaryId").innerHTML = "";
   } else if (sDir == "Outside") {
      document.getElementById("BoundaryId").innerHTML = "Location Selected is Outside Boundary!";
   } else {
      document.getElementById("BoundaryId").innerHTML = "Robot Hitting '" + sDir + "' Wall!";
   }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
// place robot at specfic location with a specfic direction
////////////////////////////////////////////////////////////////////////////////////////////////////////
function PlaceRobot(xIn, yIn, sDir, sMode) {
   var iOff = rSquareSize / 3;
   var iInc = 5;
   var path = new Path2D();
   //
   // erase
   //
   ctx.fillStyle = "#0000FF";
   if (sMode == "Erase") {
      ctx.fillStyle = "#FFFFFF";
      iOff = rSquareSize / 2.8;
      iInc = 6;
   }
   //
   // draw
   //
   if (sDir == "North") {
      var x = xIn;
      var y = yIn + iInc;
      path.moveTo(x + iOff, y);
      path.lineTo(x, y - iOff);
      path.lineTo(x - iOff, y);
   } else if (sDir == "South") {
      var x = xIn;
      var y = yIn - iInc;
      path.moveTo(x + iOff, y);
      path.lineTo(x, y + iOff);
      path.lineTo(x - iOff, y);
   } else if (sDir == "West") {
      var x = xIn + iInc;
      var y = yIn;
      path.moveTo(x, y - iOff);
      path.lineTo(x - iOff, y);
      path.lineTo(x, y + iOff);
   } else if (sDir == "East") {
      var x = xIn - iInc;
      var y = yIn;
      path.moveTo(x, y - iOff);
      path.lineTo(x + iOff, y);
      path.lineTo(x, y + iOff);
   }
   ctx.fill(path);
}
