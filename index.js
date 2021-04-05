const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`server listening on port: ${PORT}`)
  });

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
app.post('/createroom', function (req = express.Request, res = express.Response) { 
    result = 0;
    let room_code = makeid(8)
    let player_name = req.query.player_name
    room = {
        code : room_code,
        players: [player_name],
        state: "queue",
        statearr : [] 
    }
fs.writeFile('rooms/'+room_code+'.json', JSON.stringify(room), (err) => {
    // throws an error, you could also catch it here
    if (err){ 
        res.send({"failed": "can't create room"});
        throw err;
    }
    // success case, the file was saved
    res.send({"success": room_code});
});
});
app.post('/joinroom', function (req = express.Request, res = express.Response) { 
    let room_code = req.query.room_code
    let player_name = req.query.player_name
    const filePath = 'rooms/'+room_code+'.json';
    var fileObject = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if(fileObject.players.length<4){
        if(fileObject.players.includes(player_name)){
            res.send({"failed": "Name already used"});
            return;
        }
        if(fileObject.state != "queue"){
            res.send({"failed": "Already in game"});
            return;
        }
        fileObject.players.push(player_name)
        console.log(fileObject.players)
        fs.writeFile('rooms/'+room_code+'.json', JSON.stringify(fileObject), (err) => {
            // throws an error, you could also catch it here
            if (err){ 
                res.send({"failed": "player not added"});
                throw err;
            }
            // success case, the file was save
            res.send({"success": "player add"});
        });
    }else{
        res.send({"failed": "the room is full"})
    }
});
app.get('/roomstate', function (req = express.Request, res = express.Response) {
    console.log(req)
    let room_code = req.query.room_code
    const filePath = 'rooms/'+room_code+'.json';
    var fileObject = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.send(fileObject);
})
app.get('/roomstart', function (req = express.Request, res = express.Response) {
    let room_code = req.query.room_code
    const filePath = 'rooms/'+room_code+'.json';
    var fileObject = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if(fileObject.players.length<=4){
        if(fileObject.state != "queue"){
            res.send({"failed": "Already in game"});
            return;
        }
        fileObject.state = "puzzle1"
        fs.writeFile('rooms/'+room_code+'.json', JSON.stringify(fileObject), (err) => {
            // throws an error, you could also catch it here
            if (err){ 
                res.send({"failed": "player not added"});
                throw err;
            }
            // success case, the file was save
            res.send({"success": "puzzle1"});
        });
    }else{
        res.send({"failed": "the room is full"})
    }
});
app.get('/imright', function (req = express.Request, res = express.Response) {
    let room_code = req.query.room_code
    let player_name = req.query.player_name
    const filePath = 'rooms/'+room_code+'.json';
    var fileObject = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if(fileObject.players.length<=4){

        fileObject.statearr.push(player_name)
        if(fileObject.players.length == fileObject.statearr.length){
            fileObject.state = "puzzle2"
        }
        fs.writeFile('rooms/'+room_code+'.json', JSON.stringify(fileObject), (err) => {
            // throws an error, you could also catch it here
            if (err){ 
                res.send({"failed": "player not added"});
                throw err;
            }
            // success case, the file was save
            res.send({"success": "puzzle1"});
        });
    }else{
        res.send({"failed": "the room is full"})
    }
});
app.get('/changestate', function (req = express.Request, res = express.Response) {
    let room_code = req.query.room_code
    let player_name = req.query.player_name
    const filePath = 'rooms/'+room_code+'.json';
    var fileObject = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if(fileObject.players.length<=4){

        fileObject.statearr.push(player_name)
        if(fileObject.players.length == fileObject.statearr.length){
            fileObject.state = "puzzle2"
        }
        fileObject.state = player_name
        fs.writeFile('rooms/'+room_code+'.json', JSON.stringify(fileObject), (err) => {
            // throws an error, you could also catch it here
            if (err){ 
                res.send({"failed": "player not added"});
                throw err;
            }
            // success case, the file was save
            res.send({"success": "puzzle1"});
        });
    }else{
        res.send({"failed": "the room is full"})
    }
});
app.get('/', function (req = express.Request, res = express.Response) {
    res.send("E ae brasa hackers");
})
