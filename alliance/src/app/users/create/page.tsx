"use client";

import {Autocomplete, Box, TextField} from "@mui/material";
import {Create} from "@refinedev/mui";
import {useForm} from "@refinedev/react-hook-form";
import {useTranslate} from "@refinedev/core";
import * as React from "react";
import {Controller} from "react-hook-form";

export default function UserCreate() {


    const translate = useTranslate();

    const {
        saveButtonProps,
        refineCore: {onFinish, formLoading},
        register,
        control,
        formState: {errors},
        handleSubmit,
    } = useForm({});

    return (
        <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
            <Box
                component="form"
                sx={{display: "flex", flexDirection: "column"}}
                autoComplete="off"
            >
                <TextField
                    {...register("firstName", {
                        required: "This field is required",
                    })}
                    error={!!(errors as any)?.firstName}
                    helperText={(errors as any)?.firstName?.message}
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
                    error={!!(errors as any)?.lastName}
                    helperText={(errors as any)?.lastName?.message}
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
                    label={"Email"}
                    name="email"
                />
                <TextField
                    {...register("password", {
                        required: "This field is required",
                    })}
                    error={!!(errors as any)?.password}
                    helperText={(errors as any)?.password?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    type="password"
                    label={"New Password"}
                    name="password"
                />
                <TextField
                    {...register("confirmPassword", {
                        required: "Confirm password is required",
                        validate: (value, formValues) =>
                            value === formValues.password || "Passwords do not match",
                    })}
                    margin="normal"
                    fullWidth
                    type="password"
                    name="confirmPassword"
                    label="Confirm New Password"
                />
                {errors.content && <span>This field is required</span>}
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
        </Create>
    );
}
