"use client";

import {Autocomplete, Box, TextField} from "@mui/material";
import {Create, useAutocomplete} from "@refinedev/mui";
import {useForm} from "@refinedev/react-hook-form";
import {Controller, useFieldArray} from "react-hook-form"
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

interface IVoter {
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    eno: string;
}

export default function AddressCreate() {

    const onSubmit = (values: any) => {
        console.log('values: ' + values)
        const voters: IVoter[] = [];
        values.voters.forEach((val: any) => {
            voters.push({
                title: val.title,
                firstName: val.firstName,
                lastName: val.lastName,
                email: val.email,
                eno: val.eno
            });
        });

        onFinish({
            houseName: values.houseName,
            houseNo: values.houseNo,
            street: values.street,
            postCode: values.postCode,
            pollingDistrict: values.pollingDistrict,
            board: values.board,
            voters: voters,
        });
    };

    const {
        refineCore: {onFinish, formLoading, redirect},
        control,
        register,
        formState: {errors},
        handleSubmit,
    } = useForm({});

    const {fields, append, remove} = useFieldArray({
        control,
        name: "voters",
        rules: {
            required: false,
        },
    });

    const {autocompleteProps: boardAutocompleteProps} = useAutocomplete({
        resource: "boards/autocomplete",
    });

    return (
        <Create isLoading={formLoading} saveButtonProps={{onClick: handleSubmit(onSubmit)}}>
            <Box
                component="form"
                sx={{display: "flex", flexDirection: "column"}}
                autoComplete="off"
            >
                <TextField
                    {...register("houseName", {
                        required: false
                    })}
                    error={!!(errors as any)?.title}
                    helperText={(errors as any)?.title?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    type="text"
                    label={"House Name"}
                    name="houseName"
                />
                <TextField
                    {...register("houseNo", {
                        required: "This field is required",
                    })}
                    error={!!(errors as any)?.title}
                    helperText={(errors as any)?.title?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    type="text"
                    label={"House No"}
                    name="houseNo"
                />
                <TextField
                    {...register("street", {
                        required: "This field is required",
                    })}
                    error={!!(errors as any)?.title}
                    helperText={(errors as any)?.title?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    type="text"
                    label={"Street"}
                    name="street"
                />
                <TextField
                    {...register("pollingDistrict", {
                        required: "This field is required",
                    })}
                    error={!!(errors as any)?.pollingDistrict}
                    helperText={(errors as any)?.pollingDistrict?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    type="text"
                    label={"Polling District"}
                    name="pollingDistrict"
                />
                <TextField
                    {...register("postCode", {
                        required: "This field is required",
                    })}
                    error={!!(errors as any)?.postCode}
                    helperText={(errors as any)?.postCode?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    type="text"
                    label={"Post Code"}
                    name="postCode"
                />
                <Controller
                    control={control}
                    name={"board.id"}
                    rules={{required: "This field is required"}}
                    // eslint-disable-next-line
                    defaultValue={null as any}
                    render={({field}) => (
                        <Autocomplete
                            {...boardAutocompleteProps}
                            {...field}
                            onChange={(_, value) => {
                                field.onChange(value.id);
                            }}
                            getOptionLabel={(item) => {
                                return (
                                    boardAutocompleteProps?.options?.find((p) => {
                                        const itemId =
                                            typeof item === "object"
                                                ? item?.id?.toString()
                                                : item?.toString();
                                        const pId = p?.id?.toString();
                                        return itemId === pId;
                                    })?.name ?? ""
                                );
                            }}
                            isOptionEqualToValue={(option, value) => {
                                const optionId = option?.id?.toString();
                                const valueId =
                                    typeof value === "object"
                                        ? value?.id?.toString()
                                        : value?.toString();
                                return value === undefined || optionId === valueId;
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={"Board"}
                                    margin="normal"
                                    variant="outlined"
                                    error={!!(errors as any)?.board?.id}
                                    helperText={(errors as any)?.board?.id?.message}
                                    required
                                />
                            )}
                        />
                    )}
                />
                {fields.map(({id}, index) => {
                    return (
                        <Box
                            key={id}
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                marginRight: "15px",
                            }}
                        >
                            <Stack direction={"row"} gap={3}>
                                <Controller
                                    control={control}
                                    name={`voters[${index}].title`}
                                    render={({field}) => (
                                        <TextField
                                            {...field}
                                            error={!!errors?.voters}
                                            helperText={errors.voters && `${errors.voters.message}`}
                                            margin="normal"
                                            required={false}
                                            fullWidth={false}
                                            id="title"
                                            label={`Title - ${index + 1}`}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={`voters[${index}].firstName`}
                                    render={({field}) => (
                                        <TextField
                                            {...field}
                                            error={!!errors?.voters}
                                            helperText={errors.voters && `${errors.voters.message}`}
                                            margin="normal"
                                            required
                                            fullWidth={false}
                                            id="firstName"
                                            label={`First Name - ${index + 1}`}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={`voters[${index}].lastName`}
                                    render={({field}) => (
                                        <TextField
                                            {...field}
                                            error={!!errors?.voters}
                                            helperText={errors.voters && `${errors.voters.message}`}
                                            margin="normal"
                                            required
                                            fullWidth={false}
                                            id="firstName"
                                            label={`Last Name - ${index + 1}`}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={`voters[${index}].email`}
                                    render={({field}) => (
                                        <TextField
                                            {...field}
                                            error={!!errors?.voters}
                                            helperText={errors.voters && `${errors.voters.message}`}
                                            margin="normal"
                                            required
                                            fullWidth={false}
                                            id="email"
                                            label={`Email - ${index + 1}`}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={`voters[${index}].eno`}
                                    render={({field}) => (
                                        <TextField
                                            {...field}
                                            error={!!errors?.voters}
                                            helperText={errors.voters && `${errors.voters.message}`}
                                            margin="normal"
                                            required
                                            fullWidth={false}
                                            id="eno"
                                            label={`ENO - ${index + 1}`}
                                        />
                                    )}
                                />
                            </Stack>
                            &nbsp;
                            <DeleteIcon
                                onClick={() => {
                                    remove(index);
                                }}
                                sx={{color: "red", cursor: "pointer"}}
                            />
                        </Box>
                    );
                })}
            </Box>
            <p>{errors.voters && `${errors.voters?.root?.message}`}</p>
            <Button
                variant="contained"
                onClick={() => {
                    append({voters: "Javascript"});
                }}
            >
                Add Voter
            </Button>
        </Create>
    );
}
