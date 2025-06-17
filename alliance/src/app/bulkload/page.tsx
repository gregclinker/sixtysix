"use client"

import React, {useState} from "react";
import {useInvalidate, useNotification, useSelect} from "@refinedev/core";
import {useForm} from "@refinedev/react-hook-form";
import {Create} from "@refinedev/mui";
import {Box, Button, Input, List, Paper, Stack, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {apiHttpClient, dataProvider} from "@providers/data-provider";
import JSZip from 'jszip';
import {DataGrid, GridColDef} from "@mui/x-data-grid";

interface IBulkLoad {
    fileName: string;
    type: string;
    status: string;
    started: string;
    completed: string;
}

export default function BulkLoad() {

    const API_URL = dataProvider.getApiUrl();
    const invalidate = useInvalidate();

    const [isUploading, setIsUploading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [fileContent, setFileContent] = useState("");
    const [fileName, setFileName] = useState("");

    const {query: bulkLoadQuery} = useSelect<IBulkLoad>({
        resource: 'bulkloads'
    });

    const {data, isFetching} = bulkLoadQuery;
    const bulkLoads = data?.data || [];

    // Define columns for DataGrid
    const columns = React.useMemo<GridColDef<IBulkLoad>[]>(
        () => [
            {field: "id", headerName: "ID", type: "number", minWidth: 50,},
            {field: "fileName", sortable: false, filterable: false, headerName: "File Name", minWidth: 200, flex: 1},
            {field: "type", sortable: false, filterable: false, headerName: "Type", minWidth: 120, flex: 0.5},
            {field: "status", sortable: false, filterable: false, headerName: "Status", minWidth: 120, flex: 0.5},
            {
                field: "started",
                headerName: "Started",
                minWidth: 180,
                flex: 0.8,
                sortable: false,
                filterable: false,
                valueFormatter: (params) => new Date(params.value).toLocaleString(),
            },
            {
                field: "completed",
                headerName: "Completed",
                minWidth: 180,
                flex: 0.8,
                sortable: false,
                filterable: false,
                renderCell: ({row}) => {
                    return row.status === "COMPLETE"
                        ? new Date(row.completed).toLocaleString()
                        : "";
                },
            },
        ],
        []
    );

    const {open} = useNotification();

    const {
        handleSubmit,
        formState: {errors},
        reset, //
    } = useForm();

    const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            setFileContent(content);
        };
        reader.readAsText(file);
    };

    const zipFileContent = async (fileContent: any, fileName: string) => {
        const zip = new JSZip();
        zip.file(fileName, fileContent);
        const zippedBlob = await zip.generateAsync({
            type: "blob",
            /* NOTE THESE ADDED COMPRESSION OPTIONS */
            /* deflate is the name of the compression algorithm used */
            compression: "DEFLATE",
            compressionOptions: {
                /* compression level ranges from 1 (best speed) to 9 (best compression) */
                level: 5
            }
        });
        return zippedBlob;
    };

    const notificationKey = "operation-progress";

    const onSubmit = async (data: any) => {
        open?.({
            key: notificationKey,
            type: "progress",
            message: "Submitting please wait this may take up to a few minutes ...",
            description: "Please wait while we process your request. The bulk load may take a few minutes",
        });
        setIsUploading(true);
        const formData = new FormData();
        const zippedFile = await zipFileContent(fileContent, fileName);
        formData.append("file", zippedFile);

        try {
            const res = await apiHttpClient.post(`${API_URL}/bulkloads/${fileName}`, formData);
            // Close the loading notification
            open?.({
                key: "operation-success",
                type: "success",
                message: "Bulk load successful",
                description: "Your request has been processed successfully.",
            });
            // Handle successful upload
            console.log("File uploaded successfully", res.data);
            // Clear the form after successful submission
            setFileContent("");
            setFileName("");
            reset(); // Reset the form fields

            // Optionally, clear the file input
            const fileInput = document.getElementById("file-input") as HTMLInputElement;
            if (fileInput) {
                fileInput.value = "";
            }
            invalidate({
                resource: "bulkloads",
                invalidates: ["list", "many"],
            });
            setIsUploading(false);
        } catch (error: any) {
            open?.({
                type: "error",
                message: "Bulk load failed",
                description: error.message,
            });
            setIsUploading(false);
        }
    };

    const exportData = async () => {
        setIsExporting(false);
        try {
            const response = await apiHttpClient.get(dataProvider.getApiUrl() + "/bulkloads/export");
            const fileContent = JSON.stringify(response.data, null, 2);
            const FileSaver = require('file-saver');
            const blob = new Blob([fileContent], {
                type: "application/json;charset=utf-8"
            });
            FileSaver.saveAs(blob, "export.json");
        } catch (error: any) {
            open?.({
                type: "error",
                message: "export failed",
                description: error.message,
            });
            setIsExporting(false);
        }
    };

    return (
        <Create saveButtonProps={{onClick: handleSubmit(onSubmit), disabled: !fileContent}}
                title={<Typography variant="h5">Import Data</Typography>}
                footerButtons={({defaultButtons}) => (<></>)}>
            <Box component="form" sx={{display: "flex", flexDirection: "column"}} autoComplete="off">
                <Stack direction="row" gap={4} flexWrap="wrap" sx={{marginTop: "16px"}}>
                    <label htmlFor="file-input">
                        <Input id="file-input" type="file" sx={{display: "none"}} onChange={onFileChange}/>
                        <Button variant="contained" component="span" startIcon={<FileUploadIcon/>}>Select File</Button>
                    </label>
                    {fileName && (
                        <Typography variant="body1">Selected file: {fileName}</Typography>
                    )}
                </Stack>
                {fileContent && (
                    <Paper elevation={3} sx={{marginTop: 2, padding: 2, maxHeight: 400, overflow: 'auto'}}><Typography
                        variant="body2">File Content Preview:</Typography>
                        <pre>{fileContent}</pre>
                    </Paper>
                )}
                <LoadingButton
                    loading={isUploading}
                    loadingPosition="start"
                    startIcon={<FileUploadIcon/>}
                    variant="contained"
                    onClick={handleSubmit(onSubmit)}
                    disabled={!fileContent}
                    sx={{
                        marginTop: 2,
                        width: 'auto', // This prevents the button from filling the screen width
                        minWidth: '150px', // You can adjust this value as needed
                        maxWidth: '150px', // Limits the maximum width
                    }}
                >
                    Upload
                </LoadingButton>
            </Box>
            <List>
                {isFetching ? (
                    <div>Loading...</div>
                ) : (
                    <DataGrid
                        rows={bulkLoads}
                        columns={columns}
                        autoHeight
                        getRowId={(row) => row.fileName} // Assuming fileName is unique, otherwise use another unique identifier
                        loading={isFetching}
                    />
                )}
            </List>
        </Create>
    );
};