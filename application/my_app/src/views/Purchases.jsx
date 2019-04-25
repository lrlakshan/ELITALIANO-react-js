import React from "react";
import ReactTable from "react-table";
import Datetime from "react-datetime";
import Helper from '../utils/Helper';
import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from "@material-ui/core/Checkbox";
import Moment from "moment";

// @material-ui/icons
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import Add from "@material-ui/icons/AddToQueue";
import Remove from "@material-ui/icons/RemoveFromQueue";
import Bill from "@material-ui/icons/ShoppingCart";
import Close from "@material-ui/icons/Close";
import Check from "@material-ui/icons/Check";
import Checkout from "@material-ui/icons/FindInPage";
import Payment from "@material-ui/icons/AssignmentTurnedIn";
import Invoice from "@material-ui/icons/Description";
// import Dashboard from "@material-ui/icons/Dashboard";
// import Schedule from "@material-ui/icons/Schedule";
// import Info from "@material-ui/icons/Info";
// import LocationOn from "@material-ui/icons/LocationOn";
// import Gavel from "@material-ui/icons/Gavel";
// import HelpOutline from "@material-ui/icons/HelpOutline";

// core components
import GridContainer from "../components/Grid/GridContainer.jsx";
import GridItem from "../components/Grid/GridItem.jsx";
//import NavPills from "../components/NavPills/NavPills.jsx";
//import Accordion from "components/Accordion/Accordion.jsx";
import Card from "../components/Card/Card.jsx";
import CardHeader from "../components/Card/CardHeader.jsx";
import CardBody from "../components/Card/CardBody.jsx";
import CardIcon from "../components/Card/CardIcon.jsx";
import CustomInput from "../components/CustomInput/CustomInput.jsx";
import Button from "../components/CustomButtons/Button.jsx";
import Table from "../components/Table/Table.jsx";

import { cardTitle } from "../assets/jss/material-dashboard-pro-react.jsx";
import extendedFormsStyle from "../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import extendedTablesStyle from "../assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import sweetAlertStyle from "../assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import "../assets/scss/purchaseInvoice.css"
import elitaliano_logo from '../assets/img/elitaliano_logo.png';

const styles = {
    dialogPaper: {
        maxWidth: '850px',
    },
    cardIconTitle: {
        ...cardTitle,
        marginTop: "15px",
        marginBottom: "0px"
    },
    marginCenter: {
        marginTop: "15px",
        marginLeft: "25px",
        marginBottom: "0px",
        width: "150px"
    },
    Right: {
        position: "absolute",
        marginTop: "30px",
        marginRight: "70px",
        marginBottom: "0px",
        textAlign: "right",
        // display: "inline",
        paddingLeft: "80%",
    },
    Left: {
        position: "absolute",
        marginTop: "30px",
        marginBottom: "0px",
        textAlign: 'left',
        paddingLeft: "110px",
        // display:"inline"
    },
    ProceedButtonStyle: {
        position: "absolute",
        marginTop: "50px",
        marginLeft: "87%",
        marginBottom: "20px",
    },
    closeIcon: {
        position: "absolute",
        marginLeft: "96%",
        marginBottom: "0px",
    },
    paymentCloseIcon: {
        position: "absolute",
        marginLeft: "88%",
        marginBottom: "0px",
    },
    invoiceCloseIcon: {
        position: "absolute",
        marginLeft: "94%",
        marginBottom: "0px",
    },
    cardSize: {
        width: "100%"
    },
    paymentCardSize: {
        width: "400px"
    },
    printInvoiceSize: {
        width: "842px"
    },
    addButton: {
        float: "right"
    },
    invoiceButton: {
        float: "right"
    },
    ...extendedFormsStyle,
    ...extendedTablesStyle,
    ...sweetAlertStyle
};

function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    return (
        row[id] !== undefined ?
            String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
            :
            true
    );
}

