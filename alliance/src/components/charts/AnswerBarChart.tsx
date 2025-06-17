"use client"

import React from "react";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,} from "recharts";

import type {IAnswerBarChartProps} from "@interfaces";

export const AnswerBarChart: React.FC<IAnswerBarChartProps> = ({data, fill, yscale, interval}) => {

    const dataKeys = Object.keys(data[0]).filter(key => key !== 'date');

    // Generate a unique color for each bar
    const getColor = (index: number) => `hsl(${index * 30}, 70%, 50%)`;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={data}
                margin={{
                    top: 1,
                    right: 0,
                    left: 0,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis interval={interval} dataKey="date"/>
                <YAxis type={"number"} domain={[0, yscale]}/>
                <Tooltip/>
                <Legend/>
                {dataKeys.map((key, index) => (
                    <Bar key={key} dataKey={key} fill={getColor(index)}/>
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};
