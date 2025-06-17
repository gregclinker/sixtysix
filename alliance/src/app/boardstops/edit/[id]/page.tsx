"use client";

import {Button, Checkbox, FormControlLabel, MenuItem, Select, TextField} from "@mui/material";
import {Edit, SaveButton} from "@refinedev/mui";
import {useForm} from "@refinedev/react-hook-form";
import * as React from "react";
import {useEffect, useState} from "react";
import {Controller, UseFormWatch} from "react-hook-form";
import {useNavigation, useTranslate} from "@refinedev/core";
import {apiHttpClient, dataProvider} from "@providers/data-provider";
import CircularProgress from "@mui/material/CircularProgress";

export default function BoardStopEdit() {

    const {goBack} = useNavigation();
    const translate = useTranslate();

    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        control,
        formState: {errors},
        refineCore: {onFinish, redirect, queryResult, id, formLoading},
        reset,
        watch,
        handleSubmit,
    } = useForm({
        refineCoreProps: {
            redirect: false,
        },
    });

    const cancelBoardStop = () => {
        setIsSaving(true);
        apiHttpClient.request({
                method: "PATCH",
                url: dataProvider.getApiUrl() + `/boardstops/cancel/${id}`,
            }
        ).then(function (response) {
            goBack();
        }).catch(function (error) {
            console.error(error);
        });
    }

    // I don't know why you have to do this!!
    useEffect(() => {
        // Reset the form when the data is loaded
        if (queryResult?.data?.data) {
            reset(queryResult.data.data);
        }
    }, [queryResult?.data?.data, reset]);

    const address: any = queryResult?.data?.data?.address;
    const boardStopVoters: any = queryResult?.data?.data?.boardStopVoters;

    const showSupporterEmailFields: UseFormWatch<any>[] = [
        watch("boardStopVoters[0].voter.supporter"),
        watch("boardStopVoters[1].voter.supporter"),
        watch("boardStopVoters[2].voter.supporter"),
        watch("boardStopVoters[3].voter.supporter"),
        watch("boardStopVoters[4].voter.supporter"),
        watch("boardStopVoters[5].voter.supporter"),
        watch("boardStopVoters[6].voter.supporter"),
        watch("boardStopVoters[7].voter.supporter"),
        watch("boardStopVoters[8].voter.supporter"),
        watch("boardStopVoters[9].voter.supporter"),
    ];

    const hideVoters: UseFormWatch<any>[] = [
        watch("boardStopVoters[0].voter.noContact"),
        watch("boardStopVoters[1].voter.noContact"),
        watch("boardStopVoters[2].voter.noContact"),
        watch("boardStopVoters[3].voter.noContact"),
        watch("boardStopVoters[4].voter.noContact"),
        watch("boardStopVoters[5].voter.noContact"),
        watch("boardStopVoters[6].voter.noContact"),
        watch("boardStopVoters[7].voter.noContact"),
        watch("boardStopVoters[8].voter.noContact"),
        watch("boardStopVoters[9].voter.noContact"),
    ];


    const handleCustomSubmit = (data: any, wholeHousehold: boolean, notIn: boolean) => {
        setIsSaving(true);
        onFinish({
            ...data,
            wholeHousehold: wholeHousehold,
            notIn: notIn,
        });
        goBack();
    };

    if (isSaving) {
        return <div><CircularProgress/></div>;
    }

    return (
        <Edit
            title={""}
            breadcrumb={false}
            goBack={false}
            headerButtons={
                <>
                    <Button variant="contained" onClick={() => cancelBoardStop()}>Cancel</Button>
                    <SaveButton onClick={handleSubmit((data) => handleCustomSubmit(data, false, true))}>Not
                        In</SaveButton>
                    <SaveButton
                        onClick={handleSubmit((data) => handleCustomSubmit(data, true, false))}>Household</SaveButton>
                </>
            }
            footerButtons={
                <>
                    <SaveButton onClick={handleSubmit((data) => handleCustomSubmit(data, false, false))}/>
                </>
            }
            footerButtonProps={{
                style: {
                    marginBottom: "30px",
                },
            }}
        >
            <TextField
                {...register("id", {
                    required: "This field is required",
                })}
                type="hidden"
                sx={{display: 'none'}}
            />
            <TextField
                {...register("boardId", {
                    required: "This field is required",
                })}
                type="hidden"
                sx={{display: 'none'}}
            />
            <h3><b>Address: </b>{address}</h3>
            {boardStopVoters?.map((boardStopVoter: {
                answers: any;
                voter: any;
            }, voterIndex: any) => {
                return (
                    <div key={voterIndex}><h4>Voter:&nbsp;{boardStopVoter?.voter.fullName}<br/>
                        <Controller
                            name={`boardStopVoters[${voterIndex}].voter.noContact`}
                            control={control}
                            // eslint-disable-next-line
                            defaultValue={false}
                            render={({field}) => (
                                <FormControlLabel
                                    label={translate("Do not contact")}
                                    control={
                                        <Checkbox
                                            {...field}
                                            checked={field.value || false}
                                            onChange={(event) => {
                                                field.onChange(event.target.checked);
                                            }}
                                        />
                                    }
                                />
                            )}
                        />
                        {!hideVoters[voterIndex] && (
                            <FormControlLabel
                                control={
                                    <Controller
                                        name={`boardStopVoters[${voterIndex}].voter.supporter`}
                                        control={control}
                                        render={({field}) =>
                                            <Checkbox {...field} checked={field.value || false}/>}
                                    />
                                }
                                label="Supporter"
                            />
                        )}
                    </h4>
                        {!hideVoters[voterIndex] && showSupporterEmailFields[voterIndex] && (
                            <Controller
                                name={`boardStopVoters[${voterIndex}].voter.email`}
                                control={control}
                                defaultValue=""
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        label="supporter's email"
                                        margin="dense"
                                        sx={{width: 300}}
                                    />
                                )}
                            />
                        )}
                        {!hideVoters[voterIndex] && (
                            <div key={"voterDiv" + voterIndex}>
                                {boardStopVoter?.answers?.map((answer: any, answerIndex: number) =>
                                    <div key={"voterDiv" + voterIndex + answerIndex}>
                                        <h4>{answer?.questionVO?.text}</h4>
                                        <Controller
                                            key={"Controller" + voterIndex + answerIndex}
                                            control={control}
                                            name={`boardStopVoters[${voterIndex}].answers[${answerIndex}].text`}
                                            rules={{required: false}}
                                            defaultValue=""
                                            render={({field}) => {
                                                return (
                                                    <>
                                                        <Select
                                                            {...field}
                                                            defaultValue={""}
                                                            id={"select" + voterIndex + answerIndex}
                                                            key={"Select" + voterIndex + answerIndex}
                                                            sx={{width: 300}}
                                                        >
                                                            <MenuItem key="123456" value="">Select</MenuItem>
                                                            {answer?.questionVO?.options.map((option: string, optionIndex: number) => (
                                                                <MenuItem
                                                                    key={"MenuItem" + voterIndex + answerIndex + optionIndex}
                                                                    value={option}>{option}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </>);
                                            }}
                                        />
                                    </div>)}
                            </div>
                        )}
                    </div>
                );
            })}
        </Edit>
    );
}
