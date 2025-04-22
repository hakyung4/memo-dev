export async function searchMemory(query, userId) {
    const res = await fetch("http://127.0.0.1:8000/api/memory/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, user_id: userId }),
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch memory results");
    }
  
    return await res.json();
}
  