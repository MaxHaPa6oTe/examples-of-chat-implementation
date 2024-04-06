import {DataTypes, Sequelize} from "sequelize";
import express from 'express'

import { WebSocketServer } from 'ws';
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())
app.get('/letsgo', Letsgo)

const wss = new WebSocketServer({
    port: 5000
},  () => console.log('Websocket запущен на 5000 порту')
)

const _db = new Sequelize(
    'chat',
    'postgres',
    'admin',
    {
        dialect: 'postgres',
        host: 'localhost',
        port: 5432
    },
)

const start = async () => {
    try {
        await _db.sync()
        app.listen(4444, ()=>console.log('Бэк работает на 4444 порту'))
    } catch (err) {
        console.log(err)
    }
}

start()

const messages = _db.define('messages', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: DataTypes.STRING, },
    message: {type: DataTypes.STRING, },
});

wss.on('connection', function connection(ws) {
    ws.on('message', function (message) {
        message = JSON.parse(message)
        switch (message.event) {
            case 'message':
                AddMes(message)
                broadcastMessage(message)
                break;
            case 'connection':
                broadcastMessage(message)
                break;
        }
    })
})

function broadcastMessage(message, id) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message))
    })
}

async function AddMes(req, res) {
    const Mes = await messages.create({message:req.message, username:req.username})
    return 'Сообщение добавлено'
}

async function Letsgo(req, res) {
    const Mes = await messages.findAll()
    return res.json(Mes)
}