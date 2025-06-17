"use client";

import * as React from "react";
import {useEffect} from "react";
import {useNavigation, useParsed} from "@refinedev/core";
import Cookies from "js-cookie";

export default function BoardRunAuth() {

    const {show} = useNavigation();
    const {pathname, params} = useParsed();
    const jwt = params?.jwt;
    const boardId = params?.boardId;

    useEffect(() => {
        if (jwt) {
            console.log("BoardRunEdit authenticating on the fly");
            Cookies.remove("auth");
            const authData: any = {
                "name": "boardrunner",
                "email": "boardrunner@boardrunner.com",
                "roles": ['ROLE_USER'],
                "jwt": jwt
            };
            Cookies.set("auth", JSON.stringify(authData), {expires: 30, /* 30 days */ path: "/",});
            show("boards", boardId);
        }
    }, [jwt, show]);

    return (
        <h3>redirecting, please wait</h3>
    );
}