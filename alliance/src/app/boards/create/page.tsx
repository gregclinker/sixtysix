"use client";

import {Autocomplete, Box, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {Create, useAutocomplete} from "@refinedev/mui";
import {useForm} from "@refinedev/react-hook-form";
import {Controller} from "react-hook-form";
import * as React from "react";
import {sortModeOptions} from "@constants/sortModeOptions";

interface IPollingDistrict {
    name: string;
}

export default function BoardCreate() {

    const {
        saveButtonProps,
        refineCore: {formLoading},
        register,
        formState: {errors},
        control
    } = useForm({});

    const {autocompleteProps: pollingDistrictAutocompleteProps} = useAutocomplete<IPollingDistrict>({
        resource: "addresses/pollingdistricts",
        debounce: 500,
        onSearch: (value) => [
            {
                field: "name",
                operator: "contains",
                value,
            },
        ],
    });

    return (
        <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
            <Box
                component="form"
                sx={{display: "flex", flexDirection: "column"}}
                autoComplete="off"
            >
                <TextField
                    {...register("name", {
                        required: "This field is required",
                    })}
                    error={!!(errors as any)?.name}
                    helperText={(errors as any)?.name?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    type="text"
                    label={"Name"}
                    name="name"
                />
                <TextField
                    {...register("description", {
                        required: "This field is required",
                    })}
                    error={!!(errors as any)?.description}
                    helperText={(errors as any)?.description?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    type="text"
                    label={"Description"}
                    name="description"
                />
                <Controller
                    control={control}
                    name="pollingDistrict"
                    rules={{required: "This field is required"}}
                    render={({field}) => (
                        <Autocomplete
                            {...pollingDistrictAutocompleteProps}
                            {...field}
                            onChange={(_, value) => {
                                field.onChange(value?.name);
                            }}
                            getOptionLabel={(item) => item.name}
                            isOptionEqualToValue={(option, value) =>
                                value === undefined || option?.name === value?.name
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Polling District"
                                    margin="normal"
                                    variant="outlined"
                                    error={!!errors.pollingDistrict}
                                    helperText={(errors as any)?.pollingDistrict?.message}
                                    required
                                />
                            )}
                        />
                    )}
                />
                <FormControl
                    sx={{marginTop: 2, marginBottom: 1}}
                    error={!!errors?.sortMode}
                >
                    <InputLabel id="sortmode-label">Sort Mode</InputLabel>
                    <Select
                        labelId="sortMode-label"
                        id="sortMode"
                        label="Sort Mode"
                        defaultValue={"ELECTORAL_REGISTER"}
                        {...register("sortMode", {
                            required: "This field is required",
                        })}
                    >
                        {sortModeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.sortMode && (
                        <FormHelperText error>
                            {errors.sortMode.message?.toString()}
                        </FormHelperText>
                    )}
                </FormControl>
            </Box>
        </Create>
    );
}
