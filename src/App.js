import React, { useState, useEffect, useCallback, useRef } from "react";

import { withAuthenticator } from "@aws-amplify/ui-react";
import { signOut } from "aws-amplify/auth";
import { get } from "aws-amplify/api";
import "@aws-amplify/ui-react/styles.css";
import Chart from "chart.js/auto";
import logoImage from "./assets/utdlogo.png";
import "@aws-amplify/ui-react/styles.css";
import { list as listS3Objects, getUrl } from "@aws-amplify/storage";
import { Amplify } from "aws-amplify";
import { Modal, Backdrop, Fade } from "@mui/material";
import { Loader, SelectField } from "@aws-amplify/ui-react";

import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CategoryIcon from "@mui/icons-material/Category";
import HomeIcon from "@mui/icons-material/Home";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Alert } from "@mui/material";
import { Button } from "@aws-amplify/ui-react";
import amplifyconfig from "./amplifyconfiguration.json";

Amplify.configure(amplifyconfig, {
  Storage: {
    S3: {
      prefixResolver: async ({ accessLevel, targetIdentityId }) => {
        if (accessLevel === "guest") {
          return "unpredicted/";
        }
      },
    },
  },
});

const myTheme = {
  name: "my-orange-theme",
  tokens: {
    components: {
      button: {
        primary: {
          backgroundColor: {
            value: "#ff7f50",
          },
        },
      },
      heading: {
        level1: {
          fontSize: {
            value: "2rem",
          },
        },
      },
      fieldcontrol: {
        paddingInline: {
          value: "1rem",
        },
      },
    },
  },
};

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    display: "flex",
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    "& canvas": {
      width: "100%",
      height: "auto",
      border: "1px solid #ddd",
      borderRadius: "4px",
    },
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(2),
    },
  })
);

const ChartsContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  marginBottom: theme.spacing(2),
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

async function getTodo(setAlert, getMostRecentItemImageUrl, setLoading) {
  setLoading(true); // Show loader at the beginning of the request
  try {
    const operation = await get({
      apiName: "qadetection",
      path: "/cans",
    });

    const response = await operation.response;

    if (response.statusCode === 200) {
      setAlert({
        message: "Capture successful! Fetching image...",
        type: "success",
      });

      setTimeout(async () => {
        await getMostRecentItemImageUrl(setLoading);
      }, 6000);
    } else {
      console.error("Server responded with error: ", response);
      setAlert({
        message: `Capture failed: Server responded with status ${response.statusCode}`,
        type: "error",
      });
      setLoading(false); // Hide loader on non-200 response
    }
  } catch (e) {
    console.error("Error caught in getTodo:", e);
    setAlert({
      message: "Capture failed due to network or request error.",
      type: "error",
    });
    setLoading(false); // Hide loader on catch
  }
}

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  position: "relative",
}));

