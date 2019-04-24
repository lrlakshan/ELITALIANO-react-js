import React from 'react';

// react component for creating dynamic tables
import ReactTable from "react-table";
import Helper from '../utils/Helper';
import LoadingOverlay from 'react-loading-overlay';
import ReactSearchBox from 'react-search-box'
import Datetime from "react-datetime";
import Moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";


// @material-ui/core components
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from "@material-ui/core/InputAdornment";
// @material-ui/icons
import Search from "@material-ui/icons/Search";
import Bill from "@material-ui/icons/ShoppingCart";
import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
import Done from "@material-ui/icons/Done";
import Close from "@material-ui/icons/Close";
import AddCircle from "@material-ui/icons/AddCircle";
import LocalMall from "@material-ui/icons/LocalMall";
// core components
import NavPills from "../components/NavPills/NavPills.jsx";
import GridContainer from "../components/Grid/GridContainer.jsx";
import GridItem from "../components/Grid/GridItem.jsx";
import Button from "../components/CustomButtons/Button.jsx";
import Card from "../components/Card/Card.jsx";
import CardBody from "../components/Card/CardBody.jsx";
import CardIcon from "../components/Card/CardIcon.jsx";
import CardHeader from "../components/Card/CardHeader.jsx";
import CustomInput from "../components/CustomInput/CustomInput.jsx";

import { cardTitle } from "../assets/jss/material-dashboard-pro-react.jsx";
import sweetAlertStyle from "../assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";
import extendedFormsStyle from "../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import elitaliano_logo from '../assets/img/elitaliano_logo.png';
import "../assets/scss/purchaseInvoice.css"

