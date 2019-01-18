import Dashboard from "../views/Dashboard";
import Buttons from "../views/Buttons";

//import pagesRoutes from "./pages.jsx";

// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import Image from "@material-ui/icons/Image";
import Apps from "@material-ui/icons/Apps";
// import ContentPaste from "@material-ui/icons/ContentPaste";
import GridOn from "@material-ui/icons/GridOn";
import Place from "@material-ui/icons/Place";
import WidgetsIcon from "@material-ui/icons/Widgets";
import Timeline from "@material-ui/icons/Timeline";
import DateRange from "@material-ui/icons/DateRange";


var dashRoutes = [
  {
    path: "/main/dashboard",
    name: "Dashboard",
    icon: DashboardIcon,
    component: Dashboard
  },
  {
    //collapse: true,
    path: "/main/buttons",
    name: "buttons",
    //state: "openComponents",
    icon: Apps,
    component: Buttons,
    // views: [
    //   {
    //     path: "/components/buttons",
    //     name: "Buttons",
    //     mini: "B",
    //     component: Buttons
    //   },
    //     {
    //       path: "/components/grid-system",
    //       name: "Grid System",
    //       mini: "GS",
    //       component: GridSystem
    //     },
    //     {
    //       path: "/components/panels",
    //       name: "Panels",
    //       mini: "P",
    //       component: Panels
    //     },
    //     {
    //       path: "/components/sweet-alert",
    //       name: "Sweet Alert",
    //       mini: "SA",
    //       component: SweetAlert
    //     },
    //     {
    //       path: "/components/notifications",
    //       name: "Notifications",
    //       mini: "N",
    //       component: Notifications
    //     },
    //     { path: "/components/icons", name: "Icons", mini: "I", component: Icons },
    //     {
    //       path: "/components/typography",
    //       name: "Typography",
    //       mini: "T",
    //       component: Typography
    //     }
    //]
  },
  // {
  //   collapse: true,
  //   path: "/forms",
  //   name: "Forms",
  //   state: "openForms",
  //   icon: "content_paste",
  //   views: [
  //     {
  //       path: "/forms/regular-forms",
  //       name: "Regular Forms",
  //       mini: "RF",
  //       component: RegularForms
  //     },
  //     {
  //       path: "/forms/extended-forms",
  //       name: "Extended Forms",
  //       mini: "EF",
  //       component: ExtendedForms
  //     },
  //     {
  //       path: "/forms/validation-forms",
  //       name: "Validation Forms",
  //       mini: "VF",
  //       component: ValidationForms
  //     },
  //     { path: "/forms/wizard", name: "Wizard", mini: "W", component: Wizard }
  //   ]
  // },
  // {
  //   collapse: true,
  //   path: "/tables",
  //   name: "Tables",
  //   state: "openTables",
  //   icon: GridOn,
  //   views: [
  //     {
  //       path: "/tables/regular-tables",
  //       name: "Regular Tables",
  //       mini: "RT",
  //       component: RegularTables
  //     },
  //     {
  //       path: "/tables/extended-tables",
  //       name: "Extended Tables",
  //       mini: "ET",
  //       component: ExtendedTables
  //     },
  //     {
  //       path: "/tables/react-tables",
  //       name: "React Tables",
  //       mini: "RT",
  //       component: ReactTables
  //     }
  //   ]
  // },
  // {
  //   collapse: true,
  //   path: "/maps",
  //   name: "Maps",
  //   state: "openMaps",
  //   icon: Place,
  //   views: [
  //     {
  //       path: "/maps/google-maps",
  //       name: "Google Maps",
  //       mini: "GM",
  //       component: GoogleMaps
  //     },
  //     {
  //       path: "/maps/full-screen-maps",
  //       name: "Full Screen Map",
  //       mini: "FSM",
  //       component: FullScreenMap
  //     },
  //     {
  //       path: "/maps/vector-maps",
  //       name: "Vector Map",
  //       mini: "VM",
  //       component: VectorMap
  //     }
  //   ]
  // },
  // { path: "/widgets", name: "Widgets", icon: WidgetsIcon, component: Widgets },
  // { path: "/charts", name: "Charts", icon: Timeline, component: Charts },
  // { path: "/calendar", name: "Calendar", icon: DateRange, component: Calendar },
  // { redirect: true, path: "/", pathTo: "/", name: "Dashboard" }
];
export default dashRoutes;
