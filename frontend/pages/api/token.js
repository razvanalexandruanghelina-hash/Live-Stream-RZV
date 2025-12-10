export default function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing stream ID" });
  }

  // Token simplu (DEMO) - îl înlocuim cu token real când backend-ul e gata
  const fakeToken = "TOKEN_DE_TEST_" + id;

  res.status(200).json({ token: fakeToken });
}
