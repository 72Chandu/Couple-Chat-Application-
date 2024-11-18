const express=require("express");
const app=express();
const indexRoutes=require("./routes/index");
const path = require("path");
const http=require("http");
const socketIo=require("socket.io");
const server=http.createServer(app);
const io=socketIo(server);

let waitingusers=[];
let room={};

io.on("connection",function(socket){
    //console.log("connected from the web server");
    socket.on("joinroom",function(){
        console.log("request to join room");
        if(waitingusers.length>0){
            let partner=waitingusers.shift();
            const roomname=`${socket.id}-${partner.id}`;
            socket.join(roomname);
            partner.join(roomname);
            io.to(roomname).emit("joined");
        }else{
            waitingusers.push(socket);
        }
    });

    socket.on("disconnect",function(){
       let index= waitingusers.findIndex(waitingusers=>waitingusers.id===socket.id);
       waitingusers.slice(index,1);

    });

})
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")));
app.use("/",indexRoutes);
server.listen(3000);


//npm run build:css -> jab tum projct pe kaam karega tab tak is ko run karna hoga 