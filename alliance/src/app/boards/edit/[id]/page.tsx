"use client";

import {
    Box,
    Button,
    Checkbox,
    FormHelperText,
    InputLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {Edit} from "@refinedev/mui";
import {useForm} from "@refinedev/react-hook-form";
import React, {useEffect, useState} from "react";
import {useParsed, useSelect} from "@refinedev/core";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import {BoardMap} from "@components/maps";
import {IPostCodeCluster} from "@interfaces";
import CircularProgress from "@mui/material/CircularProgress";
import {Controller} from "react-hook-form";
import {sortModeOptions} from "@constants/sortModeOptions";

interface IAddress {
    id: number;
    text: string;
}

export default function BoardEdit() {

    const {id} = useParsed();

    const {
        control,
        saveButtonProps,
        register,
        formState: {errors},
        refineCore: {onFinish, formLoading, queryResult: formQueryResult},
        reset,
        handleSubmit,
    } = useForm({
        refineCoreProps: {
            resource: "boards", id,
            redirect: "show"
        },
    });

    const postCodeCluster: IPostCodeCluster = formQueryResult?.data?.data?.postCodeCluster;

    const [selectedAddresses, setSelectedAddresses] = useState<IAddress[]>([]);
    const [transferredAddresses, setTransferredAddresses] = useState<IAddress[]>([]);
    const [hideMap, setHideMap] = useState(true);

    const {options: addressOptions, queryResult: addressQqueryResult, onSearch} = useSelect<IAddress>({
        resource: `addresses/optionaladdresses/board/${id}`,
        hasPagination: false,
        optionLabel: "text",
        optionValue: "id",
        debounce: 500,
    });

    const handleSearch = async (value: string) => {
        onSearch(value);
    };

    const handleSelect = (address: IAddress) => {
        setSelectedAddresses(prev =>
            prev.some(a => a.id === address.id)
                ? prev.filter(a => a.id !== address.id)
                : [...prev, address]
        );
    };

    const handleSelectAll = () => {
        setSelectedAddresses(selectedAddresses.length === addressOptions.length ? [] : addressOptions.map(o => ({
            id: o.value,
            text: o.label
        })));
    };

    const handleTransfer = () => {
        setTransferredAddresses(prev => {
            const newAddresses = selectedAddresses.filter(selected =>
                !prev.some(existing => existing.id === selected.id)
            );
            return [...prev, ...newAddresses];
        });
        setSelectedAddresses([]);
    };

    const clearTransfer = () => {
        setTransferredAddresses([]);
    };

    const onSubmit = (data: any) => {
        const newAddressIds = transferredAddresses.map(address => address.id);
        onFinish({
            ...data,
            newAddressIds: newAddressIds
        });
    };

    // I don't know why you have to do this!!
    useEffect(() => {
        // Reset the form when the data is loaded
        if (formQueryResult?.data?.data) {
            reset(formQueryResult.data.data);
        }
    }, [formQueryResult?.data?.data, reset]);

    if (formLoading) {
        return <div><CircularProgress/></div>;
    }

    return (
        <Edit saveButtonProps={{...saveButtonProps, onClick: handleSubmit(onSubmit)}}>
            <div hidden={!postCodeCluster.addressCount}>
                <Button onClick={() => setHideMap(!hideMap)}>{hideMap ? "Show Map" : "Hide Map"}</Button>
                <Box hidden={hideMap} component={Paper}>
                    <BoardMap
                        postCodeCluster={postCodeCluster}
                        mapContainerStyle={{
                            width: '100%',
                            height: '800px',
                        }}
                    />
                    <br/>
                </Box>
            </div>
            <Box
                component="form"
                sx={{display: "flex", flexDirection: "column"}}
                autoComplete="off"
            >
                <TextField
                    {...register("name", {
                        required: "This field is required",
                    })}
                    error={!!(errors as any)?.houseNameNo}
                    helperText={(errors as any)?.houseNameNo?.message}
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
                    error={!!(errors as any)?.street}
                    helperText={(errors as any)?.street?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    type="text"
                    label={"Description"}
                    name="description"
                    disabled
                />
                <Controller
                    key={"sortMode"}
                    control={control}
                    name={"sortMode"}
                    rules={{required: true}}
                    defaultValue=""
                    render={({field}) => {
                        return (
                            <>
                                <InputLabel id="sortmode-label">Sort Mode</InputLabel>
                                <Select
                                    {...field}
                                    labelId="sortMode-label"
                                    id="sortMode"
                                    label="Sort Mode"
                                    defaultValue=""
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
                            </>);
                    }}
                />
            </Box>
            <Typography sx={{marginLeft: '0px', marginTop: '16px', marginBottom: '8px'}} variant="body1"
                        fontWeight="bold">{"Add addresses to this board"}</Typography>
            <Box>
                <>
                    <Stack direction="row" spacing={2} alignItems="top">
                        <Stack sx={{minHeight: "400px", maxHeight: "400px"}} direction="column" spacing={2}
                               alignItems="top">
                            <TextField
                                label="Search addresses to add"
                                variant="outlined"
                                fullWidth
                                sx={{minWidth: 300}}
                                margin="normal"
                                onChange={(e) => {
                                    handleSearch(e.target.value);
                                }}
                            />
                            <Paper sx={{height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
                                {addressQqueryResult.isFetching ? (
                                    <CircularProgress/>
                                ) : (
                                    <List>
                                        <ListItem>
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={selectedAddresses.length === addressOptions.length}
                                                    onChange={handleSelectAll}
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary="Select All"/>
                                        </ListItem>
                                        {addressOptions.map((option) => (
                                            <ListItem key={option.value}>
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={selectedAddresses.some(a => a.id === option.value)}
                                                        onChange={() => handleSelect({
                                                            id: option.value,
                                                            text: option.label
                                                        })}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText primary={option.label}/>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Paper>
                        </Stack>
                        <Stack direction="column" spacing={2} alignItems="top">
                            <Button variant="contained" endIcon={<KeyboardDoubleArrowRightIcon/>}
                                    onClick={handleTransfer}>Add</Button>
                            <Button variant="contained" startIcon={<KeyboardDoubleArrowLeftIcon/>}
                                    onClick={clearTransfer}>Clear</Button>
                        </Stack>
                        <TextField
                            multiline
                            rows={16}
                            maxRows={16}
                            fullWidth
                            sx={{minWidth: 600}}
                            value={transferredAddresses.map(addr => addr.text).join(', ')}
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Stack>
                </>
            </Box>
        </Edit>
    );
}
