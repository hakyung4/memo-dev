export async function searchMemory(filters) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'}/api/memory/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters),
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

export async function getMemoryGraph(userId) {
  const res = await fetch(`http://127.0.0.1:8000/api/memory/graph/${userId}`);
  if (!res.ok) throw new Error('Failed to load graph data');
  return res.json();
}

export async function getWeeklyDigest(userId, selectedDate = null) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'}/api/digest/weekly`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      selected_date: selectedDate ? selectedDate : undefined,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch weekly digest');
  }

  return await res.json();
}
