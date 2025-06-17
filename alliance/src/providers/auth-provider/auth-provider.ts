"use client";

import {AuthProvider} from "@refinedev/core";
import Cookies from "js-cookie";
import axios from "axios";
import {API_URL} from "@providers/data-provider";

export const authProvider: AuthProvider = {

    login: async ({email, password}) => {
        const {data} = await axios.post(`${API_URL}/signin`, {
            email,
            password
        });

        if (data) {
            Cookies.set("auth", JSON.stringify(data), {
                expires: 30, // 30 days
                path: "/",
            });
            return {
                success: true,
                redirectTo: "/",
            };
        }

        return {
            success: false,
            error: {
                name: "LoginError",
                message: "Invalid username or password",
            },
        };
    },
    logout: async () => {
        Cookies.remove("auth", {path: "/"});
        return {
            success: true,
            redirectTo: "/login",
        };
    },
    check: async () => {
        const auth = Cookies.get("auth");
        if (auth) {
            return {
                authenticated: true,
            };
        }

        return {
            authenticated: false,
            logout: true,
            redirectTo: "/login",
        };
    },
    getPermissions: async () => {
        const auth = Cookies.get("auth");
        if (auth) {
            const parsedUser = JSON.parse(auth);
            return parsedUser.roles;
        }
        return null;
    },
    getIdentity: async () => {
        const auth = Cookies.get("auth");
        if (auth) {
            const parsedUser = JSON.parse(auth);
            return parsedUser;
        }
        return null;
    },
    onError: async (error) => {
        if (error.response?.status === 401) {
            alert(error.message); // Replace with your notification system
            // Trigger logout
            return {
                logout: true,
                redirectTo: "/login",
                error,
            };
        }
        return {};
    },
};
