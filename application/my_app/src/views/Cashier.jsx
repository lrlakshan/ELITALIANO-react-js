import React from 'react';
import ReactTable from "react-table";
import Datetime from "react-datetime";
import ReactSearchBox from 'react-search-box'
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
    invoiceCloseIcon: {
        position: "absolute",
        marginLeft: "95%",
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
            customerSelectOpen: false,
            customerTableLoading: false,
            customerNames: [],
            selectedCustomerId: '',
            selectedCustomerName: '',
            typingName: '',
            typingMobile: ''
        };
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
                    <Button
                        justIcon
                        round
                        simple
                        onClick={this.customerSelectClose}
                        color="danger"
                        className={classes.invoiceCloseIcon}
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
                                            onClick={this.purchaseDoneButtonClick}
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
                </Dialog>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                        <Card>
                            <CardHeader color="primary" icon>
                                <CardIcon color="primary">
                                    <LibraryBooks />
                                </CardIcon>
                                <h4 className={classes.cardIconTitle}>Invoice number <small> - 224</small></h4>
                            </CardHeader>
                            <br />
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
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
                                            <Add className={classes.icons} />
                                        </Button>
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
                                                // inputProps={
                                                //     { disabled: this.state.PurchaseDetailsList.length != 0 }
                                                // }
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
                                                // value={this.state.amountAvailable.toString()}
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
                                                // value={this.state.purchasePrice.toString()}
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
                                                // value={this.state.purchasePrice.toString()}
                                            />
                                        </FormControl>
                                        <FormControl >
                                            <CustomInput
                                                // success={this.state.amountPurchasesState === "success"}
                                                // error={this.state.amountPurchasesState === "error"}
                                                labelText="Amount Purchases"
                                                id="amountPurchases"
                                                // value={this.state.amountPurchases.toString()}
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
                                            {/* <Select
                                                MenuProps={{
                                                    className: classes.selectMenu
                                                }}
                                                classes={{
                                                    select: classes.select
                                                }}
                                                // value={this.state.simpleSelectProduct}
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
                                            </Select> */}
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
                                            // disabled={this.state.PurchaseDetailsList.length == 0}
                                        >
                                            <Remove className={classes.icons} /> Remove All
                                        </Button>
                                        <Button
                                            color="github"
                                            className={classes.marginCenter}
                                            onClick={this.checkOutOpen}
                                            // disabled={this.state.PurchaseDetailsList.length == 0}
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
                                        {/* <h3 className={classes.marginCenter}><small>Rs.{(this.state.totalBill < 1000000) ? parseInt(this.state.totalBill, 10).toLocaleString() + ".00" : parseInt(this.state.totalBill, 10).toLocaleString()}</small></h3> */}
                                    </CardBody>
                                </GridItem>
                            </GridContainer>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                        <Card>
                            <CardBody>
                                <ReactTable
                                    // loading={this.state.tableLoading}
                                    // data={this.state.PurchaseDetailsList}
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
                                    // pageSize={this.state.numberOfRows}
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