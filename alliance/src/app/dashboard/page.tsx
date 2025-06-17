"use client";

import React, {useState} from "react";
import {useCustom, useSelect} from "@refinedev/core";
import {Box, Card, CardHeader, Grid, MenuItem, Select, Stack, Tab} from "@mui/material";

import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import KpiCard from "@components/kpi-card";
import {AnswerBarChart, AreaGraph, BarChart} from "@components/charts";
import {IAnswerChartDatum, IChart} from "@interfaces";
import {dataProvider} from "@providers/data-provider";
import CircularProgress from "@mui/material/CircularProgress";

interface IBoard {
    id: number;
    name: string;
}

interface IPollingDistrict {
    name: string;
}

export default function DashboardList() {
    const API_URL = dataProvider.getApiUrl();

    const {data: boardstopsAnswered} = useCustom<IChart>({
        url: `${API_URL}/dashboard/boardstops/answered`,
        method: "get",
    });

    const {data: boardsToDO} = useCustom<IChart>({
        url: `${API_URL}/dashboard/boards/todo`,
        method: "get",
    });

    const {data: boardsInprogress} = useCustom<IChart>({
        url: `${API_URL}/dashboard/boards/inprogress`,
        method: "get",
    });

    const {data: boardsCompleted} = useCustom<IChart>({
        url: `${API_URL}/dashboard/boards/completed`,
        method: "get",
    });

    const [boardId, setBoardId] = useState(0);
    const [pollingDistrict, setPollingDistrict] = useState("all");
    const [days, setDays] = useState(7);
    const [view, setview] = useState("TREND");
    const [interval, setInterval] = useState(0);

    const {query: answersQuery, onSearch} = useSelect<IAnswerChartDatum>({
        resource: 'dashboard/questions',
        filters: [
            {
                field: "boardId",
                operator: "eq",
                value: boardId,
            },
            {
                field: "pollingDistrict",
                operator: "eq",
                value: pollingDistrict,
            },
            {
                field: "days",
                operator: "eq",
                value: days,
            },
            {
                field: "view",
                operator: "eq",
                value: view,
            },
        ],
    });

    const {data: answerData, isFetching: isFetchingAnswers} = answersQuery;

    const {options: boardOptions} = useSelect<IBoard>({
        resource: "boards",
        optionLabel: "name",
        optionValue: "id",
    });

    const handleSelectBoardChange = (event: any) => {
        setBoardId(event.target.value);
        setPollingDistrict("all");
    };

    const {options: pollingDistrictOptions} = useSelect<IPollingDistrict>({
        resource: "addresses/pollingdistricts",
        optionLabel: "name",
        optionValue: "name",
    });

    const handleSelectPollingDistrictChange = (event: any) => {
        setPollingDistrict(event.target.value);
        setBoardId(0);
    };

    const handleSelectDaysChange = (event: any) => {
        const days = event.target.value as number;
        setDays(days);
        if (days > 30) {
            setInterval(7)
        } else if (days > 21) {
            setInterval(7)
        } else if (days > 14) {
            setInterval(2)
        } else if (days > 7) {
            setInterval(1)
        } else {
            setInterval(0)
        }
    };

    const handleSelectviewChange = (event: any) => {
        setview(event.target.value);
    };

    // Chart code
    const [boardsChartValue, setBoardsChartValue] = React.useState("1");
    const handleBoardsChartChange = (event: React.SyntheticEvent, newValue: string) => {
        setBoardsChartValue(newValue);
    };

    // Chart code
    const [answersChartValue, setAnswersChartValue] = React.useState("1");
    const handleAnswersChartChange = (event: React.SyntheticEvent, newValue: string) => {
        setAnswersChartValue(newValue);
    };

    // Chart code
    const [cumulativeAnswersChartValue, setCumulativeAnswersChartValue] = React.useState("1");
    const handleCumulativeAnswersChartChange = (event: React.SyntheticEvent, newValue: string) => {
        setCumulativeAnswersChartValue(newValue);
    };

    return <main>
        <Box my={5} sx={{boxShadow: 5, pt: 2}}>
            <Card sx={{height: 600}}>
                <CardHeader title="Answers"/>
                <Stack direction="row" spacing={1} sx={{margin: 1}}>
                    <Select sx={{minWidth: 200,}} value={boardId} onChange={handleSelectBoardChange}>
                        <MenuItem key={"0"} value={0}>{"All boards"}</MenuItem>
                        {boardOptions?.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select sx={{minWidth: 200,}} value={pollingDistrict} onChange={handleSelectPollingDistrictChange}>
                        <MenuItem key={"0"} value={"all"}>{"All polling districts"}</MenuItem>
                        {pollingDistrictOptions?.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select sx={{minWidth: 200,}} value={days} onChange={handleSelectDaysChange}>
                        <MenuItem key={0} value={1}>1 days</MenuItem>
                        <MenuItem key={0} value={7}>7 days</MenuItem>
                        <MenuItem key={1} value={14}>14 days</MenuItem>
                        <MenuItem key={2} value={21}>21 days</MenuItem>
                        <MenuItem key={3} value={30}>30 days</MenuItem>
                        <MenuItem key={4} value={60}>60 days</MenuItem>
                        <MenuItem key={5} value={90}>90 days</MenuItem>
                    </Select>
                    <Select sx={{minWidth: 200,}} value={view} onChange={handleSelectviewChange}>
                        <MenuItem key={1} value={"TREND"}>Trend</MenuItem>
                        <MenuItem key={2} value={"ACTUAL"}>Actual</MenuItem>
                    </Select>
                </Stack>
                {isFetchingAnswers ? (
                    <CircularProgress/>
                ) : (
                    <TabContext value={answersChartValue}>
                        <TabList onChange={handleAnswersChartChange}>
                            {answerData?.data?.map((answer, index) =>
                                <Tab key={index} label={answer.question} value={index + ""}/>
                            )}
                        </TabList>
                        {answerData?.data?.map((answer, index) =>
                            <TabPanel key={index} value={index + ""} tabIndex={index}>
                                <AnswerBarChart data={answer?.data ?? []} fill="#ffce90" yscale={answer?.scale}
                                                interval={interval}/>
                            </TabPanel>
                        )}
                    </TabContext>
                )}
            </Card>
        </Box>

        <Box sx={{mt: 2, mb: 5}}>
            <Grid container columnGap={3} rowGap={3}>
                <Grid item xs>
                    <KpiCard
                        title="Board Stops Answered"
                        total={boardstopsAnswered?.data?.total ?? 0}
                        trend={boardstopsAnswered?.data?.trend ?? 0}
                        target={500}
                    />
                </Grid>
                <Grid item xs>
                    <KpiCard
                        title="Boards In-Progress"
                        total={boardsInprogress?.data?.total ?? 0}
                        trend={boardsInprogress?.data?.trend ?? 0}
                        target={10}
                    />
                </Grid>
                <Grid item xs>
                    <KpiCard
                        title="Boards Completed"
                        total={boardsCompleted?.data?.total ?? 0}
                        trend={boardsCompleted?.data?.trend ?? 0}
                        target={10}
                    />
                </Grid>
            </Grid>
        </Box>
        <Box my={5} sx={{boxShadow: 5}}>
            <Card sx={{height: 600}}>
                <CardHeader title="Boards"/>
                <TabContext value={boardsChartValue}>
                    <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                        <TabList onChange={handleBoardsChartChange}>
                            <Tab label="Answers" value="1"/>
                            <Tab label="To Do" value="2"/>
                            <Tab label="In-Progress" value="3"/>
                            <Tab label="Completed" value="4"/>
                        </TabList>
                    </Box>
                    <TabPanel value="1" tabIndex={1}>
                        <AreaGraph
                            data={boardstopsAnswered?.data?.data ?? []} stroke="#8884d8" fill="#cfeafc"/>
                    </TabPanel>
                    <TabPanel value="2" tabIndex={2}>
                        <BarChart data={boardsToDO?.data?.data ?? []} fill="#ffce90"/>
                    </TabPanel>
                    <TabPanel value="3" tabIndex={3}>
                        <BarChart data={boardsInprogress?.data?.data ?? []} fill="#ffce90"/>
                    </TabPanel>
                    <TabPanel value="4" tabIndex={4}>
                        <BarChart data={boardsCompleted?.data?.data ?? []} fill="#ffce90"/>
                    </TabPanel>
                </TabContext>
            </Card>
        </Box>
    </main>;
}