const LoaderContainer = styled("div")({
  position: "absolute", // or 'fixed'
  top: "50%", // Center vertically or adjust as needed
  left: "50%", // Center horizontally or adjust as needed
  transform: "translate(-50%, -50%)",
  zIndex: 1000, // Make sure it is on top of other content
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

function MainPage() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("Main Page");
  const [alert, setAlert] = useState({ message: null, type: null });
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [latestImageUrl, setLatestImageUrl] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  const pChartRef = useRef(null);
  const cChartRef = useRef(null);

  const getMostRecentItemImageUrl = async () => {
    try {
      const listResult = await listS3Objects({
        prefix: "", // Adjust this prefix according to where your images are stored
      });

      if (listResult.items.length > 0) {
        const mostRecentItem = listResult.items.sort(
          (a, b) => new Date(b.lastModified) - new Date(a.lastModified)
        )[0];

        const getUrlResult = await getUrl({
          key: mostRecentItem.key,
          options: {
            accessLevel: "guest",
            expiresIn: 60,
            useAccelerateEndpoint: true,
          },
        });

        // Parse the URL to get the pathname
        const urlObject = new URL(getUrlResult.url);
        const pathname = urlObject.pathname;
        const imageUrl = `https://iqdsdatabucket.s3.amazonaws.com${pathname}`;

        setLatestImageUrl(imageUrl); // Set the image URL for the modal
        setLoading(false); // Hide loader right before showing the modal
        setModalOpen(true); // Open the modal after setting the image URL
        setAlert({
          message: `Fetching labels...`,
          type: "default",
        });
      } else {
        console.log("No items found in the bucket.");
        setLoading(false); // Ensure to hide loader if no items are found
      }
    } catch (error) {
      console.error("Error getting the most recent item's URL:", error);
      setLoading(false); // Ensure to hide loader on error
    }
  };

  const handleManualCaptureClick = async () => {
    console.log("Manual capture started, setting loading true");
    setLoading(true); // Show loader immediately on button click
    try {
      await getTodo(setAlert, getMostRecentItemImageUrl, setLoading); // Get the latest image URL from S3
      console.log("getTodo completed, should still be loading");
      // Reactivate loader for fetching labels (if needed, seems redundant)
      setLoading(true);

      setTimeout(async () => {
        console.log("Fetching labels...");
        const mostRecentData = await aggregateDataForModal(); // Get the latest labels from DynamoDB after a delay
        if (mostRecentData) {
          console.log("Labels fetched, setting alert");
          setAlert({
            message: `Labels: ${mostRecentData.labels}`,
            type: "info",
          }); // Update the alert with the labels information
        } else {
          console.log("No label data, setting error alert");
          setAlert({
            message: "No recent label data available.",
            type: "error",
          });
        }
        console.log("Label fetch operation complete, setting loading false");
        setLoading(false); // Hide loader after fetching labels
      }, 15000); // Delay for 15 seconds
    } catch (error) {
      console.error("Error during manual capture:", error);
      setAlert({
        message: "Error during capture process.",
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSignOut = () => {
    signOut();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setOpen(false);
  };

  const aggregateDataForModal = useCallback(async () => {
    console.log("Fetching most recent item from DynamoDB...");
    try {
      const operation = await get({
        apiName: "qadetection",
        path: "/cans/data",
      });

      const response = await operation.response;
      const reader = response.body.getReader();
      let responseBody = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        responseBody += new TextDecoder().decode(value);
      }

      const data = JSON.parse(responseBody);
      if (data.length > 0) {
        const mostRecentItem = data.reduce((a, b) => {
          const dateTimeA = new Date(
            `${a.Year}-${a.Month.toString().padStart(
              2,
              "0"
            )}-${a.Day.toString().padStart(
              2,
              "0"
            )}T${a.Hour.toString().padStart(
              2,
              "0"
            )}:${a.Minute.toString().padStart(
              2,
              "0"
            )}:${a.Second.toString().padStart(2, "0")}`
          );
          const dateTimeB = new Date(
            `${b.Year}-${b.Month.toString().padStart(
              2,
              "0"
            )}-${b.Day.toString().padStart(
              2,
              "0"
            )}T${b.Hour.toString().padStart(
              2,
              "0"
            )}:${b.Minute.toString().padStart(
              2,
              "0"
            )}:${b.Second.toString().padStart(2, "0")}`
          );
          return dateTimeA > dateTimeB ? a : b;
        });

        console.log("Most recent item:", mostRecentItem);
        return {
          imageUrl: mostRecentItem.URL,
          labels: mostRecentItem.Labels.join(", "), // Join the labels for display
        };
      } else {
        console.log("No items found.");
        return null;
      }
    } catch (error) {
      console.error(
        "Error fetching the most recent item's data from DynamoDB:",
        error
      );
      return null;
    }
  }, []);

  const aggregateDataForCharts = (data) => {
    const aggregatedData = data.reduce((acc, item) => {
      const dateKey = `${item.Year}-${item.Month.toString().padStart(
        2,
        "0"
      )}-${item.Day.toString().padStart(2, "0")}`;
      if (!acc[dateKey]) {
        acc[dateKey] = { total: 0, good: 0, open: 0, dented: 0 };
      }
      acc[dateKey].total++;
      if (item.Labels.includes("Dented")) acc[dateKey].dented++;
      if (item.Labels.includes("Good")) acc[dateKey].good++;
      if (item.Labels.includes("Open")) acc[dateKey].open++;
      return acc;
    }, {});

    const chartData = Object.keys(aggregatedData)
      .sort((a, b) => new Date(a) - new Date(b)) // Sort the dates chronologically
      .map((date) => {
        const { total, good, open, dented } = aggregatedData[date];
        return {
          date,
          proportionGood: good / total,
          proportionOpen: open / total,
          proportionDented: dented / total,
          // Adding counts here
          countGood: good,
          countOpen: open,
          countDented: dented,
        };
      });

    console.log(chartData);

    return chartData;
  };

  const fetchDynamoDBData = useCallback(async () => {
    console.log("Fetching data from DynamoDB...");
    try {
      const operation = await get({
        apiName: "qadetection",
        path: "/cans/data",
      });

      const response = await operation.response;
      const reader = response.body.getReader();
      let responseBody = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        responseBody += new TextDecoder().decode(value);
      }

      console.log("DynamoDB JSON data as string:", responseBody);
      const parsedData = JSON.parse(responseBody);
      return aggregateDataForCharts(parsedData);
    } catch (error) {
      console.error("Error fetching data from DynamoDB:", error);
      return null; // Handle the error appropriately
    }
  }, []); // Add any dependencies here if `fetchDynamoDBData` depends on props or state

  useEffect(() => {
    if (
      selectedProduct === "cokecan" &&
      pChartRef.current &&
      cChartRef.current
    ) {
      const ctxP = pChartRef.current.getContext("2d");
      const ctxC = cChartRef.current.getContext("2d");

      if (ctxP && ctxC) {
        // Initialize and update charts only if the context is available
        // P-chart for proportions
        const pChart = new Chart(ctxP, {
          type: "line", // Keep as line chart
          data: {
            labels: [],
            datasets: [
              {
                label: "Proportion of Good",
                data: [],
                borderColor: "green",
                backgroundColor: "green",
              },
              {
                label: "Proportion of Open",
                data: [],
                borderColor: "orange",
                backgroundColor: "orange",
              },
              {
                label: "Proportion of Dented",
                data: [],
                borderColor: "red",
                backgroundColor: "red",
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });

        // C-chart for counts
        const cChart = new Chart(ctxC, {
          type: "bar", // Change to bar chart
          data: {
            labels: [],
            datasets: [
              {
                label: "Count of Good Cans",
                data: [],
                backgroundColor: "green",
              },
              {
                label: "Count of Open Cans",
                data: [],
                backgroundColor: "orange",
              },
              {
                label: "Count of Dented Cans",
                data: [],
                backgroundColor: "red",
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });

        // Fetch data and update charts
        async function fetchDataAndRenderCharts() {
          const chartData = await fetchDynamoDBData();
          if (chartData) {
            pChart.data.labels = chartData.map((data) => data.date);
            pChart.data.datasets[0].data = chartData.map(
              (data) => data.proportionGood
            );
            pChart.data.datasets[1].data = chartData.map(
              (data) => data.proportionOpen
            );
            pChart.data.datasets[2].data = chartData.map(
              (data) => data.proportionDented
            );
            pChart.update();

            cChart.data.labels = chartData.map((data) => data.date);
            cChart.data.datasets[0].data = chartData.map(
              (data) => data.countGood
            );
            cChart.data.datasets[1].data = chartData.map(
              (data) => data.countOpen
            );
            cChart.data.datasets[2].data = chartData.map(
              (data) => data.countDented
            );
            cChart.update();
          }
        }

        fetchDataAndRenderCharts();

        return () => {
          pChart.destroy();
          cChart.destroy();
        };
      }
    }
  }, [selectedProduct, fetchDynamoDBData]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            QA Image Detection
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <img
              src={logoImage}
              alt="Logo"
              style={{ maxHeight: "75%", maxWidth: "75%" }}
            />
          </div>
          <IconButton
            onClick={handleDrawerClose}
            style={{ position: "absolute", right: 0 }}
          >
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <List>
          {["Main Page", "Products", "Capture"].map((text, index) => (
            <ListItem
              key={text}
              disablePadding
              button
              onClick={() => handlePageChange(text)}
              selected={text === currentPage}
            >
              <ListItemButton>
                <ListItemIcon>
                  {text === "Main Page" ? (
                    <HomeIcon />
                  ) : index % 2 === 0 ? (
                    <CameraAltIcon />
                  ) : (
                    <CategoryIcon />
                  )}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem button onClick={handleSignOut}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItem>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />

        {currentPage === "Main Page" && (
          <Box>
            <Typography variant="h4">Main Page Content</Typography>
          </Box>
        )}
        {currentPage === "Products" && (
          <Box>
            <Typography variant="h4">Products Page Content</Typography>
            <SelectField
              label="Products"
              descriptiveText="Select a product"
              marginTop="20px"
              onChange={handleProductChange}
              value={selectedProduct}
              style={{ width: "500px" }} // Set a fixed width
            >
              <option value="other">Other</option>
              <option value="cokecan">Coke Can</option>

              {/* Add other options as needed */}
            </SelectField>

            {selectedProduct === "cokecan" && (
              <ChartsContainer>
                <div style={{ marginRight: "20px" }}>
                  <Typography variant="h6" marginTop="20px">
                    P-Chart
                  </Typography>
                  <canvas ref={pChartRef} width="600" height="300"></canvas>
                </div>
                <div style={{ marginLeft: "20px" }}>
                  <Typography variant="h6" marginTop="20px">
                    C-Chart
                  </Typography>
                  <canvas ref={cChartRef} width="600" height="300"></canvas>
                </div>
              </ChartsContainer>
            )}
          </Box>
        )}
        {currentPage === "Capture" && (
          <Box>
            <Typography variant="h4">Capture Page Content</Typography>
            <Button
              onClick={handleManualCaptureClick} // Use the new click handler
              style={{ marginTop: "20px" }}
            >
              Manual Capture
            </Button>
            {alert.message && (
              <Alert severity={alert.type}>{alert.message}</Alert>
            )}
          </Box>
        )}
      </Main>

      {/* Modal for displaying the latest image */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={modalOpen}>
          <Box
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "auto",
              maxWidth: "90%",
              maxHeight: "90%",
              backgroundColor: "white",
              border: "2px solid #000",
              boxShadow: "24",
              padding: "16px",
              overflowY: "auto",
            }}
          >
            <img
              src={latestImageUrl}
              alt="Latest Capture"
              style={{ width: "100%", maxHeight: "100%" }}
            />
            {loading && <Loader />}
            {alert.message && (
              <Alert severity={alert.type} style={{ marginTop: "20px" }}>
                {alert.message}
              </Alert>
            )}
          </Box>
        </Fade>
      </Modal>

      {loading && (
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      )}
    </Box>
  );
}

export default withAuthenticator(MainPage, { theme: myTheme });
