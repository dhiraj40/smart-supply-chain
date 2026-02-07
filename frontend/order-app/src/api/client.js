const API_BASE_URL = "http://localhost:8000"; // change if needed

export async function apiFetch(
    endpoint,
    { method = "GET", body, headers = {} } = {}
) {
    const token = localStorage.getItem("token");

    headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
    }

    console.log(body)

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: headers,
        body: body ? body : undefined,
    });

    console.log(res)

    // Global auth failure handling
    if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.reload(); // force logout
        throw new Error("Unauthorized");
    }

    // Non-OK responses
    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "API Error");
    }

    // Handle empty response (204)
    if (res.status === 204) return null;

    return res.json();
}
