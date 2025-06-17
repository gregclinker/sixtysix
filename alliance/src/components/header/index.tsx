"use client";

import {ColorModeContext} from "@contexts/color-mode";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {useGetIdentity} from "@refinedev/core";
import {HamburgerMenu, RefineThemedLayoutV2HeaderProps} from "@refinedev/mui";
import React, {useContext} from "react";

type IUser = {
    id: number;
    name: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({sticky = true,}) => {
    const {mode, setMode} = useContext(ColorModeContext);
    const {data: user} = useGetIdentity<IUser>();
    const constituencyName = '__CONSTITUENCY__'

    return (
        <AppBar position={sticky ? "sticky" : "relative"}>
            <Toolbar>
                <Stack
                    direction="row"
                    width="100%"
                    justifyContent="flex-end"
                    alignItems="center"
                >
                    <HamburgerMenu/>
                    <Typography variant="h6" component="div"
                                sx={{position: 'absolute', left: '50%', transform: 'translateX(-50%)'}}>
                        {constituencyName}
                    </Typography>
                    <Stack direction="row" width="100%" justifyContent="flex-end" alignItems="center">
                        <IconButton
                            color="inherit"
                            onClick={() => {
                                setMode();
                            }}
                        >
                            {mode === "dark" ? <LightModeOutlined/> : <DarkModeOutlined/>}
                        </IconButton>

                        {user?.name && (
                            <Stack
                                direction="row"
                                gap="16px"
                                alignItems="center"
                                justifyContent="center"
                            >
                                {user?.name && (
                                    <Typography
                                        sx={{
                                            display: {
                                                xs: "none",
                                                sm: "inline-block",
                                            },
                                        }}
                                        variant="subtitle2"
                                    >
                                        {user?.name}
                                    </Typography>
                                )}
                            </Stack>
                        )}
                    </Stack>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};
