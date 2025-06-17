"use client";

import {Stack, Typography} from "@mui/material";
import {useParsed, useShow,} from "@refinedev/core";
import {BooleanField, Show, TextFieldComponent as TextField} from "@refinedev/mui";
import * as React from 'react';

export default function QuestionShow() {
    const {id} = useParsed();
    const {queryResult} = useShow({
        resource: "questions", id
    });
    const {data, isLoading} = queryResult;
    const record = data?.data;

    const selectedOptions = record?.options
        .filter((option: { selectedForBoard: any; }) => option.selectedForBoard)
        .map((option: { text: any; }) => option.text);

    return (
        <Show isLoading={isLoading}>
            <Stack gap={1}>
                <Typography variant="body1" fontWeight="bold">
                    {"ID"}
                </Typography>
                <TextField value={record?.id}/>
                <Typography variant="body1" fontWeight="bold">
                    {"Text"}
                </Typography>
                <TextField value={record?.text}/>
                <Typography variant="body1" fontWeight="bold">
                    {"Options"}
                </Typography>
                <TextField value={record?.options?.join(", ")}/>
                <Typography variant="body1" fontWeight="bold">
                    {"Selected options to create board"}
                </Typography>
                <TextField
                    value={record?.optionToCreateBoard?.length > 0 ? record?.optionToCreateBoard?.join(", ") : "No selected options"}/>
                <Typography variant="body1" fontWeight="bold">
                    {"Active"}
                </Typography>
                <BooleanField value={record?.active}/>
            </Stack>
        </Show>
    );
}