const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || "https://medshareappapi.runasp.net"
).replace(/\/$/, "");

function getStoredToken() {
    return sessionStorage.getItem("erp_access_token");
}

function getStoredRefreshToken() {
    return sessionStorage.getItem("erp_refresh_token");
}

function setStoredTokens(accessToken: string, refreshToken?: string) {
    sessionStorage.setItem("erp_access_token", accessToken);
    if (refreshToken) sessionStorage.setItem("erp_refresh_token", refreshToken);
}

function clearStoredTokens() {
    sessionStorage.removeItem("erp_access_token");
    sessionStorage.removeItem("erp_refresh_token");
}

async function request<T>(
    path: string,
    init: RequestInit = {},
    withAuth = true,
): Promise<T> {
    const headers = new Headers(init.headers || {});
    if (withAuth) {
        const token = getStoredToken();
        if (token) headers.set("Authorization", `Bearer ${token}`);
    }
    if (
        !headers.has("Content-Type") &&
        init.body &&
        !(init.body instanceof FormData)
    ) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers,
    });

    const text = await response.text();
    let data: unknown = null;
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!response.ok) {
        const message =
            typeof data === "object" && data && "message" in data
                ? String((data as { message?: unknown }).message)
                : "Request failed";
        throw new Error(message);
    }

    return (data as T) ?? ({} as T);
}

function buildQuery(
    params?: Record<string, string | number | boolean | undefined>,
) {
    if (!params) return "";
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null)
            searchParams.append(key, String(value));
    });
    const query = searchParams.toString();
    return query ? `?${query}` : "";
}

export const authApi = {
    async login(username: string, password: string) {
        const data = await request<{
            accessToken?: string;
            refreshToken?: string;
            user?: unknown;
        }>(
            "/api/Auth/login",
            {
                method: "POST",
                body: JSON.stringify({ username, password }),
            },
            false,
        );
        if (data.accessToken)
            setStoredTokens(data.accessToken, data.refreshToken);
        return data;
    },

    async logout() {
        try {
            await request("/api/Auth/logout", {
                method: "POST",
                body: JSON.stringify({ refreshToken: getStoredRefreshToken() }),
            });
        } finally {
            clearStoredTokens();
        }
    },

    async me() {
        return request("/api/Auth/me");
    },

    async profile(payload: Record<string, unknown>) {
        return request("/api/Auth/profile", {
            method: "PUT",
            body: JSON.stringify(payload),
        });
    },

    isAuthenticated() {
        return Boolean(getStoredToken());
    },
};

export const dashboardApi = {
    async getStats() {
        return request("/api/Dashboard/stats");
    },

    async getSalesChart(months = 6) {
        return request(`/api/Dashboard/sales-chart?months=${months}`);
    },

    async getBranchPerformance() {
        return request("/api/Dashboard/branch-performance");
    },

    async getRecentActivities(count = 5) {
        return request(`/api/Dashboard/recent-activities?count=${count}`);
    },
};

export const productsApi = {
    async list(params?: Record<string, string | number | boolean | undefined>) {
        return request(`/api/Products${buildQuery(params)}`);
    },

    async get(id: number) {
        return request(`/api/Products/${id}`);
    },

    async create(payload: Record<string, unknown>) {
        return request("/api/Products", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async update(id: number, payload: Record<string, unknown>) {
        return request(`/api/Products/${id}`, {
            method: "PUT",
            body: JSON.stringify({ id, ...payload }),
        });
    },

    async remove(id: number) {
        return request(`/api/Products/${id}`, { method: "DELETE" });
    },

    async adjustStock(id: number, delta: number, reason?: string) {
        const params = new URLSearchParams({ delta: String(delta) });
        if (reason) params.set("reason", reason);
        return request(
            `/api/Products/${id}/adjust-stock?${params.toString()}`,
            { method: "POST" },
        );
    },
};

export const customersApi = {
    async list(params?: Record<string, string | number | boolean | undefined>) {
        return request(`/api/Customers${buildQuery(params)}`);
    },

    async get(id: number) {
        return request(`/api/Customers/${id}`);
    },

    async create(payload: Record<string, unknown>) {
        return request("/api/Customers", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async update(id: number, payload: Record<string, unknown>) {
        return request(`/api/Customers/${id}`, {
            method: "PUT",
            body: JSON.stringify({ id, ...payload }),
        });
    },

    async remove(id: number) {
        return request(`/api/Customers/${id}`, { method: "DELETE" });
    },
};

export const branchesApi = {
    async list() {
        return request("/api/Branches");
    },
};

export const notificationsApi = {
    async list(unreadOnly = false) {
        return request(`/api/Notifications?unreadOnly=${String(unreadOnly)}`);
    },

    async markRead(id: number) {
        return request(`/api/Notifications/${id}/read`, { method: "PATCH" });
    },

    async markAllRead() {
        return request("/api/Notifications/read-all", { method: "PATCH" });
    },
};

export const suppliersApi = {
    async list(params?: Record<string, string | number | boolean | undefined>) {
        return request(`/api/Suppliers${buildQuery(params)}`);
    },
};

export const salesApi = {
    async list(params?: Record<string, string | number | boolean | undefined>) {
        return request(`/api/sales${buildQuery(params)}`);
    },
};

export const purchasesApi = {
    async list(params?: Record<string, string | number | boolean | undefined>) {
        return request(`/api/purchases${buildQuery(params)}`);
    },
};

export function normalizeCollection<T>(payload: unknown): T[] {
    if (Array.isArray(payload)) return payload as T[];
    if (payload && typeof payload === "object") {
        const container = payload as {
            items?: unknown;
            data?: unknown;
            result?: unknown;
            value?: unknown;
        };
        if (Array.isArray(container.items)) return container.items as T[];
        if (Array.isArray(container.data)) return container.data as T[];
        if (Array.isArray(container.result)) return container.result as T[];
        if (Array.isArray(container.value)) return container.value as T[];
    }
    return [];
}
