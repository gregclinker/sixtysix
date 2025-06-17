"use client";

import {AccessControlProvider} from "@refinedev/core";
import Cookies from "js-cookie";

export const accessControlProvider: AccessControlProvider = {
    can: async ({resource, action, params}) => {
        //console.log("accessControlProvider", resource + ", action", action);
        const getUserRole = () => {
            const authJson = Cookies.get("auth") as string;
            if (authJson != null) {
                const auth = JSON.parse(authJson);
                const roles = auth?.roles as Array<string>;
                if (roles.includes("ROLE_ADMIN")) {
                    return "admin";
                } else if (roles.includes("ROLE_RUNNER")) {
                    return "runner";
                } else {
                    return "user";
                }
            }
            return "user";
        };

        const userRole = getUserRole()

        if (userRole === "admin") {
            return {can: true};
        } else if (userRole === "runner" && resource == "hamburger-menu") {
            return {can: true};
        } else if (userRole === "runner" && resource == "boardruns") {
            return {can: true};
        } else if (userRole === "runner" && resource == "boards" && (action == "show" || action == "edit" || action == "list")) {
            return {can: true};
        } else if (userRole === "runner" && resource == "telling" && (action == "list")) {
            return {can: true};
        } else if (userRole === "runner" && resource == "voters" && (action == "show" || action == "edit")) {
            return {can: true};
        } else if (userRole === "runner" && resource == "boardstops" && (action == "show" || action == "edit")) {
            return {can: true};
        } else if (userRole === "runner" && resource == "addresses" && (action == "show" || action == "edit")) {
            return {can: true};
        } else if (userRole === "user" && resource == "boards" && action == "show") {
            return {can: true};
        } else if (userRole === "user" && resource == "voters" && (action == "show" || action == "edit")) {
            return {can: true};
        } else if (userRole === "user" && resource == "boardstops" && (action == "show" || action == "edit")) {
            return {can: true};
        } else {
            return {can: false, reason: "Unauthorized"};
        }

    },
};