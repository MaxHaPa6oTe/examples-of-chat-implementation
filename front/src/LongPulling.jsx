import axios from "axios"
import { useEffect, useState } from "react"

const LongPulling = () => {
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
        try {
          const {data} = await axios.get('http://localhost:5000/get-messages')
          setMessages(prev=>[data,...prev])
          await subscribe()
        } catch (e) {
          setTimeout(()=>{
            subscribe()
          },500)
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

export default LongPulling