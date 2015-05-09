/* Initial Section
 * Board Creation + Background Initialization
 * Defined here: createBoard(canvasElement),
 *               grid(x, y, size),
 *               drawBoard(context, xconstraint, yconstrait, size)
 *               relMouseCoordinates(event)
 *               drawInnerSegment(context, xconstraint, yconstraint, size)
 *               drawVictory(referenceToMove, CellsWon)
 */
 var globalElement=""
function createBoard(canElem){
    HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;
    globalElement=canElem
    var context = canElem.getContext("2d");
    SIZE = 500
    context.canvas.width = SIZE + 10;
    context.canvas.height = SIZE + 10 ;
    drawBoard(context, 10, 10, SIZE);
    context.stroke();
    play(500);
}
grid = function(x, y, size){
    this.setValue = function(i,j,obj){
        this.array[i][j].value = obj;
    }
    this.won = false;
    this.start = {x: x, y: y};
    this.size = size;
    this.step = size/3;
    this.array = [];
    for(var i = 0; i < 3; i++){
        this.array[i] = [];
        for(var j = 0; j < 3; j++){
            var xref = x + this.step * i;
            var yref = y + this.step * j;
            this.array[i][j] = {x: xref, y: yref, taken:0, value:""};
        }
    }
}

function drawBoard(context, xcon, ycon, size){
    //Determine inc
    var inc = size/3;
    maingrid = new grid(xcon, ycon, size);
    drawInnerSegment(context, xcon, ycon, size);
    //Individual Segments
    for(var x = 0; x < 3; x++){
        for(var y = 0; y < 3; y++){
            //console.log("parameters", x*inc + xcon + 10, y*inc + ycon + 10, inc-20);
            var xref = x*inc + xcon + 10
            var yref = y * inc + ycon + 10;
            var t = new grid(xref, yref, inc-20);
            maingrid.setValue(x,y,t);
            drawInnerSegment(context,xref ,yref, inc-20)
        }
    }
    context.stroke();
}
/* source: https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element*/
function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft /* - currentElement.scrollLeft*/;
        totalOffsetY += currentElement.offsetTop /*- currentElement.scrollTop*/ ;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}

function drawInnerSegment(context, xcon, ycon, size){
    var inc = size/3;
    for(var x = 1; x <=2 ; x++){
        context.moveTo(xcon + inc*x, ycon);
        context.lineTo(xcon + inc*x, ycon + size);
        context.moveTo(xcon, ycon+inc*x);
        context.lineTo(xcon+size, ycon+inc*x);
    }
}
function victory(context, relstep, relstart){
    context.beginPath()
    context.lineWidth = 10;
    context.strokeStyle = g.state? "#FF0000" : "#0000FF"
    context.moveTo(relstart.x + relstep*ret[0].x + relstep/2, relstart.y + relstep*ret[0].y + relstep/2)
    context.lineTo(relstart.x + relstep*ret[2].x + relstep/2, relstart.y + relstep*ret[2].y + relstep/2)
    context.stroke();
}
function drawVictory(ref, ret){
    var context = globalElement.getContext('2d')
    var relstep = maingrid.array[ref.major.x][ref.major.y].value.step
    var relstart = maingrid.array[ref.major.x][ref.major.y].value.start
    victory(context, relstep, relstart)
}
function drawBigVictory(ref, ret){
    var context = globalElement.getContext('2d')
    var relstep = maingrid.step
    var relstart = maingrid.start
    victory(context, relstep, relstart)
}
/* Move Validation Segment
 * Everything here deals with verifying the moves of the game and making moves
 * Methods: isolate(xycoordinates),
 *          recursiveMoveCheck(ref),
 *          validateMove(ref),
 */
