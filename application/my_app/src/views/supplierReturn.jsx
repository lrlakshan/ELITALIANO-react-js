import React from 'react';

// react component for creating dynamic tables
import ReactTable from "react-table";
import Helper from '../utils/Helper';
import Datetime from "react-datetime";
import Moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import LoadingOverlay from 'react-loading-overlay';
import ReactSearchBox from 'react-search-box'

// @material-ui/core components
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
import LocalMall from "@material-ui/icons/LocalMall";
import Search from "@material-ui/icons/Search";
import Close from "@material-ui/icons/Close";
import AddCircle from "@material-ui/icons/AddCircle";

// core components
import GridContainer from "../components/Grid/GridContainer.jsx";
import GridItem from "../components/Grid/GridItem.jsx";
import Button from "../components/CustomButtons/Button.jsx";
import Card from "../components/Card/Card.jsx";
import CardBody from "../components/Card/CardBody.jsx";
import CardIcon from "../components/Card/CardIcon.jsx";
import CardHeader from "../components/Card/CardHeader.jsx";
import NavPills from "../components/NavPills/NavPills.jsx";
import CustomInput from "../components/CustomInput/CustomInput.jsx";

import { cardTitle } from "../assets/jss/material-dashboard-pro-react.jsx";
import sweetAlertStyle from "../assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";
import extendedFormsStyle from "../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";

const styles = {
    cardIconTitle: {
        ...cardTitle,
        marginTop: "15px",
        marginBottom: "0px"
    },
    cardSize: {
        width: "350px"
    },
    addButton: {
        float: "right"
    },
    formCloseIcon: {
        position: "absolute",
        marginLeft: "87%",
        marginBottom: "0px",
    },
    ...sweetAlertStyle,
    ...extendedFormsStyle,
};

//function to allow filter by name irrespective of case sensitive
function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    return (
        row[id] !== undefined ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase()) : true
    );
}

