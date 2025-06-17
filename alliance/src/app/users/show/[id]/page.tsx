"use client";

import {Stack, Typography} from "@mui/material";
import {useParsed, useShow,} from "@refinedev/core";
import {BooleanField, DateField, Show, TextFieldComponent as TextField} from "@refinedev/mui";
import * as React from 'react';

export default function UserShow() {
    const {id} = useParsed();
    const {queryResult} = useShow({
        resource: "users", id
    });
    const {data, isLoading} = queryResult;
    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Stack gap={1}>
                <Typography variant="body1" fontWeight="bold">
                    {"ID"}
                </Typography>
                <TextField value={record?.id}/>
                <Typography variant="body1" fontWeight="bold">
                    {"First Name"}
                </Typography>
                <TextField value={record?.firstName}/>
                <Typography variant="body1" fontWeight="bold">
                    {"Last Name"}
                </Typography>
                <TextField value={record?.lastName}/>
                <Typography variant="body1" fontWeight="bold">
                    {"Email Address"}
                </Typography>
                <TextField value={record?.email}/>
                <Typography variant="body1" fontWeight="bold">
                    {"Role"}
                </Typography>
                <TextField value={record?.role}/>
                <Typography variant="body1" fontWeight="bold">
                    {"Failed Logins"}
                </Typography>
                <TextField value={record?.failedLoginAttempts}/>
                <Typography variant="body1" fontWeight="bold">
                    {"Last Failed Login"}
                </Typography>
                <DateField value={record?.lastFailedLogin}/>
                <Typography variant="body1" fontWeight="bold">
                    {"Locked"}
                </Typography>
                <BooleanField value={record?.locked}/>

            </Stack>
        </Show>
    );
}
