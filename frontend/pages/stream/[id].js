import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';

let socket;

export default function StreamPage() {
  const router = useRouter();
  const { id } = router.query;

  const videoRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');

  useEffect(() => {
    if (!videoRef.current) return;

    // Capturează video și audio local
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error("Eroare la accesul camerei:", err);
      });
  }, []);

  useEffect(() => {
    if (!id) return;

    // Conectare la socket.io
    socket = io(); // presupunem că backend-ul rulează pe același host

    // Alăturare la "room"-ul streamului
    socket.emit('joinRoom', id);

    // Ascultă mesaje noi
    socket.on('chatMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const sendMessage = () => {
    if (inputMsg.trim() === '') return;
    // Trimite mesaj către server
    socket.emit('chatMessage', { room: id, text: inputMsg });
    setInputMsg('');
  };

  if (!id) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '700px', margin: 'auto', padding: '1rem' }}>
      <h1>Stream live: {id}</h1>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
      />

      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}>
        <h2>Chat</h2>
        <div
          style={{
            height: '200px',
            overflowY: 'auto',
            border: '1px solid #ddd',
            padding: '0.5rem',
            marginBottom: '0.5rem',
            backgroundColor: '#f9f9f9'
          }}
        >
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: '0.25rem' }}>
              {msg.text}
            </div>
          ))}
        </div>

        <input
          type="text"
          value={inputMsg}
          onChange={e => setInputMsg(e.target.value)}
          placeholder="Scrie un mesaj..."
          style={{ width: '80%', padding: '0.5rem' }}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button onClick={sendMessage} style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem' }}>
          Trimite
        </button>
      </div>
    </div>
  );
}
