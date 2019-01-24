import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";
import Helper from '../utils/Helper';
import LoadingOverlay from 'react-loading-overlay';

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
    }
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
            productIdState: "",
            productNameState: "",
            purchasePriceState: "",
            sellingPriceState: "",
            marketPriceState: "",

            // register form
            registerEmail: "",
            registerEmailState: "",
            registerPassword: "",
            registerPasswordState: "",
            registerConfirmPassword: "",
            registerConfirmPasswordState: "",
            registerCheckbox: false,
            registerCheckboxState: "",
            // type validation
            required: "",
            requiredState: "",
            typeEmail: "",
            typeEmailState: "",
            number: "",
            numberState: "",
            url: "",
            urlState: "",
            equalTo: "",
            whichEqualTo: "",
            equalToState: "",
            // range validation
            minLength: "",
            minLengthState: "",
            maxLength: "",
            maxLengthState: "",
            range: "",
            rangeState: "",
            minValue: "",
            minValueState: "",
            maxValue: "",
            maxValueState: ""
        };
        this.registerClick = this.registerClick.bind(this);
        this.loginClick = this.loginClick.bind(this);
        this.typeClick = this.typeClick.bind(this);
        this.rangeClick = this.rangeClick.bind(this);
    }
    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
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
                        amountAvailable: data[i].amountAvailable,
                        actions: (
                            // we've added some custom button actions
                            <div className="actions-right">
                                {/* use this button to add a like kind of action */}
                                <Button
                                    justIcon
                                    round
                                    simple
                                    // onClick={() => {
                                    //     let obj = this.state.data.find(o => o.id === key);
                                    //     alert(
                                    //         "You've clicked LIKE button on \n{ \nName: " +
                                    //         obj.name +
                                    //         ", \nposition: " +
                                    //         obj.position +
                                    //         ", \noffice: " +
                                    //         obj.office +
                                    //         ", \nage: " +
                                    //         obj.age +
                                    //         "\n}."
                                    //     );
                                    // }}
                                    color="info"
                                    className="like"
                                >
                                    <Favorite />
                                </Button>{" "}
                                {/* use this button to add a edit kind of action */}
                                <Button
                                    justIcon
                                    round
                                    simple
                                    // onClick={() => {
                                    //     let obj = this.state.data.find(o => o.id === key);
                                    //     alert(
                                    //         "You've clicked EDIT button on \n{ \nName: " +
                                    //         obj.name +
                                    //         ", \nposition: " +
                                    //         obj.position +
                                    //         ", \noffice: " +
                                    //         obj.office +
                                    //         ", \nage: " +
                                    //         obj.age +
                                    //         "\n}."
                                    //     );
                                    // }}
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
                                        var data = this.state.data;
                                        // data.find((o, i) => {
                                        //     if (o.id === key) {
                                        //         // here you should add some custom code so you can delete the data
                                        //         // from this component and from your server as well
                                        //         data.splice(i, 1);
                                        //         return true;
                                        //     }
                                        //     return false;
                                        // });
                                        this.setState({ data: data });
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
    registerClick() {
        if (this.state.productIdState === "") {
            this.setState({ productIdState: "error" });
        }
        if (this.state.productNameState === "") {
            this.setState({ productNameState: "error" });
        }
        if (this.state.purchasePriceState === "") {
            this.setState({ purchasePriceState: "error" });
        }
        if (this.state.sellingPriceState === "") {
            this.setState({ sellingPriceState: "error" });
        }
        if (this.state.marketPriceState === "") {
            this.setState({ marketPriceState: "error" });
        }
    }
    loginClick() {
        if (this.state.loginEmailState === "") {
            this.setState({ loginEmailState: "error" });
        }
        if (this.state.loginPasswordState === "") {
            this.setState({ loginPasswordState: "error" });
        }
    }
    typeClick() {
        if (this.state.requiredState === "") {
            this.setState({ requiredState: "error" });
        }
        if (this.state.typeEmailState === "") {
            this.setState({ typeEmailState: "error" });
        }
        if (this.state.numberState === "") {
            this.setState({ numberState: "error" });
        }
        if (this.state.urlState === "") {
            this.setState({ urlState: "error" });
        }
        if (this.state.equalToState === "") {
            this.setState({ equalToState: "error" });
        }
    }
    rangeClick() {
        if (this.state.minLengthState === "") {
            this.setState({ minLengthState: "error" });
        }
        if (this.state.maxLengthState === "") {
            this.setState({ maxLengthState: "error" });
        }
        if (this.state.rangeState === "") {
            this.setState({ rangeState: "error" });
        }
        if (this.state.minValueState === "") {
            this.setState({ minValueState: "error" });
        }
        if (this.state.maxValueState === "") {
            this.setState({ maxValueState: "error" });
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
                                        defaultFilterMethod={filterCaseInsensitive}
                                        columns={[
                                            {
                                                Header: "ID",
                                                accessor: "productId",
                                                filterable: false,
                                                width: 100
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
                                                Header: "Stock",
                                                accessor: "amountAvailable",
                                                filterable: false,
                                                width: 100
                                            },
                                            {
                                                Header: "Actions",
                                                accessor: "actions",
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
                                <MailOutline />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Add New Products</h4>
                        </CardHeader>
                        <CardBody>
                            <form>
                                <CustomInput
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
                                />
                                <div>
                                    <Button
                                        size='sm'
                                        color="info"
                                        onClick={this.registerClick}
                                        className={classes.addButton}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size='sm'
                                        color="info"
                                        onClick={this.registerClick}
                                        className={classes.addButton}
                                    >
                                        Add
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(viewStock);
