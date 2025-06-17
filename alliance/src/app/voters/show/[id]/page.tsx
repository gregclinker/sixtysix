"use client";

import {Stack, Typography} from "@mui/material";
import {useParsed, useShow} from "@refinedev/core";
import {BooleanField, Show, ShowButton, TextFieldComponent as TextField} from "@refinedev/mui";
import * as React from 'react';

export default function VoterShow() {
    const {id} = useParsed();
    const {queryResult} = useShow({
        resource: "voters", id
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
                    {"Title"}
                </Typography>
                <TextField value={record?.title}/>
                <Typography variant="body1" fontWeight="bold">
                    {"First Name"}
                </Typography>
                <TextField value={record?.firstName}/>
                <Typography variant="body1" fontWeight="bold">
                    {"Initials"}
                </Typography>
                <TextField value={record?.initials}/>
                <Typography variant="body1" fontWeight="bold">
                    {"Last Name"}
                </Typography>
                <TextField value={record?.lastName}/>
                <Typography variant="body1" fontWeight="bold">
                    {"Email"}
                </Typography>
                <TextField value={record?.email}/>
                <Typography variant="body1" fontWeight="bold">
                    {"eno"}
                </Typography>
                <TextField value={record?.eno}/>
                <Typography variant="body1" fontWeight="bold">
                    {"No Contact"}
                </Typography>
                <BooleanField value={record?.noContact}/>
                <Typography variant="body1" fontWeight="bold">
                    {"Supporter"}
                </Typography>
                <BooleanField value={record?.supporter}/>
            </Stack>
            <br/>
            <Stack direction="row" spacing={5} alignItems="center">
                <Typography variant="body1" fontWeight="bold">
                    {"Address"}
                </Typography>
                <TextField
                    value={record?.address.houseName + ", "
                        + record?.address.houseNo + ", "
                        + record?.address.street + ", "
                        + record?.address.postCode}/>
                <ShowButton resource={"addresses"} recordItemId={record?.address.id}/>
            </Stack>
        </Show>
    );
}
