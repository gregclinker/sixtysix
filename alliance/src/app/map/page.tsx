'use client'

import React, {useState} from 'react'
import {useSelect, useShow} from "@refinedev/core";
import {IPostCodeCluster} from "@interfaces";
import {BoardMap} from "@components/maps";
import {InputLabel, MenuItem, Select, Stack} from "@mui/material";
import {ShowButton} from "@refinedev/mui";
import CircularProgress from "@mui/material/CircularProgress";

interface IBoard {
    id: number;
    name: string;
}

export default function PostCodeList() {

    const [boardId, setBoardId] = useState(0);

    const {queryResult, setShowId} = useShow<IPostCodeCluster>({
        resource: "postcodes/boards",
        id: boardId,
    });

    const {data, isLoading, isError} = queryResult;
    const postCodeCluster = data?.data;

    const {options, query: boardQuery} = useSelect<IBoard>({
        resource: "boards",
        optionLabel: "name",
        optionValue: "id",
    });

    const handleSelectChange = (event: any) => {
        setBoardId(event.target.value);
        setShowId(event.target.value);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Stack direction="row" spacing={2} alignItems={"center"}>
                <h4>Board</h4>
                <Select value={boardId} onChange={handleSelectChange}
                        endAdornment={
                            boardQuery.isLoading ? (
                                <CircularProgress color="inherit" size={20}/>
                            ) : null
                        }
                >
                    <MenuItem key={"0"} value={0}>{"All boards"}</MenuItem>
                    {options?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
                <Stack spacing={1} alignItems={"left"}>
                    <Stack direction="row" spacing={0} alignItems={"center"}>
                        <InputLabel sx={{
                            whiteSpace: 'normal',
                            maxWidth: '100%',
                            lineHeight: '1.2em',
                            maxHeight: '2.4em', // This allows for 2 lines
                            overflow: 'hidden',
                        }}>{postCodeCluster?.description ?? ""}</InputLabel>
                        {boardId > 0 ? (
                                <>
                                    <ShowButton hideText resource={"boards"} recordItemId={boardId}/>
                                </>
                            )
                            : (
                                <></>
                            )}
                    </Stack>
                    <InputLabel>address count: {postCodeCluster?.addressCount}</InputLabel>
                </Stack>
            </Stack>
            <br/>
            <BoardMap
                postCodeCluster={postCodeCluster as IPostCodeCluster}
                mapContainerStyle={{
                    width: '100%',
                    height: '800px',
                }}
            />
        </div>
    );
}