var isolate = function(obj){
    //Determine Overall Segment
    //X position
    //step = size/3
    var s = SIZE/3
    var xref = Math.floor(obj.x/s);
    var yref = Math.floor(obj.y/s);
    var xz = maingrid.array[xref][yref].x;
    var yz = maingrid.array[xref][yref].y;
    var zero = {x: xz, y: yz};
    //Locally determine values
    var xd = Math.abs(obj.x - zero.x);
    var yd = Math.abs(obj.y - zero.y);
    s /= 3;
    var xxref = Math.floor(xd/s);
    var yyref = Math.floor(yd/s);
    var x = maingrid.array[xref][yref].value.array[xxref][yyref].x;
    var y = maingrid.array[xref][yref].value.array[xxref][yyref].y;
    //Create Ref Objects
    var minor = {x: xxref, y: yyref}
    var major = {x: xref, y: yref}
    return {x: x, y: y, major: major, minor: minor};
}
var recursiveMoveCheck = function(ref){
    var openCount = [];
    var c = 0;
    for(var i = 0; i < 3; i++){
        for(var j = 0; j < 3; j++){
            if(maingrid.array[ref.major.x][ref.major.y].value.array[i][j].taken == 0){
                openCount[c++] = {x: i, y: j}
                if(c > 3 ) break;
            }
        }
    }
    //Don't worry if there are more than 3 moves... cuz like... mem overflow...
    if(c > 3) return true;
    else{
        ref.major.x = ref.minor.x
        ref.major.y = ref.minor.y
        for(var i = 0; i < 3; i++){
            //Build new Ref
            ref.minor.x = openCount[i].x;
            ref.minor.y = openCount[i].y;
            if(recursiveMoveCheck(ref) == false) return false
        }
        return true;
    }
}
//Replace faulty Recursive move check 
var moveCheck = function(ref){ 
    //Get next cell 
    var xref = ref.minor.x; 
    var yref = ref.minor.y; 
    for(var i = 0; i < 3; i++){ 
        for(var j = 0; j < 3; j++){ 
            if(maingrid.array[i][j].value.taken == 0) return true   
        }
    }
    return false;
}
var validateMove = function(ref){
    //Check if this specific position has been taken yet
    if(maingrid.array[ref.major.x][ref.major.y].value.array[ref.minor.x][ref.minor.y].taken != 0){
        console.log("NotUsedFailed");
        return false
    }
    else if((ref.major.x != g.nx || ref.major.y != g.ny) && g.started){
        return false;
    }
    // else if(!recursiveMoveCheck(ref)){
    //     console.log('recursion failed')
    //     return false;
    // }
    else if(!moveCheck(ref)){ 
        console.log("Move Failed")
        return false; 
    } 
    else{
        var v = ""
        //player 1 = true
        if(g.state == true) v = 1;
        //player 2 = false
        else v = 2;
    }
    console.log("Setting Major", ref.major.x, ref.major.y, "minor", ref.minor.x, ref.minor.y, "to", v)
    maingrid.array[ref.major.x][ref.major.y].value.array[ref.minor.x][ref.minor.y].taken = v
    return true;
}
var checkGrid = function(obj){
    //Check for vertical first
    //If game.state at this point is true, it is player one. Else, it is player 2
    var listen = g.state? 1: 2
    var check3_v = []
    var check3_h = []
    var check3_dl = []
    var check3_dr = []
    //There should be a more elegant way, but since IDK it yet, this will be commented out.
    //Will use the ugly method instead.
    for(var i = 0; i < 3; i++){
        console.log("i: ", i)
        check3_v = [];
        check3_h = [];
        if(obj.array[i][i].taken==listen){
            check3_dl.push({x:i,y:i});
            console.log("diag-left check", i, i, check3_dl);
        }
        if(obj.array[2-i][i].taken == listen){
            check3_dr.push({x:2-i,y:i});
            console.log("diag-right check", 2-i, i, check3_dr);
        }
        for(var j = 0; j < 3; j++){
            console.log("Going through", i, j, obj.array[i][j].taken, "alt:", obj.array[j][i].taken)
            if(obj.array[j][i].taken==listen){
                check3_h.push({x:j,y:i});
                console.log("horizontal check", j, i, check3_h);
            }
            if(obj.array[i][j].taken==listen){
                check3_v.push({x:i,y:j});
                console.log("veritical check", i, j, check3_v);
            }
        }
        if(check3_v.length == 3){
            console.log("vert won")
            return check3_v
        }else if(check3_h.length == 3){
            console.log("hor won")
            return check3_h
        } else if(check3_dl.length == 3){
            console.log("diag left won")
            return check3_dl
        } else if(check3_dr.length == 3){
            console.log("diag right won")
            return check3_dl
        }
    }
    return {x: -1, y: -1}
}
var evaluate = function(ref){
    //Check this minor grid
    var ret = checkGrid(maingrid.array[ref.major.x][ref.major.y].value)
    if(ret.x == -1) return
    else if(maingrid.array[ref.major.x][ref.major.y].value.won == true) return
    else{
        maingrid.array[ref.major.x][ref.major.y].value.won = true
        maingrid.array[ref.major.x][ref.major.y].taken = g.state ? 1 : 2
        drawVictory(ref, ret)
        var big = checkGrid(maingrid)
        if(big.x == -1) return
        else drawVictory(ref, big)
    }
}

var mark = function(e){
    var canvas = document.getElementById("board");
    var c = isolate(canvas.relMouseCoords(e));
    var w = validateMove(c)
    if(w == false){
        return;
    }
    evaluate(c);
    g.started = true;
    g.nx = c.minor.x;
    g.ny = c.minor.y;
    console.log(g.nx, g.ny)
    var x = c.x;
    var y = c.y;
    var cont = canvas.getContext("2d");
    if(g.state){
        cont.fillStyle = "#FF0000"
    }
    else{
        cont.fillStyle = "#0000FF"
    }
    g.state = w ? !g.state : g.state;
    console.log(x, y);
    cont.fillRect(x + 5, y + 5, SIZE/3/3 - 20 , SIZE/3/3 - 20);
    cont.stroke();
    console.log(e);
}
game = function(){
    this.state = true; //true = player 1, false= player2
    this.started = false;
    this.nx = 0;
    this.ny = 0;
}
function play(size){
    g = new game();
    cvs = document.getElementById("board");
    cvs.addEventListener('click', mark);
}
