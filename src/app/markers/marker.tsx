import React from "react";
import styled from "styled-components";
import PlaceIcon from "@mui/icons-material/Place";

const MarkerWrapper = styled.div`
  position: absolute;
  display: flex;
  user-select: none;
  transform: translate(-50%, -50%);
  z-index: 2;
  cursor: ${(props: any) => (props.onClick ? "pointer" : "default")};
  &:hover {
    z-index: 2;
  }
`;

export const Marker = ({ onClick, logo }: any) => (
  <MarkerWrapper onClick={onClick}>
    <PlaceIcon
      style={{
        position: "relative",
        width: "40px",
        height: "40px",
        color: "#0c0d4e",
      }}
    />
    {logo !== "" && (
      <img
        src={logo}
        width="15px"
        height="15px"
        style={{
          position: "relative",
          transform: "translate(-185%, 55%)",
          zIndex: 4,
          backgroundColor: "#0c0d4e",
        }}
      />
    )}
  </MarkerWrapper>
);
