import { useEffect, useState } from 'react';
import { connect, createLocalTracks } from 'livekit-client';
import { useRouter } from 'next/router';

export default function StreamPage() {
  const router = useRouter();
  const { id: roomId } = router.query;
  const [room, setRoom] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!roomId) return;

    async function startStream() {
      try {
        const res = await fetch('/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identity: 'user_' + Math.floor(Math.random() * 1000), room: roomId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Token fetch failed');

        const url = process.env.NEXT_PUBLIC_LIVEKIT_URL;
        const room = await connect(url, data.token);

        const tracks = await createLocalTracks({ audio: true, video: true });
        await room.localParticipant.publishTracks(tracks);

        setRoom(room);
      } catch (e) {
        setError(e.message);
      }
    }

    startStream();

    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [roomId]);

  if (error) return <div>Error: {error}</div>;
  if (!room) return <div>Loading...</div>;

  return (
    <div>
      <h2>Streaming în camera: {roomId}</h2>
      <video
        autoPlay
        playsInline
        muted
        ref={el => {
          if (el && room.localParticipant.videoTracks.size > 0) {
            const track = [...room.localParticipant.videoTracks.values()][0].track;
            track.attach(el);
          }
        }}
        style={{ width: '100%', maxHeight: '400px', backgroundColor: '#000' }}
      />
    </div>
  );
}
