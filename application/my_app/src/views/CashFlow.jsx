import React from 'react';

// react component for creating dynamic tables
import ReactTable from "react-table";
import Helper from '../utils/Helper';
import LoadingOverlay from 'react-loading-overlay';
import ReactSearchBox from 'react-search-box'
import Datetime from "react-datetime";
import Moment from "moment";


// @material-ui/core components
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from '@material-ui/core/Dialog';
// @material-ui/icons
import Search from "@material-ui/icons/Search";
import Airplay from "@material-ui/icons/TabletMac";
import Info from "@material-ui/icons/Info";
import LocationOn from "@material-ui/icons/LocationOn";
import Gavel from "@material-ui/icons/Gavel";
import HelpOutline from "@material-ui/icons/HelpOutline";

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
    alignright: {
        marginTop: "10px",
        marginBottom: "0px",
        textAlign: "Right"
    },
    searchButton: {
        paddingRight: "8%",
    },
    searchByDateButton: {
        paddingLeft: "10%",
        paddingRight: "10%",
    },
    viewCfButtons: {
        marginLeft: "20%",
        width: "150px"
    },
    viewPurchaseDetailsButton: {
        marginLeft: "20%",
    },
    cardSize: {
        width: "350px"
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

class CashFlow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cashReceivedDetails: [],
            loading: false,
            customerTableLoading: false,
            cumCashReceived: '0',
            cumCashPaid: '0',
            cumExpenses: '0',
            cumSalary: "0",
            CfBtn: "todayCF",
            selectedToDate: Moment(Date()).format("YYYY-MM-DD"),
            selectedFromDate: Moment(Date()).format("YYYY-MM-DD"),
            CfHistoryCaption: '',
            CfSummaryCaption: ''
        };
        this.updateToDate = this.updateToDate.bind(this);
        this.updateFromDate = this.updateFromDate.bind(this);
    }

    componentDidMount() {
        this.getTodayCashReceivedInvoiceDetails();
    }

    //get the selected 'TO' date from the calender and convert it to YYYY-MM-DD format
    updateToDate(date) {
        var dateStringTo = date._d;
        var dateObjTo = new Date(dateStringTo);
        var momentObjTo = Moment(dateObjTo);
        var momentStringTo = momentObjTo.format('YYYY-MM-DD');
        this.setState({ selectedToDate: momentStringTo });
    }

    //get the selected 'FROM' date from the calender and convert it to YYYY-MM-DD format
    updateFromDate(date) {
        var dateString = date._d;
        var dateObj = new Date(dateString);
        var momentObj = Moment(dateObj);
        var momentString = momentObj.format('YYYY-MM-DD');
        this.setState({ selectedFromDate: momentString });
    }

    //get today cash received from sales details
    getAllCashReceivedInvoiceDetails = () => {
        const cashReceivedDetails = [];
        this.setState({
            loading: true,
            CfHistoryCaption: "From all Cash Flow history details",
            CfSummaryCaption: "From all Cash Flow history details",
        });

        Helper.http
            .jsonGet("getAllCashReceivedInvoiceDetails")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        invoiceNum: data[i].invoiceNum,
                        customerName: data[i].customerName,
                        date: data[i].date,
                        cashPaid: data[i].cashPaid
                    };
                    cashReceivedDetails.push(_data);
                }
                this.setState({ cashReceivedDetails });
                this.setState({
                    loading: false,
                    numberOfRows: data.length,
                    cumCashReceived: response.cumCashReceived
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };


    //get today cash received from sales details
    getTodayCashReceivedInvoiceDetails = () => {
        const cashReceivedDetails = [];
        this.setState({
            loading: true,
            CfHistoryCaption: "From today's (" + Moment(Date()).format("YYYY-MM-DD") + ") Cash Flow history details",
            CfSummaryCaption: "From today's (" + Moment(Date()).format("YYYY-MM-DD") + ") Cash Flow history details",
        });

        Helper.http
            .jsonGet("getTodayCashReceivedInvoiceDetails")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        invoiceNum: data[i].invoiceNum,
                        customerName: data[i].customerName,
                        date: data[i].date,
                        cashPaid: data[i].cashPaid
                    };
                    cashReceivedDetails.push(_data);
                }
                this.setState({ cashReceivedDetails });
                this.setState({
                    loading: false,
                    numberOfRows: data.length,
                    cumCashReceived: response.cumCashReceived
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //today cash flow button click function
    todayCfBtnClick = () => {
        this.setState({
            CfBtn: 'todayCF',
        });
        this.getTodayCashReceivedInvoiceDetails();
    }

    //all cash flow button click function
    allCfBtnClick = () => {
        this.setState({
            CfBtn: 'allCF',
        });
        this.getAllCashReceivedInvoiceDetails();
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                        <Card>
                            <CardHeader color="primary" icon>
                                <CardIcon color="primary">
                                    <Search />
                                </CardIcon>
                                <h4 className={classes.cardIconTitle}>Filter By</h4>
                            </CardHeader>
                            <br />
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <Button
                                            simple={this.state.CfBtn === 'allCF' || this.state.CfBtn === ''}
                                            size='sm'
                                            round
                                            color="twitter"
                                            className={classes.viewCfButtons}
                                            onClick={this.todayCfBtnClick}> Today Cash Flow
                                            </Button>
                                        <Button
                                            simple={this.state.CfBtn === 'todayCF' || this.state.CfBtn === ''}
                                            size='sm'
                                            round
                                            color="twitter"
                                            className={classes.viewCfButtons}
                                            onClick={this.allCfBtnClick}> All Cash Flow
                                            </Button>
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
                                                        onChange={this.updateFromDate}
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
                                                        onChange={this.updateToDate}
                                                    />
                                                </FormControl>
                                                <Button
                                                    // disabled={this.state.selectedCustomerId !== '' || this.state.typingInvoice !== ''}
                                                    size='sm'
                                                    color="success"
                                                    className={classes.searchByDateButton}
                                                    onClick={this.searchBetweenTimePeriod}>
                                                    Search
                                                    </Button>
                                            </CardBody>
                                        </GridItem>
                                    </GridContainer>
                                </GridItem>
                            </GridContainer>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                        <Card>
                            <CardHeader color="primary" icon>
                                <CardIcon color="primary">
                                    <Airplay />
                                </CardIcon>
                                <h4 className={classes.cardIconTitle}>Cash Flow Summary - <small>{this.state.CfSummaryCaption}</small></h4>
                            </CardHeader>
                            <LoadingOverlay
                                active={this.state.loading}
                                spinner
                                text='Loading...'
                            >
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <CardBody>
                                            <h4>Cash Received From Sales</h4>
                                            <h4>Cash Paid to Suppliers (-)</h4>
                                            <h4>Expenses (-)</h4>
                                            <h4>Salary (-)</h4>
                                            <br />
                                            <h4>Net Cash In Flow</h4>
                                        </CardBody>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <CardBody>
                                            <h4 className={classes.alignright}><small>{parseInt(this.state.cumCashReceived, 10).toLocaleString() + ".00"}</small></h4>
                                            <h4 className={classes.alignright}><small>{parseInt(this.state.cumCashPaid, 10).toLocaleString() + ".00"}</small></h4>
                                            <h4 className={classes.alignright}><small>{parseInt(this.state.cumExpenses, 10).toLocaleString() + ".00"}</small></h4>
                                            <h4 className={classes.alignright}><small>{parseInt(this.state.cumSalary, 10).toLocaleString() + ".00"}</small></h4>
                                            <br />
                                            <h4 className={classes.alignright}><small>{parseInt((this.state.cumCashReceived - this.state.cumCashPaid - this.state.cumExpenses - this.state.cumSalary), 10).toLocaleString() + ".00"}</small></h4>
                                        </CardBody>
                                    </GridItem>
                                </GridContainer>
                            </LoadingOverlay>
                        </Card>
                    </GridItem>
                </GridContainer>
                <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={8}>
                        <br />
                        <NavPills
                            color="info"
                            alignCenter
                            tabs={[
                                {
                                    tabButton: "Cash Reecived",
                                    tabIcon: Info,
                                    tabContent: (
                                        <Card>
                                            <LoadingOverlay
                                                active={this.state.loading}
                                                spinner
                                                text='Loading...'
                                            >
                                            <CardHeader>
                                                <h4 className={classes.cardTitle}>
                                                        Cash Received from Sales - <small>{this.state.CfHistoryCaption}</small>
                                                </h4>
                                            </CardHeader>
                                            <CardBody>
                                                <ReactTable
                                                    data={this.state.cashReceivedDetails}
                                                    filterable={false}
                                                    sortable={false}
                                                    showPagination={false}
                                                    defaultSorted={[
                                                        {
                                                            id: "date",
                                                            desc: true
                                                        }
                                                    ]}
                                                    columns={[
                                                        {
                                                            Header: () => (
                                                                <div className="actions-center"><strong>Date</strong></div>),
                                                            accessor: "date",
                                                            width: 150,
                                                            Cell: row => <div className="actions-center">{row.value}</div>
                                                        },
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
                                                                <div className="actions-right"><strong>Amount</strong></div>),
                                                            accessor: "cashPaid",
                                                            width: 120,
                                                            Cell: row => <div className="actions-right">{row.value}</div>
                                                        }
                                                    ]}
                                                    className="-striped -highlight"
                                                    pageSize={this.state.numberOfRows}
                                                />
                                            </CardBody>
                                            </LoadingOverlay>
                                        </Card>
                                    )
                                },
                                {
                                    tabButton: "Cash Paid",
                                    tabIcon: LocationOn,
                                    tabContent: (
                                        <Card>
                                            <CardHeader>
                                                <h4 className={classes.cardTitle}>
                                                    Location of the product
                        </h4>
                                                <p className={classes.cardCategory}>
                                                    More information here
                        </p>
                                            </CardHeader>
                                            <CardBody>
                                                Efficiently unleash cross-media information without
                                                cross-media value. Quickly maximize timely deliverables
                                                for real-time schemas.
                        <br />
                                                <br />
                                                Dramatically maintain clicks-and-mortar solutions
                                                without functional solutions.
                      </CardBody>
                                        </Card>
                                    )
                                },
                                {
                                    tabButton: "Expenses",
                                    tabIcon: Gavel,
                                    tabContent: (
                                        <Card>
                                            <CardHeader>
                                                <h4 className={classes.cardTitle}>
                                                    Legal info of the product
                        </h4>
                                                <p className={classes.cardCategory}>
                                                    More information here
                        </p>
                                            </CardHeader>
                                            <CardBody>
                                                Completely synergize resource taxing relationships via
                                                premier niche markets. Professionally cultivate
                                                one-to-one customer service with robust ideas.
                        <br />
                                                <br />
                                                Dynamically innovate resource-leveling customer service
                                                for state of the art customer service.
                      </CardBody>
                                        </Card>
                                    )
                                },
                                {
                                    tabButton: "Salary",
                                    tabIcon: HelpOutline,
                                    tabContent: (
                                        <Card>
                                            <CardHeader>
                                                <h4 className={classes.cardTitle}>Help center</h4>
                                                <p className={classes.cardCategory}>
                                                    More information here
                        </p>
                                            </CardHeader>
                                            <CardBody>
                                                From the seamless transition of glass and metal to the
                                                streamlined profile, every detail was carefully
                                                considered to enhance your experience. So while its
                                                display is larger, the phone feels just right.
                        <br />
                                                <br />
                                                Another Text. The first thing you notice when you hold
                                                the phone is how great it feels in your hand. The cover
                                                glass curves down around the sides to meet the anodized
                                                aluminum enclosure in a remarkable, simplified design.
                      </CardBody>
                                        </Card>
                                    )
                                }
                            ]}
                        />
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

export default withStyles(styles)(CashFlow);