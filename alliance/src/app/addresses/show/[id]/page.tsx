"use client";

import {Stack, Typography} from "@mui/material";
import {useParsed, useShow} from "@refinedev/core";
import {BooleanField, Show, ShowButton, TextFieldComponent as TextField} from "@refinedev/mui";
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {BoardMap} from "@components/maps";
import {IPostCodeCluster} from "@interfaces";

export default function AddressShow() {

    const {id} = useParsed();
    const {queryResult} = useShow({
        resource: "addresses", id
    });
    const {data, isLoading} = queryResult;
    const record = data?.data;
    const postCodeCluster: IPostCodeCluster = data?.data?.postCodeCluster;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Show isLoading={isLoading}>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                    </TableHead>
                    <TableBody>
                        <TableRow sx={{display: "flex"}}>
                            <TableCell sx={{
                                width: '30%',
                                height: '100%',
                                alignItems: 'left',
                                padding: '0 16px',  // Adjust padding as needed
                            }}>
                                <Stack gap={1}>
                                    <Typography variant="body1" fontWeight="bold">
                                        {"ID"}
                                    </Typography>
                                    <TextField value={record?.id}/>
                                    <Typography variant="body1" fontWeight="bold">
                                        {"House Name"}
                                    </Typography>
                                    <TextField value={record?.houseName}/>
                                    <Typography variant="body1" fontWeight="bold">
                                        {"House No"}
                                    </Typography>
                                    <TextField value={record?.houseNo}/>
                                    <Typography variant="body1" fontWeight="bold">
                                        {"Street"}
                                    </Typography>
                                    <TextField value={record?.street}/>
                                    <Typography variant="body1" fontWeight="bold">
                                        {"Polling District"}
                                    </Typography>
                                    <TextField value={record?.pollingDistrict}/>
                                    <Typography variant="body1" fontWeight="bold">
                                        {"Post Code"}
                                    </Typography>
                                    <TextField value={record?.postCode}/>
                                    <Typography variant="body1" fontWeight="bold">
                                        {"Board"}
                                    </Typography>
                                    {record?.board?.id && (
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <TextField value={record?.board?.name}/>
                                            <ShowButton hideText resource={"boards"}
                                                        recordItemId={record?.board?.id as number}/>
                                        </Stack>
                                    )}
                                </Stack>
                            </TableCell>
                            <TableCell sx={{
                                width: '100%',
                                height: '100%',
                                alignItems: 'left',
                                padding: '0 16px',  // Adjust padding as needed
                            }}>
                                <div>
                                    <BoardMap
                                        postCodeCluster={postCodeCluster}
                                        mapContainerStyle={{
                                            width: '100%',
                                            height: '500px',
                                        }}
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <br/>

            <Typography variant="body1" fontWeight="bold">
                {"Voters"}
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Title</TableCell>
                            <TableCell align="left">First Name</TableCell>
                            <TableCell align="left">Initials</TableCell>
                            <TableCell align="left">Last Name</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">ENO</TableCell>
                            <TableCell align="left">No Contact</TableCell>
                            <TableCell align="left">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {record?.voters.map((voter: {
                            id: number;
                            title: string;
                            firstName: string;
                            initials: string;
                            lastName: string;
                            email: string;
                            eno: string;
                            noContact: boolean;
                        }) => (
                            <TableRow
                                key={voter.id}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell align="left">{voter.id}</TableCell>
                                <TableCell align="left">{voter.title}</TableCell>
                                <TableCell align="left">{voter.firstName}</TableCell>
                                <TableCell align="left">{voter.initials}</TableCell>
                                <TableCell align="left">{voter.lastName}</TableCell>
                                <TableCell align="left">{voter.email}</TableCell>
                                <TableCell align="left">{voter.eno}</TableCell>
                                <TableCell align="left"><BooleanField value={voter?.noContact}/></TableCell>
                                <TableCell><ShowButton resource={"voters"}
                                                       recordItemId={voter.id as number}/></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Show>
    );
}
