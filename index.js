const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const { exit } = require('process');

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(bodyParser.json());

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
        state: "queue"
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
app.get('/', function (req = express.Request, res = express.Response) {
    console.log(req)
    let room_code = req.query.room_code
    const filePath = 'rooms/'+room_code+'.json';
    var fileObject = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.send(fileObject);
})

app.listen(3000, () => {
  console.log("server run!!!");
});