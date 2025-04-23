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

export async function chatWithGPT(prompt, userId, history) {
  const res = await fetch('http://127.0.0.1:8000/api/gpt/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, history }),
  });

  if (!res.ok) throw new Error('GPT chat failed');
  return await res.json();
}

export async function saveChatQA(payload) {
  const res = await fetch('http://127.0.0.1:8000/api/memory/save-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Save failed');
  return await res.json();
}

export async function deleteMemory(memoryId, userId) {
  const res = await fetch(`http://127.0.0.1:8000/api/memory/delete/${memoryId}/${userId}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('Failed to delete memory');
  return await res.json();
}

