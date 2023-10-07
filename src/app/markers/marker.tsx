import React from "react";
import styled from "styled-components";

const MarkerWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  background-color: #000;
  border: 2px solid #fff;
  border-radius: 100%;
  user-select: none;
  transform: translate(-50%, -50%);
  z-index: 2;
  cursor: ${(props) => (props.onClick ? "pointer" : "default")};
  &:hover {
    z-index: 2;
  }
`;

export const Marker = ({ onClick }: any) => <MarkerWrapper onClick={onClick} />;
