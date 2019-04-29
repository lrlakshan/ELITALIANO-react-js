import React from 'react';

// react component for creating dynamic tables
import ReactTable from "react-table";
import Helper from '../utils/Helper';
import LoadingOverlay from 'react-loading-overlay';

// @material-ui/core components
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from '@material-ui/core/Dialog';

// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
import LocalMall from "@material-ui/icons/LocalMall";

// core components
import GridContainer from "../components/Grid/GridContainer.jsx";
import GridItem from "../components/Grid/GridItem.jsx";
import Button from "../components/CustomButtons/Button.jsx";
import Card from "../components/Card/Card.jsx";
import CardBody from "../components/Card/CardBody.jsx";
import CardIcon from "../components/Card/CardIcon.jsx";
import CardHeader from "../components/Card/CardHeader.jsx";

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
    ...sweetAlertStyle,
    ...extendedFormsStyle,
};

class supplierReturn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoices: [],
            items: [],
            loading: false,
            open: false,
            formTitle: "",
            invoiceNum: "",
            simpleSelectItem: ""
        };
    }

    componentDidMount() {
        this.getPurchaseInvoiceDetails();
    }

    //close the popup form
    handleClose = () => {
        this.setState({
            open: false,
        });
    };

    //get purhcase invoice details
    getPurchaseInvoiceDetails = () => {
        const invoices = [];
        this.setState({ loading: true });

        Helper.http
            .jsonGet("getAllPurchasesInvoiceDetails")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        invoiceNum: data[i].invoiceNum,
                        supplierName: data[i].supplierName,
                        date: data[i].date,
                        details: data[i].details,
                        totalBill: data[i].totalBill,
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
                                            formTitle: "Return Items",
                                            formButtonText: "Save",
                                            // invoiceNum: data[i].invoiceNum,
                                        })
                                        this.loadItemsOfSelectedInvoice(data[i].invoiceNum);
                                    }}
                                    color="warning"
                                    className="edit"
                                >
                                    <Dvr />
                                </Button>{" "}
                            </div>
                        )
                    };
                    invoices.push(_data);
                }
                this.setState({ invoices });
                this.setState({ loading: false });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //get the items of the selected invoice number
    loadItemsOfSelectedInvoice = (InvoiceNumber) => {
        const items = [];

        Helper.http
            .jsonPost("getPurchaseListDetails", {
                invoiceNum: InvoiceNumber,
            })
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        id: data[i].id,
                        productId: data[i].productId,
                        productName: data[i].productName,
                        purchasePrice: data[i].purchasePrice,
                        amountPurchases: data[i].amountPurchases,
                    };
                    items.push(_data);
                }
                this.setState({ items });
                this.setState({ loading: false });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    handleSelectedItem = event => {
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
                                <h4 className={classes.cardIconTitle}>Return to Supplier</h4>
                            </CardHeader>
                            <CardBody>
                                <LoadingOverlay
                                    active={this.state.loading}
                                    spinner
                                    text='Loading...'
                                >
                                    <ReactTable
                                        data={this.state.invoices}
                                        filterable= {false}
                                        sortable={false}
                                        showPagination={false}
                                        defaultSorted={[
                                            {
                                                id: "invoiceNum"
                                            }
                                        ]}
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
                                                    <div className="actions-center"><strong>Supplier Name</strong></div>),
                                                accessor: "supplierName",
                                                width: 250,
                                                Cell: row => <div className="actions-center">{row.value}</div>
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
                                                    <div className="actions-center"><strong>Details</strong></div>),
                                                accessor: "details",
                                                width: 250,
                                                Cell: row => <div className="actions-center">{row.value}</div>
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
                                <InputLabel className={classes.label}>Items of Bill</InputLabel>
                                <FormControl
                                    fullWidth
                                    className={classes.selectFormControl}
                                >
                                    <InputLabel
                                        htmlFor="simple-selectSupplier"
                                        className={classes.selectLabel}
                                    >Selcet Return Item</InputLabel>
                                    <Select
                                        MenuProps={{
                                            className: classes.selectMenu
                                        }}
                                        classes={{
                                            select: classes.select
                                        }}
                                        value={this.state.simpleSelectItem}
                                        onChange={this.handleSelectedItem}
                                        inputProps={{
                                            name: "simpleSelectItem",
                                            id: "simple-selectItem"
                                        }}
                                    >
                                        <MenuItem
                                            disabled
                                            classes={{
                                                root: classes.selectMenuItem
                                            }}
                                        >
                                            Select Item
                                        </MenuItem>
                                        {this.state.items.map((product, index) =>
                                            <MenuItem
                                                key={product.productId}
                                                value={product.productId}
                                                classes={{
                                                    root: classes.selectMenuItem,
                                                    selected: classes.selectMenuItemSelected
                                                }}
                                            >
                                                {product.productName}
                                            </MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
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
            </div>
        );
    }
}

export default withStyles(styles)(supplierReturn);