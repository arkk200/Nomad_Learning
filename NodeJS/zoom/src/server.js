// 결과적으로 백엔드와 프론트엔드는 이런식으로 만들지 않는다.
// 백에서 프론트엔드의 메세지를 받고 parse한 후 프론트에 문자열 하나를 보내지 않고
// 프론트에 데이터를 보낸 후 프론트에서 parse를 한다.
// parsed.type을 이용하여 case를 여러개 사용하지도 않는다.

import http from "http";
import SocketIO from 'socket.io';
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const io = SocketIO(server);

/*
socket.io로 넘어오며 발전된 점
1. 직접 event를 만들 수 있다.
2. 프론트엔드에서, JS object를 전송할 수 있다.
*/

io.on("connection", socket => {
    // socket.on 뒤에 원하는 이벤트를 넣으면 된다.
    socket.on("enter_room", (roomName, done) => {
        console.log(roomName);
        setTimeout(() => {
            // 프론트에서 실행되는 함수의 인자를 백에서 줄 수 있다.
            done("hello from the backend"); // done 함수 내에 있는 코드는 프론트에서 실행됨
            // socketIO의 또다른 좋은 점은 백에서 프론트의 함수를 실행시킬 수 있다는 것이다.
        }, 3000);
    });
});

/*
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", socket => {
    sockets.push(socket);

    socket["nickname"] = "Anon";
    
    console.log("Conneted to Browswer ♬");

    socket.on("close", () => console.log("Disconnted from Browser ※"))

    socket.on("message", (msg) => {
        const message = JSON.parse(msg.toString('utf8'));
        switch (message.type){
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        }
    });
});
*/

server.listen(3000, handleListen);