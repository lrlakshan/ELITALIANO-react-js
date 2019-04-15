import React from 'react';
import ReactTable from "react-table";
import Datetime from "react-datetime";
import ReactSearchBox from 'react-search-box'
import Helper from '../utils/Helper';
import LoadingOverlay from 'react-loading-overlay';
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
import Person from "@material-ui/icons/GroupAdd";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import Add from "@material-ui/icons/AddToQueue";
import Remove from "@material-ui/icons/RemoveFromQueue";
import Bill from "@material-ui/icons/ShoppingCart";
import Close from "@material-ui/icons/Close";
import Done from "@material-ui/icons/Done";
import Check from "@material-ui/icons/Check";
import AddCircle from "@material-ui/icons/AddCircle";
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
    AddNewCustomerButton: {
        marginTop: "15px",
        marginLeft: "25px",
        marginBottom: "0px",
        width: "150px"
    },
    CustomerSelectFormOpenButton: {
        position: "absolute",
        marginTop: "25px",
        paddingLeft: "10%",
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
        marginLeft: "89%",
        marginBottom: "0px",
    },
    selectCustomerCloseIcon: {
        position: "absolute",
        marginLeft: "95%",
        marginBottom: "0px",
    },
    addNewCustomerCloseIcon: {
        position: "absolute",
        marginLeft: "92%",
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

class Cashier extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alertOpen: false,
            customerSelectOpen: false,
            customerTableLoading: false,
            AddNewCustomerForm: false,
            tableLoading: false,
            salesInvoiceNextNumber: null,
            totalBill: "0.00",
            purchasePrice: "0.00",
            numberOfRows: 1,
            customerIdNextNumber: '',
            customerNames: [],
            productList :[],
            saleDetailsList: [],
            selectedCustomerId: '',
            selectedCustomerName: '',
            newCustomerName: '',
            newCustomerMobile: '',
            typingName: '',
            typingMobile: '',
            addNewCustomerloading: false,
            successAlert: false,
            succesAlertMsg: "",
            simpleSelectProduct: "",
            selectedDate: Moment(Date()).format("YYYY-MM-DD"),

            //cashier product details states
            amountAvailable: "0",
            marketPrice: '0.00',
            sellingPrice: '0.00',
            amountPurchases: 0,

            //states success false
            newCustomerNameState: '',
            newCustomerMobileState: '',
            amountPurchasesState: ''
        };
        this.customerSaveButtonClick = this.customerSaveButtonClick.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    componentDidMount() {
        this.getMenuList();
        this.getSalesInvoiceNextNumber();
    }

    //get the selected date from the calender and convert it to YYYY-MM-DD format
    updateState(date) {
        // This function gives you the moment object of date selected. 
        var dateString = date._d;
        var dateObj = new Date(dateString);
        var momentObj = Moment(dateObj);
        var momentString = momentObj.format('YYYY-MM-DD');
        this.setState({ selectedDate: momentString });
    }

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
                        mobileNumber: data[i].mobileNumber,
                        customerName: data[i].customerName,
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

    //customer select by mobile number
    selectByCustomerMobile = (value) => {
        const customerNames = [];
        this.setState({ 
            customerTableLoading: true,
            typingMobile: value
         });
        Helper.http
            .jsonPost("getSelectedCustomerByMobile", {
                mobileNumber: value
            })
            .then(response => {
                let data = response.data.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        id: data[i].id,
                        mobileNumber: data[i].mobileNumber,
                        customerName: data[i].customerName,
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

    //this will open the customer selecting form 
    CustomerSelectFormOpenButtonClick = () => {
        this.setState({
            customerSelectOpen: true
        })
    } 
    
    //Add new customer form open button
    AddNewCustomerButtonClick = () => {
        this.setState({ loading: true });
        Helper.http
            .jsonGet("customerIdNextNumber")
            .then(response => {
                this.setState({ 
                    AddNewCustomerForm: true,
                    customerIdNextNumber: response.data
                 });
                this.setState({ loading: false });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //Add new customer form close button
    AddNewCustomerFormClose = () => {
        this.setState({
            AddNewCustomerForm: false,
            newCustomerNameState: '',
            newCustomerMobileState: '',
            newCustomerName: '',
            newCustomerMobile: ''
        })
    } 

    //Saving the new customer
    customerSaveButtonClick = () => {
        this.setState({
            addNewCustomerloading: true
        })
        if (this.state.newCustomerName === "") {
            this.setState({ newCustomerNameState: "error" });
        }
        if (this.state.newCustomerMobile === "") {
            this.setState({ newCustomerMobileState: "error" });
        } 
        if (this.state.newCustomerName !== "" && this.state.newCustomerMobile !== ""){
            Helper.http
                .jsonPost("addNewCustomer", {
                    customerName: this.state.newCustomerName,
                    mobileNumber: this.state.newCustomerMobile,
                })
                .then(response => {
                    this.setState({
                        addNewCustomerloading: false,
                        newCustomerNameState: '',
                        newCustomerMobileState: '',
                        newCustomerName: '',
                        newCustomerMobile: '',
                        successAlert: true,
                        succesAlertMsg: "New customer added successfully"
                    });
                })
                .catch(exception => {
                    if(exception === '23000'){
                        this.setState({
                            alertOpen: true,
                            alertDiscription: "The mobile number you entered is already in the system",
                            addNewCustomerloading: false
                        });
                    } else if (exception === 2002){
                        this.setState({
                            alertOpen: true,
                            alertDiscription: "Please Check your connection",
                            addNewCustomerloading: false
                        });
                    }
                });
        }
        this.setState({
            addNewCustomerloading: false
        })
    } 

    //save the selected customer ID and customer name in a state
    selectCustomer = (customerId, customerName) => {
        this.setState({
            selectedCustomerId: customerId,
            selectedCustomerName: customerName,
        })
    }

    //clear the selected customer ID and customer name from the state
    clearSelectedCustomer = () => {
        this.setState({
            selectedCustomerId: '',
            selectedCustomerName: '',
        })
    }

    //close the pop up window after selecting the customer
    customerSelectClose = () => {
        this.setState({
            customerSelectOpen: false,
            customerNames: []
        })
    }

    //alert dialog box close
    handleClose = () => {
        this.setState({ alertOpen: false });
    };

    //success message sweet alert hide function
    hideAlert_success = () => {
        this.setState({
            successAlert: false,
            succesAlertMsg: "",
            AddNewCustomerForm: false
        });
    };

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
                    marketPrice: response.data.marketPrice,
                    sellingPrice: response.data.sellingPrice,
                    purchasePrice: response.data.purchasePrice,
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //add to list button handle function
    addToListButtonClick = () => {
        if (this.state.simpleSelectProduct === "") {
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
                    .jsonPost("addSales", {
                        invoiceNum: this.state.salesInvoiceNextNumber,
                        date: this.state.selectedDate,
                        productId: this.state.productId,
                        customerId: this.state.selectedCustomerId,
                        purchasePrice: this.state.purchasePrice,
                        sellingPrice: this.state.sellingPrice,
                        amountPurchases: this.state.amountPurchases
                    })
                    .then(response => {
                        this.setState({
                            tableLoading: false,
                            productList: [],
                            amountAvailable: "0",
                            purchasePrice: "0.00",
                            sellingPrice: "0.00",
                            amountPurchasesState: "",
                            amountPurchases: 0,
                            simpleSelectProduct: ""
                        });
                        this.getMenuList();
                        this.getSalesDetails();
                    })
                    .catch(exception => {
                        console.log(exception);
                    });
            }
        }
    }

    //get the next sales invoice number after the last bil generated
    getSalesInvoiceNextNumber = () => {
        Helper.http
            .jsonGet("salesInvoiceNextNumber")
            .then(response => {
                this.setState({ salesInvoiceNextNumber: response.data });
                this.getSalesDetails();
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //preview items in the current invoice number 
    getSalesDetails = () => {
        const saleDetailsList = [];
        this.setState({ tableLoading: true });
        Helper.http
            .jsonPost("getsaleListDetails", {
                invoiceNum: this.state.salesInvoiceNextNumber,
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
                        sellingPrice: data[i].sellingPrice,
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
                    saleDetailsList.push(_data);
                }
                this.setState({
                    saleDetailsList,
                    tableLoading: false
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    }

    // function that verifies if a string has a given length or not
    verifyLength(value, length) {
        if (value.length >= length) {
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

    change(event, stateName, type, stateNameEqualTo, maxValue) {
        switch (type) {
            case "number":
                if (this.verifyNumber(event.target.value)) {
                    this.setState({ [stateName + "State"]: "success" });
                } else {
                    this.setState({ [stateName + "State"]: "error" });
                }
                break;
            case "newCustomerNameLength":
                if (this.verifyLength(event.target.value, stateNameEqualTo)) {
                    this.setState({ 
                        [stateName + "State"]: "success",
                        newCustomerName: event.target.value 
                    });
                } else {
                    this.setState({ 
                        [stateName + "State"]: "error",
                        newCustomerName: event.target.value  
                    });
                }
                break;
            case "newCustomerMobileLength":
                if (this.verifyLength(event.target.value, stateNameEqualTo)) {
                    this.setState({
                        [stateName + "State"]: "success",
                        newCustomerMobile: event.target.value
                    });
                } else {
                    this.setState({
                        [stateName + "State"]: "error",
                        newCustomerMobile: event.target.value 
                    });
                }
                break;
            case "amoutPurchaseNumber":
                if (event.target.value <= 0) {
                    this.setState({ [stateName + "State"]: "error" });
                    this.setState({ amountPurchases: event.target.value })
                } else {
                    this.setState({ [stateName + "State"]: "success" });
                    this.setState({ amountPurchases: event.target.value })
                }
                break;
            default:
                break;
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>

                {/* customer select dialog box */}
                <Dialog
                    open={this.state.customerSelectOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    scroll="body"
                >
                    <LoadingOverlay
                        active={this.state.loading}
                        spinner
                        text='Loading...'
                    >
                    <Button
                        justIcon
                        round
                        simple
                        onClick={this.customerSelectClose}
                        color="danger"
                        className={classes.selectCustomerCloseIcon}
                    >
                        <Close />
                    </Button>
                    <br />
                    <Card className={classes.cardSize}>
                        <CardHeader color="primary" icon>
                            <CardIcon color="primary">
                                <LibraryBooks />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Select Customer</h4>
                        </CardHeader>
                        <CardBody>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <Button
                                            color="info"
                                            onClick={this.AddNewCustomerButtonClick}
                                            className={classes.AddNewCustomerButton}
                                        > <AddCircle className={classes.icons} />Add New
                                        </Button>
                                        <br />
                                        <br />
                                        <InputLabel className={classes.label}>Search By Customer Name</InputLabel>
                                        <br />
                                        <br />
                                        <ReactSearchBox
                                            placeholder="Customer Name"
                                            value={this.state.typingName}
                                            callback={record => console.log(record)}
                                            onChange={this.selectByCustomerName}
                                        />
                                        <br />
                                        <br />
                                        <InputLabel className={classes.label}>Search By Mobile Number</InputLabel>
                                        <br />
                                        <br />
                                        <ReactSearchBox
                                            placeholder="Mobile Number"
                                            value={this.state.typingMobile}
                                            callback={record => console.log(record)}
                                            onChange={this.selectByCustomerMobile}
                                        />
                                        <br />
                                        <CustomInput
                                            labelText="Selected Customer"
                                            id="selectedCustomerName"
                                            disabled
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            value={this.state.selectedCustomerName}
                                        />
                                        <br />
                                        <br />
                                        <Button
                                            disabled={this.state.selectedCustomerId == ''}
                                            size='sm'
                                            color="danger"
                                            onClick={this.clearSelectedCustomer}
                                            className={classes.invoiceButton}
                                        > Clear
                                        </Button>
                                        <Button
                                            disabled={this.state.selectedCustomerId == ''}
                                            size='sm'
                                            color="success"
                                            onClick={this.customerSelectClose}
                                            className={classes.invoiceButton}
                                        > Continue
                                        </Button>
                                    </CardBody>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <ReactTable
                                            loading={this.state.customerTableLoading}
                                            data={this.state.customerNames}
                                            noDataText="No Matching Results"
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
                                                            <strong>Customer Name</strong></div>),
                                                    accessor: "customerName",
                                                    filterable: false,
                                                    sortable: false,
                                                    width: 250,
                                                    Cell: row => <div className="actions-left">{row.value}</div>
                                                },
                                                {
                                                    Header: () => (
                                                        <div className="actions-left">
                                                            <strong>Mobile Number</strong></div>),
                                                    accessor: "mobileNumber",
                                                    filterable: false,
                                                    sortable: false,
                                                    width: 135,
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
                                            pageSize="5"
                                            showPaginationBottom={false}
                                            className="-striped -highlight"
                                        />
                                    </CardBody>
                                </GridItem>
                            </GridContainer>
                            
                        </CardBody>
                    </Card>
                    </LoadingOverlay>
                </Dialog>

                {/* Add new customer detials */}
                <Dialog
                    open={this.state.AddNewCustomerForm}
                    aria-labelledby="form-dialog-title">
                    <LoadingOverlay
                        active={this.state.addNewCustomerloading}
                        spinner
                        text='Please Wait...'
                    >
                    <Button
                        justIcon
                        round
                        simple
                        onClick={this.AddNewCustomerFormClose}
                        color="danger"
                        className={classes.addNewCustomerCloseIcon}
                    >
                        <Close />
                    </Button>
                    <br />
                    <Card className={classes.cardSize}>
                        <CardHeader color="info" icon>
                            <CardIcon color="info">
                                <Person />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Add New Customer</h4>
                        </CardHeader>
                        <CardBody>
                            <form>
                                <CustomInput
                                    disabled={true}
                                    labelText="Customer ID"
                                    id="customerId"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    defaultValue={this.state.customerIdNextNumber.toString()}
                                />
                                <CustomInput
                                    success={this.state.newCustomerNameState === "success"}
                                    error={this.state.newCustomerNameState === "error"}
                                    labelText="Customer Name *"
                                    id="newCustomerName"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event =>
                                            this.change(event, "newCustomerName", "newCustomerNameLength", 1),
                                        type: "text"
                                    }}
                                    onChange={(event) => this.setState({ newCustomerName: event.target.value })}
                                    defaultValue={this.state.newCustomerName}
                                />
                                <CustomInput
                                    success={this.state.newCustomerMobileState === "success"}
                                    error={this.state.newCustomerMobileState === "error"}
                                    labelText="MobileNumber *"
                                    id="newCustomerMobile"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event =>
                                            this.change(event, "newCustomerMobile", "newCustomerMobileLength", 1),
                                        type: "number"
                                    }}
                                    onChange={(event) => this.setState({ newCustomerMobile: event.target.value })}
                                    defaultValue={this.state.newCustomerMobile.toString()}
                                />
                                <div>
                                    <Button
                                        size='sm'
                                        color="info"
                                        onClick={this.customerSaveButtonClick}
                                        className={classes.addButton}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                    </LoadingOverlay>
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

                {/* success alert */}
                <SweetAlert
                    show={this.state.successAlert}
                    success
                    style={{ display: "block", marginTop: "-150px" }}
                    title="successful!"
                    onConfirm={() => this.hideAlert_success()}
                    onCancel={() => this.hideAlert_success()}
                    confirmBtnCssClass={
                        this.props.classes.button + " " + this.props.classes.success
                    }
                >
                    {this.state.succesAlertMsg}
                </SweetAlert>

                <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                        <Card>
                            <CardHeader color="primary" icon>
                                <CardIcon color="primary">
                                    <LibraryBooks />
                                </CardIcon>
                                <h4 className={classes.cardIconTitle}>Invoice number <small> - {this.state.salesInvoiceNextNumber}</small></h4>
                            </CardHeader>
                            <br />
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <InputLabel className={classes.label}>Date</InputLabel>
                                        <br />
                                        <FormControl >
                                            <Datetime
                                                timeFormat={false}
                                                dateFormat="YYYY-MM-DD"
                                                defaultValue={Moment(Date()).format("YYYY-MM-DD")}
                                                onChange={this.updateState}
                                            inputProps={
                                                { disabled: this.state.saleDetailsList.length != 0 }
                                            }
                                            />
                                        </FormControl>
                                        <br />
                                        <FormControl >
                                            <CustomInput
                                                labelText="Select Customer"
                                                id="customer"
                                                disabled
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "text"
                                                }}
                                                value={this.state.selectedCustomerName}
                                            />
                                        </FormControl>
                                        <Button 
                                        simple 
                                        round 
                                        color="success" 
                                        className={classes.CustomerSelectFormOpenButton} 
                                            onClick={this.CustomerSelectFormOpenButtonClick}>
                                            <AddCircle className={classes.icons} />
                                        </Button>

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
                                                labelText="Market Price (Rs.)"
                                                id="marketPrice"
                                                disabled
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "number"
                                                }}
                                                value={this.state.marketPrice.toString()}
                                            />
                                        </FormControl>
                                        <FormControl >
                                            <CustomInput
                                                labelText="Selling Price (Rs.)"
                                                id="sellingPrice"
                                                disabled
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "number"
                                                }}
                                                value={this.state.sellingPrice.toString()}
                                            />
                                        </FormControl>
                                        <FormControl >
                                            <CustomInput
                                                success={this.state.amountPurchasesState === "success"}
                                                error={this.state.amountPurchasesState === "error"}
                                                disabled={this.state.selectedCustomerName === ''}
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
                                                disabled = {this.state.selectedCustomerName === ''}
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
                                        <Button 
                                            disabled={this.state.selectedCustomerName === ''}
                                            color="success" 
                                            className={classes.marginCenter} 
                                            onClick={this.addToListButtonClick}>
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
                                            disabled={this.state.saleDetailsList.length == 0}
                                        >
                                            <Remove className={classes.icons} /> Remove All
                                        </Button>
                                        <Button
                                            color="github"
                                            className={classes.marginCenter}
                                            onClick={this.checkOutOpen}
                                            disabled={this.state.saleDetailsList.length == 0}
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
                                    data={this.state.saleDetailsList}
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
                                            accessor: "sellingPrice",
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

export default withStyles(styles)(Cashier);