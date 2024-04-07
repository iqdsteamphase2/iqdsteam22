import React, { useState, useEffect } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { signOut } from "aws-amplify/auth";
import { get } from "aws-amplify/api";
import "@aws-amplify/ui-react/styles.css";
import Chart from "chart.js/auto";
import logoImage from "./assets/utdlogo.png";
import "@aws-amplify/ui-react/styles.css";

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

async function getTodo(setAlert) {
  try {
    console.log("Attempting to fetch data...");
    const response = await get({
      apiName: "qadetection",
      path: "/cans",
    });
    console.log("GET call succeeded: ", response);
    setAlert({ message: "Capture successful!", type: "success" });
  } catch (e) {
    console.error("GET call failed: ", e);
    // Explicitly checking if the catch block is reached
    setAlert({ message: "Capture failed.", type: "error" });
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

function MainPage() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("Main Page");
  const [alert, setAlert] = useState({ message: null, type: null });

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

  const createCharts = () => {
    let pChartInstance = null;
    let cChartInstance = null;
    const pChartCanvas = document.getElementById("p-chart");
    if (pChartInstance) {
      pChartInstance.destroy();
    }
    pChartInstance = new Chart(pChartCanvas, {
      type: "bar",
      data: {
        labels: ["Category A", "Category B", "Category C", "Category D"],
        datasets: [
          {
            label: "Defects",
            data: [10, 20, 5, 15],
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
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

    const cChartCanvas = document.getElementById("c-chart");
    if (cChartInstance) {
      cChartInstance.destroy();
    }
    cChartInstance = new Chart(cChartCanvas, {
      type: "line",
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
          {
            label: "Defects",
            data: [5, 8, 3, 6],
            fill: false,
            borderColor: "rgba(54, 162, 235, 1)",
            tension: 0.1,
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
  };

  useEffect(() => {
    createCharts();
  }, []);

  useEffect(() => {
    if (alert.message) {
      setTimeout(() => {
        setAlert({ message: null, type: null });
      }, 3000);
    }
  }, [alert.message]);

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
            <ChartsContainer>
              <div style={{ marginRight: "20px" }}>
                <Typography variant="h6" marginTop="20px">
                  P-Chart
                </Typography>
                <canvas id="p-chart" width="600" height="300"></canvas>
              </div>
              <div style={{ marginLeft: "20px" }}>
                <Typography variant="h6" marginTop="20px">
                  C-Chart
                </Typography>
                <canvas id="c-chart" width="600" height="300"></canvas>
              </div>
            </ChartsContainer>
          </Box>
        )}
        {currentPage === "Products" && (
          <Typography variant="h4">Products Page Content</Typography>
        )}
        {currentPage === "Capture" && (
          <Box>
            <Typography variant="h4">Capture Page Content</Typography>
            <Button
              onClick={() => getTodo(setAlert)}
              style={{ marginTop: "20px" }}
            >
              Manual Capture
            </Button>
            {alert.message && (
              <Alert severity={alert.type}>{alert.message}</Alert> // Use `severity` instead of `variation` for MUI Alert
            )}
          </Box>
        )}
      </Main>
    </Box>
  );
}

export default withAuthenticator(MainPage, { theme: myTheme });
