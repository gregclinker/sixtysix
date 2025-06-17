"use client";

import {DataGrid, type GridColDef} from "@mui/x-data-grid";
import {useMany} from "@refinedev/core";
import {BooleanField, DeleteButton, EditButton, List, ShowButton, useDataGrid,} from "@refinedev/mui";
import React from "react";

export default function QuestionsList() {
    const {dataGridProps} = useDataGrid({
        dataProviderName: "default",
    });

    const {data: questionData, isLoading: questionIsLoading} = useMany({
        resource: "questions",
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
                field: "text",
                flex: 1,
                headerName: "Text",
                minWidth: 100,
                filterable: false,
                sortable: false,
            },
            {
                field: "options",
                flex: 1,
                headerName: "Options",
                minWidth: 100,
                filterable: false,
                sortable: false,
            },
            {
                field: "active",
                flex: 1,
                headerName: "Active",
                minWidth: 80,
                filterable: false,
                sortable: false,
                renderCell: function render({row}) {
                    return (
                        <>
                            <BooleanField value={row.active}/>
                        </>
                    );
                },
            },
            {
                field: "optionToCreateBoard",
                flex: 1,
                headerName: "Options to create boards",
                minWidth: 100,
                filterable: false,
                sortable: false,
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
        [questionData]
    );

    return (
        <List>
            <DataGrid {...dataGridProps} columns={columns} autoHeight/>
        </List>
    );
}
