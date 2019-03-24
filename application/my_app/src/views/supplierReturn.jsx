import React from 'react';

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

class supplierReturn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invoices: [],
            loading: false,
            open: false,
        };
    }

    componentDidMount() {
        this.getPurchaseInvoiceDetails();
    }

    //get purhcase invoice details
    getPurchaseInvoiceDetails = () => {
        const invoices = [];
        this.setState({ loading: true });

        Helper.http
            .jsonGet("getInvoiceDetails")
            .then(response => {
                let data = response.data.data;
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
            </div>
        );
    }
}

export default withStyles(styles)(supplierReturn);