export default async function handler(req, res) {
  const response = await fetch(process.env.BACKEND_URL + '/rtc/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  });
  const data = await response.json();

  if (!response.ok) {
    res.status(response.status).json(data);
  } else {
    res.status(200).json(data);
  }
}
