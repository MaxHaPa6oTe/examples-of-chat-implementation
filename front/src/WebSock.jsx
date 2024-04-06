import axios from "axios"
import { useEffect, useRef, useState } from "react"

const WebSock = () => {
    const sendMessage = async () => {
        const message = {
          username,
          message: value,
          id:Date.now(),
          event:'message'
        }
        socket.current.send(JSON.stringify(message))
        setValue('')
      }
      const [messages, setMessages] = useState([])
      const [value,setValue] = useState('')
      const socket = useRef()
      const [connected, setConnected] = useState(false)
      const [username, setUsername] = useState('')
    
    function connect() {
        socket.current = new WebSocket('ws://localhost:5000')
        socket.current.onopen = () => {
            setConnected(true)
            const message = {
              event: 'connection',
              username,
              id:Date.now()
            }
            socket.current.send(JSON.stringify(message))
            axios.get('http://localhost:4444/letsgo')
            .then(e=>setMessages(e.data))
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev=>[...prev, message])            
        }
        socket.current.onclose = () => {
            console.log('Socket закрыт')
        }
        socket.current.onerror = () => {
          console.log('Socket ошибка')
        }
    }

    if (!connected) {
        return (
            <>
            <div>
                <form onSubmit={e=>e.preventDefault()}>
                <input value={username} onChange={e=>setUsername(e.target.value)} type="text" placeholder="Введите ваше имя"/>
                <button onClick={connect}>Вход</button>
                </form>
            </div>
            </>
        )
    }
    return <>
<div>
      <form onSubmit={e=>e.preventDefault()}>
        <input value={value} onChange={e=>setValue(e.target.value)} type="text"/>
        <button onClick={sendMessage}>Написать</button>
      </form>
    </div>

    <div>
      {messages.map(mess=>
        <p key={mess.id}>
          {mess.event === 'connection'
          ? <div>Пользвоатель {mess.username} подключился</div>
        : <div>{mess.username}. {mess.message}</div>}
        </p>)}
    </div>
    </>
}

export default WebSock