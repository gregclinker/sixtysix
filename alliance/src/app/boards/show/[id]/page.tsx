"use client";

import {Stack, Typography, useMediaQuery} from "@mui/material";
import {useParsed, usePermissions, useShow} from "@refinedev/core";
import {DeleteButton, EditButton, Show, ShowButton, TextFieldComponent as TextField} from "@refinedev/mui";
import * as React from 'react';
import {useState} from 'react';
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import QRCode from 'react-qr-code'
import nextConfig from "@../next.config.mjs";
import {BoardMap} from "@components/maps";
import {IPostCodeCluster} from "@interfaces";
import Button from '@mui/material/Button';
import CircularProgress from "@mui/material/CircularProgress";
import {useTheme} from "@mui/material/styles";

export default function BoardShow() {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [hideMap, setHideMap] = useState(false || isMobile);

    const {id} = useParsed();
    const {queryResult} = useShow({
        resource: "boards", id
    });

    const {data, isLoading} = queryResult;
    const record = data?.data;
    const postCodeCluster: IPostCodeCluster = data?.data?.postCodeCluster;
    const hostname = nextConfig?.env?.HOSTNAME
    const qRCodeUrl = hostname + record?.qrCodeUrl

    const {data: permissions, isLoading: isLoadingPermissions} = usePermissions();

    if (isLoading || isLoadingPermissions) {
        return <div><CircularProgress/></div>;
    }

    const userRole = permissions as Array<string>;

    const boardLive = (record?.status === 'REFRESHED' || record?.status === 'INPROGRESS') && record?.stopCount > record?.stopCompletedCount;

    return (
        <Show isLoading={isLoading}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell align="left">
                                <Stack gap={1}>
                                    <Stack gap={1} direction={"row"} alignItems={"center"}>
                                        <Typography variant="body1" fontWeight="bold">
                                            {"ID"}
                                        </Typography>
                                        <TextField value={record?.id}/>
                                    </Stack>
                                    <Stack gap={1} direction={"row"} alignItems={"center"}>
                                        <Typography variant="body1" fontWeight="bold">
                                            {"Name"}
                                        </Typography>
                                        <TextField value={record?.name}/>
                                    </Stack>
                                    <Stack gap={1} direction={"row"} alignItems={"center"}>
                                        <Typography variant="body1" fontWeight="bold">
                                            {"Description"}
                                        </Typography>
                                        <TextField value={record?.description}/>
                                    </Stack>
                                    <Stack gap={1} direction={"row"} alignItems={"center"}>
                                        <Typography variant="body1" fontWeight="bold">
                                            {"Status"}
                                        </Typography>
                                        <TextField value={record?.status}/>
                                    </Stack>
                                    <Stack gap={1} direction={"row"} alignItems={"center"}>
                                        <Typography variant="body1" fontWeight="bold">
                                            {"Sort Mode"}
                                        </Typography>
                                        <TextField value={record?.sortMode}/>
                                    </Stack>
                                    <Stack gap={1} direction={"row"} alignItems={"center"}>
                                        <Typography variant="body1" fontWeight="bold">
                                            {"Address Count"}
                                        </Typography>
                                        <TextField value={record?.addressCount}/>
                                    </Stack>
                                    <Stack gap={1} direction={"row"} alignItems={"center"}>
                                        <Typography variant="body1" fontWeight="bold">
                                            {"Stop Count"}
                                        </Typography>
                                        <TextField value={record?.stopCount}/>
                                    </Stack>
                                    <Stack gap={1} direction={"row"} alignItems={"center"}>
                                        <Typography variant="body1" fontWeight="bold">
                                            {"Completed"}
                                        </Typography>
                                        <progress value={record?.percentageComplete} max={100}/>
                                        &nbsp;{record?.percentageComplete}%
                                    </Stack>
                                </Stack>
                            </TableCell>
                            <TableCell align="left">
                                {(userRole?.includes("ROLE_RUNNER") || userRole?.includes("ROLE_ADMIN")) && boardLive ? (
                                    <>
                                        <QRCode value={qRCodeUrl}/>
                                        <br/>
                                        {/*
                                        <a href={qRCodeUrl}>Test Link</a>
                                        <br/>
*/}
                                    </>) : (
                                    <>&nbsp;</>)
                                }
                                &nbsp;
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <div hidden={!postCodeCluster.addressCount}>
                <Button onClick={() => setHideMap(!hideMap)}>{hideMap ? "Show Map" : "Hide Map"}</Button>
                <TableContainer hidden={hideMap} component={Paper}>
                    <BoardMap
                        postCodeCluster={postCodeCluster}
                        mapContainerStyle={{
                            width: '100%',
                            height: '800px',
                        }}
                    />
                </TableContainer>
                <br/>
            </div>

            <Typography hidden={!boardLive} variant="body1"
                        fontWeight="bold">{"Board Stops"}</Typography>
            <TableContainer hidden={!boardLive} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Address & Status</TableCell>
                            <TableCell align="left">Voters</TableCell>
                            <TableCell align="left">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {record?.boardStops?.map((boardStop: {
                            boardStopVoters: any;
                            id: number,
                            address: string,
                            addressId: number,
                            status: string,
                        }, index: number) => <TableRow key={boardStop.id}
                                                       sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                            <TableCell key={index + 1000} align="left">
                                <Stack gap={1}>
                                    <Stack gap={1} direction={"row"} alignItems="center">
                                        {boardStop.address}
                                        <ShowButton accessControl={{hideIfUnauthorized: true}}
                                                    hideText resource={"addresses"}
                                                    recordItemId={boardStop.addressId as number}/>
                                    </Stack>
                                    {boardStop.status}
                                </Stack>
                            </TableCell>
                            <TableCell key={index + 2000} align="left">
                                {boardStop?.boardStopVoters?.map((boardStopVoter: any, index: number) => {
                                    return <div key={index}>
                                        {boardStopVoter?.voter?.fullName}
                                        {(userRole?.includes("ROLE_RUNNER") || userRole?.includes("ROLE_ADMIN")) && boardLive ? (
                                            <>
                                                <EditButton key={index} hideText size={"small"} resource={"voters"}
                                                            recordItemId={boardStopVoter?.voter?.id}/>
                                                <br/>
                                            </>) : (
                                            <>&nbsp;</>)
                                        }
                                    </div>;
                                })}
                            </TableCell>
                            <TableCell align="left">
                                <Stack direction="row">
                                    <EditButton variant={"contained"}
                                                hideText resource={"boardstops"}
                                                recordItemId={boardStop.id as number}/> &nbsp;
                                    <DeleteButton variant={"contained"} accessControl={{hideIfUnauthorized: true}}
                                                  hideText resource={"boardstops"}
                                                  recordItemId={boardStop.id as number}/>
                                </Stack>
                            </TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography hidden={boardLive} variant="body1"
                        fontWeight="bold">{"Addresses"}</Typography>
            <TableContainer hidden={boardLive} component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">House Name</TableCell>
                            <TableCell align="left">No</TableCell>
                            <TableCell align="left">Street</TableCell>
                            <TableCell align="left">Post Code</TableCell>
                            <TableCell align="left">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {record?.addresses.map((address: {
                            id: number,
                            houseName: string,
                            houseNo: string,
                            street: string,
                            postCode: string,
                        }) => (
                            <TableRow key={address.id} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                <TableCell align="left">{address.id}</TableCell>
                                <TableCell align="left">{address.houseName}</TableCell>
                                <TableCell align="left">{address.houseNo}</TableCell>
                                <TableCell align="left">{address.street}</TableCell>
                                <TableCell align="left">{address.postCode}</TableCell>
                                <TableCell align="left">
                                    <Stack direction="row">
                                        <ShowButton accessControl={{hideIfUnauthorized: true}}
                                                    hideText resource={"addresses"}
                                                    recordItemId={address.id as number}/>
                                        <EditButton accessControl={{hideIfUnauthorized: true}}
                                                    hideText resource={"addresses"}
                                                    recordItemId={address.id as number}/>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Show>
    );
}
