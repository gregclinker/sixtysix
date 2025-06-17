"use client";

import {Stack, Typography} from "@mui/material";
import {usePermissions, useShow} from "@refinedev/core";
import {DateField, Show, TextFieldComponent as TextField} from "@refinedev/mui";
import * as React from 'react';
import {useState} from 'react';
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import {BoardMap} from "@components/maps";
import {IPostCodeCluster} from "@interfaces";
import Button from '@mui/material/Button';
import CircularProgress from "@mui/material/CircularProgress";
import {useParams} from "next/navigation";
import Checkbox from "@mui/material/Checkbox";
import dayjs from "dayjs";

export default function BoardPrint() {

    const [hideMap, setHideMap] = useState(true);

    const params = useParams();
    const id = params?.id as string;
    const {queryResult, setShowId} = useShow({
        resource: "boards", id,
    });

    const {data, isLoading} = queryResult;
    const record = data?.data;
    const postCodeCluster: IPostCodeCluster = data?.data?.postCodeCluster;
    const {data: permissions, isLoading: isLoadingPermissions} = usePermissions();

    if (isLoading || isLoadingPermissions) {
        return <div><CircularProgress/></div>;
    }
    const time = <DateField value={dayjs()} format="MMMM D, YYYY h:mmA" /* Custom format *//>;
    const title = <Typography variant="h5">Print View at {time}</Typography>;
    return (
        <Show title={title} goBack={false} isLoading={isLoading}>
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

            <TableContainer component={Paper} sx={{
                '& .MuiTableCell-root': {
                    padding: '2px 18px 0px 10px',
                },
                '& .MuiTableRow-root': {
                    '& td, & th': {
                        //top, right, bottom, left
                        padding: '2px 6px 0px 0px',
                        border: 0
                    }
                }
            }}>
                <Table>
                    <TableBody>
                        {record?.boardStops.map((boardStop: {
                            boardStopVoters: any;
                            id: number,
                            address: string,
                            addressId: number,
                        }) => {
                            return (
                                <>
                                    <TableRow key={boardStop.id + 100001} sx={{border: 0}}>
                                        <TableCell align="left">&nbsp;</TableCell>
                                    </TableRow>
                                    <TableRow key={boardStop.id} sx={{border: 0}}>
                                        <TableCell align="left">
                                            <Typography variant="h6"
                                                        fontWeight="bold">{boardStop.address}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left">
                                            {boardStop?.boardStopVoters?.map((boardStopVoter: any) => {
                                                const noContact = boardStopVoter?.voter?.noContact as boolean;
                                                return (
                                                    <>
                                                        <TableContainer>
                                                            <Table>
                                                                <TableBody>
                                                                    <TableRow key={boardStopVoter.id}>
                                                                        <TableCell align="left">
                                                                            <Stack gap={1}>
                                                                                <Typography variant="body1"
                                                                                            fontWeight="bold">{boardStopVoter?.voter?.fullName + (noContact ? " NO CONTACT" : "")}</Typography>
                                                                                <TableContainer>
                                                                                    {noContact ? (<></>
                                                                                    ) : (
                                                                                        <Table>
                                                                                            {boardStopVoter?.answers?.map((answer: any, answerIndex: number) => {
                                                                                                return (
                                                                                                    <>
                                                                                                        <TableBody>
                                                                                                            <TableRow>
                                                                                                                <TableCell
                                                                                                                    align="left">
                                                                                                                    {answer?.questionVO?.text}
                                                                                                                </TableCell>
                                                                                                                {answer?.questionVO?.options.map((option: string, optionIndex: number) => (
                                                                                                                    <TableCell
                                                                                                                        key={optionIndex}
                                                                                                                        align="left">
                                                                                                                        {option}
                                                                                                                        <Checkbox
                                                                                                                            checked={answer?.text == option}/>
                                                                                                                    </TableCell>
                                                                                                                ))}
                                                                                                            </TableRow>
                                                                                                        </TableBody>
                                                                                                    </>
                                                                                                );
                                                                                            })}
                                                                                        </Table>
                                                                                    )}
                                                                                </TableContainer>
                                                                            </Stack>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </>
                                                );
                                            })}
                                        </TableCell>
                                    </TableRow>
                                    <TableContainer
                                        sx={{
                                            '& .MuiTableCell-root': {
                                                padding: '0px 0px 0px 0px',
                                            },
                                            '& .MuiTableRow-root': {},
                                            borderBottom: '1px solid #000',
                                        }}>
                                        <Table>
                                            <TableBody>
                                                <TableRow
                                                    sx={{border: 0}}>
                                                    <TableCell>&nbsp;</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Show>
    );
}
