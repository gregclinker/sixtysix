"use client";

import * as React from "react";
import {useEffect} from "react";
import {useNavigation, useParsed} from "@refinedev/core";
import Cookies from "js-cookie";

export default function TellerAuth() {

    const {list} = useNavigation();
    const {pathname, params} = useParsed();
    const jwt = params?.jwt;

    useEffect(() => {
        if (jwt) {
            console.log("Telling authenticating on the fly");
            Cookies.remove("auth");
            const authData: any = {
                "name": "boardrunner",
                "email": "boardrunner@boardrunner.com",
                "roles": ['ROLE_USER'],
                "jwt": jwt
            };
            Cookies.set("auth", JSON.stringify(authData), {expires: 30, path: "/"});
            list("telling");
        }
    }, [jwt, list]);

    return (
        <h3>redirecting, please wait</h3>
    );
}