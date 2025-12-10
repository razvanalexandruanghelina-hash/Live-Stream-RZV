import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function StreamPage() {
  const router = useRouter();
  const { id } = router.query;

  const [token, setToken] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function getToken() {
      const res = await fetch(`/api/token?id=${id}`);
      const data = await res.json();
      setToken(data.token);
    }

    getToken();
  }, [id]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Live Stream: {id}</h1>
      {!token && <p>Loading token...</p>}
      {token && (
        <p>Token loaded. Aici va fi playerul video LiveKit.</p>
      )}
    </div>
  );
}
