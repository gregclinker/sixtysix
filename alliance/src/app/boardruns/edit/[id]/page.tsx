"use client";

import {Checkbox, FormControlLabel, MenuItem, Select, TextField} from "@mui/material";
import {Edit, SaveButton} from "@refinedev/mui";
import {useForm} from "@refinedev/react-hook-form";
import * as React from "react";
import {useEffect, useState} from "react";
import {Controller} from "react-hook-form";
import {useTranslate, useUpdate} from "@refinedev/core";

export default function BoardRunEdit() {

    function getVoter(voter: any) {
        const voterDetails: any = voter?.voter;
        const voterTitle: string = voterDetails?.title == null ? '' : voterDetails?.title + ' '
        return voterTitle + voterDetails?.firstName + " " + voterDetails?.lastName;
    }

    const translate = useTranslate();

    const {
        handleSubmit,
        saveButtonProps,
        register,
        control,
        formState: {errors},
        refineCore: {formLoading, onFinish, redirect, query, queryResult, id},
        reset,
    } = useForm({
        refineCoreProps: {
            queryOptions: {
                staleTime: Infinity,
                refetchOnWindowFocus: false,
                refetchOnMount: false,
            },
        },
    });

    const [message, setMessage] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const {mutate} = useUpdate();

    const saveAndNext = (data: any) => {
        onFinish(data).then(() => {
            redirect("edit");
        });
    };

    const handleSaveWithoutRefresh = async (data: any) => {
        mutate({
            resource: "boardruns",
            values: data,
            id: queryResult?.data?.data?.id,
            invalidates: [],
        });
        setIsDisabled(true);
        setMessage("Thank you, please close the window to exit");
    };

    const address: any = queryResult?.data?.data?.address;
    const voters: any = queryResult?.data?.data?.boardStopVoters;

    useEffect(() => {
        // Reset the form when the data is loaded
        if (queryResult?.data?.data) {
            reset(queryResult.data.data);
        }
    }, [queryResult?.data?.data, reset]);

    if (!formLoading && !queryResult?.data?.data) {
        return (
            <div style={{paddingTop: 50, paddingBottom: 50, textAlign: 'center'}}>
                <h3>The board is finished, thank you. Please close your browser</h3>
            </div>
        );
    }

    return (
        <Edit title="Enter Voter Data" breadcrumb={false} goBack={false}
              headerButtons={() => <></>}
              footerButtons={({defaultButtons}) => (
                  <>
                      <SaveButton variant={"contained"} onClick={handleSubmit(saveAndNext)}>Next</SaveButton>
                      <SaveButton
                          disabled={isDisabled} onClick={handleSubmit(handleSaveWithoutRefresh)}>Finish</SaveButton>
                      <br/>
                  </>
              )}
        >
            <TextField
                {...register("id", {
                    required: "This field is required",
                })}
                type="hidden"
                sx={{display: 'none'}}
                key={"TextField.id"}
            />
            <TextField
                {...register("boardId", {
                    required: "This field is required",
                })}
                type="hidden"
                sx={{display: 'none'}}
                key={"TextField.boardId"}
            />
            <h3><b>Address: </b>{address}</h3>
            {voters?.map((voter: {
                answers: any;
                voter: any;
            }, voterIndex: any) => {
                const voterName = getVoter(voter);
                return (
                    <div key={voterIndex}><h4>Voter:&nbsp;{voterName}&nbsp;&nbsp;&nbsp;
                        <Controller
                            name={`boardStopVoters[${voterIndex}].voter.noContact`}
                            control={control}
                            // eslint-disable-next-line
                            defaultValue={null as any}
                            disabled={isDisabled}
                            render={({field}) => (
                                <FormControlLabel
                                    label={translate("do not contact")}
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
                    </h4>
                        {voter?.answers?.map((answer: any, answerIndex: number) =>
                            <div key={"voterDiv" + voterIndex + answerIndex}>
                                <h4>{answer?.questionVO?.text}</h4>
                                <Controller
                                    key={"Controller" + voterIndex + answerIndex}
                                    control={control}
                                    name={`boardStopVoters[${voterIndex}].answers[${answerIndex}].text`}
                                    rules={{required: false}}
                                    defaultValue=""
                                    disabled={isDisabled}
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
                );
            })}
            {message && <span><h3>{message}</h3></span>}
        </Edit>
    );
}