class supplierReturn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            supplierList: [],
            loading: false,
            alertOpen: false,
            open: false,
            returnButtonDisabled: true,
            successAlert: false,
            failAlert: false,
            numberOfRows: 0,
            otherIncomeNextNumber: null,
            productId: '',
            productName: '',
            purchasePrice: '',
            sellingPrice: '',
            marketPrice: '',
            invoiceNum: "",
            amountAvailable: '',
            returnAmount: '0',
            returnUnitPrice: '0',
            receivable: '0',
            cashPaid: '0',
            simpleSelectSupplier: '',
            selectedSupplierName: '',
            selectedDate: Moment(Date()).format("YYYY-MM-DD"),

            //error states
            returnAmountState: '',
            returnUnitPriceState: '',
            cashPaidState: ''
        };
        this.updateState = this.updateState.bind(this);
    }

    componentDidMount() {
        this.getProductDetails();
        this.getSupplierList();
        this.getOtherIncomeNextNumber();
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

    //get products and details in the stock
    getProductDetails = () => {
        const products = [];
        this.setState({ loading: true });

        Helper.http
            .jsonGet("productDetails")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        productId: data[i].productId,
                        productName: data[i].productName,
                        purchasePrice: data[i].purchasePrice,
                        sellingPrice: data[i].sellingPrice,
                        marketPrice: data[i].marketPrice,
                        amountAvailable: data[i].amountAvailable,
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
                                            productId: data[i].productId,
                                            productName: data[i].productName,
                                            purchasePrice: data[i].purchasePrice,
                                            sellingPrice: data[i].sellingPrice,
                                            marketPrice: data[i].marketPrice,
                                            amountAvailable: data[i].amountAvailable,
                                        })
                                    }}
                                    color="warning"
                                    className="edit"
                                >
                                    <Dvr />
                                </Button>{" "}
                            </div>
                        )
                    };
                    products.push(_data);
                }
                this.setState({ products });
                this.setState({ loading: false });
            })
            .catch(exception => {
                if (exception) {
                    this.setState({
                        alertOpen: true,
                        alertDiscription: "Please Check your connection",
                    });
                    this.setState({ loading: false });
                }
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

    //calculate the amount of cash will reeive from the return
    calculateClick = () => {
        let x = Number(this.state.returnAmount)*Number(this.state.returnUnitPrice);
        if(this.state.simpleSelectSupplier === ''){
            this.setState({
                alertOpen: true,
                alertDiscription: "You have to Select the paticular supplier"
            });
        }else {
            if (x <= 0) {
                this.setState({
                    alertOpen: true,
                    alertDiscription: "You have to fill up the neccessary fileds"
                });
            } else {
                this.setState({
                    receivable: x,
                    returnButtonDisabled: false
                });
                console.log('receivable amount', this.state.receivable);
                const element = document.getElementById("returnBtn");
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    //get the next other income ID number after the last other income generated
    getOtherIncomeNextNumber = () => {
        Helper.http
            .jsonGet("otherIncomeNextNumber")
            .then(response => {
                this.setState({ otherIncomeNextNumber: response.data });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //return button click funtion to add return details to the database
    returnBtnClick = () => {
        Helper.http
            .jsonPost("addOtherIncome", {
                date: this.state.selectedDate,
                otherIncomeId: this.state.otherIncomeNextNumber,
                details: "Return to "+this.state.selectedSupplierName,
                cashPaid: this.state.cashPaid,
                balance: this.state.receivable - this.state.cashPaid,
                totalBill: this.state.receivable,
            })
            .then(response => {
                this.setState({
                    successAlert: true,
                    succesAlertMsg: "Successfully returned '" + this.state.returnAmount + "' " + this.state.productName
                });
                if (this.state.cashPaid !== "0") {
                    Helper.http
                        .jsonPost("addCashReceivedFromOtherIncome", {
                            otherIncomeId: this.state.otherIncomeNextNumber,
                            date: this.state.selectedDate,
                            cashPaid: this.state.cashPaid,
                        })
                        .then(response => {
                            console.log('added cash received from other income');
                        })
                        .catch(exception => {
                            console.log(exception);
                        });
                }

            })
            .catch(exception => {
                console.log(exception);
                this.setState({
                    failAlert: true,
                    failedAlertMsg: "Return transaction unsuccessful",
                });
            });
    }

    //close the popup form
    handleClose = () => {
        this.setState({
            open: false,
            returnButtonDisabled: true,
            productName: '',
            amountAvailable: '',
            returnAmount: '0',
            returnUnitPrice: '0',
            receivable: '0',
            cashPaid: '0',
            selectedSupplierName: '',
            simpleSelectSupplier: '',
            returnAmountState: '',
            returnUnitPriceState: '',
            cashPaidState: ''
        });
    };

    //alert dialog box close
    alertClose = () => {
        this.setState({ alertOpen: false });
    };

    //success message sweet alert hide function
    hideAlert_success = () => {
        this.setState({
            successAlert: false,
            succesAlertMsg: "",
            failedAlertMsg: "",
        });
        this.handleClose();
        this.getProductDetails();
        this.getSupplierList();
        this.getOtherIncomeNextNumber();
    };

    //failed message sweet alert hide function
    hideAlert_fail = () => {
        this.setState({
            failAlert: false
        });
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
            case "numberValidation":
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

                {/* return items dialog box */}
                <Dialog
                    open={this.state.open}
                    aria-labelledby="form-dialog-title">
                    <Button
                        justIcon
                        round
                        simple
                        onClick={this.handleClose}
                        color="danger"
                        className={classes.formCloseIcon}
                    >
                        <Close />
                    </Button>
                    <br />
                    <Card className={classes.cardSize}>
                        <CardHeader color="info" icon>
                            <CardIcon color="info">
                                <LocalMall />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Return Details - <small>{this.state.productName}</small></h4>
                        </CardHeader>
                        <CardBody>
                            <form>
                                <InputLabel className={classes.label}>Date</InputLabel>
                                <br />
                                <FormControl >
                                    <Datetime
                                        timeFormat={false}
                                        dateFormat="YYYY-MM-DD"
                                        defaultValue={Moment(Date()).format("YYYY-MM-DD")}
                                        onChange={this.updateState}
                                    />
                                </FormControl>
                                <FormControl
                                    fullWidth
                                    className={classes.selectFormControl}
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
                                <CustomInput
                                    disabled
                                    labelText="Amount Available"
                                    id="amountAvailable"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    value={this.state.amountAvailable.toString()}
                                />
                                <CustomInput
                                    success={this.state.returnAmountState === "success"}
                                    error={this.state.returnAmountState === "error"}
                                    labelText="Return Amount *"
                                    id="returnAmount"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event =>
                                            this.change(event, "returnAmount", "max-value", this.state.amountAvailable),
                                        type: "number"
                                    }}
                                    onChange={(event) => this.setState({ returnAmount: event.target.value })}
                                    defaultValue= {this.state.returnAmount.toString()}
                                />
                                <CustomInput
                                    success={this.state.returnUnitPriceState === "success"}
                                    error={this.state.returnUnitPriceState === "error"}
                                    labelText="Return Unit Price *"
                                    id="returnUnitPrice"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event =>
                                            this.change(event, "returnUnitPrice", "numberValidation"),
                                        type: "number"
                                    }}
                                    onChange={(event) => this.setState({ returnUnitPrice: event.target.value })}
                                    defaultValue={this.state.returnUnitPrice.toString() + ".00"}
                                />
                                <Button
                                    size='sm'
                                    color="info"
                                    onClick={this.calculateClick}
                                    className={classes.addButton}
                                >
                                    Calculate
                                    </Button>
                                <CustomInput
                                    labelText="Cash Receivable"
                                    id="cashReceivable"
                                    disabled
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    value={this.state.receivable.toString() + ".00"}
                                />
                                <CustomInput
                                    success={this.state.cashPaidState === "success"}
                                    error={this.state.cashPaidState === "error"}
                                    disabled={this.state.returnButtonDisabled}
                                    labelText="Cash Received *"
                                    id="cashPaid"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event =>
                                            this.change(event, "cashPaid", "numberValidation"),
                                        type: "number"
                                    }}
                                    onChange={(event) => this.setState({ cashPaid: event.target.value })}
                                    defaultValue={this.state.cashPaid.toString() + ".00"}
                                />
                                <div>
                                    <Button
                                        id='returnBtn'
                                        disabled={this.state.returnButtonDisabled}
                                        size='sm'
                                        color="info"
                                        onClick={this.returnBtnClick}
                                        className={classes.addButton}
                                    >
                                        Return
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </Dialog>

                {/* alert dialog box */}
                <Dialog
                    open={this.state.alertOpen}
                    onClose={this.alertClose}
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
                        <Button onClick={this.alertClose} color="info" autoFocus simple> Got it! </Button>
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

                {/* fail alert */}
                <SweetAlert
                    show={this.state.failAlert}
                    danger
                    style={{ display: "block", marginTop: "-150px" }}
                    title="Failed!"
                    onConfirm={() => this.hideAlert_fail()}
                    onCancel={() => this.hideAlert_fail()}
                    confirmBtnCssClass={
                        this.props.classes.button + " " + this.props.classes.danger
                    }
                >
                    {this.state.failedAlertMsg}
                </SweetAlert>

                <GridContainer>
                    <GridItem xs={12}>
                        <Card>
                            <CardHeader color="primary" icon>
                                <CardIcon color="primary">
                                    <Assignment />
                                </CardIcon>
                                <h4 className={classes.cardIconTitle}>Available Stocks</h4>
                            </CardHeader>
                            <CardBody>
                                <ReactTable
                                    loading = {this.state.loading}
                                    data={this.state.products}
                                    filterable
                                    nextText='next>>'
                                    previousText='<<previous'
                                    defaultFilterMethod={filterCaseInsensitive}
                                    defaultSorted={[
                                        {
                                            id: "productId"
                                        }
                                    ]}
                                    columns={[
                                        {
                                            Header: () => (
                                                <strong>ID</strong>),
                                            accessor: "productId",
                                            filterable: false,
                                            width: 80
                                        },
                                        {
                                            Header: () => (
                                                <strong>Product Name</strong>),
                                            accessor: "productName",
                                            width: 250
                                        },
                                        {
                                            Header: () => (
                                                <strong>Purchase Price</strong>),
                                            accessor: "purchasePrice",
                                            Cell: row => <div className="actions-right">{row.value}</div>
                                        },
                                        {
                                            Header: () => (
                                                <strong>Selling Price</strong>),
                                            accessor: "sellingPrice",
                                            Cell: row => <div className="actions-right">{row.value}</div>
                                        },
                                        {
                                            Header: () => (
                                                <strong>Market Price</strong>),
                                            accessor: "marketPrice",
                                            Cell: row => <div className="actions-right">{row.value}</div>
                                        },
                                        {
                                            Header: () => (
                                                <strong>Stock</strong>),
                                            accessor: "amountAvailable",
                                            filterable: false,
                                            width: 80,
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
                                    defaultPageSize={10}
                                    showPaginationTop
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

export default withStyles(styles)(supplierReturn);