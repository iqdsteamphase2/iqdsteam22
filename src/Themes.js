import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";

/**
 * Theme object containing customized theme properties.
 */
export const myTheme = {
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

/**
 * Width of the drawer component.
 */
export const drawerWidth = 240;

/**
 * Main container component with dynamic margin based on the drawer state.
 * @param {object} props - Component properties.
 * @param {object} props.theme - MUI theme.
 * @param {boolean} props.open - Whether the drawer is open.
 * @returns {object} - Styled component.
 */
export const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
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
}));

/**
 * Container component for charts with flex layout.
 * @param {object} props - Component properties.
 * @param {object} props.theme - MUI theme.
 * @returns {object} - Styled component.
 */
export const ChartsContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  marginBottom: theme.spacing(2),
}));

/**
 * Styled AppBar component with dynamic width and margin based on the drawer state.
 * @param {object} props - Component properties.
 * @param {object} props.theme - MUI theme.
 * @param {boolean} props.open - Whether the drawer is open.
 * @returns {object} - Styled component.
 */
export const AppBar = styled(MuiAppBar, {
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

/**
 * Styled DrawerHeader component.
 * @param {object} props - Component properties.
 * @param {object} props.theme - MUI theme.
 * @returns {object} - Styled component.
 */
export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  position: "relative",
}));

/**
 * Styled LoaderContainer component for positioning loader.
 * @returns {object} - Styled component.
 */
export const LoaderContainer = styled("div")({
  position: "absolute", // or 'fixed'
  top: "50%", // Center vertically or adjust as needed
  left: "50%", // Center horizontally or adjust as needed
  transform: "translate(-50%, -50%)",
  zIndex: 1000, // Make sure it is on top of other content
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
