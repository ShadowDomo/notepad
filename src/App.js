import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState('')
  const [oldData, setOldData] = useState('')
  const [key, setKey] = useState('')
  // the save key
  const prod = process.env.PROD || false
  const server = 'http://localhost:3000'
  if (prod) {
    server = "https://cherry-shortcake-58802.herokuapp.com/"
  }

  async function dataHandler(e) {
    setData(e.target.value)
  }

  // todo make server not receive entire text each update, but only additions
  // todo make scaleable, key in params

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
    const currentUrl = window.location.pathname.substring(1)
    setKey(currentUrl)

    const temp = async () => {
      if (currentUrl.length === 0) {
        // generate a new key
        const newKey = await getFreshKey()
        setKey(newKey)
        window.history.pushState({}, null, newKey)
      }

      const serverData = await getFromServer(currentUrl)
      // console.log(serverData)
      setData(serverData)
    }

    temp()
  }, [])

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




  return (
    <div className="App container h-75 w-100" >
      <h1 className='mb-3 mt-3 text-white'>Notepadder - {key}</h1>
      <textarea rows='10' value={data} onInput={dataHandler} style={{
        width: '100%', height: '100%', resize: 'none',
        borderRadius: '8px'

      }}></textarea>
    </div>
  );



}
export default App;
