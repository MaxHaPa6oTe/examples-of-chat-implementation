import express from 'express'
import cors from 'cors'
import events from 'events'

const PORT = 5000;

const emitter = new events.EventEmitter();

const app = express()

app.use(cors());
app.use(express.json())
app.get('/get-messages', (req,res)=>{
    emitter.once('newMessage', (message)=>{
        res.json(message);
    })
});

app.post('/new-messages',((req,res) => {
    const message = req.body;
    emitter.emit('newMessage', message);
    res.status(200);
}));

app.listen(PORT, ()=>console.log(`Сервер работает на ${PORT} порту`));