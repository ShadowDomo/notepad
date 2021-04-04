import { useState, useEffect, useRef } from 'react'

function App() {
  const [data, setData] = useState('')
  const [oldData, setOldData] = useState('')
  const [key, setKey] = useState('')

  const inputBox = useRef(null);
  // the save key

  let prod = 'https://cherry-shortcake-58802.herokuapp.com/' // eslint-disable-line
  let localhost = 'http://localhost:3001/' // eslint-disable-line

  let server = prod

  async function dataHandler(e) {
    setData(e.target.value)
  }

  // todo saving icon
  // todo make server not receive entire text each update, but only additions
  // todo make scaleable, key in params
  // todo use sockets and send updates to all connected users
  // saves the notepad periodically
  async function sendToServer() {
    // temp
    if (key.length === 0) return
    const payLoad = { key: key, data: data }
    await fetch(server, {
      body: JSON.stringify(payLoad),
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST'
    })
    // console.log(await result.json())

    // update the latest saved data
    setOldData(data)
  }

  // checks whether the data needs to be updated 
  function sendIfNeeded() {
    if (oldData !== data) {
      sendToServer()
    }
  }

  // gets a fresh key from the server
  async function getFreshKey() {
    const result = await fetch(server + 'generate')
    return await result.json()
  }

  // onload set the data to that from server
  useEffect(() => {
    // const currentUrl = window.location.pathname.substring(1)
    // setKey(currentUrl)
    const d = async () => {
      let newKey;
      if (localStorage.getItem('key')) {
        newKey = localStorage.getItem('key')
      } else {
        newKey = await getFreshKey()
      }

      setKey(newKey)
      const serverData = await getFromServer(newKey)
      setData(serverData)

    }

    d()

    // load()
  }, [])// eslint-disable-line react-hooks/exhaustive-deps


  const load = async (e) => {
    let newKey = inputBox.current.textContent

    setKey(newKey)
    localStorage.setItem('key', newKey)
    const serverData = await getFromServer(newKey)
    setData(serverData)
  }

  // improvement, chunk the updates to the server
  useEffect(() => {
    sendIfNeeded()

  }, [data])// eslint-disable-line react-hooks/exhaustive-deps


  // gets data for the given key from server
  async function getFromServer(key) {
    // temp 
    if (key.length === 0) return
    const payload = { key: key }
    const result = await fetch(server + 'get', {
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST'
    })
    return await result.json()

  }

  function temp2(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.target.blur()
      load()
      // console.log('saw enter')
    }
  }


  return (
    <div className="App container h-75 w-100" >
      <div className='d-flex justify-content-between'>
        <h1 className='text-white '>Notepadder</h1>
        <h1 className='text-white' contentEditable='true' ref={inputBox} onKeyDown={temp2} suppressContentEditableWarning={true} onBlur={load}>{key}</h1>
      </div>
      <textarea rows='10' value={data} onInput={dataHandler} style={{
        width: '100%', height: '100%', resize: 'none',
        borderRadius: '8px'

      }}></textarea>
    </div>
  );



}
export default App;
