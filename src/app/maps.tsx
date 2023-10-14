"use client";
import React, { useEffect, useState, useContext } from "react";
import GoogleMapReact, { MapOptions } from "google-map-react";
import { UserPosMarker } from "./markers/userPosMarker";
import { AlertContext } from "../pages/_app";
import { LocationMarker } from "./markers/locationMarker";
import { cosineDistanceBetweenPoints } from "./geopos/geoPosUtils";
import { OSM_TAGS_VALUES } from "./geopos/constants";
const { extractWithQuery } = require("osm-extractor");

const ZOOM_VALUE = 17;

const defaultProps = {
  center: {
    lat: 10.99835602,
    lng: 77.01502627,
  },
  zoom: ZOOM_VALUE,
};

export type Position = {
  lat: number;
  lng: number;
};

const mapOptions: MapOptions = {
  gestureHandling: "none",
  clickableIcons: false,
  disableDefaultUI: true,
  disableDoubleClickZoom: true,
  keyboardShortcuts: false,
  minZoom: ZOOM_VALUE,
  maxZoom: ZOOM_VALUE,
};

const Maps = () => {
  const { _alert, setAlert } = useContext(AlertContext);
  const [mapCenter, setMapCenter] = useState(defaultProps);
  const [pois, setPois]: any = useState([]);

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
          const { latitude, longitude } = coords;
          if (
            cosineDistanceBetweenPoints(
              mapCenter.center.lat,
              mapCenter.center.lng,
              latitude,
              longitude
            ) > 20
          ) {
            setMapCenter({
              ...mapCenter,
              center: { lat: latitude, lng: longitude },
            });
          }
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
      console.log(error);
      return [];
    }
  };

  const handleChange = async (map: any) => {
    if (map.zoom < 13) {
      setPois([]);
      return;
    }
    const { ne, _se, sw, _nw } = await map.marginBounds;
    const bounds = [sw.lat, sw.lng, ne.lat, ne.lng];
    let pois: Array<any> = await fetchOsmPoiForZone(bounds);
    pois = pois.filter((poi: any) => {
      let keys = Object.keys(poi.tags);
      return (
        !keys.includes("amenity") ||
        poi.tags["amenity"] === "cinema" ||
        poi.tags["amenity"] === "nightclub" ||
        poi.tags["amenity"] === "playground" ||
        poi.tags["amenity"] === "post office" ||
        poi.tags["amenity"] === "recycling" ||
        poi.tags["amenity"] === "telephone" ||
        poi.tags["amenity"] === "toilets"
      );
    });
    // console.log(JSON.stringify(pois, null, 2));
    const markers = pois.map((poi: any) => {
      let path: string = "";
      Object.keys(poi.tags).some((tagKey) => {
        const tagCopy = poi.tags[tagKey].replace(/[-, ,_]/g, "").toLowerCase();
        if (OSM_TAGS_VALUES.includes(tagCopy)) {
          path = `/osm-logos/${tagCopy}.svg`;
          return true;
        }
      });
      return {
        lat: poi.lat,
        lng: poi.lon,
        title: poi.tags["name"],
        logo: path,
        description: poi.tags["description"],
      };
    });
    setPois(markers);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        yesIWantToUseGoogleMapApiInternals={true}
        bootstrapURLKeys={{
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        }}
        shouldUnregisterMapOnUnmount={false}
        center={mapCenter.center}
        defaultZoom={mapCenter.zoom}
        onGoogleApiLoaded={({ map, maps }) => onMapLoaded(map, maps)}
        onChange={handleChange}
        options={mapOptions}
      >
        {pois.map((poi: any, index: any) => (
          <LocationMarker
            userPos={mapCenter.center}
            key={index}
            locationName={poi.title}
            lat={poi.lat}
            lng={poi.lng}
            logo={poi.logo}
            setAlert={setAlert}
            description={poi.description}
          />
        ))}
        <UserPosMarker
          lat={mapCenter.center.lat}
          lng={mapCenter.center.lng}
        ></UserPosMarker>
      </GoogleMapReact>
    </div>
  );
};

export default Maps;
