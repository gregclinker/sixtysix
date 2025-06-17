"use client";

import {DataGrid, type GridColDef} from "@mui/x-data-grid";
import {useMany} from "@refinedev/core";
import {BooleanField, DeleteButton, EditButton, List, ShowButton, useDataGrid,} from "@refinedev/mui";
import React from "react";

export default function UsersList() {
    const {dataGridProps} = useDataGrid({
        dataProviderName: "default",
    });

    const {data: userData, isLoading: questionIsLoading} = useMany({
        resource: "users",
        ids:
            dataGridProps?.rows
                ?.map((item: any) => item?.question?.id)
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
                filterable: false,
                sortable: false,
            },
            {
                field: "firstName",
                flex: 1,
                headerName: "First Name",
                minWidth: 180,
                filterable: true,
                sortable: true,
            },
            {
                field: "lastName",
                flex: 1,
                headerName: "Last Name",
                minWidth: 180,
                filterable: true,
                sortable: true,
            },
            {
                field: "email",
                flex: 1,
                headerName: "Email",
                minWidth: 250,
                filterable: true,
                sortable: true,
            },
            {
                field: "role",
                flex: 1,
                headerName: "Role",
                minWidth: 200,
                filterable: true,
                sortable: true,
            },
            {
                field: "locked",
                flex: 1,
                headerName: "Locked",
                minWidth: 80,
                filterable: false,
                sortable: false,
                renderCell: function render({row}) {
                    return (
                        <>
                            <BooleanField value={row.locked}/>
                        </>
                    );
                },
            },
            {
                field: "actions",
                headerName: "Actions",
                align: "center",
                headerAlign: "center",
                minWidth: 80,
                filterable: false,
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
            },
        ],
        [userData]
    );

    return (
        <List>
            <DataGrid {...dataGridProps} columns={columns} autoHeight/>
        </List>
    );
}
