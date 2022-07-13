////////////////////////////////////////////////////////////////////////////////////////////////////////
// Robot 9th-July-2020 / Mario Barthlomew Sanguineti
////////////////////////////////////////////////////////////////////////////////////////////////////////
var rSquareSizeX = 100;                         // px width of square
var rSquareSizeY = 50;                          // px height of square
var sCurrentDir = "East";                       // initial location robot is facing
var iTableTopSize = 8;                          // Grid size 8x8
var rBoundaryX = iTableTopSize * rSquareSizeX;  // Total width of play area for robot
var rBoundaryY = iTableTopSize * rSquareSizeY;  // Total height of play area for robot
var iOffBound  = 0;                             // boundar between play wall and canvas wall
var xCurrent = rSquareSizeX / 2 + iOffBound/2;  // initial default location X of robot
var yCurrent = rSquareSizeY / 2 + iOffBound/2;  // initial default location Y of robot
var clickMode='robot';                          // initial default placement of onclick is to place robot
////////////////////////////////////////////////////////////////////////////////////////////////////////
// obstacle setup
////////////////////////////////////////////////////////////////////////////////////////////////////////
var Obstacle = new Array(iTableTopSize+1);
for(var i = 0; i< Obstacle.length; i++){
   Obstacle[i] = new Array(iTableTopSize+1);
};
ClearObstacles();
DoPlaceRobot();
Obstacle[iTableTopSize/2][iTableTopSize/2]=1;    // initial placement of obstacle rougthly at middle of play area
Obstacle[1][1]=2;                                // initial placement of robot
////////////////////////////////////////////////////////////////////////////////////////////////////////
// Main
////////////////////////////////////////////////////////////////////////////////////////////////////////
var canvas = document.getElementById("myCanvas");
canvas.width  = rBoundaryX + iOffBound;
canvas.height = rBoundaryY + iOffBound;
var ctx = canvas.getContext("2d");
ctx.beginPath();
DrawSquares();
PlaceObstacles();
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
// Clear Obstacles
////////////////////////////////////////////////////////////////////////////////////////////////////////
function ClearObstacles()
{
   for (iCol = 1; iCol <= iTableTopSize; iCol++) {
      for (iRow = 1; iRow <= iTableTopSize; iRow++) {
         Obstacle[iRow][iCol]=0;
      }
   }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
// Place Obstacles
////////////////////////////////////////////////////////////////////////////////////////////////////////
function PlaceObstacles()
{
   for (iCol = 1; iCol <= iTableTopSize; iCol++) {
      for (iRow = 1; iRow <= iTableTopSize; iRow++) {
         if(Obstacle[iRow][iCol] == 1) {
            var { x, y } = GetXY(iRow, iCol);
            var width =rSquareSizeX*0.5;
            var height=rSquareSizeY*0.5;
            x=x + width*0.5;
            y=y + height*0.5;
            ctx.fillStyle = 'red';
            ctx.fillRect(x,y,width,height);
         }
      }
   }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
// given robots row,col return favourable grid location x, Y
////////////////////////////////////////////////////////////////////////////////////////////////////////
function GetXY(iRow, iCol) {
   var x = (iCol - 1) * rSquareSizeX + iOffBound/2;
   var y = (iRow - 1) * rSquareSizeY + iOffBound/2;
   return { x, y };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
// enable place onstacles/rbot/clear from button
////////////////////////////////////////////////////////////////////////////////////////////////////////
function DoPlaceObstacles()
{
   clickMode = 'obstacle';
   document.getElementById("ModeId").innerHTML="Click Square(s) in Grid to Place lots of <u>Obstacle(s).</u>";
}
function DoPlaceRobot()
{
   clickMode = 'robot';
   document.getElementById("ModeId").innerHTML="Click a Square in Grid to Place the <u>Robot.</u>";
}
function DoClearAll()
{
    location.reload();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
// place robot on any square with mouse
////////////////////////////////////////////////////////////////////////////////////////////////////////
function canvasClick(e) {
   var { iRow, iCol } = GetRowCol(e.offsetX, e.offsetY);
//
// robot or obstacle already at this location
//
   if( Obstacle[iRow][iCol] == 1) {
      return true;
   }
   else if( Obstacle[iRow][iCol] == 2) {
      return true;
   }
//
// place robot
//
   if(clickMode == 'robot') {
      if (iRow > 0 && iCol > 0)  {
         var x = (iCol - 1) * rSquareSizeX + rSquareSizeX / 2 + iOffBound /2;
         var y = (iRow - 1) * rSquareSizeY + rSquareSizeY / 2 + iOffBound /2;
         PlaceRobot(xCurrent, yCurrent, sCurrentDir, "Erase");
         PlaceRobot(x, y, sCurrentDir, "Show");
         xCurrent = x;
         yCurrent = y;
         BoundaryHit("Clear");
      } else {
         BoundaryHit("Outside");
      }
   }
//
// place obstacle
//
   else if(clickMode == 'obstacle') {
      var { iRow, iCol } = GetRowCol(e.offsetX, e.offsetY);
      Obstacle[iRow][iCol] = 1;
      PlaceObstacles();
   }
//
// report
//
   Report();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
// report robots status
////////////////////////////////////////////////////////////////////////////////////////////////////////
function Report() {
   var { iRow, iCol } = GetRowCol(xCurrent, yCurrent);
   var sReport = `Report<br>Direction Facing: ${sCurrentDir} <br>X=${xCurrent}, Y=${yCurrent} <br>Row=${iRow}, Col=${iCol}`;
   if (iRow > 0 && iCol > 0) {
      document.getElementById("ReportId").innerHTML = sReport;
   } else {
      document.getElementById("ReportId").innerHTML = sReport;
      document.getElementById("BoundaryId").innerHTML="<br>Failure!";
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
         var xPos = (i - 1) * rSquareSizeX + iOffBound/2;
         var yPos = (j - 1) * rSquareSizeY + iOffBound/2;
         if (x >= xPos && x <= xPos + rSquareSizeX) {
            if (y >= yPos && y <= yPos + rSquareSizeY) {
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
         var xPos = (i - 1) * rSquareSizeX + iOffBound/2;
         var yPos = (j - 1) * rSquareSizeY + iOffBound/2;
         ctx.rect(xPos, yPos, rSquareSizeX, rSquareSizeY);
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
//
// heading North
//
   if (sCurrentDir == "North") {
      if (yPos - rSquareSizeY > 0) {
         var { iRow, iCol } = GetRowCol(xPos, yPos - rSquareSizeY);
         if(Obstacle[iRow][iCol] == 1) {
            BoundaryHit("Obstacle Heading North");
         } else {
            yPos = yPos - rSquareSizeY;
            BoundaryHit("Clear");
         }
      } else {
         BoundaryHit("North");
      }
//
// heading South
//
   } else if (sCurrentDir == "South") {
      if (yPos + rSquareSizeY < rBoundaryY) {
         var { iRow, iCol } = GetRowCol(xPos, yPos + rSquareSizeY);
         if(Obstacle[iRow][iCol] == 1) {
            BoundaryHit("Obstacle Heading South");
         } else {
            yPos = yPos + rSquareSizeY;
            BoundaryHit("Clear");
         }
      } else {
         BoundaryHit("South");
      }
//
// heading West
//
   } else if (sCurrentDir == "West") {
      if (xPos - rSquareSizeX > 0) {
         var { iRow, iCol } = GetRowCol(xPos - rSquareSizeX, yPos);
         if(Obstacle[iRow][iCol] == 1) {
            BoundaryHit("Obstacle Heading West");
         } else {
            xPos = xPos - rSquareSizeX;
            BoundaryHit("Clear");
         }
      } else {
         BoundaryHit("West");
      }
//
// heading East
//
   } else if (sCurrentDir == "East") {
      if (xPos + rSquareSizeX < rBoundaryX) {
         var { iRow, iCol } = GetRowCol(xPos + rSquareSizeX, yPos);
         if(Obstacle[iRow][iCol] == 1) {
            BoundaryHit("Obstacle Heading East");
         } else {
            xPos = xPos + rSquareSizeX;
            BoundaryHit("Clear");
         }
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
   if(sDir.match(/Obstacle/)) {
      document.getElementById("BoundaryId").innerHTML = sDir;
   } else if (sDir == "Clear") {
      document.getElementById("BoundaryId").innerHTML = "Success!";
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
   var iOff = Math.min(rSquareSizeX,rSquareSizeY) / 3;
   var iInc = 5;
   var path = new Path2D();
   //
   // erase
   //
   ctx.fillStyle = "#0000FF";
   if (sMode == "Erase") {
      ctx.fillStyle = "#FFFFFF";
      iOff = Math.min(rSquareSizeX,rSquareSizeY) / 2.70;
      iInc = 6;
      var { iRow, iCol } = GetRowCol(xCurrent, yCurrent);
      Obstacle[iRow][iCol]=0;
   }
   else if(sMode == 'Show') {
      var { iRow, iCol } = GetRowCol(xIn, yIn);
      Obstacle[iRow][iCol]=2;
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
