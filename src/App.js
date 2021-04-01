import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState('')
  const [oldData, setOldData] = useState('')

  // the save key
  const key = window.location.pathname.substring(1)

  async function dataHandler(e) {
    setData(e.target.value)
  }

  //TODO save old state, and compare with new state. helps to prevent sending when data hasn't changed

  // todo make scaleable, key in params
  // saves the notepad periodically
  async function sendToServer() {
    const payLoad = { key: key, data: data }
    const result = await fetch('http://localhost:3001/', {
      body: JSON.stringify(payLoad),
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST'
    })
    console.log(await result.json())

    // update the latest saved data
    setOldData(data)
  }

  // checks whether the data needs to be updated
  function sendIfNeeded() {
    if (oldData !== data) {
      sendToServer()
    }
  }

  // onload set the data to that from server
  useEffect(() => {
    const temp = async () => {
      const serverData = await getFromServer(key)
      setData(serverData)
    }

    temp()
  }, [])

  // improvement, chunk the updates to the server
  useEffect(() => {
    sendIfNeeded()
  }, [data])


  // gets data for the given key from server
  async function getFromServer(key) {
    const payload = { key: key }
    const result = await fetch('http://localhost:3001/get', {
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
    <div className="App ">
      <h1 className='mb-3'>Notepadder</h1>
      <textarea rows='10' cols='40' value={data} onChange={dataHandler} style={{ width: '90%', height: '90%', resize: 'none' }}></textarea>
      <h4>Key is: {key}</h4>
      <button onClick={sendIfNeeded}>clickme</button>
    </div>
  );



}
export default App;
