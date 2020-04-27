var grid = [];
var start_idx = [];
var stop_idx = [];
var c, ctx;
var dim_w=25, dim_h=25;
var start_flag = 0;
var stop_flag = 0;
var color = 1;
var colors=["#FFFFFF" ,"#000000", "#FF0000", "#00FF00"]

window.onload = function(){
    if(typeof(this.Worker)!=="undefined"){
        this.console.log('Yay web browser supports workers')
        var dimensions = [this.document.documentElement.clientWidth, this.document.documentElement.clientHeight]
        c = document.getElementById("matrix");
        ctx = c.getContext('2d');
        c.height = Math.min(dimensions[0]*0.85, dimensions[1]*0.85);
        c.width = Math.min(dimensions[0]*0.85, dimensions[1]*0.85);
        draw_grid(c, dim_w, dim_h);
        color = 1;

        c.addEventListener('click', function(event){
            var xVal = event.pageX - c.offsetLeft;
            var yVal = event.pageY - c.offsetTop;
            var idx = xVal/(c.width/dim_h);
            var idy = yVal/(c.height/dim_w);
            idx = Math.floor(idx);
            idy = Math.floor(idy);
            addBlock(idx, idy);
        })
    }
    else{
        this.alert('Sorry your web browser does not suport workers')
        var button = this.document.getElementById('pathBtn');
        button.disabled = true;
    }
}

function draw_grid(element, dim_h, dim_w){
    var ctx = element.getContext("2d");
    ctx.strokeStyle = '#a1a1a1';
    for(row=0; row<dim_w; row++){
        grid.push([]);
        for(col=0; col<dim_h; col++){
            grid[row].push(0);
            ctx.lineWidth = 0.5;
            ctx.moveTo(col*element.width/dim_h,(row+1)*element.height/dim_w);
            ctx.lineTo((col+1)*element.width/dim_h, (row+1)*element.height/dim_h);
            ctx.stroke();
            ctx.lineWidth = 1;
            ctx.moveTo((col+1)*element.width/dim_h, (row)*element.height/dim_w);
            ctx.lineTo((col+1)*element.width/dim_h, (row+1)*element.height/dim_w);
            ctx.stroke();
        }
    }
}

function addBlock(idx, idy){
    if(!grid[idy][idx]){
        grid[idy][idx] = color;
        if(color==1){
            ctx.fillStyle = colors[color];
            ctx.fillRect((idx)*(c.width/dim_h), (idy)*(c.height/dim_w), c.width/dim_h, c.height/dim_w);
        }
        if(color==2){
            start_idx = [idx, idy]
            start_flag = 1;
            const button = document.getElementById("startBtn");
            button.disabled = true;
            ctx.fillStyle = colors[color];
            ctx.fillRect((idx)*(c.width/dim_h), (idy)*(c.height/dim_w), c.width/dim_h, c.height/dim_w);
            color = 0;
        }
        if(color==3){
            stop_idx = [idx, idy]
            stop_flag = 1;
            const button = document.getElementById("stopBtn");
            button.disabled = true;
            ctx.fillStyle = colors[color];
            ctx.fillRect((idx)*(c.width/dim_h), (idy)*(c.height/dim_w), c.width/dim_h, c.height/dim_w);
            color = 0;
        }
    }
    else{
        if(grid[idy][idx]==2){
            start_idx = [];
            start_flag = 0;
            const button = document.getElementById("startBtn");
            button.disabled = false;
        }
        if(grid[idy][idx]==3){
            stop_idx = [];
            stop_flag = 0;
            const button = document.getElementById("stopBtn");
            button.disabled = false;
        }
        grid[idy][idx] = 0;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect((idx)*(c.width/dim_h), (idy)*(c.height/dim_w), c.width/dim_h, c.height/dim_w);
    }
}

function getReset(){
    for(var row = 0; row<dim_w; row++){
        for(var col=0; col<dim_h; col++){
            if(grid[col][row]==0){
                grid[col][row] = 1;
            }
            addBlock(row, col);
        }
    }
    flag = 0;
    color = 1;    
}

function startBlock(){
    color = 2;
}

function stopBlock(){
    color = 3;
}

function wallBlock(){
    color = 1;
}

var flag = 0;
function getPath(){
    var workerPath = '';
    if(document.getElementById('algoSelect').value=='dijkstra'){
        workerPath = './dijkstra.js'
    }
    else if(document.getElementById('algoSelect').value=='astar'){
        workerPath = './astar.js'
    }
    if(start_idx.length==0 || stop_idx.length==0){
        alert('Pick start and stop flags');
        return;
    }
    var w = new Worker(workerPath)
    w.postMessage([grid, start_idx, stop_idx, dim_h, dim_w]);
    w.onmessage = function(event){
        if(flag){
            t = stop_idx;
            console.log(t);
            t = event.data[t[1]][t[0]];
            while((t[0]!=start_idx[0]) || (t[1]!=start_idx[1])){
                ctx.fillStyle = '#0000FF';
                ctx.fillRect((t[0])*(c.width/dim_h), (t[1])*(c.height/dim_w), c.width/dim_h, c.height/dim_w);
                t = event.data[t[1]][t[0]];
            }
        }
        else{
            //Color the block searched by the algo
            ctx.fillStyle = LightenDarkenColor('#CC0BFF', event.data[2]*0.2);
            if(event.data[0]==start_idx[0] && event.data[1]==start_idx[1]){}
            else if(event.data[0]==stop_idx[0] && event.data[1]==stop_idx[1]){
                flag = 1;
            }
            else{
                ctx.fillRect((event.data[0])*(c.width/dim_h), (event.data[1])*(c.height/dim_w), c.width/dim_h, c.height/dim_w);
            }
        }
    }
}

function LightenDarkenColor(col, amt) {
  
    var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  
}