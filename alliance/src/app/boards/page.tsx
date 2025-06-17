"use client";

import {DataGrid, type GridColDef} from "@mui/x-data-grid";
import {useGo, useInvalidate, useMany, usePermissions} from "@refinedev/core";
import {DeleteButton, EditButton, List, ShowButton, useDataGrid,} from "@refinedev/mui";
import React, {useState} from "react";
import {apiHttpClient, dataProvider} from "@providers/data-provider";
import {LoadingButton} from "@mui/lab";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CircularProgress from '@mui/material/CircularProgress';
import {DeleteForever} from "@mui/icons-material";
import BuildIcon from '@mui/icons-material/Build';
import PrintIcon from '@mui/icons-material/Print';
import {Stack, Tooltip} from "@mui/material";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function BoardList() {

    const {data: permissions, isLoading: isLoadingPermissions} = usePermissions();

    const userRole = permissions as Array<string>;

    const go = useGo();
    const [isBuilding, setIsBuilding] = useState(false);

    const invalidate = useInvalidate();
    const {dataGridProps} = useDataGrid({
        dataProviderName: "default",
    });

    const {data: boardData, isLoading: boardsIsLoading} = useMany({
        resource: "boards",
        ids:
            dataGridProps?.rows
                ?.map((item: any) => item?.board?.id)
                .filter(Boolean) ?? [],
        queryOptions: {
            enabled: !!dataGridProps?.rows,
        },
    });

    const buildBoard = (url: string) => {
        setOpenDeleteAll(false);
        setOpenCreateAll(false);
        setOpenRefreshAll(false);
        setIsBuilding(true);
        let method: string = "POST";
        if (url.includes("delete")) {
            method = "DELETE";
        }
        apiHttpClient.request({
                method: method,
                url: dataProvider.getApiUrl() + url,
            }
        ).then(function (response) {
            setIsBuilding(false);
            invalidate({
                resource: "boards",
                invalidates: ["list"],
            });
        }).catch(function (error) {
            console.error(error);
        });
    }

    const columns = React.useMemo<GridColDef[]>(
        () => [
            {
                field: "id",
                headerName: "ID",
                type: "number",
                minWidth: 50,
            },
            {
                field: "name",
                flex: 1,
                headerName: "Name",
                minWidth: 100,
                renderCell: (params) => (
                    <div style={{whiteSpace: 'pre-wrap', lineHeight: '1.2em', maxHeight: '3.6em', overflow: 'hidden'}}>
                        {params.value}
                    </div>
                ),
            },
            {
                field: "description",
                flex: 1,
                headerName: "Description",
                minWidth: 350,
                renderCell: (params) => (
                    <div style={{whiteSpace: 'pre-wrap', lineHeight: '1.2em', maxHeight: '3.6em', overflow: 'hidden'}}>
                        {params.value}
                    </div>
                ),
            },
            {
                field: "status",
                flex: 1,
                headerName: "Status",
                minWidth: 100,
            },
            {
                field: "addressCount",
                flex: 1,
                headerName: 'Addrs',
                minWidth: 80,
                filterable: false,
            },
            {
                field: "stopCount",
                flex: 1,
                headerName: 'Stops',
                minWidth: 80,
                filterable: false,
            },
            {
                field: "percentageComplete",
                flex: 1,
                headerName: "Completed",
                filterable: false,
                align: "center",
                headerAlign: "center",
                minWidth: 80,
                renderCell: (params) => (
                    <>
                        {params.value}%&nbsp;
                        <progress value={params.value} max="100" style={{width: '100%'}}/>
                    </>
                ),
            },
            {
                field: "actions",
                headerName: "Actions",
                sortable: false,
                align: "center",
                headerAlign: "center",
                minWidth: 250,
                renderCell: function render({row}) {
                    return (
                        <>
                            <Tooltip
                                title="Refresh the board stops for this board, based on previous answers and current question settings">
                                <LoadingButton
                                    key={row.id}
                                    loadingPosition="start"
                                    startIcon={<AutorenewIcon/>}
                                    variant="text"
                                    onClick={() => {
                                        buildBoard(`/boards/build/${row.id}`)
                                    }}
                                />
                            </Tooltip>
                            <Tooltip title="Edit this board">
                                <EditButton hideText recordItemId={row.id}/>
                            </Tooltip>
                            <Tooltip title="Show this board">
                                <ShowButton hideText recordItemId={row.id}/>
                            </Tooltip>
                            <Tooltip title="Print a copy of the board">
                                <LoadingButton
                                    disabled={row?.stopCount <= 0}
                                    loading={isBuilding}
                                    loadingPosition="start"
                                    startIcon={<PrintIcon/>}
                                    variant="text"
                                    onClick={() => {
                                        go({
                                            to: `/boards/print/${row.id}`,
                                            type: "push",
                                        });
                                    }}
                                />
                            </Tooltip>
                            <DeleteButton hideText recordItemId={row.id}/>
                        </>
                    );
                },
            },
        ],
        [boardData]
    );

    const [openDeleteAll, setOpenDeleteAll] = React.useState(false);
    const handleClickOpenDeleteAll = () => {
        setOpenDeleteAll(true);
    };
    const handleCloseDeleteAll = () => {
        setOpenDeleteAll(false);
    };

    const [openCreateAll, setOpenCreateAll] = React.useState(false);
    const handleClickOpenCreateAll = () => {
        setOpenCreateAll(true);
    };
    const handleCloseCreateAll = () => {
        setOpenCreateAll(false);
    };

    const [openRefreshAll, setOpenRefreshAll] = React.useState(false);
    const handleClickOpenRefreshAll = () => {
        setOpenRefreshAll(true);
    };
    const handleCloseRefreshAll = () => {
        setOpenRefreshAll(false);
    };

    if (boardsIsLoading) {
        return (
            <>
                <CircularProgress/>&nbsp;Loading
            </>
        );
    }

    if (isBuilding) {
        return (
            <>
                <h1>Refreshing boards, please wait. This may take several minutes</h1>
                <CircularProgress/>
            </>
        );
    }

    return (
        <List>
            <Stack direction={"column"} gap={1}>
                <Stack direction={"row"} gap={1}>
                    <React.Fragment>
                        <Tooltip title="Delete all the boards, not data will be lost">
                            <Button variant="contained" onClick={handleClickOpenDeleteAll} startIcon={<DeleteForever/>}
                                    disabled={!userRole?.includes("ROLE_ADMIN")}>
                                DELETE ALL
                            </Button>
                        </Tooltip>
                        <Dialog open={openDeleteAll} onClose={handleCloseDeleteAll} aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title">{"Delete all boards"}</DialogTitle>
                            <DialogContent>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">Are you sure?</DialogContentText>
                                </DialogContent>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => buildBoard("/boards/delete")}>Yes</Button>
                                <Button onClick={handleCloseDeleteAll} autoFocus>No</Button>
                            </DialogActions>
                        </Dialog>
                    </React.Fragment>

                    <React.Fragment>
                        <Tooltip
                            title="Recreate the boards using the built in geolcation logic. Does not create the board stops only the clusters of addresses.">
                            <Button variant="contained" onClick={handleClickOpenCreateAll} startIcon={<BuildIcon/>}
                                    disabled={!userRole?.includes("ROLE_ADMIN")}>
                                CREATE ALL
                            </Button>
                        </Tooltip>
                        <Dialog open={openCreateAll} onClose={handleCloseCreateAll} aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title">{"Delete and re-create all boards"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">Are you sure?</DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => buildBoard("/boards/create")}>Yes</Button>
                                <Button onClick={handleCloseCreateAll} autoFocus>No</Button>
                            </DialogActions>
                        </Dialog>
                    </React.Fragment>

                    <React.Fragment>
                        <Tooltip
                            title="Refresh the board stops, based on previous answers and current question settings">
                            <Button variant="contained" onClick={handleClickOpenRefreshAll}
                                    startIcon={<AutorenewIcon/>}>
                                REFRESH ALL
                            </Button>
                        </Tooltip>
                        <Dialog open={openRefreshAll} onClose={handleCloseRefreshAll}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title">{"Refresh all boards"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">Are you sure?</DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => buildBoard("/boards/build")}>Yes</Button>
                                <Button onClick={handleCloseRefreshAll} autoFocus>No</Button>
                            </DialogActions>
                        </Dialog>
                    </React.Fragment>

                </Stack>
                <DataGrid {...dataGridProps} columns={columns} autoHeight/>
            </Stack>
        </List>
    );
}
