export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const getToken = () => localStorage.getItem("token");

const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
});

export const getMe = () =>
    fetch(`${BASE_URL}/auth/me`, { headers: headers() }).then((r) => r.json());

export const getTickets = () =>
    fetch(`${BASE_URL}/tickets`, { headers: headers() }).then((r) => r.json());

export const updateTicket = (id, statut) =>
    fetch(`${BASE_URL}/tickets/${id}`, {
        method: "PATCH",
        headers: headers(),
        body: JSON.stringify({ statut }),
    }).then((r) => r.json());

export const getStats = (type) =>
    fetch(`${BASE_URL}/admin/stats/${type}`, { headers: headers() }).then((r) => r.json());

export const getLogs = () =>
    fetch(`${BASE_URL}/logs`, { headers: headers() }).then((r) => r.json());

export const getApiStatus = () =>
    fetch(`${BASE_URL.replace("/api", "")}/api/status`).then((r) => r.json());

export const getBotStatus = () =>
    fetch(`${BASE_URL}/bot/status`, { headers: headers() }).then((r) => r.json());

export const exportCSV = (type, periode) =>
    fetch(`${BASE_URL}/admin/export/${type}?periode=${periode}`, { headers: headers() });
