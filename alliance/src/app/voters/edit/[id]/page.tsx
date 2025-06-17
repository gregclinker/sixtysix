"use client";

import {Box, Button, Checkbox, TextField} from "@mui/material";
import {Edit} from "@refinedev/mui";
import {useForm} from "@refinedev/react-hook-form";
import {Controller} from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import * as React from "react";
import {useNavigation, useTranslate} from "@refinedev/core";

export default function VoterEdit() {

    const translate = useTranslate();

    const {goBack} = useNavigation();

    const {
        control,
        saveButtonProps,
        register,
        formState: {errors},
    } = useForm({
        refineCoreProps: {
            redirect: false
        },
    });

    return (
        <Edit
            breadcrumb={false}
            goBack={false}
            saveButtonProps={{
                ...saveButtonProps,
                onClick: async (e) => {
                    saveButtonProps.onClick(e);
                    goBack(); /* Navigate back after saving */
                },
            }}
            footerButtons={({defaultButtons, saveButtonProps}) => (
                <>
                    {defaultButtons}
                    <Button variant="contained" onClick={() => goBack()}>Cancel</Button>
                </>
            )}
        >
            <Box
                component="form"
                sx={{display: "flex", flexDirection: "column"}}
                autoComplete="off"
            >
                <TextField
                    {...register("title", {
                        required: false,
                    })}
                    error={!!(errors as any)?.houseNameNo}
                    helperText={(errors as any)?.houseNameNo?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    type="text"
                    label={"Title"}
                    name="title"
                />
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
                    {...register("initials", {
                        required: false,
                    })}
                    error={!!(errors as any)?.initials}
                    helperText={(errors as any)?.initials?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    type="text"
                    label={"Initials"}
                    name="initials"
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
                    {...register("email", {})}
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
                    {...register("eno", {})}
                    error={!!(errors as any)?.eno}
                    helperText={(errors as any)?.eno?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    type="text"
                    label={"ENO"}
                    name="eno"
                />
                <Controller
                    control={control}
                    name="noContact"
                    // eslint-disable-next-line
                    defaultValue={false}
                    render={({field}) => (
                        <FormControlLabel
                            label={translate("No Contact")}
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
                <Controller
                    control={control}
                    name="supporter"
                    // eslint-disable-next-line
                    defaultValue={null as any}
                    render={({field}) => (
                        <FormControlLabel
                            label={translate("Supporter")}
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
        </Edit>
    );
}
