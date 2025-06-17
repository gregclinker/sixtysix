"use client";

import {DataGrid, type GridColDef} from "@mui/x-data-grid";
import {useMany} from "@refinedev/core";
import {DeleteButton, EditButton, List, useDataGrid,} from "@refinedev/mui";
import React from "react";

export default function QuestionsList() {
    const {dataGridProps} = useDataGrid({
        dataProviderName: "default",
    });

    const {data: questionData, isLoading: questionIsLoading} = useMany({
        resource: "boardstops",
        ids:
            dataGridProps?.rows
                ?.map((item: any) => item?.id)
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
                field: "name",
                headerName: "Name",
                type: "string",
                minWidth: 150,
                filterable: true,
                sortable: false,
            },
            {
                field: "address",
                headerName: "Address",
                type: "string",
                minWidth: 450,
                filterable: false,
                sortable: false,
            },
            {
                field: "status",
                headerName: "Status",
                type: "string",
                minWidth: 150,
                filterable: true,
                sortable: false,
            },
            {
                field: "actions",
                headerName: "Actions",
                align: "center",
                headerAlign: "center",
                minWidth: 200,
                filterable: false,
                sortable: false,
                renderCell: function render({row}) {
                    return (
                        <>
                            <EditButton hideText recordItemId={row.id}/>
                            <DeleteButton hideText recordItemId={row.id}/>
                        </>
                    );
                },
            },
        ],
        [questionData]
    );

    return (
        <List>
            <DataGrid {...dataGridProps} columns={columns} autoHeight/>
        </List>
    );
}
