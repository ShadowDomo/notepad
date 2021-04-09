import { useState, useEffect, useRef } from 'react'
import SHA256 from 'crypto-js/sha256'

function App() {
  const [data, setData] = useState('')
  const [oldData, setOldData] = useState('')
  const [key, setKey] = useState('')
  const [loadingStatus, setLoadingStatus] = useState('')
  const [password, setPassword] = useState('')


  const inputBox = useRef(null);
  // the save key

  let prod = 'https://cherry-shortcake-58802.herokuapp.com/' // eslint-disable-line
  let localhost = 'http://localhost:3001/' // eslint-disable-line

  let server = localhost

  async function dataHandler(e) {
    setData(e.target.value)
  }

  // todo saving icon
  // todo make server not receive entire text each update, but only additions
  // todo make scaleable, key in params
  // todo passwords
  // todo use sockets and send updates to all connected users

  // saves the notepad periodically
  async function sendToServer() {
    // temp
    if (key.length === 0) return
    setLoadingStatus('Saving...')
    const payLoad = { key: key, data: data }
    try {
      await fetch(server, {
        body: JSON.stringify(payLoad),
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST'
      })
      setOldData(data)
    } catch (error) {
      setLoadingStatus('Failed to connect to server. Try again later.')
      console.log('Failed to send to server')
      return;
    }

    setLoadingStatus('Saved!')
    // update the latest saved data
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
      if (serverData !== false) {
        setData(serverData)
      }

    }

    d()

    // load()
  }, [])// eslint-disable-line react-hooks/exhaustive-deps


  const load = async (e) => {
    let newKey = inputBox.current.textContent
    setLoadingStatus('Loading...')
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
    if (key.length === 0) return
    const payload = { key: key }
    let result;
    try {
      result = await fetch(server + 'get', {
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST'
      })
    } catch (error) {
      setLoadingStatus('Server seems to be offline. Try again later.')
      console.log(error)
      return;
    }

    let jsoned = await result.json()
    // console.log(jsoned)
    if (jsoned.hasOwnProperty('error')) {
      setLoadingStatus('Failed to connect to server')
      console.log('Error retrieiving data from server')
      return false
    }

    setLoadingStatus('Saved!')
    // console.log(jsoned)
    return jsoned;
  }

  // handler for changing key
  function temp2(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.target.blur()
      load()
      // console.log('saw enter')
    }
  }



  function passwordHandler() {
    // hash password
    const message = password
    const hash = SHA256(message).toString()
    console.log(hash)

    // send hash to server


  }

  return (
    <div className="App container mt-3 h-75 w-100" >
      <div className='d-flex justify-content-between'>
        <h1 className='text-white '>Notepadder</h1>
        <h1 className='text-white' contentEditable='true' ref={inputBox} onKeyDown={temp2} suppressContentEditableWarning={true} onBlur={load}>{key}</h1>
      </div>
      <textarea rows='10' value={data} onInput={dataHandler} style={{
        width: '100%', height: '100%', resize: 'none',
        borderRadius: '8px'
      }}></textarea>
      <div className='d-flex justify-content-end'>
        <h6 className='text-white'>{loadingStatus}</h6>
      </div>
      <div className='form-group'>
        <label className='text-white'>Enter password to lock notepad</label>
        <input type='password' className='form-control' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className='btn btn-primary mt-2' onClick={passwordHandler}>Lock</button>
      </div>
    </div >
  );



}
export default App;
