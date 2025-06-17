"use client";

import {Autocomplete, Box, Checkbox, Stack, TextField} from "@mui/material";
import {Edit} from "@refinedev/mui";
import {useForm} from "@refinedev/react-hook-form";
import {Controller, useWatch} from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import {useTranslate} from "@refinedev/core";
import * as React from "react";
import {useEffect} from "react";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface IQuestion {
    id: number;
    text: string;
    options: string[];
    optionToCreateBoard: string[];
    active: boolean;
}

export default function QuestionEdit() {

    const onSubmit = (values: any) => {
        const options: string[] = [];
        values.options.toString().split(',').forEach((val: any) => {
            options.push(val);
        });
        onFinish({
            text: values.text,
            active: values.active,
            optionToCreateBoard: values.optionToCreateBoard,
            options: options,
        });
    };

    const translate = useTranslate();

    const {
        register,
        control,
        setValue,
        formState: {errors},
        refineCore: {query, onFinish},
        handleSubmit,
    } = useForm<IQuestion>({});

    const questionOptions: string[] = query?.data?.data?.options as Array<string>
    const questionActive: boolean = query?.data?.data?.active as boolean

    const [optionsToCreateBoard, setOptionsToCreateBoard] = React.useState<string[]>([]);

    const optionToCreateBoard = useWatch({
        control,
        name: "optionToCreateBoard",
    });

    useEffect(() => {
        if (optionToCreateBoard?.length > 0) {
            setValue("active", false);
        }
    }, [optionToCreateBoard, setValue]);

    const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
    const checkedIcon = <CheckBoxIcon fontSize="small"/>;

    if (query?.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Edit saveButtonProps={{onClick: handleSubmit(onSubmit)}}>
            <Box
                component="form"
                sx={{display: "flex", flexDirection: "column"}}
                autoComplete="off"
            >
                <Stack direction="column" spacing={2}>
                    <TextField
                        {...register("text", {
                            required: "This field is required",
                        })}
                        error={!!(errors as any)?.text}
                        helperText={(errors as any)?.text?.message}
                        margin="normal"
                        fullWidth
                        InputLabelProps={{shrink: true}}
                        type="text"
                        label={"Text"}
                        name="text"
                    />
                    <TextField
                        {...register("options", {
                            required: "This field is required",
                        })}
                        error={!!(errors as any)?.postCode}
                        helperText={(errors as any)?.postCode?.message}
                        margin="normal"
                        fullWidth
                        InputLabelProps={{shrink: true}}
                        type="text"
                        label={"Options"}
                        name="options"
                    />
                    <Controller
                        control={control}
                        name="optionToCreateBoard"
                        rules={{required: false}}
                        // eslint-disable-next-line
                        defaultValue={[]} // Instead of null
                        render={({field}) => (
                            <Autocomplete
                                {...field}
                                value={field.value || []}
                                onChange={(_, newValue) => {
                                    field.onChange(newValue);
                                }}
                                multiple
                                id="checkboxes-tags-demo"
                                options={questionOptions}
                                disableCloseOnSelect
                                getOptionLabel={(option) => option}
                                renderOption={(props, option, {selected}) => {
                                    const {key, ...optionProps} = props;
                                    return (
                                        <li key={key} {...optionProps}>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                style={{marginRight: 8}}
                                                checked={selected}
                                            />
                                            {option}
                                        </li>
                                    );
                                }}
                                style={{width: 500}}
                                renderInput={(params) => (
                                    <TextField {...params} label="Options to create boards" placeholder="Options"/>
                                )}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="active"
                        defaultValue={questionActive}
                        render={({field}) => (
                            <FormControlLabel
                                label={translate("Active")}
                                control={
                                    <Checkbox
                                        {...field}
                                        checked={field.value}
                                        onChange={(event) => {
                                            field.onChange(event.target.checked);
                                        }}
                                    />
                                }
                            />
                        )}
                    />
                </Stack>
            </Box>
        </Edit>
    );
}