const styles = {
    cardIconTitle: {
        ...cardTitle,
        marginTop: "15px",
        marginBottom: "0px"
    },
    marginLeft: {
        marginTop: "15px",
        marginLeft: "25px",
        marginBottom: "0px",
        width: "150px"
    },
    alignright: {
        marginTop: "10px",
        marginBottom: "0px",
        textAlign: "Right"
    },
    searchButton: {
        paddingRight: "8%",
    },
    viewSalesButtons: {
        marginLeft: "20%",
        width: "150px"
    },
    viewPurchaseDetailsButton: {
        marginLeft: "20%",
    },
    cardSize: {
        width: "350px"
    },
    addButton: {
        float: "right"
    },
    invoiceCloseIcon: {
        position: "absolute",
        marginLeft: "94%",
        marginBottom: "0px",
    },
    invoiceFormCloseIcon: {
        position: "absolute",
        marginLeft: "88%",
        marginBottom: "0px",
    },
    invoiceSize: {
        width: "842px"
    },
    dialogPaper: {
        maxWidth: '850px',
    },
    ...sweetAlertStyle,
    ...extendedFormsStyle,
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

class SalesHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            salesInvoices: [],
            customerNames: [],
            salesHistoryItems: [],
            loading: false,
            open: false,
            customerTableLoading: false,
            invoiceOpen: false,
            numberOfRows: 1,
            selectedCustomerId: '',
            selectedCustomerName: '',
            typingName: '',
            typingInvoice: '',
            formTitle: "",
            invoiceNum: "",
            cumRevenue: '0',
            cumCostOfSales: '0',
            cumDiscount: '0',
            invoiceTotalBill: '',
            invoiceDate: '',
            invoiceDiscount: '',
            invoiceCashPaid: '',
            invoiceBalance: '',
            invoiceInvoiceNumber: '',
            selectedRadioBtn: "radio1",
            salesBtn: 'todaySales',
            simpleSelectItem: "",
        };
    }

    componentDidMount() {
        this.getTodaySalesInvoiceDetails();
    }

    //get all sales invoice details
    getAllSalesInvoiceDetails = () => {
        const salesInvoices = [];
        this.setState({ loading: true });

        Helper.http
            .jsonGet("getAllSalesInvoiceDetails")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        invoiceNum: data[i].invoiceNum,
                        customerName: data[i].customerName,
                        date: data[i].date,
                        details: data[i].details,
                        totalBill: data[i].totalBill,
                        discount: data[i].discount,
                        cashPaid: data[i].cashPaid,
                        balance: data[i].balance,

                        actions: (
                            // we've added some custom button actions
                            <div className="actions-right">
                                {/* use this button to add a edit kind of action */}
                                <Button
                                    justIcon
                                    round
                                    simple
                                    onClick={() => {
                                        //let obj = this.state.data.find(o => o.id === key);
                                        this.setState({
                                            open: true,
                                            formTitle: "Invoice Details",
                                            formButtonText: "Save",
                                        })
                                        this.loadItemsOfSelectedInvoice(data[i].invoiceNum, data[i].date, data[i].totalBill, data[i].discount, data[i].cashPaid, data[i].balance);
                                    }}
                                    color="warning"
                                    className="edit"
                                >
                                    <Dvr />
                                </Button>{" "}
                            </div>
                        )
                    };
                    salesInvoices.push(_data);
                }
                this.setState({ salesInvoices });
                this.setState({ 
                    loading: false,
                    numberOfRows: data.length,
                    cumRevenue: response.cumRevenue,
                    cumCostOfSales: response.cumCostOfSales,
                    cumDiscount: response.cumDiscount,
                    customerNames: [],
                    selectedCustomerId: '',
                    selectedCustomerName: '', 
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //get today sales invoice details
    getTodaySalesInvoiceDetails = () => {
        const salesInvoices = [];
        this.setState({ loading: true });

        Helper.http
            .jsonGet("getTodaySalesInvoiceDetails")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        invoiceNum: data[i].invoiceNum,
                        customerName: data[i].customerName,
                        date: data[i].date,
                        details: data[i].details,
                        totalBill: data[i].totalBill,
                        discount: data[i].discount,
                        cashPaid: data[i].cashPaid,
                        balance: data[i].balance,

                        actions: (
                            // we've added some custom button actions
                            <div className="actions-right">
                                {/* use this button to add a edit kind of action */}
                                <Button
                                    justIcon
                                    round
                                    simple
                                    onClick={() => {
                                        //let obj = this.state.data.find(o => o.id === key);
                                        this.setState({
                                            open: true,
                                            formTitle: "Invoice Details",
                                            formButtonText: "Save",
                                        })
                                        this.loadItemsOfSelectedInvoice(data[i].invoiceNum, data[i].date, data[i].totalBill, data[i].discount, data[i].cashPaid, data[i].balance);
                                    }}
                                    color="warning"
                                    className="edit"
                                >
                                    <Dvr />
                                </Button>{" "}
                            </div>
                        )
                    };
                    salesInvoices.push(_data);
                }
                this.setState({ salesInvoices });
                this.setState({
                    loading: false,
                    numberOfRows: data.length,
                    cumRevenue: response.cumRevenue,
                    cumCostOfSales: response.cumCostOfSales,
                    cumDiscount: response.cumDiscount,
                    customerNames: [],
                    selectedCustomerId: '',
                    selectedCustomerName: '', 
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //det the typed invoice number to typingInvoice state 
    invoiceNumberCatch = (value) =>{
        this.setState({ typingInvoice: value });
    }

    //search details of a paticular invoice number
    searchByInvoiceNumber = () => {
        const salesInvoices = [];
        this.setState({ 
            loading: true,
            salesBtn: ''
         });
        Helper.http
            .jsonPost("searchByInvoiceNumber", {
                invoiceNum: this.state.typingInvoice
            })
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        invoiceNum: data[i].invoiceNum,
                        customerName: data[i].customerName,
                        date: data[i].date,
                        details: data[i].details,
                        totalBill: data[i].totalBill,
                        discount: data[i].discount,
                        cashPaid: data[i].cashPaid,
                        balance: data[i].balance,

                        actions: (
                            // we've added some custom button actions
                            <div className="actions-right">
                                {/* use this button to add a edit kind of action */}
                                <Button
                                    justIcon
                                    round
                                    simple
                                    onClick={() => {
                                        //let obj = this.state.data.find(o => o.id === key);
                                        this.setState({
                                            open: true,
                                            formTitle: "Invoice Details",
                                            formButtonText: "Save",
                                        })
                                        this.loadItemsOfSelectedInvoice(data[i].invoiceNum, data[i].date, data[i].totalBill, data[i].discount, data[i].cashPaid, data[i].balance);
                                    }}
                                    color="warning"
                                    className="edit"
                                >
                                    <Dvr />
                                </Button>{" "}
                            </div>
                        )
                    };
                    salesInvoices.push(_data);
                }
                this.setState({ salesInvoices });
                this.setState({
                    loading: false,
                    numberOfRows: data.length,
                    cumRevenue: response.cumRevenue,
                    cumCostOfSales: response.cumCostOfSales,
                    cumDiscount: response.cumDiscount,
                    customerNames: [],
                    selectedCustomerId: '',
                    selectedCustomerName: '',
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //select the customer from search bar
    selectByCustomerName = (value) => {
        const customerNames = [];
        this.setState({
            customerTableLoading: true,
            typingName: value
        });
        Helper.http
            .jsonPost("getSelectedCustomerByName", {
                customerName: value
            })
            .then(response => {
                let data = response.data.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        id: data[i].id,
                        searchResult: data[i].customerName,
                        actions: (
                            // we've added some custom button actions
                            <div className="actions-right">
                                {/* use this button to add customer */}
                                <Button
                                    justIcon
                                    round
                                    simple
                                    onClick={() => {
                                        this.selectCustomer(data[i].id, data[i].customerName);
                                    }}
                                    color="success"
                                    className="remove"
                                >
                                    <Done />
                                </Button>{" "}
                            </div>
                        )
                    };
                    customerNames.push(_data);
                }
                this.setState({ customerNames });
                this.setState({ customerTableLoading: false });
            })
            .catch(exception => {
                console.log(exception);
                this.setState({
                    customerTableLoading: false,
                    customerNames: []
                });
            });
    }

    //save the selected customer ID and customer name in a state
    selectCustomer = (customerId, customerName) => {
        this.setState({
            selectedCustomerId: customerId,
            selectedCustomerName: customerName,
        });
    }

    //clear the selected customer ID and customer name from the state
    clearSelectedCustomer = () => {
        this.setState({
            selectedCustomerId: '',
            selectedCustomerName: '',
        });
    }

    //radio button change handling function
    handleRadioBtnChange = (event) => {
        console.log(event.target.value);
        this.setState({
            selectedRadioBtn: event.target.value
        });
    };

    //today sales button click function
    todaySalesBtnClick = () => {
        this.setState({
            salesBtn: 'todaySales',
        });
        this.getTodaySalesInvoiceDetails();
    }

    //all sales button click function
    allSalesBtnClick = () => {
        this.setState({
            salesBtn: 'allSales',
        });
        this.getAllSalesInvoiceDetails();
    }

    //this will get the invoice details as well as the items that purchased under that invoice number
    loadItemsOfSelectedInvoice = (invoiceNumber, date, totalBill, discount, cashPaid, balance) => {
        const salesHistoryItems = [];
        this.setState({ invoiceFormLoading: true });
        Helper.http
            .jsonPost("salesHistoryMoreDetails", {
                invoiceNum: invoiceNumber
            })
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        id: data[i].id,
                        productName: data[i].productName,
                        marketPrice: data[i].marketPrice,
                        amount: data[i].amount,
                        regAmount: data[i].regAmount,
                        sellingPrice: data[i].sellingPrice,
                        amountPurchases: data[i].amountPurchases,
                    };
                    salesHistoryItems.push(_data);
                }
                this.setState({ 
                    salesHistoryItems,
                    invoiceTotalBill: totalBill,
                    invoiceDate: date,
                    invoiceDiscount: discount,
                    invoiceCashPaid: cashPaid,
                    invoiceBalance: balance,
                    invoiceInvoiceNumber: invoiceNumber,
                    invoiceTotalBillRegular: response.sum.totalBillRegular,
                    invoiceFormLoading: false
                 });
            })
            .catch(exception => {
                console.log(exception);
                this.setState({ invoiceFormLoading: false });
            });
    }

    //invoice details form close icon click function
    invoiceFormHandleClose = () => {
        this.setState({
            open: false,
            invoiceTotalBill: '',
            invoiceDate: '',
            invoiceDiscount: '',
            invoiceCashPaid: '',
            invoiceBalance: '',
            invoiceInvoiceNumber: ''
        });
    }

    //view purcase details button click function
    viewPurchaseDetailsBtnClick = () => {
        this.setState({
            open: false,
            invoiceOpen: true
        });
    }

    //invoice close button click function
    invoiceClose = () => {
        this.setState({
            open: true,
            invoiceOpen: false
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>

                {/* dialog box which is open after action button clicked in sales history table */}
                <Dialog
                    open={this.state.open}
                    aria-labelledby="form-dialog-title">
                    <Button
                        justIcon
                        round
                        simple
                        onClick={this.invoiceFormHandleClose}
                        color="danger"
                        className={classes.invoiceFormCloseIcon}
                    >
                        <Close />
                    </Button>
                    <br />
                    <Card className={classes.cardSize}>
                        <CardHeader color="info" icon>
                            <CardIcon color="info">
                                <LocalMall />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>{this.state.formTitle} - <small>{this.state.invoiceInvoiceNumber}</small></h4>
                        </CardHeader>
                        <CardBody>
                            <LoadingOverlay
                                active={this.state.invoiceFormLoading}
                                spinner
                                text='Loading...'
                            >
                            <form>
                                <CustomInput
                                    disabled={true}
                                    labelText="Total Bill"
                                    id="invoiceTotalBill"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    value={this.state.invoiceTotalBill}
                                />
                                <CustomInput
                                    disabled={true}
                                    labelText="Promo Discount"
                                    id="invoiceDiscount"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    value={this.state.invoiceDiscount}
                                />
                                <CustomInput
                                    disabled={true}
                                    labelText="Cash Paid"
                                    id="invoiceCashPaid"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    value={this.state.invoiceCashPaid}
                                />
                                <CustomInput
                                    disabled={true}
                                    labelText="Payment Due"
                                    id="invoiceBalance"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    value={this.state.invoiceBalance}
                                />
                                <Button
                                    size='sm'
                                    round
                                    color="twitter"
                                    className={classes.viewPurchaseDetailsButton}
                                    onClick={this.viewPurchaseDetailsBtnClick}> View Purchase Details
                                </Button>
                            </form>
                            </LoadingOverlay>
                        </CardBody>
                    </Card>
                </Dialog>

                {/* Historical Invoice dialog box */}
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
                    <Card className={classes.invoiceSize}>
                        <CardHeader color="primary" icon>
                            <CardIcon color="primary">
                                <Bill />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Invoice</h4>
                        </CardHeader>
                        <br />
                        <CardBody>
                            <div id="divToPrint" className="container">
                                <div >
                                    <h1 className="no-margin">Sales Invoice</h1>
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
                                                    <td>{this.state.invoiceInvoiceNumber}</td>
                                                </tr>
                                                <tr>
                                                    <th>Issue Date</th>
                                                    <td>{this.state.invoiceDate}</td>
                                                </tr>
                                                <tr>
                                                    <th>Total</th>
                                                    <td>{parseInt(this.state.invoiceTotalBill - this.state.invoiceDiscount, 10).toLocaleString() + ".00"}</td>
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
                                                <th>Qty</th>
                                                <th>Regular Price *1</th>
                                                <th>Total</th>
                                                <th>Sale Price *1</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.salesHistoryItems.map((item, index) =>
                                                    <tr key={item.id}>
                                                        <td>
                                                            <p>{item.productName}</p>
                                                        </td>
                                                        <td>{item.amountPurchases}</td>
                                                        <td>{item.marketPrice}</td>
                                                        <td>{item.regAmount}</td>
                                                        <td>{item.sellingPrice}</td>
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
                                                <th>Sub Total</th>
                                                <td>{parseInt(this.state.invoiceTotalBillRegular, 10).toLocaleString() + ".00"}</td>
                                            </tr>
                                            <tr>
                                                <th>Discount (-)</th>
                                                <td>{parseInt(this.state.invoiceTotalBillRegular - this.state.invoiceTotalBill, 10).toLocaleString() + ".00"}</td>
                                            </tr>
                                            <tr>
                                                <th>Promo Discount (-)</th>
                                                <td>{parseInt(this.state.invoiceDiscount, 10).toLocaleString() + ".00"}</td>
                                            </tr>
                                            <tr>
                                                <th>Total</th>
                                                <td>{parseInt(this.state.invoiceTotalBill - this.state.invoiceDiscount, 10).toLocaleString() + ".00"}</td>
                                            </tr>
                                            <tr>
                                                <th>Cash Paid</th>
                                                <td>{parseInt(this.state.invoiceCashPaid, 10).toLocaleString() + ".00"}</td>
                                            </tr>
                                            <tr>
                                                <th>Payment Due</th>
                                                <td>{parseInt(this.state.invoiceBalance, 10).toLocaleString() + ".00"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Dialog>

                <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                        <Card>
                            <CardHeader color="primary" icon>
                                <CardIcon color="primary">
                                    <Assignment />
                                </CardIcon>
                                <h4 className={classes.cardIconTitle}>Filter By</h4>
                            </CardHeader>
                            <br />
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <div className="k-form-field" >
                                            <input type="radio" name="radio" value="radio1" className="k-radio" onChange={this.handleRadioBtnChange} defaultChecked={true} />
                                            <label className="k-radio-label">Search within all sales</label>
                                            <br />
                                            <br />
                                            <input type="radio" name="radio" value="radio2" className="k-radio" onChange={this.handleRadioBtnChange} />
                                            <label className="k-radio-label">Search within a time period</label>
                                        </div>
                                    </CardBody>
                                </GridItem>
                                {this.state.selectedRadioBtn == 'radio1' 
                                    ? <GridItem xs={12} sm={12} md={6}>
                                        <GridContainer>
                                            <Button
                                                simple={this.state.salesBtn == 'allSales' || this.state.salesBtn == ''}
                                                size='sm'
                                                round
                                                color="twitter"
                                                className={classes.viewSalesButtons}
                                                onClick={this.todaySalesBtnClick}> View today Sales
                                            </Button>
                                            <Button
                                                simple={this.state.salesBtn == 'todaySales' || this.state.salesBtn == ''}
                                                size='sm'
                                                round
                                                color="twitter"
                                                className={classes.viewSalesButtons}
                                                onClick={this.allSalesBtnClick}> View all Sales
                                            </Button>
                                        </GridContainer>
                                    </GridItem> 
                                    : <GridItem xs={12} sm={12} md={6}>
                                        <GridContainer>
                                            <GridItem xs={12} sm={12} md={6}>
                                                <CardBody>
                                                    <InputLabel className={classes.label}>From</InputLabel>
                                                    <br />
                                                    <FormControl >
                                                        <Datetime
                                                            timeFormat={false}
                                                            dateFormat="YYYY-MM-DD"
                                                            defaultValue={Moment(Date()).format("YYYY-MM-DD")}
                                                            onChange={this.updateState}
                                                        />
                                                    </FormControl>
                                                </CardBody>
                                            </GridItem>
                                            <GridItem xs={12} sm={12} md={6}>
                                                <CardBody>
                                                    <InputLabel className={classes.label}>To</InputLabel>
                                                    <br />
                                                    <FormControl >
                                                        <Datetime
                                                            timeFormat={false}
                                                            dateFormat="YYYY-MM-DD"
                                                            defaultValue={Moment(Date()).format("YYYY-MM-DD")}
                                                            onChange={this.updateState}
                                                        />
                                                    </FormControl>
                                                </CardBody>
                                            </GridItem>
                                        </GridContainer>
                                    </GridItem>
                                }
                                
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <NavPills
                                            color="info"
                                            tabs={[
                                                {
                                                    tabButton: "Invoice",
                                                    tabContent: (
                                                        <span>
                                                            <ReactSearchBox
                                                                placeholder="Insert Invoice Number"
                                                                value={this.state.typingName}
                                                                callback={record => console.log(record)}
                                                                onChange={this.invoiceNumberCatch}
                                                            />
                                                            <Button
                                                                size='sm'
                                                                color="success"
                                                                className={classes.searchButton}
                                                                onClick={this.searchByInvoiceNumber}>
                                                                <Search className={classes.icons} /> Search
                                                            </Button>
                                                        </span>
                                                    )
                                                },
                                                {
                                                    tabButton: "Customer",
                                                    tabContent: (
                                                        <span>
                                                            <CustomInput
                                                                labelText="Selected Customer"
                                                                id="selectedCustomerName"
                                                                disabled
                                                                formControlProps={{
                                                                    fullWidth: true
                                                                }}
                                                                value={this.state.selectedCustomerName}
                                                            />
                                                            <ReactSearchBox
                                                                placeholder="Insert Customer Name"
                                                                value={this.state.typingName}
                                                                callback={record => console.log(record)}
                                                                onChange={this.selectByCustomerName}
                                                            />
                                                            <Button
                                                                disabled={this.state.selectedCustomerId == ''}
                                                                size='sm'
                                                                color="success"
                                                                className={classes.searchButton}
                                                                onClick={this.proceedOpen}> Search
                                                            </Button>
                                                            <Button
                                                                disabled={this.state.selectedCustomerId == ''}
                                                                size='sm'
                                                                color="danger"
                                                                className={classes.searchButton}
                                                                onClick={this.clearSelectedCustomer}> Clear
                                                            </Button>
                                                        </span>
                                                    )
                                                },
                                            ]}
                                        />
                                    </CardBody>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <ReactTable
                                            loading={this.state.customerTableLoading}
                                            data={this.state.customerNames}
                                            noDataText=""
                                            defaultFilterMethod={filterCaseInsensitive}
                                            defaultSorted={[
                                                {
                                                    id: "id",
                                                    asc: true
                                                }
                                            ]}
                                            columns={[
                                                {
                                                    Header: () => (
                                                        <div className="actions-left">
                                                            <strong>Search Result</strong></div>),
                                                    accessor: "searchResult",
                                                    filterable: false,
                                                    sortable: false,
                                                    width: 140,
                                                    Cell: row => <div className="actions-left">{row.value}</div>
                                                },
                                                {
                                                    Header: "",
                                                    accessor: "actions",
                                                    width: 50,
                                                    sortable: false,
                                                    filterable: false
                                                }
                                            ]}
                                            pageSize="3"
                                            showPaginationBottom={false}
                                            className="-striped -highlight"
                                        />
                                    </CardBody>
                                </GridItem>
                            </GridContainer>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                        <Card>
                            <CardHeader color="primary" icon>
                                <CardIcon color="primary">
                                    <Assignment />
                                </CardIcon>
                                <h4 className={classes.cardIconTitle}>Sales Summary</h4>
                            </CardHeader>
                            <LoadingOverlay
                                active={this.state.loading}
                                spinner
                                text='Loading...'
                            >
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <h4>Revenue</h4>
                                        <h4>Cost of Sales (-)</h4>
                                        <h4>Discounts given (-)</h4>
                                        <br />
                                        <h4>Gross Profit/Loss</h4>
                                    </CardBody>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <h4 className={classes.alignright}><small>{parseInt(this.state.cumRevenue,10).toLocaleString() + ".00"}</small></h4>
                                            <h4 className={classes.alignright}><small>{(this.state.cumCostOfSales == null)  ? "0.00" : (parseInt(this.state.cumCostOfSales, 10).toLocaleString() + ".00")}</small></h4>
                                            <h4 className={classes.alignright}><small>{parseInt(this.state.cumDiscount, 10).toLocaleString() + ".00"}</small></h4>
                                        <br />
                                            <h4 className={classes.alignright}><small>{parseInt((this.state.cumRevenue - this.state.cumCostOfSales - this.state.cumDiscount), 10).toLocaleString() + ".00"}</small></h4>
                                    </CardBody>
                                </GridItem>
                            </GridContainer>
                            </LoadingOverlay>
                        </Card>
                    </GridItem>
                </GridContainer>
                <GridContainer>
                    <GridItem xs={12}>
                        <LoadingOverlay
                            active={this.state.loading}
                            spinner
                            text='Loading...'
                        >
                        <Card>
                            <CardHeader color="primary" icon>
                                <CardIcon color="primary">
                                    <Assignment />
                                </CardIcon>
                                <h4 className={classes.cardIconTitle}>Sales History</h4>
                            </CardHeader>
                            <CardBody>
                                    <ReactTable
                                        data={this.state.salesInvoices}
                                        filterable={false}
                                        sortable={false}
                                        showPagination={false}
                                        columns={[
                                            {
                                                Header: () => (
                                                    <div className="actions-center"><strong>Invoice</strong></div>),
                                                accessor: "invoiceNum",
                                                filterable: false,
                                                width: 100,
                                                Cell: row => <div className="actions-center">{row.value}</div>
                                            },
                                            {
                                                Header: () => (
                                                    <div className="actions-left"><strong>Customer Name</strong></div>),
                                                accessor: "customerName",
                                                width: 250,
                                                Cell: row => <div className="actions-left">{row.value}</div>
                                            },
                                            {
                                                Header: () => (
                                                    <div className="actions-center"><strong>Date</strong></div>),
                                                accessor: "date",
                                                width: 150,
                                                Cell: row => <div className="actions-center">{row.value}</div>
                                            },
                                            {
                                                Header: () => (
                                                    <div className="actions-left"><strong>Details</strong></div>),
                                                accessor: "details",
                                                width: 250,
                                                Cell: row => <div className="actions-left">{row.value}</div>
                                            },
                                            {
                                                Header: () => (
                                                    <div className="actions-right"><strong>Total Bill</strong></div>),
                                                accessor: "totalBill",
                                                width: 120,
                                                Cell: row => <div className="actions-right">{row.value}</div>
                                            },
                                            {
                                                Header: "",
                                                accessor: "actions",
                                                width: 100,
                                                sortable: false,
                                                filterable: false
                                            }
                                        ]}
                                        className="-striped -highlight"
                                        pageSize={this.state.numberOfRows}
                                    />
                            </CardBody>
                        </Card>
                        </LoadingOverlay>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

export default withStyles(styles)(SalesHistory);