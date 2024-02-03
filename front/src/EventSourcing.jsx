import axios from "axios"
import { useEffect, useState } from "react"

const EventSourcing = () => {
    const sendMessage = async () => {
        await axios.post('http://localhost:5000/new-messages',{
          message: value,
          id:Date.now()
        })
      }
      const [messages, setMessages] = useState([])
      const [value,setValue] = useState('')
      useEffect(()=>{
        subscribe()
      },[])
      const subscribe = async () => {
        const eventSource = new EventSource(`http://localhost:5000/connect`)
        eventSource.onmessage = function (event) {
           const message = JSON.parse(event.data);
           setMessages(prev=>[message,...prev]) 
        }
    }
    return <>
    <div>
      <form onSubmit={e=>e.preventDefault()}>
        <input value={value} onChange={e=>setValue(e.target.value)} type="text"/>
        <button onClick={sendMessage}>ok</button>
      </form>
    </div>

    <div>
      {messages.map(mess=>
        <p key={mess.id}>
          {mess.message}
        </p>)}
    </div>
    </>
}

export default EventSourcing