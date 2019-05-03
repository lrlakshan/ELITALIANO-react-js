import Dashboard from "../views/Dashboard";
import ViewStocks from "../views/ViewStock";
import Purchases from "../views/Purchases";
import supplierReturn from "../views/supplierReturn";
import SalesHistory from "../views/SalesHistory";
import PurchaseHistory from "../views/PurchaseHistory";
import CashFlow from "../views/CashFlow";
import Salary from "../views/Salary";
import Expenses from "../views/Expenses";
import CashRecieved from "../views/CashRecieved";
import Summary from "../views/Summary";
import Recievable from "../views/Recievable";
import Payable from "../views/Payable";
import Cashier from "../views/Cashier";
import Notes from "../views/Notes";

//import pagesRoutes from "./pages.jsx";

// @material-ui/icons
import InsertChart from "@material-ui/icons/InsertChart";
import Cash from "@material-ui/icons/AttachMoney";
import CashOut from "@material-ui/icons/MoneyOff";
import StoreMallDirectory from "@material-ui/icons/StoreMallDirectory";
// import ContentPaste from "@material-ui/icons/ContentPaste";
import Accounts from "@material-ui/icons/ImportContacts";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import Note from "@material-ui/icons/SpeakerNotes";


var dashRoutes = [
  {
    path: "/main/dashboard",
    name: "Dashboard",
    icon: InsertChart,
    component: Dashboard
  },
  {
    collapse: true,
    path: "/main/inventory",
    name: "Inventory",
    state: "openComponents",
    icon: StoreMallDirectory,
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
        path: "/main/supplierReturn",
        name: "Return to Supplier",
        mini: "",
        component: supplierReturn
      },
    ]
  },
  {
    collapse: true,
    path: "/main/Accounts",
    name: "Accounts",
    state: "openForms",
    icon: Accounts,
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
        path: "/main/cashflow",
        name: "Cash Flow",
        mini: "",
        component: CashFlow
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
    icon: Cash,
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
  {
    collapse: true,
    path: "/main/cashout",
    name: "Cash Out",
    state: "cashOutComponents",
    icon: CashOut,
    views: [
      {
        path: "/main/expenses",
        name: "Expenses",
        mini: "",
        component: Expenses
      },
      {
        path: "/main/salary",
        name: "Salary",
        mini: "",
        component: Salary
      },
    ]
  },
  { path: "/main/cashier", name: "Cashier", icon: ShoppingCart, component: Cashier },
  { path: "/main/notes", name: "Notes", icon: Note, component: Notes }
];
export default dashRoutes;
