import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DocX from './components/DocX.jsx'

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('Hello');
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0, name: "Piyush" });
  const [clientsCursor, setClientsCursor] = useState({})
  const textareaRef = useRef(null);

  const ws = new WebSocket('ws://localhost:8080'); // Replace with your WebSocket server URL


  useEffect(() => {
    // Connect to the WebSocket server


    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      console.log('Message received:', event.data);
      const data = JSON.parse(event.data);
      if (input != data.text) {
        setInput(data.text)
        setMessages((prev) => [...prev, event.data]); // Append received message to messages
      }
      if (data.cursor) {
        let temp = { ...clientsCursor }
        temp[data.from] = data.cursor
        console.log(temp)
        setClientsCursor({ ...temp })
      }

    };


    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(ws);

    // Cleanup: Close WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []);

  // Capture mouse coordinates
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (textareaRef.current) {
        const { left, top, width, height } = textareaRef.current.getBoundingClientRect();
        const mouseX = event.clientX - left; // Mouse X relative to textarea
        const mouseY = event.clientY - top; // Mouse Y relative to textarea

        // Ensure the values are within the textarea bounds
        const clampedX = Math.max(0, Math.min(mouseX, width));
        const clampedY = Math.max(0, Math.min(mouseY, height));

        // Calculate percentage values
        const percentX = ((clampedX / width) * 100).toFixed(2);
        const percentY = ((clampedY / height) * 100).toFixed(2);

        setMouseCoords({ x: percentX, y: percentY, name: "Me"});

        // Send the cursor position to WebSocket

        const cursorData = {
          cursor: { x: percentX, y: percentY },
        };
        console.log(ws.readyState)

        if (ws.readyState === WebSocket.OPEN) {
          console.log("insidehandle mouse")
          ws.send(JSON.stringify(cursorData)); // Send mouse coordinates
        }
      }
    };

    // Listen to mouse movement
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const sendMessage = (a) => {
    if (a != null) {
      const messageData = {
        text: a,
      };
      socket.send(JSON.stringify(messageData));
      return
    }
    console.log(socket)
    if (socket && input.trim()) {
      socket.send(input); // Send message to the WebSocket server
      setMessages((prev) => [...prev, `You: ${input}`]); // Add to local messages
    }
  };

  return (
    <>
    <h1 spellCheck="false">DocX</h1>
      <DocX input={input} textareaRef={textareaRef} setInput={setInput} sendMessage={sendMessage} >
        {Object.keys(clientsCursor).map((key, index) =>

          <div key={key} name={key} style={{ position: "absolute", top: `${clientsCursor[key].y}%`, left: `${clientsCursor[key].x}%` }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 512"><path fill="#FFD43B" d="M0 55.2L0 426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320l118.1 0c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z" /></svg>
            {key}</div>

        )}
        <div style={{ position: "absolute", top: `${mouseCoords.y}%`, left: `${mouseCoords.x}%`, color: "olive", margin: "20px 0" }}>{mouseCoords.name}</div>
      </DocX>
      <p>Mouse Coordinates: X: {mouseCoords.x}, Y: {mouseCoords.y}</p>
      

      {/* <button onClick={()=>sendMessage(null)}>send</button> */}
    </>
  )
}

export default App
