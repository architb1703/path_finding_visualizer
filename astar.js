function get_astar_path(grid, start, stop, dim_h, dim_w){
    var parents = [];
    for(var i =0; i<dim_h; i++){
        parents.push([]);
        for(var j=0; j<dim_w; j++){
            parents[i].push(0);
        }
    }
    var stack = [];
    var count = 0;
    console.log(start)
    stack.push([0, count, start, start]);
    count++;
    while(stack.length!=0){
        stack.sort(function(a,b){
            if(a[0]<b[0]){
                return(-1);
            }
            else if(a[0]>b[0]){
                return(1);
            }
            else{
                if(a[1]>b[1]){
                    return(1);
                }
                else{
                    return(-1);
                }
            }
        });
        var u = stack[0];
        delete stack[0];
        postMessage([u[2][0],u[2][1], u[0]]);
        parents[u[2][1]][u[2][0]] = u[3];
        if(u[2][0]==stop[0] && u[2][1]==stop[1]){
            console.log(u[0]);
            postMessage(parents);
            break;
        }
        if(grid[u[2][1]][u[2][0]]==-1){
            continue;
        }
        grid[u[2][1]][u[2][0]] = -1
        if(u[2][1]-1>=0 && (grid[u[2][1]-1][u[2][0]]==0 || grid[u[2][1]-1][u[2][0]]==3)){
            stack.push([u[0]+1+add_weight(u[2][0], u[2][1]-1, stop),count, [u[2][0], u[2][1]-1], u[2]])
            count+=1
        }
        if(u[2][1]+1<dim_h && (grid[u[2][1]+1][u[2][0]]==0 || grid[u[2][1]+1][u[2][0]]==3)){
            stack.push([u[0]+1+add_weight(u[2][0], u[2][1]+1, stop),count, [u[2][0], u[2][1]+1], u[2]])
            count+=1
        }
        if(u[2][0]-1>=0 && (grid[u[2][1]][u[2][0]-1]==0 || grid[u[2][1]][u[2][0]-1]==3)){
            stack.push([u[0]+1+add_weight(u[2][0]-1, u[2][1], stop),count, [u[2][0]-1, u[2][1]], u[2]])
            count+=1
        }
        if(u[2][0]+1<dim_w && (grid[u[2][1]][u[2][0]+1]==0 || grid[u[2][1]][u[2][0]+1]==3)){
            stack.push([u[0]+1+add_weight(u[2][0]+1, u[2][1], stop),count, [u[2][0]+1, u[2][1]], u[2]])
            count+=1
        }
    }
}

function add_weight(x, y, stop){
    return(Math.abs(x-stop[0])+Math.abs(y-stop[1]));
}

onmessage = function(event){
    this.console.log("Message Received");
    get_astar_path(event.data[0], event.data[1], event.data[2], event.data[3], event.data[4]);
}