"use client";

import {Box, TextField} from "@mui/material";
import {Create} from "@refinedev/mui";
import {useForm} from "@refinedev/react-hook-form";
import {Controller} from "react-hook-form";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {useTranslate} from "@refinedev/core";
import * as React from "react";

export default function QuestionCreate() {

    const onSubmit = (values: any) => {
        const options: string[] = [];
        values.options.toString().split(',').forEach((val: any) => {
            options.push(val);
        });
        onFinish({
            text: values.text,
            active: values.active,
            options: options,
        });
    };

    const translate = useTranslate();

    const {
        refineCore: {onFinish, formLoading},
        register,
        control,
        formState: {errors},
        handleSubmit,
    } = useForm({});

    return (
        <Create isLoading={formLoading} saveButtonProps={{onClick: handleSubmit(onSubmit)}}>
            <Box
                component="form"
                sx={{display: "flex", flexDirection: "column"}}
                autoComplete="off"
            >
                <TextField
                    {...register("text", {
                        required: "This field is required",
                    })}
                    error={!!(errors as any)?.title}
                    helperText={(errors as any)?.title?.message}
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
                    error={!!(errors as any)?.options}
                    helperText={(errors as any)?.options?.options}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    type="text"
                    label={"Options"}
                    name="options"
                />
                <Controller
                    control={control}
                    name="active"
                    defaultValue={null as any}
                    render={({field}) => (
                        <FormControlLabel
                            label={translate("isActive")}
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
            </Box>
        </Create>
    );
}
