// API client for Karplus-Strong backend
// Handles JWT auth, token refresh, and all REST endpoints

const api = (() => {
    const BASE = (window.KS_CONFIG && window.KS_CONFIG.API_URL) || 'http://localhost:8000/api/v1';

    function getTokens() {
        const access = localStorage.getItem('ks-access');
        const refresh = localStorage.getItem('ks-refresh');
        return { access, refresh };
    }

    function setTokens(access, refresh) {
        localStorage.setItem('ks-access', access);
        if (refresh) localStorage.setItem('ks-refresh', refresh);
    }

    function clearTokens() {
        localStorage.removeItem('ks-access');
        localStorage.removeItem('ks-refresh');
        localStorage.removeItem('ks-user');
    }

    function getUser() {
        const raw = localStorage.getItem('ks-user');
        return raw ? JSON.parse(raw) : null;
    }

    function isLoggedIn() {
        return !!getTokens().access;
    }

    async function request(path, options = {}) {
        const url = `${BASE}${path}`;
        const headers = { 'Content-Type': 'application/json', ...options.headers };

        const { access } = getTokens();
        if (access) {
            headers['Authorization'] = `Bearer ${access}`;
        }

        let response = await fetch(url, { ...options, headers });

        // Auto-refresh on 401
        if (response.status === 401 && getTokens().refresh) {
            const refreshed = await refreshToken();
            if (refreshed) {
                headers['Authorization'] = `Bearer ${getTokens().access}`;
                response = await fetch(url, { ...options, headers });
            }
        }

        return response;
    }

    async function refreshToken() {
        const { refresh } = getTokens();
        if (!refresh) return false;

        try {
            const response = await fetch(`${BASE}/auth/token/refresh/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh }),
            });
            if (response.ok) {
                const data = await response.json();
                setTokens(data.access, data.refresh || refresh);
                return true;
            }
        } catch (e) {
            // refresh failed
        }
        clearTokens();
        return false;
    }

    // --- Auth ---

    async function register(username, password) {
        const response = await fetch(`${BASE}/auth/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (response.ok) {
            setTokens(data.access, data.refresh);
            localStorage.setItem('ks-user', JSON.stringify({ id: data.id, username: data.username }));
        }
        return { ok: response.ok, data };
    }

    async function login(username, password) {
        const response = await fetch(`${BASE}/auth/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (response.ok) {
            setTokens(data.access, data.refresh);
            localStorage.setItem('ks-user', JSON.stringify({ username }));
        }
        return { ok: response.ok, data };
    }

    function logout() {
        clearTokens();
    }

    // --- Songs ---

    async function getSongs(page = 1) {
        const response = await request(`/songs/?page=${page}`);
        return response.json();
    }

    async function createSong(songData) {
        const response = await request('/songs/', {
            method: 'POST',
            body: JSON.stringify(songData),
        });
        return { ok: response.ok, data: await response.json() };
    }

    async function updateSong(id, songData) {
        const response = await request(`/songs/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(songData),
        });
        return { ok: response.ok, data: await response.json() };
    }

    async function deleteSong(id) {
        const response = await request(`/songs/${id}/`, { method: 'DELETE' });
        return { ok: response.ok };
    }

    async function getPresets() {
        const response = await request('/songs/presets/');
        return response.json();
    }

    return {
        register, login, logout,
        isLoggedIn, getUser,
        getSongs, createSong, updateSong, deleteSong, getPresets,
    };
})();
