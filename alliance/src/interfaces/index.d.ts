import {CSSProperties} from "react";

export type KpiCardProps = {
    title: string;
    total: number;
    trend: number;
    target: number;
    formatTotal?: (value: number) => number | string;
    formatTarget?: (value: number) => number | string;
};

export type DeltaType =
    | "error"
    | "warning"
    | "primary"
    | "secondary"
    | "success"
    | "info";

export interface IChartDatum {
    date: string;
    value: string;
}

export interface IChart {
    data: IChartDatum[];
    total: number;
    trend: number;
}

export interface ITellingQRCode {
    qrCodeUrl: string;
}

interface IAreaGraphProps {
    data: IChartDatum[];
    stroke: string;
    fill: string;
}

interface IBarChartProps {
    data: IChartDatum[];
    fill: string;
}

interface IAnswerBarChartProps {
    data: Map<string, string>[];
    yscale: number;
    interval: number;
    fill: string;
}

export interface IAnswerChartDatum {
    question: string;
    scale: number;
    data: Map<string, string>[];
}

export interface IPostCodeCluster {
    description: string;
    addressCount: number;
    postCodeCount: number;
    deltas: number[];
    maxLatitude: number;
    minLatitude: number;
    maxLongitude: number;
    minLongitude: number;
    mapId: number;
    postCodes: IPostCode[];
}

export interface IPostCode {
    postCode: string;
    latitude: number;
    longitude: number;
}

interface IMapProps {
    postCodeCluster: IPostCodeCluster;
    mapContainerStyle: CSSProperties;
}

