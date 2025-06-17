"use client";

import {Autocomplete, Box, TextField} from "@mui/material";
import {Edit} from "@refinedev/mui";
import {useForm} from "@refinedev/react-hook-form";
import {Controller} from "react-hook-form";
import {useTranslate} from "@refinedev/core";
import * as React from "react";

export default function UserEdit() {

    const translate = useTranslate();

    const {
        register,
        saveButtonProps,
        control,
        setValue,
        formState: {errors},
        refineCore: {query, onFinish},
        handleSubmit,
    } = useForm({});

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Box
                component="form"
                sx={{display: "flex", flexDirection: "column"}}
                autoComplete="off"
            >
                <TextField
                    {...register("firstName", {
                        required: "This field is required",
                    })}
                    error={!!(errors as any)?.text}
                    helperText={(errors as any)?.text?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    type="text"
                    label={"First Name"}
                    name="firstName"
                />
                <TextField
                    {...register("lastName", {
                        required: "This field is required",
                    })}
                    error={!!(errors as any)?.postCode}
                    helperText={(errors as any)?.postCode?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    type="text"
                    label={"Last Name"}
                    name="lastName"
                />
                <TextField
                    {...register("email", {
                        required: "This field is required",
                    })}
                    error={!!(errors as any)?.email}
                    helperText={(errors as any)?.email?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    type="text"
                    label={"Email Address"}
                    name="email"
                />
                <TextField
                    {...register("password", {
                        required: false,
                    })}
                    error={!!(errors as any)?.password}
                    helperText={(errors as any)?.password?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    type="text"
                    label={"Password"}
                    name="password"
                />
                <Controller
                    control={control}
                    name="role"
                    rules={{required: false}}
                    // eslint-disable-next-line
                    defaultValue={null as any}
                    render={({field}) => (
                        <Autocomplete
                            {...field}
                            onChange={(_, value) => {
                                field.onChange(value);
                            }}
                            disablePortal
                            options={['ROLE_USER', 'ROLE_RUNNER', 'ROLE_ADMIN']}
                            sx={{width: 300}}
                            renderInput={(params) => <TextField margin="normal" {...params} label="Role"/>}
                        />
                    )}
                />
            </Box>
        </Edit>
    );
}
