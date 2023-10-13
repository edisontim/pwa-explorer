export const UserPosMarker = () => {
  return (
    <>
      <div className="pulsating-circle"></div>
      <div
        style={{
          backgroundColor: "#4285f1",
          borderRadius: "50%",
          width: 17,
          height: 17,
          border: "3px solid white",
          zIndex: 3,
          position: "absolute",
        }}
      />
    </>
  );
};
