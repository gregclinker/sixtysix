"use client";

import {DataGrid, type GridColDef} from "@mui/x-data-grid";
import {useMany} from "@refinedev/core";
import {BooleanField, DeleteButton, EditButton, List, ShowButton, useDataGrid,} from "@refinedev/mui";
import React from "react";

export default function VoterList() {
    const {dataGridProps} = useDataGrid({
        dataProviderName: "default",
    });

    const {data: voterData, isLoading: addressIsLoading} = useMany({
        resource: "voters",
        ids:
            dataGridProps?.rows
                ?.map((item: any) => item?.address?.id)
                .filter(Boolean) ?? [],
        queryOptions: {
            enabled: !!dataGridProps?.rows,
        },
    });

    const columns = React.useMemo<GridColDef[]>(
        () => [
            {
                field: "id",
                headerName: "ID",
                type: "number",
                minWidth: 50,
            },
            {
                field: "title",
                flex: 1,
                headerName: "Title",
                minWidth: 100,
            },
            {
                field: "firstName",
                flex: 1,
                headerName: "First Name",
                minWidth: 100,
            },
            {
                field: "initials",
                flex: 1,
                headerName: "Initials",
                minWidth: 100,
            },
            {
                field: "lastName",
                flex: 1,
                headerName: "Last Name",
                minWidth: 100,
            },
            {
                field: "email",
                flex: 1,
                headerName: "Email",
                minWidth: 200,
            },
            {
                field: "eno",
                flex: 1,
                headerName: "ENO",
                minWidth: 100,
            },
            {
                field: "noContact",
                flex: 1,
                headerName: "No Contact",
                minWidth: 80,
                filterable: false,
                sortable: false,
                renderCell: function render({row}) {
                    return (
                        <>
                            <BooleanField value={row.noContact}/>
                        </>
                    );
                },
            },
            {
                field: "supporter",
                flex: 1,
                headerName: "Supporter",
                minWidth: 80,
                filterable: false,
                sortable: false,
                renderCell: function render({row}) {
                    return (
                        <>
                            <BooleanField value={row.supporter}/>
                        </>
                    );
                },
            },
            {
                field: "actions",
                headerName: "Actions",
                sortable: false,
                renderCell: function render({row}) {
                    return (
                        <>
                            <EditButton hideText recordItemId={row.id}/>
                            <ShowButton hideText recordItemId={row.id}/>
                            <DeleteButton hideText recordItemId={row.id}/>
                        </>
                    );
                },
                align: "center",
                headerAlign: "center",
                minWidth: 80,
            },
        ],
        [voterData]
    );

    return (
        <List headerButtons={({defaultButtons}) => (<></>)}>
            <DataGrid {...dataGridProps} columns={columns} autoHeight/>
        </List>
    );
}
