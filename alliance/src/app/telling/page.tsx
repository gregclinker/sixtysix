"use client";

import React, {useState} from "react";
import {useCustom, useNotification, usePermissions, useSelect} from "@refinedev/core";
import {Alert, MenuItem, Select, Stack, Typography} from "@mui/material";
import {apiHttpClient, dataProvider} from "@providers/data-provider";
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import QRCode from 'react-qr-code'
import nextConfig from "../../../next.config.mjs";

interface IPollingDistrict {
    name: string;
}

export default function TellingList() {

    const {data: permissions, isLoading: isLoadingPermissions} = usePermissions();
    const userRole = permissions as Array<string>;

    const API_URL = dataProvider.getApiUrl();

    const {open} = useNotification();

    const {data, isLoading, error: qrError} = useCustom<{ qrCodeUrl: string }>({
        url: `${API_URL}/telling/qrcode`,
        method: "get",
    });

    const {options: pollingDistrictOptions} = useSelect<IPollingDistrict>({
        resource: "telling/pollingdistricts",
        optionLabel: "name",
        optionValue: "name",
    });

    const [pollingDistrict, setPollingDistrict] = useState("all");
    const [eno, setEno] = useState("");
    const [error, setError] = useState("");
    const hostname = nextConfig?.env?.HOSTNAME || ''
    const qrCodeUrl = hostname + data?.data?.qrCodeUrl

    const handleSelectPollingDistrictChange = (event: any) => {
        setPollingDistrict(event.target.value);
    };

    const handleEnoChange = (event: any) => {
        setEno(event.target.value);
    };

    const handleSave = () => {
        setError("");
        if (!pollingDistrict || pollingDistrict === "all" || !eno.trim()) {
            setError("Please select a polling district and enter the voter's ENO.");
            return;
        }
        apiHttpClient.request({
            method: 'PATCH',
            url: dataProvider.getApiUrl() + `/telling/hasVoted/pollingDistrict/${pollingDistrict}/eno/${eno}`,
        })
            .then(() => {
                open?.({
                    type: "success",
                    message: "Saved successfully",
                    description: "The voter's status has been updated.",

                });
                setEno("");
            })
            .catch(function (error) {
                console.error(error);
            });
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <Box>
            <Stack spacing={2}>
                <Typography variant="h5">Telling</Typography>
                {(userRole?.includes("ROLE_RUNNER") || userRole?.includes("ROLE_ADMIN")) ? (
                    <>
                        <QRCode value={qrCodeUrl ?? ""}/>
                        <br/>
                        {/*
                        <a href={data?.data?.qrCodeUrl}>Test Link</a>
                        <br/>
*/}
                    </>) : (
                    <>&nbsp;</>)
                }
                <Stack spacing={2}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Button variant="contained" fullWidth={false} endIcon={<SaveIcon/>}
                            onClick={handleSave}>SAVE</Button>
                    <Stack direction={"row"} spacing={2}>
                        <Select sx={{minWidth: 200, maxWidth: 200}} value={pollingDistrict}
                                onChange={handleSelectPollingDistrictChange}>
                            <MenuItem key={"0"} value={"all"}>{"Select polling district"}</MenuItem>
                            {pollingDistrictOptions?.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <TextField
                            fullWidth={false}
                            id="outlined-helperText"
                            label="Voter's ENO"
                            value={eno}
                            onChange={handleEnoChange}
                            type={"number"}
                        />
                    </Stack>
                    <Button variant="contained" fullWidth={false} endIcon={<SaveIcon/>}
                            onClick={handleSave}>SAVE</Button>
                </Stack>
            </Stack>
        </Box>
    );
}