class Purchases extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            simpleSelectSupplier: "",
            simpleSelectProduct: "",
            selectedSupplierName: "",
            productList: [],
            supplierList: [],
            PurchaseDetailsList: [],
            amountAvailable: "0",
            purchasePrice: "0.00",
            purchaseInvoiceNextNumber: null,
            productId: null,
            amountPurchases: 0,
            checked: [],
            numberOfRows: 1,
            tableLoading: false,
            alertOpen: false,
            alertDiscription: "",
            selecedSupplierId: "",
            totalBill: "0.00",
            checkoutOpen: false,
            proceedOpen: false,
            cashPaid: "0.00",
            balance: "0.00",
            nextButtonDisabled: true,
            invoiceOpen: false,
            purchaseCompleted: false,
            selectedDate: Moment(Date()).format("YYYY-MM-DD"),
            details:"",
            pdfPrinted: false,

            //delete alert states
            deleteAlert: false,
            deleteAlertSuccess: false,

            //input states
            amountPurchasesState: ""
        };
        this.updateState = this.updateState.bind(this);
    }

    //get the selected date from the calender and convert it to YYYY-MM-DD format
    updateState(date) {
        // This function gives you the moment object of date selected. 
        var dateString = date._d;
        var dateObj = new Date(dateString);
        var momentObj = Moment(dateObj);
        var momentString = momentObj.format('YYYY-MM-DD'); 
        this.setState({selectedDate:momentString});
    }

    //print PDF button click
    printPDF = () => {
        const input = document.getElementById('divToPrint');
        html2canvas(input, {
            scale: "1.2"
        })
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                var imgWidth = 210;
                var pageHeight = 295;
                var imgHeight = canvas.height * imgWidth / canvas.width;
                var heightLeft = imgHeight;
                const pdf = new jsPDF();
                var position = 0;

                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                pdf.save(this.state.purchaseInvoiceNextNumber + "-" + this.state.selectedSupplierName + "-" + this.state.details);

                //un comment this to enable print feature
                // pdf.autoPrint();
                // window.open(pdf.output('bloburl'), '_blank');

                this.setState({pdfPrinted: true});
            });
    }

    componentDidMount() {
        this.getMenuList();
        this.getSupplierList();
        this.getPurchaseInvoiceNextNumber();
    }

    //get the product list for product drop down
    getMenuList = () => {
        const productList = [];
        Helper.http
            .jsonGet("productDetails")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        productId: data[i].productId,
                        productName: data[i].productName,
                    };
                    productList.push(_data);
                }
                this.setState({ productList });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //get the next purchase invoice number after the last bil generated
    getPurchaseInvoiceNextNumber = () => {
        Helper.http
            .jsonGet("purchaseInvoiceNextNumber")
            .then(response => {
                this.setState({ purchaseInvoiceNextNumber: response.data });
                this.removeListInReload();
                this.getPurchaseDetails();
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //get list of suppliers to load to the select supplier menu
    getSupplierList = () => {
        const supplierList = [];
        Helper.http
            .jsonGet("supplierDetails")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        id: data[i].id,
                        supplierName: data[i].supplierName,
                    };
                    supplierList.push(_data);
                }
                this.setState({ supplierList });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //preview items in the current invoice number 
    getPurchaseDetails = () => {
        const PurchaseDetailsList = [];
        this.setState({ tableLoading: true });
        Helper.http
            .jsonPost("getPurchaseListDetails", {
                invoiceNum: this.state.purchaseInvoiceNextNumber,
            })
            .then(response => {
                let data = response.data;
                this.setState({
                    numberOfRows: data.length,
                    totalBill: (response.sum.totalBill != null) ? response.sum.totalBill : "0.00"
                });
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        id: data[i].id,
                        productName: data[i].productName,
                        amountPurchases: data[i].amountPurchases,
                        purchasePrice: data[i].purchasePrice,
                        amount: data[i].amount,
                        actions: (
                            // we've added some custom button actions
                            <div className="actions-right">
                                {/* use this button to remove the data row */}
                                <Button
                                    justIcon
                                    round
                                    simple
                                    onClick={() => {
                                        this.listItemDelete(data[i].id);
                                    }}
                                    color="danger"
                                    className="remove"
                                >
                                    <Close />
                                </Button>{" "}
                            </div>
                        )
                    };
                    PurchaseDetailsList.push(_data);
                }
                this.setState({
                    PurchaseDetailsList,
                    tableLoading: false
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    }

    //select item from the select product drop down menu and send to backend
    handleSelectedProduct = event => {
        this.setState({
            [event.target.name]: event.target.value,
            productId: event.target.value
        });
        Helper.http
            .jsonPost("getSelectedProductDetails", {
                productId: event.target.value
            })
            .then(response => {

                this.setState({
                    amountAvailable: response.data.amountAvailable,
                    purchasePrice: response.data.purchasePrice
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //select supplier from the drop down menu and send to backend
    handleSelectedSupplier = event => {
        this.setState({
            [event.target.name]: event.target.value,
            selecedSupplierId: event.target.value
        });
        Helper.http
            .jsonPost("getSelectedSupplierName", {
                id: event.target.value
            })
            .then(response => {

                this.setState({
                    selectedSupplierName: response.data.supplierName
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //checkout button function
    checkOutOpen = () => {
        this.setState({
            checkoutOpen: true
        });
    };

    //checkout dialog box close
    checkoutClose = () => {
        this.setState({ checkoutOpen: false });
    };

    //proceed button function
    proceedOpen = () => {
        this.setState({
            proceedOpen: true,
            checkoutOpen: false,
            balance: this.state.totalBill,
            cashPaid: "0.00"
        });
    };

    //payment dialog box close and checkout dialog box open again
    proceedClose = () => {
        this.setState({
            proceedOpen: false,
            checkoutOpen: true,
            nextButtonDisabled: true
        });
    };

    //Next button function
    nextButton = () => {
        if(this.state.details == ""){
            this.setState({
                alertOpen: true,
                alertDiscription: "You have to add a small note on the purchase"
            });
        } else{
            this.setState({
                invoiceOpen: true,
                proceedOpen: false,
            });
        }
    };

    //invocie dialog box close and payment dialog box open again
    invoiceClose = () => {
        this.setState({
            invoiceOpen: false,
            proceedOpen: true,
            nextButtonDisabled: true,
            pdfPrinted: false
        });
    };

    //add to list button handle function
    addToListButtonClick = () => {
        if (this.state.simpleSelectSupplier === "") {
            this.setState({
                alertOpen: true,
                alertDiscription: "You have to select the relevant supplier from the dropdown menu. If not you have to a add new supplier"
            })
        } else if (this.state.simpleSelectProduct === "") {
            this.setState({
                alertOpen: true,
                alertDiscription: "You have to select a product from the dropdown menu. If not you have to add the product details from Inventory => View Stocks => Add New"
            })
        } else {
            if (this.state.amountPurchases <= 0) {
                this.setState({
                    amountPurchasesState: "error",
                    alertOpen: true,
                    alertDiscription: "You have to enter a valid amount as amount purchases"
                });
            }
            if (this.state.amountPurchases > 0) {
                this.setState({ tableLoading: true });
                Helper.http
                    .jsonPost("addPurchases", {
                        invoiceNum: this.state.purchaseInvoiceNextNumber,
                        date: this.state.selectedDate,
                        productId: this.state.productId,
                        supplierId: this.state.selecedSupplierId,
                        purchasePrice: this.state.purchasePrice,
                        amountPurchases: this.state.amountPurchases
                    })
                    .then(response => {
                        this.setState({
                            tableLoading: false,
                            productList: [],
                            amountAvailable: "0",
                            purchasePrice: "0.00",
                            amountPurchasesState: "",
                            amountPurchases: 0,
                            simpleSelectProduct: ""
                        });
                        this.getMenuList();
                        this.getPurchaseDetails();
                    })
                    .catch(exception => {
                        console.log(exception);
                    });
            }
        }

    }

    //final purchase doen button click. This will call purchase invoice API
    purchaseDoneButtonClick = () => {
        Helper.http
            .jsonPost("addPurchaseInvoice", {
                invoiceNum: this.state.purchaseInvoiceNextNumber,
                supplierId: this.state.selecedSupplierId,
                date: this.state.selectedDate,
                details: this.state.details,
                totalBill: this.state.totalBill,
                cashPaid: this.state.cashPaid,
                balance: this.state.balance,
            })
            .then(response => {
                this.setState({
                    purchaseCompleted: true,
                    invoiceOpen:false
                });
                // this.getMenuList();
                // this.getSupplierList();
                // this.getPurchaseInvoiceNextNumber();
                // this.getPurchaseDetails();
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //removing previous puchase list after reloading
    removeListInReload = () => {
        Helper.http
            .jsonPost("clearList", {
                invoiceNum: this.state.purchaseInvoiceNextNumber
            })
            .then(response => {
                this.setState({
                    alertOpen: true,
                    alertDiscription: "Your previous list has been cleared. Re-Enter your list you wish to buy"
                });
                this.getPurchaseDetails();
            })
            .catch(exception => {
                console.log(exception);
            });
    }

    //remove all button click function
    removeAllButtonClick = () => {
        Helper.http
            .jsonPost("clearList", {
                invoiceNum: this.state.purchaseInvoiceNextNumber
            })
            .then(response => {
                this.setState({
                    deleteAlertSuccess: true,
                    deleteAlert: false
                });
                this.getPurchaseDetails();
            })
            .catch(exception => {
                console.log(exception);
                this.setState({
                    alertOpen: true,
                    deleteAlert: false,
                    alertDiscription: "Error occured when clearing the List"
                });
            });
    }

    //delete items from the list
    listItemDelete = (id) => {
        Helper.http
            .jsonPost("deletePurchases", {
                Id: id
            })
            .then(response => {
                this.getPurchaseDetails();
            })
            .catch(exception => {
                console.log(exception);
                this.setState({
                    alertOpen: true,
                    alertDiscription: "Error occured when removing this item"
                });
            });
    }

    //are you sure to delete sweet alert cancel button function
    hideAlert_delete = () => {
        this.setState({
            deleteAlert: false,
        });
    };

    //item delete success message hide function
    Alert_delete_success_close = () => {
        this.setState({
            deleteAlertSuccess: false
        });
    };

    //purchase complete sweet alert close function
    purchase_complete_alert_close = () => {
         this.setState({
            purchaseCompleted: false,
        });
        window.location.reload();

        ////-------use this code if reload takes too much time. check it after live deployment------

        // this.setState({
        //     purchaseCompleted: false,
        //     selectedDate: Moment(Date()).format("YYYY-MM-DD"),
        //     simpleSelectSupplier:""
        // });
        // this.getPurchaseInvoiceNextNumber();
        // this.getPurchaseDetails();

        //------------------------------------------------------------------------------------
    };

    //alert dialog box close
    handleClose = () => {
        this.setState({ alertOpen: false });
    };

    //calculate remaining cash to be paid to the customer
    calBalance = () => {
        let x = this.state.totalBill - this.state.cashPaid;
        if(x<0){
            this.setState({
                alertOpen: true,
                alertDiscription: "You are entering a cash paid amount which is greater than the total bill"
            });
        }else{
            this.setState({
                balance: x,
                nextButtonDisabled: false
            });
        }
    };

    //validation rules
    // function that returns true if value is email, false otherwise
    verifyEmail(value) {
        var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (emailRex.test(value)) {
            return true;
        }
        return false;
    }
    // function that verifies if a string has a given length or not
    verifyLength(value, length) {
        if (value.length >= length) {
            return true;
        }
        return false;
    }
    // function that verifies if two strings are equal
    compare(string1, string2) {
        if (string1 === string2) {
            return true;
        }
        return false;
    }
    // function that verifies if value contains only numbers
    verifyNumber(value) {
        var numberRex = new RegExp("^[0-9]+$");
        if (numberRex.test(value)) {
            return true;
        }
        return false;
    }
    // verifies if value is a valid URL
    verifyUrl(value) {
        try {
            new URL(value);
            return true;
        } catch (_) {
            return false;
        }
    }
    change(event, stateName, type, stateNameEqualTo, maxValue) {
        switch (type) {
            case "email":
                if (this.verifyEmail(event.target.value)) {
                    this.setState({ [stateName + "State"]: "success" });
                } else {
                    this.setState({ [stateName + "State"]: "error" });
                }
                break;
            case "password":
                if (this.verifyLength(event.target.value, 1)) {
                    this.setState({ [stateName + "State"]: "success" });
                } else {
                    this.setState({ [stateName + "State"]: "error" });
                }
                break;
            case "equalTo":
                if (this.compare(event.target.value, this.state[stateNameEqualTo])) {
                    this.setState({ [stateName + "State"]: "success" });
                } else {
                    this.setState({ [stateName + "State"]: "error" });
                }
                break;
            case "checkbox":
                if (event.target.checked) {
                    this.setState({ [stateName + "State"]: "success" });
                } else {
                    this.setState({ [stateName + "State"]: "error" });
                }
                break;
            case "number":
                if (this.verifyNumber(event.target.value)) {
                    this.setState({ [stateName + "State"]: "success" });
                } else {
                    this.setState({ [stateName + "State"]: "error" });
                }
                break;
            case "length":
                if (this.verifyLength(event.target.value, stateNameEqualTo)) {
                    this.setState({ [stateName + "State"]: "success" });
                } else {
                    this.setState({ [stateName + "State"]: "error" });
                }
                break;
            case "max-length":
                if (!this.verifyLength(event.target.value, stateNameEqualTo + 1)) {
                    this.setState({ [stateName + "State"]: "success" });
                } else {
                    this.setState({ [stateName + "State"]: "error" });
                }
                break;
            case "url":
                if (this.verifyUrl(event.target.value)) {
                    this.setState({ [stateName + "State"]: "success" });
                } else {
                    this.setState({ [stateName + "State"]: "error" });
                }
                break;
            case "min-value":
                if (
                    this.verifyNumber(event.target.value) &&
                    event.target.value >= stateNameEqualTo
                ) {
                    this.setState({ [stateName + "State"]: "success" });
                } else {
                    this.setState({ [stateName + "State"]: "error" });
                }
                break;
            case "max-value":
                if (
                    this.verifyNumber(event.target.value) &&
                    event.target.value <= stateNameEqualTo
                ) {
                    this.setState({ [stateName + "State"]: "success" });
                } else {
                    this.setState({ [stateName + "State"]: "error" });
                }
                break;
            case "range":
                if (
                    this.verifyNumber(event.target.value) &&
                    event.target.value >= stateNameEqualTo &&
                    event.target.value <= maxValue
                ) {
                    this.setState({ [stateName + "State"]: "success" });
                } else {
                    this.setState({ [stateName + "State"]: "error" });
                }
                break;
            case "amoutPurchaseNumber":
                if (event.target.value <= 0) {
                    this.setState({ [stateName + "State"]: "error" });
                } else {
                    this.setState({ [stateName + "State"]: "success" });
                }
                break;
            default:
                break;
        }
        switch (type) {
            case "checkbox":
                this.setState({ [stateName]: event.target.checked });
                break;
            default:
                this.setState({ [stateName]: event.target.value });
                break;
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>

                {/* checkout dialog box */}
                <Dialog
                    open={this.state.checkoutOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    scroll="body"
                >
                    <Button
                        justIcon
                        round
                        simple
                        onClick={this.checkoutClose}
                        color="danger"
                        className={classes.closeIcon}
                    >
                        <Close />
                    </Button>
                    <br />
                    <Card className={classes.cardSize}>
                        <CardHeader color="primary" icon>
                            <CardIcon color="primary">
                                <Checkout />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Checkout</h4>
                        </CardHeader>
                        <br />
                        <Button 
                            size='sm'
                            color="info" 
                            className={classes.ProceedButtonStyle} 
                            onClick={this.proceedOpen}>
                            <Bill className={classes.icons} /> Proceed
                            </Button>
                        <br />
                        <CardBody>
                            <ReactTable
                                loading={this.state.tableLoading}
                                data={this.state.PurchaseDetailsList}
                                noDataText=""
                                defaultFilterMethod={filterCaseInsensitive}
                                defaultSorted={[
                                    {
                                        id: "id",
                                        desc: true
                                    }
                                ]}
                                columns={[
                                    {
                                        Header: () => (
                                            <strong>Product Name</strong>),
                                        accessor: "productName",
                                        filterable: false,
                                        sortable: false,
                                        width: 150
                                    },
                                    {
                                        Header: () => (
                                            <strong>Qty</strong>),
                                        accessor: "amountPurchases",
                                        filterable: false,
                                        sortable: false,
                                        width: 50,
                                        Cell: row => <div className="actions-right">{row.value}</div>
                                    },
                                    {
                                        Header: () => (
                                            <div className="actions-right">
                                                <strong>Price</strong></div>),
                                        accessor: "purchasePrice",
                                        filterable: false,
                                        sortable: false,
                                        width: 70,
                                        Cell: row => <div className="actions-right">{row.value}</div>
                                    },
                                    {
                                        Header: () => (
                                            <div className="actions-right">
                                                <strong>Amount</strong></div>),
                                        accessor: "amount",
                                        filterable: false,
                                        sortable: false,
                                        width: 100,
                                        Cell: row => <div className="actions-right">{row.value}</div>
                                    }
                                ]}
                                pageSize={this.state.numberOfRows}
                                showPaginationBottom={false}
                                className="-striped -highlight"
                            />
                            <h3 className={classes.Left} >Total</h3><h3 className={classes.Right}><small>Rs.{(this.state.totalBill < 1000000) ? parseInt(this.state.totalBill, 10).toLocaleString() + ".00" : parseInt(this.state.totalBill, 10).toLocaleString()}</small></h3>
                            <br />
                            <br />
                        </CardBody>
                    </Card>
                </Dialog>
                {/* payment dialog box */}
                <Dialog
                    open={this.state.proceedOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                // maxWidth="sm"
                // scroll="body"
                >
                    <Button
                        justIcon
                        round
                        simple
                        onClick={this.proceedClose}
                        color="danger"
                        className={classes.paymentCloseIcon}
                    >
                        <Close />
                    </Button>
                    <br />
                    <Card className={classes.paymentCardSize}>
                        <CardHeader color="primary" icon>
                            <CardIcon color="primary">
                                <Payment />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Payment</h4>
                        </CardHeader>
                        <CardBody>
                            <form>
                                <CustomInput
                                    labelText="Details"
                                    id="details"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        type: "text"
                                    }}
                                    onChange={(event) => this.setState({ details: event.target.value })}
                                    defaultValue={this.state.details}
                                />
                                <CustomInput
                                    disabled= {true}
                                    labelText="Total Bill"
                                    id="totalBill"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    defaultValue={parseInt(this.state.totalBill, 10).toLocaleString() + ".00"}
                                />
                                <CustomInput
                                    labelText="Cash Paid"
                                    id="cashPaid"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        type: "number"
                                    }}
                                    onChange={(event) => this.setState({ cashPaid: event.target.value })}
                                    defaultValue={this.state.cashPaid}
                                />
                                <div>
                                    <Button
                                        size='sm'
                                        color="info"
                                        onClick={this.calBalance}
                                        className={classes.addButton}
                                    >
                                        Calculate
                                    </Button>
                                </div>
                                <CustomInput
                                    disabled={true}
                                    labelText="Balance"
                                    id="balance"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    value={parseInt(this.state.balance, 10).toLocaleString() + ".00"}
                                />
                                <div>
                                    <Button
                                        disabled={this.state.nextButtonDisabled}
                                        size='sm'
                                        color="info"
                                        onClick={this.nextButton}
                                        className={classes.addButton}
                                    >
                                        Next>>
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </Dialog>

                {/* Invoice dialog box */}
                <Dialog
                    open={this.state.invoiceOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    scroll="body"
                    classes={{ paper: classes.dialogPaper }}
                >
                    <Button
                        justIcon
                        round
                        simple
                        onClick={this.invoiceClose}
                        color="danger"
                        className={classes.invoiceCloseIcon}
                    >
                        <Close />
                    </Button>
                    <br />
                    <Card className={classes.printInvoiceSize}>
                        <CardHeader color="primary" icon>
                            <CardIcon color="primary">
                                <Invoice />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Invoice</h4>
                        </CardHeader>
                        <br />
                        <CardBody>
                            <div >
                                <Button 
                                    disabled={!this.state.pdfPrinted}
                                    size='sm'
                                    color="info"
                                    onClick={this.purchaseDoneButtonClick}
                                    className={classes.invoiceButton}
                                > Purchase
                            </Button>
                                <Button
                                    size='sm'
                                    color="info"
                                    onClick={this.printPDF}
                                    className={classes.invoiceButton}
                                > Print PDF
                            </Button>
                            </div>
                            <div id="divToPrint" className="container">
                                <div >
                                    <h1 className="no-margin">Purchase Invoice</h1>
                                </div>
                                <div className="inv-header">
                                    <div>
                                        <img src={elitaliano_logo} className="inv-logo" />
                                        <h2>ELITALIANO</h2>
                                        <ul>
                                            <li>Liyanage Distributors</li>
                                            <li>1394/7, Hokandara road,Pannipitiya</li>
                                            <li>Lakshan : +94 71 303 2396</li>
                                            <li>Janith : +94 71 329 9627</li>
                                            <li>Email : elitaliano.lanka@gmail.com</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <th>Invoice Number</th>
                                                    <td>{this.state.purchaseInvoiceNextNumber}</td>
                                                </tr>
                                                <tr>
                                                    <th>Issue Date</th>
                                                    <td>{this.state.selectedDate}</td>
                                                </tr>
                                                <tr>
                                                    <th>Total</th>
                                                    <td>{parseInt(this.state.totalBill, 10).toLocaleString() + ".00"}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="inv-body">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Product Name</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.PurchaseDetailsList.map((item, index) =>
                                                    <tr key = {item.id}>
                                                        <td>
                                                            <p>{item.productName}</p>
                                                        </td>
                                                        <td>{item.amountPurchases}</td>
                                                        <td>{item.purchasePrice}</td>
                                                        <td>{item.amount}</td>
                                                    </tr>
                                                )
                                            }


                                        </tbody>
                                    </table>
                                </div>
                                <div className="inv-footer">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>Total</th>
                                                <td>{parseInt(this.state.totalBill, 10).toLocaleString() + ".00"}</td>
                                            </tr>
                                            <tr>
                                                <th>Cash Paid</th>
                                                <td>{parseInt(this.state.cashPaid, 10).toLocaleString() + ".00"}</td>
                                            </tr>
                                            <tr>
                                                <th>Payment Due</th>
                                                <td>{parseInt(this.state.balance, 10).toLocaleString() + ".00"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Dialog>
                {/* alert dialog box */}
                <Dialog
                    open={this.state.alertOpen}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Alert"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {this.state.alertDiscription}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="info" autoFocus simple> Got it! </Button>
                    </DialogActions>
                </Dialog>
                <SweetAlert
                    show={this.state.deleteAlert}
                    warning
                    style={{ display: "block", marginTop: "-150px" }}
                    title="Are you sure?"
                    onConfirm={() => this.removeAllButtonClick()}
                    onCancel={() => this.hideAlert_delete()}
                    confirmBtnCssClass={
                        this.props.classes.button + " " + this.props.classes.success
                    }
                    cancelBtnCssClass={
                        this.props.classes.button + " " + this.props.classes.danger
                    }
                    confirmBtnText="Yes, delete all!"
                    cancelBtnText="Cancel"
                    showCancel
                >
                    You will not be able to recover this purchase list again!
                </SweetAlert>
                <SweetAlert
                    show={this.state.deleteAlertSuccess}
                    success
                    style={{ display: "block", marginTop: "-150px" }}
                    title="Deleted!"
                    onConfirm={() => this.Alert_delete_success_close()}
                    onCancel={() => this.Alert_delete_success_close()}
                    confirmBtnCssClass={
                        this.props.classes.button + " " + this.props.classes.success
                    }
                >
                    Purchase list has been deleted.
                </SweetAlert>

                {/* purchase complete sweet alert */}
                <SweetAlert
                    show={this.state.purchaseCompleted}
                    success
                    style={{ display: "block", marginTop: "-150px" }}
                    title="Successful"
                    onConfirm={() => this.purchase_complete_alert_close()}
                    onCancel={() => this.purchase_complete_alert_close()}
                    confirmBtnCssClass={
                        this.props.classes.button + " " + this.props.classes.success
                    }
                >
                    Your purchase has been completed
                </SweetAlert>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                        <Card>
                            <CardHeader color="primary" icon>
                                <CardIcon color="primary">
                                    <LibraryBooks />
                                </CardIcon>
                                <h4 className={classes.cardIconTitle}>Invoice number <small> - {this.state.purchaseInvoiceNextNumber}</small></h4>
                            </CardHeader>
                            <br />
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <InputLabel className={classes.label}>Supplier</InputLabel>
                                        <FormControl
                                            fullWidth
                                            className={classes.selectFormControl}
                                            disabled={this.state.PurchaseDetailsList.length != 0}
                                        >
                                            <InputLabel
                                                htmlFor="simple-selectSupplier"
                                                className={classes.selectLabel}
                                            >Selcet Supplier</InputLabel>
                                            <Select
                                                MenuProps={{
                                                    className: classes.selectMenu
                                                }}
                                                classes={{
                                                    select: classes.select
                                                }}
                                                value={this.state.simpleSelectSupplier}
                                                onChange={this.handleSelectedSupplier}
                                                inputProps={{
                                                    name: "simpleSelectSupplier",
                                                    id: "simple-selectSupplier"
                                                }}
                                            >
                                                <MenuItem
                                                    disabled
                                                    classes={{
                                                        root: classes.selectMenuItem
                                                    }}
                                                >
                                                    Select Supplier
                                                </MenuItem>
                                                {this.state.supplierList.map((supplier, index) =>
                                                    <MenuItem
                                                        key={supplier.id}
                                                        value={supplier.id}
                                                        classes={{
                                                            root: classes.selectMenuItem,
                                                            selected: classes.selectMenuItemSelected
                                                        }}
                                                    >
                                                        {supplier.supplierName}
                                                    </MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                        <br />
                                        <br />
                                        <InputLabel className={classes.label}>Date</InputLabel>
                                        <br />
                                        <FormControl >
                                            <Datetime
                                                timeFormat={false}
                                                dateFormat="YYYY-MM-DD"
                                                defaultValue={Moment(Date()).format("YYYY-MM-DD")}
                                                onChange={this.updateState}
                                                inputProps={
                                                    { disabled: this.state.PurchaseDetailsList.length != 0}
                                           }
                                            />
                                        </FormControl>
                                        <br />
                                        <br />
                                        <FormControl >
                                            <CustomInput
                                                labelText="Amount Available"
                                                id="amountAvailable"
                                                disabled
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "number"
                                                }}
                                                value={this.state.amountAvailable.toString()}
                                            />
                                        </FormControl>
                                        <FormControl >
                                            <CustomInput
                                                labelText="Purchase Price (Rs.)"
                                                id="purchasePrice"
                                                disabled
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "number"
                                                }}
                                                value={this.state.purchasePrice.toString()}
                                            />
                                        </FormControl>
                                        <FormControl >
                                            <CustomInput
                                                success={this.state.amountPurchasesState === "success"}
                                                error={this.state.amountPurchasesState === "error"}
                                                labelText="Amount Purchases"
                                                id="amountPurchases"
                                                value={this.state.amountPurchases.toString()}
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    onChange: event =>
                                                        this.change(event, "amountPurchases", "amoutPurchaseNumber"),
                                                    type: "number"
                                                }}
                                                onChange={(event) => this.setState({ amountPurchases: event.target.value })}
                                            />
                                        </FormControl>
                                        <h1>Total</h1>
                                    </CardBody>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <InputLabel className={classes.label}>Product Category</InputLabel>
                                        <FormControl
                                            fullWidth
                                            className={classes.selectFormControl}
                                        >
                                            <InputLabel
                                                htmlFor="simple-selectProduct"
                                                className={classes.selectLabel}
                                            >
                                                Selcet Product
                                            </InputLabel>
                                            <Select
                                                MenuProps={{
                                                    className: classes.selectMenu
                                                }}
                                                classes={{
                                                    select: classes.select
                                                }}
                                                value={this.state.simpleSelectProduct}
                                                onChange={this.handleSelectedProduct}
                                                inputProps={{
                                                    name: "simpleSelectProduct",
                                                    id: "simple-selectProduct"
                                                }}
                                            >
                                                <MenuItem
                                                    disabled
                                                    classes={{
                                                        root: classes.selectMenuItem
                                                    }}
                                                >
                                                    Select Product
                                                </MenuItem>
                                                {this.state.productList.map((product, index) =>
                                                    <MenuItem
                                                        key={product.productId}
                                                        value={product.productId}
                                                        classes={{
                                                            root: classes.selectMenuItem,
                                                            selected: classes.selectMenuItemSelected
                                                        }} >
                                                        {product.productName}
                                                    </MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                        <br />
                                        <br />
                                        <Button color="success" className={classes.marginCenter} onClick={this.addToListButtonClick}>
                                            <Add className={classes.icons} /> Add To List
                                        </Button>
                                        <Button
                                            color="danger"
                                            className={classes.marginCenter}
                                            onClick={() => {
                                                this.setState({
                                                    deleteAlert: true,
                                                });
                                            }}
                                            disabled={this.state.PurchaseDetailsList.length == 0}
                                        >
                                            <Remove className={classes.icons} /> Remove All
                                        </Button>
                                        <Button
                                            color="github"
                                            className={classes.marginCenter}
                                            onClick={this.checkOutOpen}
                                            disabled={this.state.PurchaseDetailsList.length == 0}
                                        >
                                            <Bill className={classes.icons} /> Checkout
                                        </Button>
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <h3 className={classes.marginCenter}><small>Rs.{(this.state.totalBill < 1000000) ? parseInt(this.state.totalBill, 10).toLocaleString() + ".00" : parseInt(this.state.totalBill, 10).toLocaleString()}</small></h3>
                                    </CardBody>
                                </GridItem>
                            </GridContainer>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                        <Card>
                            <CardBody>
                                <ReactTable
                                    loading={this.state.tableLoading}
                                    data={this.state.PurchaseDetailsList}
                                    noDataText=""
                                    defaultFilterMethod={filterCaseInsensitive}
                                    defaultSorted={[
                                        {
                                            id: "id",
                                            desc: true
                                        }
                                    ]}
                                    columns={[
                                        {
                                            Header: () => (
                                                <strong>Product Name</strong>),
                                            accessor: "productName",
                                            filterable: false,
                                            sortable: false,
                                            width: 150
                                        },
                                        {
                                            Header: () => (
                                                <strong>Qty</strong>),
                                            accessor: "amountPurchases",
                                            filterable: false,
                                            sortable: false,
                                            width: 50,
                                            Cell: row => <div className="actions-right">{row.value}</div>
                                        },
                                        {
                                            Header: () => (
                                                <div className="actions-right">
                                                    <strong>Price</strong></div>),
                                            accessor: "purchasePrice",
                                            filterable: false,
                                            sortable: false,
                                            width: 70,
                                            Cell: row => <div className="actions-right">{row.value}</div>
                                        },
                                        {
                                            Header: () => (
                                                <div className="actions-right">
                                                    <strong>Amount</strong></div>),
                                            accessor: "amount",
                                            filterable: false,
                                            sortable: false,
                                            width: 100,
                                            Cell: row => <div className="actions-right">{row.value}</div>
                                        },
                                        {
                                            Header: "",
                                            accessor: "actions",
                                            width: 50,
                                            sortable: false,
                                            filterable: false
                                        }
                                    ]}
                                    pageSize={this.state.numberOfRows}
                                    showPaginationBottom={false}
                                    className="-striped -highlight"
                                />
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

export default withStyles(styles)(Purchases);