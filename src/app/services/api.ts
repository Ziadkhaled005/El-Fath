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

    async forgotPassword(email: string) {
        return request(
            "/api/Auth/forgot-password",
            {
                method: "POST",
                body: JSON.stringify({ email }),
            },
            false,
        );
    },

    async changePassword(payload: Record<string, unknown>) {
        return request("/api/Auth/change-password", {
            method: "POST",
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

    async create(payload: Record<string, unknown>) {
        return request("/api/Branches", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async update(id: number, payload: Record<string, unknown>) {
        return request(`/api/Branches/${id}`, {
            method: "PUT",
            body: JSON.stringify({ id, ...payload }),
        });
    },

    async remove(id: number) {
        return request(`/api/Branches/${id}`, { method: "DELETE" });
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

    async create(payload: Record<string, unknown>) {
        return request("/api/Suppliers", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async update(id: number, payload: Record<string, unknown>) {
        return request(`/api/Suppliers/${id}`, {
            method: "PUT",
            body: JSON.stringify({ id, ...payload }),
        });
    },

    async remove(id: number) {
        return request(`/api/Suppliers/${id}`, { method: "DELETE" });
    },
};

export const salesApi = {
    async list(params?: Record<string, string | number | boolean | undefined>) {
        return request(`/api/sales${buildQuery(params)}`);
    },

    async create(payload: Record<string, unknown>) {
        return request("/api/sales", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async remove(id: number | string) {
        return request(`/api/sales/${id}`, { method: "DELETE" });
    },
};

export const purchasesApi = {
    async list(params?: Record<string, string | number | boolean | undefined>) {
        return request(`/api/purchases${buildQuery(params)}`);
    },

    async create(payload: Record<string, unknown>) {
        return request("/api/purchases", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async update(id: number | string, payload: Record<string, unknown>) {
        return request(`/api/purchases/${id}`, {
            method: "PUT",
            body: JSON.stringify({ id, ...payload }),
        });
    },

    async approve(id: number | string) {
        return request(`/api/purchases/${id}/approve`, { method: "PATCH" });
    },

    async reject(id: number | string) {
        return request(`/api/purchases/${id}/reject`, { method: "PATCH" });
    },

    async remove(id: number | string) {
        return request(`/api/purchases/${id}`, { method: "DELETE" });
    },
};

export const expensesApi = {
    async list(params?: Record<string, string | number | boolean | undefined>) {
        return request(`/api/Expenses${buildQuery(params)}`);
    },

    async create(payload: Record<string, unknown>) {
        return request("/api/Expenses", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async update(id: number | string, payload: Record<string, unknown>) {
        return request(`/api/Expenses/${id}`, {
            method: "PUT",
            body: JSON.stringify({ id, ...payload }),
        });
    },

    async approve(id: number | string) {
        return request(`/api/Expenses/${id}/approve`, { method: "PATCH" });
    },

    async reject(id: number | string) {
        return request(`/api/Expenses/${id}/reject`, { method: "PATCH" });
    },

    async remove(id: number | string) {
        return request(`/api/Expenses/${id}`, { method: "DELETE" });
    },
};

export const employeesApi = {
    async list(params?: Record<string, string | number | boolean | undefined>) {
        return request(`/api/Employees${buildQuery(params)}`);
    },

    async create(payload: Record<string, unknown>) {
        return request("/api/Employees", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async update(id: number | string, payload: Record<string, unknown>) {
        return request(`/api/Employees/${id}`, {
            method: "PUT",
            body: JSON.stringify({ id, ...payload }),
        });
    },

    async remove(id: number | string) {
        return request(`/api/Employees/${id}`, { method: "DELETE" });
    },

    async requestLeave(payload: Record<string, unknown>) {
        return request("/api/Employees/leaves", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },
};

export const usersApi = {
    async list(params?: Record<string, string | number | boolean | undefined>) {
        return request(`/api/Users${buildQuery(params)}`);
    },

    async create(payload: Record<string, unknown>) {
        return request("/api/Users", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async update(id: number | string, payload: Record<string, unknown>) {
        return request(`/api/Users/${id}`, {
            method: "PUT",
            body: JSON.stringify({ id, ...payload }),
        });
    },

    async remove(id: number | string) {
        return request(`/api/Users/${id}`, { method: "DELETE" });
    },

    async resetPassword(id: number | string) {
        return request(`/api/Users/${id}/reset-password`, { method: "POST" });
    },
};

export const rolesApi = {
    async list() {
        return request("/api/Roles");
    },

    async create(payload: Record<string, unknown>) {
        return request("/api/Roles", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async update(id: number | string, payload: Record<string, unknown>) {
        return request(`/api/Roles/${id}`, {
            method: "PUT",
            body: JSON.stringify({ id, ...payload }),
        });
    },

    async remove(id: number | string) {
        return request(`/api/Roles/${id}`, { method: "DELETE" });
    },

    async permissions(id: number | string) {
        return request(`/api/Roles/${id}/permissions`);
    },

    async updatePermissions(id: number | string, permissions: Record<string, string[]>) {
        return request(`/api/Roles/${id}/permissions`, {
            method: "PUT",
            body: JSON.stringify({ permissions }),
        });
    },
};

export const accountingApi = {
    async getCashbox() {
        return request("/api/Accounting/cashbox");
    },

    async getJournal(params?: Record<string, string | number | boolean | undefined>) {
        return request(`/api/Accounting/journal${buildQuery(params)}`);
    },

    async createJournalEntry(payload: Record<string, unknown>) {
        return request("/api/Accounting/journal", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async getProfitLoss() {
        return request("/api/Accounting/profit-loss");
    },

    async getBalanceSheet() {
        return request("/api/Accounting/balance-sheet");
    },
};

export const reportsApi = {
    async get(type: string, params?: Record<string, string | number | boolean | undefined>) {
        return request(`/api/Reports/${type}${buildQuery(params)}`);
    },
};

export const settingsApi = {
    async get() {
        return request("/api/Settings");
    },

    async update(payload: Record<string, unknown>) {
        return request("/api/Settings", {
            method: "PUT",
            body: JSON.stringify(payload),
        });
    },

    async auditLog(params?: Record<string, string | number | boolean | undefined>) {
        return request(`/api/Settings/audit-log${buildQuery(params)}`);
    },

    async createBackup() {
        return request("/api/Settings/backup", { method: "POST" });
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
