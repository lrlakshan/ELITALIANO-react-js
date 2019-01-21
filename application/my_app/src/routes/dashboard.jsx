import Dashboard from "../views/Dashboard";
import ViewStocks from "../views/ViewStock";
import Purchases from "../views/Purchases";
import ProductChanges from "../views/ProductChanges";
import SalesHistory from "../views/SalesHistory";
import PurchaseHistory from "../views/PurchaseHistory";
import ExpenseHistory from "../views/ExpenseHistory";
import CashPaid from "../views/CashPaid";
import CashRecieved from "../views/CashRecieved";
import Summary from "../views/Summary";
import Recievable from "../views/Recievable";
import Payable from "../views/Payable";
import Cashier from "../views/Cashier";
import Notes from "../views/Notes";

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
    collapse: true,
    path: "/main/inventory",
    name: "Inventory",
    state: "openComponents",
    icon: Apps,
    views: [
      {
        path: "/main/viewStocks",
        name: "View Stocks",
        mini: "",
        component: ViewStocks
      },
      {
        path: "/main/purchases",
        name: "Purchases from Supplier",
        mini: "",
        component: Purchases
      },
      {
        path: "/main/productChanges",
        name: "Product Changes",
        mini: "",
        component: ProductChanges
      },
    ]
  },
  {
    collapse: true,
    path: "/main/Accounts",
    name: "Accounts",
    state: "openForms",
    icon: GridOn,
    views: [
      {
        path: "/main/salesHistory",
        name: "Sales History",
        mini: "",
        component: SalesHistory
      },
      {
        path: "/main/purchaseHistory",
        name: "Purchase History",
        mini: "",
        component: PurchaseHistory
      },
      {
        path: "/main/expenseHistory",
        name: "Expense History",
        mini: "",
        component: ExpenseHistory
      },
      {
        path: "/main/cashPaid",
        name: "Cash Paid",
        mini: "",
        component: CashPaid
      },
      {
        path: "/main/cashRecieved",
        name: "Cash Recieved",
        mini: "",
        component: CashRecieved
      },
      {
        path: "/main/summary",
        name: "Summary",
        mini: "",
        component: Summary
      },
    ]
  },
  {
    collapse: true,
    path: "/main/payable_recievable_payable",
    name: "Recievable/Payable",
    state: "openTables",
    icon: Image,
    views: [
      {
        path: "/main/recievable",
        name: "Cash Recievable",
        mini: "",
        component: Recievable
      },
      {
        path: "/main/payable",
        name: "Cash Payable",
        mini: "",
        component: Payable
      },
    ]
  },
  { path: "/main/cashier", name: "Cashier", icon: WidgetsIcon, component: Cashier },
  { path: "/main/notes", name: "Notes", icon: Timeline, component: Notes },
  // { path: "/calendar", name: "Calendar", icon: DateRange, component: Calendar },
  // { redirect: true, path: "/", pathTo: "/", name: "Dashboard" }
];
export default dashRoutes;
