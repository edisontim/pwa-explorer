import { Typography, Card, Unstable_Grid2 } from "@mui/material";
import { relative } from "path";

type LocationCardProps = {
  locationName: string;
  owner: string;
  getButton: () => any;
  logo: string;
  description: string;
};

const LocationCard = ({
  locationName,
  owner,
  getButton,
  logo,
  description,
}: LocationCardProps) => {
  if (locationName.length >= 21) {
    locationName = locationName.slice(0, 18) + "...";
  }
  const getHousePrices = () => {
    let prices = [];
    const margins = "25px";
    for (let i = 0; i < 4; i++) {
      prices.push(
        <div
          key={i}
          style={{
            display: "flex",
            marginLeft: margins,
            marginRight: margins,
            justifyContent: "space-between",
          }}
        >
          <Typography
            style={{
              textAlign: "center",
            }}
            variant="body1"
          >
            With {1 + i} house(s)
          </Typography>{" "}
          <Typography
            style={{
              textAlign: "center",
            }}
            variant="body1"
          >
            $???
          </Typography>
        </div>
      );
    }
    return prices;
  };
  return (
    <Card
      className="location-card"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "96vw",
        margin: "auto",
        height: "45vh",
        position: "relative",
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      elevation={3}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          padding: "10px",
          width: "calc(100% - 20px)",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            width: "100%",
            border: "1px solid black",
            backgroundColor: "#de092b",
            height: "8vh",
            marginBottom: "10px",
          }}
        >
          <Typography
            style={{
              textTransform: "uppercase",
              width: "100%",
              fontSize: 15,
              textAlign: "center",
            }}
            variant="h5"
          >
            TITLE DEED
          </Typography>
          <Typography
            style={{
              textTransform: "uppercase",
              textAlign: "center",
              fontSize: 25,
              width: "100%",
            }}
            sx={{ fontWeight: "bold" }}
            variant="h4"
          >
            {locationName}
          </Typography>
        </div>
        <Typography
          style={{
            textAlign: "center",
            marginBottom: "10px",
          }}
          variant="body1"
        >
          Rent $???
        </Typography>
        <div style={{ marginBottom: "10px" }}>{getHousePrices()}</div>
        <Typography
          style={{ textAlign: "center", marginBottom: "10px" }}
          variant="body1"
        >
          With HOTEL $???
        </Typography>
        <Typography
          style={{ textAlign: "center", marginBottom: "10px" }}
          variant="body1"
        >
          {owner === "0x0" || !owner ? "Available" : "Belongs to " + owner}
        </Typography>

        {description && (
          <Typography style={{ marginBottom: "10px" }} variant="body1">
            {description}
          </Typography>
        )}
        {getButton()}
      </div>
    </Card>
  );
};

export default LocationCard;
