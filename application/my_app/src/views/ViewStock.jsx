import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";
import Helper from '../utils/Helper';
import LoadingOverlay from 'react-loading-overlay';
import SweetAlert from "react-bootstrap-sweetalert";


// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from "@material-ui/core/InputAdornment";
// @material-ui/icons
import MailOutline from "@material-ui/icons/MailOutline";
import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
import Favorite from "@material-ui/icons/Favorite";
import Close from "@material-ui/icons/Close";
import AddCircle from "@material-ui/icons/AddCircle";
import LocalMall from "@material-ui/icons/LocalMall";
// core components
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
    cardSize: {
        width: "350px"
    },
    addButton: {
        float: "right"
    },
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

class viewStock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            loading: false,
            open: false,
            successAlert: false,
            failAlert: false,
            formTitle: "",
            formIcon: null,
            formButtonText: "",
            succesAlertMsg: "",
            failedAlertMsg: "",
            deleteAlert: false,
            deleteAlertSuccess: false,

            //input states
            productIdState: "",
            productNameState: "",
            purchasePriceState: "",
            sellingPriceState: "",
            marketPriceState: "",

            //input values
            productId: "",
            productName: "",
            purchasePrice: "",
            sellingPrice: "",
            marketPrice: "",
        };
        this.addNewClick = this.addNewClick.bind(this);
    }
    handleClickOpen = () => {
        this.setState({
            open: true,
            formTitle: "Add new products",
            formButtonText: "Add"
        });
    };

    hideAlert_success = () => {
        this.setState({
            successAlert: false,
            succesAlertMsg: "",
            failedAlertMsg: "",
        });
        this.handleClose();
        this.getProductDetails();
    };

    hideAlert_fail = () => {
        this.setState({
            failAlert: false
        });
    };

    Alert_delete_success_close = () => {
        this.setState({
            deleteAlertSuccess: false,
            productId: ""
        });
    };

    hideAlert_delete = () => {
        this.setState({
            deleteAlert: false,
            productId: ""
        });
    };

    hideAlert_delete_success = () => {
        Helper.http
            .jsonPost("deleteProducts", {
                productId: this.state.productId
            })
            .then(response => {
                this.setState({
                    deleteAlertSuccess: true,
                    productId: "",
                    deleteAlert: false
                });
                this.getProductDetails();
            })
            .catch(exception => {
                console.log(exception);
                this.setState({
                    failAlert: true,
                    deleteAlert: false,
                    failedAlertMsg: "Cannot complete this delete",
                    productId: ""
                });
            });

    };

    handleClose = () => {
        this.setState({
            open: false,
            productIdState: "",
            productNameState: "",
            purchasePriceState: "",
            sellingPriceState: "",
            marketPriceState: "",
            productId: "",
            productName: "",
            purchasePrice: "",
            sellingPrice: "",
            marketPrice: "",
        });
    };

    componentDidMount() {
        this.getProductDetails();
    }

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
                                            formTitle: "Edit Products",
                                            formButtonText: "Edit",
                                            productId: data[i].productId,
                                            productName: data[i].productName,
                                            purchasePrice: data[i].purchasePrice,
                                            sellingPrice: data[i].sellingPrice,
                                            marketPrice: data[i].marketPrice,
                                        })
                                    }}
                                    color="warning"
                                    className="edit"
                                >
                                    <Dvr />
                                </Button>{" "}
                                {/* use this button to remove the data row */}
                                <Button
                                    justIcon
                                    round
                                    simple
                                    onClick={() => {
                                        this.setState({
                                            deleteAlert: true,
                                            productId: data[i].productId,
                                        });
                                    }}
                                    color="danger"
                                    className="remove"
                                >
                                    <Close />
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
                console.log(exception);
            });
    };



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
    addNewClick() {
        if (this.state.productId === "") {
            this.setState({ productIdState: "error" });
        }
        if (this.state.productName === "") {
            this.setState({ productNameState: "error" });
        }
        if (this.state.purchasePrice === "") {
            this.setState({ purchasePriceState: "error" });
        }
        if (this.state.sellingPrice === "") {
            this.setState({ sellingPriceState: "error" });
        }
        if (this.state.marketPrice === "") {
            this.setState({ marketPriceState: "error" });
        }
        if (this.state.productId !== "" && this.state.marketPrice !== "" && this.state.sellingPrice !== "" && this.state.purchasePrice !== "" && this.state.productName !== "") {
            if (this.state.formTitle === 'Add new products') {
                Helper.http
                    .jsonPost("addProducts", {
                        productId: this.state.productId,
                        productName: this.state.productName,
                        purchasePrice: this.state.purchasePrice,
                        sellingPrice: this.state.sellingPrice,
                        marketPrice: this.state.marketPrice,
                    })
                    .then(response => {
                        this.setState({
                            successAlert: true,
                            succesAlertMsg: "New product added Successfully"
                        });

                    })
                    .catch(exception => {
                        console.log(exception);
                        this.setState({
                            failAlert: true,
                            failedAlertMsg: "Dupplicate entry of Product ID",
                        });
                    });
            }
            if (this.state.formTitle === 'Edit Products') {
                Helper.http
                    .jsonPost("updateProducts", {
                        productId: this.state.productId,
                        productName: this.state.productName,
                        purchasePrice: this.state.purchasePrice,
                        sellingPrice: this.state.sellingPrice,
                        marketPrice: this.state.marketPrice,
                    })
                    .then(response => {
                        this.setState({
                            successAlert: true,
                            succesAlertMsg: "Product details edited successfully"
                        });

                    })
                    .catch(exception => {
                        console.log(exception);
                        this.setState({
                            failAlert: true,
                            failedAlertMsg: "You cannot change the Product ID"
                        });
                    });
            }

        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <GridContainer>
                    <GridItem xs={12}>
                        <Card>
                            <CardHeader color="primary" icon>
                                <CardIcon color="primary">
                                    <Assignment />
                                </CardIcon>
                                <h4 className={classes.cardIconTitle}>Available Stocks</h4>
                            </CardHeader>
                            <Button color="info" className={classes.marginLeft} onClick={this.handleClickOpen}>
                                <AddCircle className={classes.icons} /> Add New
                            </Button>
                            <CardBody>
                                <LoadingOverlay
                                    active={this.state.loading}
                                    spinner
                                    text='Loading...'
                                >
                                    <ReactTable
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
                                                Header: "ID",
                                                accessor: "productId",
                                                filterable: false,
                                                width: 70
                                            },
                                            {
                                                Header: "Product Name",
                                                accessor: "productName",
                                                width: 250
                                            },
                                            {
                                                Header: "Purchase Price",
                                                accessor: "purchasePrice"
                                            },
                                            {
                                                Header: "Selling Price",
                                                accessor: "sellingPrice"
                                            },
                                            {
                                                Header: "Market Price",
                                                accessor: "marketPrice"
                                            },
                                            {
                                                Header: "Stock",
                                                accessor: "amountAvailable",
                                                filterable: false,
                                                width: 70
                                            },
                                            {
                                                Header: "Actions",
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
                                </LoadingOverlay>
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title">
                    <Card className={classes.cardSize}>
                        <CardHeader color="info" icon>
                            <CardIcon color="info">
                                <LocalMall />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>{this.state.formTitle}</h4>
                        </CardHeader>
                        <CardBody>
                            <form>
                                <CustomInput
                                    disabled={this.state.formTitle === "Add new products" ? false : true}
                                    success={this.state.productIdState === "success"}
                                    error={this.state.productIdState === "error"}
                                    labelText="Product ID *"
                                    id="productId"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event =>
                                            this.change(event, "productId", "length", 1),
                                        type: "number"
                                    }}
                                    onChange={(event) => this.setState({ productId: event.target.value })}
                                    defaultValue={this.state.productId.toString()}
                                />
                                <CustomInput
                                    success={this.state.productNameState === "success"}
                                    error={this.state.productNameState === "error"}
                                    labelText="Product Name *"
                                    id="productName"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event =>
                                            this.change(event, "productName", "length", 1),
                                        type: "text"
                                    }}
                                    onChange={(event) => this.setState({ productName: event.target.value })}
                                    defaultValue={this.state.productName}
                                />
                                <CustomInput
                                    success={this.state.purchasePriceState === "success"}
                                    error={this.state.purchasePriceState === "error"}
                                    labelText="Purchase Price *"
                                    id="purchasePrice"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event =>
                                            this.change(event, "purchasePrice", "length", 1),
                                        type: "number"
                                    }}
                                    onChange={(event) => this.setState({ purchasePrice: event.target.value })}
                                    defaultValue={this.state.purchasePrice.toString()}
                                />
                                <CustomInput
                                    success={this.state.sellingPriceState === "success"}
                                    error={this.state.sellingPriceState === "error"}
                                    labelText="Selling Price *"
                                    id="sellingPrice"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event =>
                                            this.change(event, "sellingPrice", "length", 1),
                                        type: "number"
                                    }}
                                    onChange={(event) => this.setState({ sellingPrice: event.target.value })}
                                    defaultValue={this.state.sellingPrice.toString()}
                                />
                                <CustomInput
                                    success={this.state.marketPriceState === "success"}
                                    error={this.state.marketPriceState === "error"}
                                    labelText="Market Price *"
                                    id="marketPrice"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event =>
                                            this.change(event, "marketPrice", "length", 1),
                                        type: "number"
                                    }}
                                    onChange={(event) => this.setState({ marketPrice: event.target.value })}
                                    defaultValue={this.state.marketPrice.toString()}
                                />
                                <div>
                                    <Button
                                        size='sm'
                                        color="info"
                                        onClick={this.handleClose}
                                        className={classes.addButton}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size='sm'
                                        color="info"
                                        onClick={this.addNewClick}
                                        className={classes.addButton}
                                    >
                                        {this.state.formButtonText}
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </Dialog>
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
                <SweetAlert
                    show={this.state.deleteAlert}
                    warning
                    style={{ display: "block", marginTop: "-150px" }}
                    title="Are you sure?"
                    onConfirm={() => this.hideAlert_delete_success()}
                    onCancel={() => this.hideAlert_delete()}
                    confirmBtnCssClass={
                        this.props.classes.button + " " + this.props.classes.success
                    }
                    cancelBtnCssClass={
                        this.props.classes.button + " " + this.props.classes.danger
                    }
                    confirmBtnText="Yes, delete it!"
                    cancelBtnText="Cancel"
                    showCancel
                >
                    You will not be able to recover this data!
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
                    Product has been deleted.
        </SweetAlert>
            </div>
        );
    }
}

export default withStyles(styles)(viewStock);
