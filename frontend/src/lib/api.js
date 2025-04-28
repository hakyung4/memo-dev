const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

async function safeFetch(url, options) {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ API Error:', errorText);
      throw new Error(errorText || 'API request failed');
    }

    return await res.json();
  } catch (error) {
    console.error('❌ Fetch failed:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

export async function searchMemory(filters) {
  return safeFetch(`${BASE_URL}/api/memory/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters),
  });
}

export async function chatWithGPT(prompt, userId, history, project = '') {
  return safeFetch(`${BASE_URL}/api/gpt/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, history, project, user_id: userId }),
  });
}

export async function saveChatQA(payload) {
  return safeFetch(`${BASE_URL}/api/memory/save-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteMemory(memoryId, userId) {
  return safeFetch(`${BASE_URL}/api/memory/delete/${memoryId}/${userId}`, {
    method: 'DELETE',
  });
}

export async function getMemoryGraph(userId) {
  return safeFetch(`${BASE_URL}/api/memory/graph/${userId}`);
}

export async function getWeeklyDigest(userId, selectedDate = null) {
  return safeFetch(`${BASE_URL}/api/digest/weekly`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      selected_date: selectedDate || undefined,
    }),
  });
}

export async function saveMemory(payload) {
  return safeFetch(`${BASE_URL}/api/memory/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function fetchAllMemories(userId) {
  return safeFetch(`${BASE_URL}/api/memory/all/${userId}`);
}

export async function fetchProjects(userId) {
  return safeFetch(`${BASE_URL}/api/memory/projects/${userId}`);
}
