"use client"

import React from "react";
import {IMapProps, IPostCode} from "@interfaces";
import {GoogleMap, useJsApiLoader} from "@react-google-maps/api";
import {Box, InputLabel} from "@mui/material";
import nextConfig from "@../next.config.mjs";

export const BoardMap: React.FC<IMapProps> = ({
                                                  postCodeCluster,
                                                  mapContainerStyle
                                              }) => {

    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: nextConfig?.env?.MAP_KEY as string
    })

    //const {AdvancedMarkerElement} = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    const [map, setMap] = React.useState(null)

    const onLoad = React.useCallback(function callback(map: any) {
        const bounds = new window.google.maps.LatLngBounds()
        // if we only have one point we wat to expand the bounds a bit
        const offset = postCodeCluster.postCodeCount == 1 ? 0.0002 : 0;
        bounds.extend(new google.maps.LatLng((postCodeCluster?.maxLatitude ?? 0) + offset,
            (postCodeCluster?.maxLongitude ?? 0) + offset))
        bounds.extend(new google.maps.LatLng((postCodeCluster?.minLatitude ?? 0) - offset,
            (postCodeCluster?.minLongitude ?? 0) - offset))
        map.fitBounds(bounds);
        postCodeCluster?.postCodes?.forEach((postCode: IPostCode) => {
            new google.maps.Marker({
                position: {lat: postCode.latitude, lng: postCode.longitude},
                map: map,
                title: postCode.postCode,
                //label: postCode.postCode
            });
        })
        setMap(map)
    }, [postCodeCluster])

    const onUnmount = React.useCallback(function callback(map: any) {
        setMap(null)
    }, [])

    return isLoaded ? (
        <Box>
            {postCodeCluster?.postCodeCount > 1 ? (
                <>
                    <InputLabel>post code area
                        : {postCodeCluster?.deltas[0] + "km x " + postCodeCluster?.deltas[1] + "km"}</InputLabel>
                </>
            ) : (
                <></>
            )}
            <GoogleMap
                key={postCodeCluster?.mapId}
                mapContainerStyle={mapContainerStyle}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    mapId: 'your-map-id',
                    heading: 180
                }}
            >
                {/* Child components, such as markers, info windows, etc. */}
                <></>
            </GoogleMap>
        </Box>
    ) : (
        <></>
    )
};
