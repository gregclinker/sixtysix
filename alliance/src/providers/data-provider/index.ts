"use client"

import dataProviderSimpleRest from "@refinedev/simple-rest";
import axios from "axios";
import Cookies from "js-cookie";
import {HttpError} from "@refinedev/core";
import nextConfig from "../../../next.config.mjs";

export const apiHttpClient = axios.create();
apiHttpClient.interceptors.request.use((config) => {
    const auth = JSON.parse(<string>Cookies.get("auth"));
    config.headers["Authorization"] = "Bearer " + auth.jwt;
    return config;
});
apiHttpClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.log(error)
        if (error.response && error.response.status === 500) {
            const customError: HttpError = {
                ...error,
                message: "Try logging in again",
                statusCode: error.response?.status,
            };
            return Promise.reject(customError);

        } else if (error.response && error.response.status === 403) {
            const customError: HttpError = {
                ...error,
                message: "Operation forbidden",
                statusCode: error.response?.status,
            };
            return Promise.reject(customError);

        } else {
            const customError: HttpError = {
                ...error,
                message: error.response?.data?.message || "Something went wrong",
                statusCode: error.response?.status,
            };
            return Promise.reject(customError);
        }
    },
);
export const API_URL = nextConfig?.env?.API_URL as string;
export const dataProvider = dataProviderSimpleRest(API_URL + "/api", apiHttpClient);