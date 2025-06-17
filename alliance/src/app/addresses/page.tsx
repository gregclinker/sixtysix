"use client";

import {DataGrid, type GridColDef} from "@mui/x-data-grid";
import {useMany} from "@refinedev/core";
import {DeleteButton, EditButton, List, ShowButton, useAutocomplete, useDataGrid,} from "@refinedev/mui";
import React from "react";

export default function AddressList() {
    const {autocompleteProps: categoryAutocompleteProps} = useAutocomplete({
        resource: "boards",
    });

    const {dataGridProps} = useDataGrid({
        dataProviderName: "default",
    });

    const {data: addressData, isLoading: addressIsLoading} = useMany({
        resource: "addresses",
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
                field: "houseName",
                flex: 1,
                headerName: "House Name",
                minWidth: 100,
            },
            {
                field: "houseNo",
                flex: 1,
                headerName: "No",
                minWidth: 100,
            },
            {
                field: "street",
                flex: 1,
                headerName: "Street",
                minWidth: 300,
            },
            {
                field: "pollingDistrict",
                flex: 1,
                headerName: "Polling District",
                minWidth: 100,
            },
            {
                field: "postCode",
                flex: 1,
                headerName: "Post Code",
                minWidth: 100,
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
        [addressData]
    );

    return (
        <List>
            <DataGrid {...dataGridProps} columns={columns} autoHeight/>
        </List>
    );
}
