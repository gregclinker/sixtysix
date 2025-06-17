"use client"

import React, {useEffect, useState} from "react";
import {useNotification} from "@refinedev/core";
import {Autocomplete, Box, TextField} from "@mui/material";
import {apiHttpClient, dataProvider} from "@providers/data-provider";
import {useForm} from "@refinedev/react-hook-form";
import {Create, useAutocomplete} from "@refinedev/mui";
import {Controller} from "react-hook-form";
import {LoadingButton} from "@mui/lab";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

interface IQuestion {
    text: string;
    options: string[];
}

interface IFormValues {
    question: IQuestion;
    selectedAnswers: string[];
}

export default function Export() {

    const {
        saveButtonProps,
        refineCore: {onFinish},
        control,
        watch,
        setValue,
        handleSubmit,
        formState: {errors},
    } = useForm<IFormValues>({
        defaultValues: {
            question: null, // or your initial value
            selectedAnswers: [], // initialize with empty array for multiple select
        },
    });

    // Custom submission handler
    const exportHandler = async (values: any) => {
        setIsExporting(true);
        // Transform data for the GET request
        const params = {
            questionId: values.question.id,
            options: values.selectedAnswers.join(','),
        };
        // Create URL with query parameters
        const queryString = new URLSearchParams(params).toString();
        try {
            const response = await apiHttpClient.get(dataProvider.getApiUrl() + `/export?${queryString}`);
            const fileContent = JSON.stringify(response.data, null, 2);
            const FileSaver = require('file-saver');
            const blob = new Blob([fileContent], {
                type: "application/json;charset=utf-8"
            });
            FileSaver.saveAs(blob, "alliance-export.json");
        } catch (error: any) {
            open?.({
                type: "error",
                message: "export failed",
                description: error.message,
            });
        }
        setIsExporting(false);
    };

    // Watch for changes to the question field
    const selectedQuestion = watch("question");

    // Reset selectedAnswers when question changes
    useEffect(() => {
        setValue("selectedAnswers", []);
    }, [selectedQuestion, setValue]);


    const {autocompleteProps} = useAutocomplete<IQuestion>({
        resource: "questions",
    });

    const [isExporting, setIsExporting] = useState(false);

    // Define columns for DataGrid
    const {open} = useNotification();

    return (
        <Create footerButtons={<LoadingButton loading={isExporting}
                                              startIcon={<FileDownloadIcon/>}
                                              onClick={handleSubmit(exportHandler)}
                                              variant={"contained"}>Export</LoadingButton>}>
            <Box component="form">
                <Controller
                    control={control}
                    name="question"
                    rules={{required: "Please select a question"}}
                    render={({field}) => (
                        <Autocomplete
                            {...autocompleteProps}
                            {...field}
                            onChange={(_, value) => {
                                field.onChange(value);
                            }}
                            getOptionLabel={(option) => option.text}
                            isOptionEqualToValue={(option, value) =>
                                value === undefined ||
                                option?.text === value?.text
                            }
                            // Remove this placeholder prop
                            // placeholder="Select a question"
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Question"
                                    // Add placeholder here instead
                                    placeholder="Select a question"
                                    margin="normal"
                                    variant="outlined"
                                    error={!!errors.question}
                                    helperText={errors.question?.message as string}
                                    required
                                />
                            )}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="selectedAnswers"
                    rules={{required: "Please select at least one answer"}}
                    render={({field, fieldState}) => (
                        <Autocomplete
                            {...field}
                            multiple
                            options={watch("question")?.options || []}
                            onChange={(_, value) => {
                                field.onChange(value);
                            }}
                            disabled={!watch("question")}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Answers"
                                    margin="normal"
                                    variant="outlined"
                                    error={!!errors.selectedAnswers}
                                    helperText={errors.selectedAnswers?.message as string}
                                    required
                                />
                            )}
                        />
                    )}
                />
            </Box>
        </Create>
    );
};