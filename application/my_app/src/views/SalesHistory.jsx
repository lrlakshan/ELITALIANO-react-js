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
import MailOutline from "@material-ui/icons/MailOutline";
import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
import Favorite from "@material-ui/icons/Favorite";
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
    ...sweetAlertStyle,
    ...extendedFormsStyle,
};


class SalesHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            salesInvoices: [],
            loading: false,
            open: false,
            numberOfRows: 1,
            formTitle: "",
            invoiceNum: "",
            simpleSelectItem: "",
        };
    }

    componentDidMount() {
        this.getSalesInvoicesDetails();
    }

    //get purhcase invoice details
    getSalesInvoicesDetails = () => {
        const salesInvoices = [];
        this.setState({ loading: true });

        Helper.http
            .jsonGet("getSalesInvoiceDetails")
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
                                            formTitle: "Return Items",
                                            formButtonText: "Save",
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
                    salesInvoices.push(_data);
                }
                this.setState({ salesInvoices });
                this.setState({ 
                    loading: false,
                    numberOfRows: data.length, 
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
                                        <p>wow1</p>
                                    </CardBody>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
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
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <NavPills
                                            color="info"
                                            tabs={[
                                                {
                                                    tabButton: "Customer Name",
                                                    tabContent: (
                                                        <span>
                                                            <ReactSearchBox
                                                                placeholder="Insert Customer Name"
                                                                value={this.state.typingName}
                                                                callback={record => console.log(record)}
                                                                onChange={this.selectByCustomerName}
                                                            />
                                                        </span>
                                                    )
                                                },
                                                {
                                                    tabButton: "Invoice Number",
                                                    tabContent: (
                                                        <span>
                                                            <ReactSearchBox
                                                                placeholder="Insert Invoice Number"
                                                                value={this.state.typingName}
                                                                callback={record => console.log(record)}
                                                                onChange={this.selectByCustomerName}
                                                            />
                                                        </span>
                                                    )
                                                },
                                            ]}
                                        />
                                    </CardBody>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <p>wow2</p>
                                    </CardBody>
                                </GridItem>
                            </GridContainer>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                        <Card>
                            <CardBody>
                                <p>wow3</p>
                            </CardBody>
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