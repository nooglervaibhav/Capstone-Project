const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

export async function fetchDashboardData() {
  const [health, timetables] = await Promise.all([
    request("/health"),
    request("/timetables"),
  ]);

  return {
    health,
    timetables,
    analytics: timetables[0]?.analytics || null,
  };
}

export async function generateTimetable(payload) {
  return request("/timetables/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteTimetable(id) {
  return request(`/timetables/${id}`, {
    method: "DELETE",
  });
}
