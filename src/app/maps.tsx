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
