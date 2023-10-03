"use client";
import React, { useEffect, useState, useContext } from "react";
import GoogleMapReact from "google-map-react";
import { UserPosMarker } from "./markers/userPosMarker";
import { WalletContext, AlertContext } from "../pages/_app";
import { LocationMarker } from "./markers/locationMarker";

const { extractWithQuery } = require("osm-extractor");

const defaultProps = {
  center: {
    lat: 10.99835602,
    lng: 77.01502627,
  },
  zoom: 14,
};

// https://henry-rossiter.medium.com/calculating-distance-between-geographic-coordinates-with-javascript-5f3097b61898
function cosineDistanceBetweenPoints(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const deltaP = p2 - p1;
  const deltaLon = lon2 - lon1;
  const deltaLambda = (deltaLon * Math.PI) / 180;
  const a =
    Math.sin(deltaP / 2) * Math.sin(deltaP / 2) +
    Math.cos(p1) *
      Math.cos(p2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const d = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * R;
  return d;
}

const Maps = () => {
  const { wallet, _setWallet } = useContext(WalletContext);
  const { _alert, setAlert } = useContext(AlertContext);
  const [mapCenter, setMapCenter] = useState(defaultProps);
  const [pois, setPois]: any = useState([]);
  const [userPos, setUserPos]: any = useState({});

  useEffect(() => {}, []);

  const onMapLoaded = (map: any, maps: any) => {
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const { latitude, longitude } = coords;
          setMapCenter({
            ...mapCenter,
            center: { lat: latitude, lng: longitude },
          });
          setUserPos({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.log(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000000,
          maximumAge: 10000,
        }
      );
      navigator.geolocation.watchPosition(
        ({ coords, timestamp }) => {
          console.log(timestamp);
          console.log(
            `user changed position, in the watch position ${JSON.stringify(
              coords,
              null,
              2
            )}`
          );
          const { latitude, longitude } = coords;
          console.log(`${latitude} ${longitude}`);
          // If we want the camera to focus only on the user, uncomment this and don't allow drag/zoom/dezoom
          setMapCenter({
            ...mapCenter,
            center: { lat: latitude, lng: longitude },
          });
          setUserPos({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.log(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000000,
          maximumAge: 10000,
        }
      );
    }
  };

  const fetchOsmPoiForZone = async (points: number[]) => {
    const query = `[out:json];node["name"](${points.toString()});out;`;
    try {
      const response = await extractWithQuery(query, { responseType: "json" });
      return response.elements;
    } catch (error) {
      return [];
    }
  };

  const handleChange = async (map: any) => {
    console.log(`Region changed`);
    if (map.zoom < 13) {
      setPois([]);
      return;
    }
    const { ne, _se, sw, _nw } = await map.marginBounds;
    const bounds = [sw.lat, sw.lng, ne.lat, ne.lng];
    let pois: any = await fetchOsmPoiForZone(bounds);
    pois = pois.filter((poi: any) => {
      let keys = Object.keys(poi.tags);
      return !keys.includes("amenity");
    });
    const markers = pois.map((poi: any) => ({
      lat: poi.lat,
      lng: poi.lon,
      title: poi.tags["name"],
    }));
    setPois(markers);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        yesIWantToUseGoogleMapApiInternals={true}
        bootstrapURLKeys={{
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        }}
        center={mapCenter.center}
        defaultZoom={mapCenter.zoom}
        onGoogleApiLoaded={({ map, maps }) => onMapLoaded(map, maps)}
        onChange={handleChange}
        options={{ gestureHandling: "greedy", clickableIcons: false }}
      >
        {pois.map((poi: any, index: any) => (
          // if ()
          <LocationMarker
            key={index}
            text={poi.title}
            lat={poi.lat}
            lng={poi.lng}
            setAlert={setAlert}
          />
        ))}
        <UserPosMarker lat={userPos.lat} lng={userPos.lng}></UserPosMarker>
      </GoogleMapReact>
    </div>
  );
};

export default Maps;
