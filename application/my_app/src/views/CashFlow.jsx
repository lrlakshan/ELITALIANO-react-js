import React from 'react';

// react component for creating dynamic tables
import ReactTable from "react-table";
import Helper from '../utils/Helper';
import LoadingOverlay from 'react-loading-overlay';
import Datetime from "react-datetime";
import Moment from "moment";


// @material-ui/core components
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import Search from "@material-ui/icons/Search";
import Airplay from "@material-ui/icons/TabletMac";
import cashReceivedIcon from "@material-ui/icons/VerticalAlignBottom";
import cashPaidIcon from "@material-ui/icons/VerticalAlignTop";
import expenseIcon from "@material-ui/icons/MoneyOff";
import salaryIcon from "@material-ui/icons/MonetizationOn";

// core components
import NavPills from "../components/NavPills/NavPills.jsx";
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
    alignright: {
        marginTop: "10px",
        marginBottom: "0px",
        textAlign: "Right"
    },
    searchByDateButton: {
        paddingLeft: "10%",
        paddingRight: "10%",
    },
    viewCfButtons: {
        marginLeft: "20%",
        width: "150px"
    },
    ...sweetAlertStyle,
    ...extendedFormsStyle,
};

class CashFlow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cashReceivedDetails: [],
            cashPaidDetails: [],
            expenseDetails: [],
            salaryDetails: [],
            otherIncomeReceivedDetails: [],
            cashReceivedTableLoading: false,    //this loading state is common for all types of cash flow summary grid
            otherIncomeReceivedTableLoading: false,
            cashPaidLoading: false,
            expenseLoading: false,
            salaryLoading: false,
            customerTableLoading: false,
            CRnumberOfRows: 0,
            CPnumberOfRows: 0,
            ExnumberOfRows: 0,
            SalnumberOfRows: 0,
            OInumberOfRows:0,
            cumCashReceived: '0',
            cumOtherIncomeReceived: '0',
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
        this.todayCfBtnClick();
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

//------------------------------CASH RECEIVED FUNCTIONS-------------------------------

    //get today cash received from sales details
    getAllCashReceivedInvoiceDetails = () => {
        const cashReceivedDetails = [];
        this.setState({
            cashReceivedTableLoading: true,
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
                    cashReceivedTableLoading: false,
                    CRnumberOfRows: data.length,
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
            cashReceivedTableLoading: true,
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
                    cashReceivedTableLoading: false,
                    CRnumberOfRows: data.length,
                    cumCashReceived: response.cumCashReceived
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //get cash received from details between two dates
    searchCashReceivedBetweenTimePeriod = () => {
        const cashReceivedDetails = [];
        this.setState({
            cashReceivedTableLoading: true,
            CfBtn: ''
        });

        Helper.http
            .jsonPost("searchCashReceivedBetweenTimePeriod", {
                from: this.state.selectedFromDate,
                to: this.state.selectedToDate
            })
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
                    cashReceivedTableLoading: false,
                    CRnumberOfRows: data.length,
                    cumCashReceived: response.cumCashReceived
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

//--------------------------------OTHER INCOME FUNCTION-------------------------------------

    //get today other income received 
    getAllOtherIncomeReceivedDetails = () => {
        const otherIncomeReceivedDetails = [];
        this.setState({
            otherIncomeReceivedTableLoading: true,
        });

        Helper.http
            .jsonGet("getAllOtherIncomeReceivedDetails")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        details: data[i].details,
                        otherIncomeId: data[i].otherIncomeId,
                        date: data[i].date,
                        cashPaid: data[i].cashPaid
                    };
                    otherIncomeReceivedDetails.push(_data);
                }
                this.setState({ otherIncomeReceivedDetails });
                this.setState({
                    otherIncomeReceivedTableLoading: false,
                    OInumberOfRows: data.length,
                    cumOtherIncomeReceived: response.cumCashReceived
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //get today other income received details
    getTodayOtherIncomeReceivedDetails = () => {
        const otherIncomeReceivedDetails = [];
        this.setState({
            otherIncomeReceivedTableLoading: true,
        });

        Helper.http
            .jsonGet("getTodayOtherIncomeReceivedDetails")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        details: data[i].details,
                        otherIncomeId: data[i].otherIncomeId,
                        date: data[i].date,
                        cashPaid: data[i].cashPaid
                    };
                    otherIncomeReceivedDetails.push(_data);
                }
                this.setState({ otherIncomeReceivedDetails });
                this.setState({
                    otherIncomeReceivedTableLoading: false,
                    OInumberOfRows: data.length,
                    cumOtherIncomeReceived: response.cumCashReceived
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //get other income received details between two dates
    searchOtherIncomeReceivedBetweenTimePeriod = () => {
        const otherIncomeReceivedDetails = [];
        this.setState({
            otherIncomeReceivedTableLoading: true,
            CfBtn: ''
        });

        Helper.http
            .jsonPost("searchOtherIncomeReceivedBetweenTimePeriod", {
                from: this.state.selectedFromDate,
                to: this.state.selectedToDate
            })
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        details: data[i].details,
                        otherIncomeId: data[i].otherIncomeId,
                        date: data[i].date,
                        cashPaid: data[i].cashPaid
                    };
                    otherIncomeReceivedDetails.push(_data);
                }
                this.setState({ otherIncomeReceivedDetails });
                this.setState({
                    otherIncomeReceivedTableLoading: false,
                    OInumberOfRows: data.length,
                    cumOtherIncomeReceived: response.cumCashReceived
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };


//--------------------------------CASH PAID FUNCTIONS---------------------------------------

    //get today cash received from sales details
    getAllCashPaidInvoiceDetails = () => {
        const cashPaidDetails = [];
        this.setState({
            cashPaidLoading: true,
        });

        Helper.http
            .jsonGet("getAllCashPaidInvoiceDetails")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        invoiceNum: data[i].invoiceNum,
                        supplierName: data[i].supplierName,
                        date: data[i].date,
                        cashPaid: data[i].cashPaid
                    };
                    cashPaidDetails.push(_data);
                }
                this.setState({ cashPaidDetails });
                this.setState({
                    cashPaidLoading: false,
                    CPnumberOfRows: data.length,
                    cumCashPaid: response.cumCashPaid
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //get today cash received from sales details
    getTodayCashPaidInvoiceDetails = () => {
        const cashPaidDetails = [];
        this.setState({
            cashPaidLoading: true,
        });

        Helper.http
            .jsonGet("getTodayCashPaidInvoiceDetails")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        invoiceNum: data[i].invoiceNum,
                        supplierName: data[i].supplierName,
                        date: data[i].date,
                        cashPaid: data[i].cashPaid
                    };
                    cashPaidDetails.push(_data);
                }
                this.setState({ cashPaidDetails });
                this.setState({
                    cashPaidLoading: false,
                    CPnumberOfRows: data.length,
                    cumCashPaid: response.cumCashPaid
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //get cash received from details between two dates
    searchCashPaidBetweenTimePeriod = () => {
        const cashPaidDetails = [];
        this.setState({
            cashPaidLoading: true,
            CfBtn: ''
        });

        Helper.http
            .jsonPost("searchCashPaidBetweenTimePeriod", {
                from: this.state.selectedFromDate,
                to: this.state.selectedToDate
            })
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        invoiceNum: data[i].invoiceNum,
                        supplierName: data[i].supplierName,
                        date: data[i].date,
                        cashPaid: data[i].cashPaid
                    };
                    cashPaidDetails.push(_data);
                }
                this.setState({ cashPaidDetails });
                this.setState({
                    cashPaidLoading: false,
                    CPnumberOfRows: data.length,
                    cumCashPaid: response.cumCashPaid
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };


//---------------------------------EXPENSES FUNCTIONS----------------------------------

    //get all expense details
    getAllExpensesDetails = () => {
        const expenseDetails = [];
        this.setState({ expenseLoading: true });
        Helper.http
            .jsonGet("getAllExpensesDetails")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        id: data[i].id,
                        expenseName: data[i].expenseName,
                        date: data[i].date,
                        details: data[i].details,
                        cashPaid: data[i].cashPaid,
                    };
                    expenseDetails.push(_data);
                }
                this.setState({ expenseDetails });
                this.setState({
                    expenseLoading: false,
                    ExnumberOfRows: data.length,
                    cumExpenses: response.cumExpensePaid
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    }

    //get today expense details
    getTodayExpensesDetails = () => {
        const expenseDetails = [];
        this.setState({ expenseLoading: true });
        Helper.http
            .jsonGet("getTodayExpensesDetails")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        id: data[i].id,
                        expenseName: data[i].expenseName,
                        date: data[i].date,
                        details: data[i].details,
                        cashPaid: data[i].cashPaid,
                    };
                    expenseDetails.push(_data);
                }
                this.setState({ expenseDetails });
                this.setState({
                    expenseLoading: false,
                    ExnumberOfRows: data.length,
                    cumExpenses: response.cumExpensePaid
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    }

    //get expense details between two dates
    searchExpenseBetweenTimePeriod = () => {
        const expenseDetails = [];
        this.setState({ expenseLoading: true });
        Helper.http
            .jsonPost("searchExpenseBetweenTimePeriod", {
                from: this.state.selectedFromDate,
                to: this.state.selectedToDate
            })
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        id: data[i].id,
                        expenseName: data[i].expenseName,
                        date: data[i].date,
                        details: data[i].details,
                        cashPaid: data[i].cashPaid,
                    };
                    expenseDetails.push(_data);
                }
                this.setState({ expenseDetails });
                this.setState({
                    expenseLoading: false,
                    ExnumberOfRows: data.length,
                    cumExpenses: response.cumExpensePaid
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    }


    //---------------------------------SALARY FUNCTIONS----------------------------------

    //get all expense details
    getAllSalaryDetails = () => {
        const salaryDetails = [];
        this.setState({ salaryLoading: true });
        Helper.http
            .jsonGet("getAllSalaryDetails")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        id: data[i].id,
                        empName: data[i].empName,
                        date: data[i].date,
                        details: data[i].details,
                        cashPaid: data[i].cashPaid,
                    };
                    salaryDetails.push(_data);
                }
                this.setState({ salaryDetails });
                this.setState({
                    salaryLoading: false,
                    SalnumberOfRows: data.length,
                    cumSalary: response.cumSalaryPaid
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    }

    //get all expense details
    getTodaySalaryDetails = () => {
        const salaryDetails = [];
        this.setState({ salaryLoading: true });
        Helper.http
            .jsonGet("getTodaySalaryDetails")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        id: data[i].id,
                        empName: data[i].empName,
                        date: data[i].date,
                        details: data[i].details,
                        cashPaid: data[i].cashPaid,
                    };
                    salaryDetails.push(_data);
                }
                this.setState({ salaryDetails });
                this.setState({
                    salaryLoading: false,
                    SalnumberOfRows: data.length,
                    cumSalary: response.cumSalaryPaid
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    }

    //get all expense details
    searchSalaryBetweenTimePeriod = () => {
        const salaryDetails = [];
        this.setState({ salaryLoading: true });
        Helper.http
            .jsonPost("searchSalaryBetweenTimePeriod", {
                from: this.state.selectedFromDate,
                to: this.state.selectedToDate
            })
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        id: data[i].id,
                        empName: data[i].empName,
                        date: data[i].date,
                        details: data[i].details,
                        cashPaid: data[i].cashPaid,
                    };
                    salaryDetails.push(_data);
                }
                this.setState({ salaryDetails });
                this.setState({
                    salaryLoading: false,
                    SalnumberOfRows: data.length,
                    cumSalary: response.cumSalaryPaid
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    }


    //today cash flow button click function
    todayCfBtnClick = () => {
        this.setState({
            CfBtn: 'todayCF',
            CfHistoryCaption: "From today's (" + Moment(Date()).format("YYYY-MM-DD") + ") Cash Flow details",
            CfSummaryCaption: "From today's (" + Moment(Date()).format("YYYY-MM-DD") + ") Cash Flow details",
        });
        this.getTodayCashReceivedInvoiceDetails();
        this.getTodayCashPaidInvoiceDetails();
        this.getTodayExpensesDetails();
        this.getTodaySalaryDetails();
        this.getTodayOtherIncomeReceivedDetails();
    }

    //all cash flow button click function
    allCfBtnClick = () => {
        this.setState({
            CfBtn: 'allCF',
            CfHistoryCaption: "From all Cash Flow details",
            CfSummaryCaption: "From all Cash Flow details",
        });
        this.getAllCashReceivedInvoiceDetails();
        this.getAllCashPaidInvoiceDetails();
        this.getAllExpensesDetails();
        this.getAllSalaryDetails();
        this.getAllOtherIncomeReceivedDetails();
    }

    searchButtonClick = () =>{
        this.setState({
            CfHistoryCaption: "From Cash Flow between " + this.state.selectedFromDate + " and " + this.state.selectedToDate,
            CfSummaryCaption: "From Cash Flow between " + this.state.selectedFromDate + " and " + this.state.selectedToDate,
        })
        this.searchCashPaidBetweenTimePeriod();
        this.searchCashReceivedBetweenTimePeriod();
        this.searchExpenseBetweenTimePeriod();
        this.searchSalaryBetweenTimePeriod();
        this.searchOtherIncomeReceivedBetweenTimePeriod();
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
                                                    onClick={this.searchButtonClick}>
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
                            {/* this loading state is common for all cash flows */}
                            <LoadingOverlay
                                active={this.state.cashReceivedTableLoading}
                                spinner
                                text='Loading...'
                            >
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <CardBody>
                                            <h4>Cash Received</h4>
                                            <h4>Other Income</h4>
                                            <h4>Cash Paid (-)</h4>
                                            <h4>Expenses (-)</h4>
                                            <h4>Salary (-)</h4>
                                            <br />
                                            <h4>Net Cash In Flow</h4>
                                        </CardBody>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <CardBody>
                                            <h4 className={classes.alignright}><small>{parseInt(this.state.cumCashReceived, 10).toLocaleString() + ".00"}</small></h4>
                                            <h4 className={classes.alignright}><small>{parseInt(this.state.cumOtherIncomeReceived, 10).toLocaleString() + ".00"}</small></h4>
                                            <h4 className={classes.alignright}><small>{parseInt(this.state.cumCashPaid, 10).toLocaleString() + ".00"}</small></h4>
                                            <h4 className={classes.alignright}><small>{parseInt(this.state.cumExpenses, 10).toLocaleString() + ".00"}</small></h4>
                                            <h4 className={classes.alignright}><small>{parseInt(this.state.cumSalary, 10).toLocaleString() + ".00"}</small></h4>
                                            <br />
                                            <h4 className={classes.alignright}><small>{parseInt((Number(this.state.cumCashReceived) + Number(this.state.cumOtherIncomeReceived) - this.state.cumCashPaid - this.state.cumExpenses - this.state.cumSalary), 10).toLocaleString() + ".00"}</small></h4>
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
                                    tabButton: "Cash Received",
                                    tabIcon: cashReceivedIcon,
                                    tabContent: (
                                        <Card>
                                            <CardHeader>
                                                <h4 className={classes.cardTitle}>
                                                        Cash Received from Sales - <small>{this.state.CfHistoryCaption}</small>
                                                </h4>
                                            </CardHeader>
                                            <CardBody>
                                                <ReactTable
                                                    data={this.state.cashReceivedDetails}
                                                    loading={this.state.cashReceivedTableLoading}
                                                    filterable={false}
                                                    sortable={false}
                                                    showPagination={false}
                                                    noDataText=""
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
                                                    pageSize={this.state.CRnumberOfRows}
                                                />
                                            </CardBody>
                                        </Card>
                                    )
                                },
                                {
                                    tabButton: "Other Income",
                                    tabIcon: cashReceivedIcon,
                                    tabContent: (
                                        <Card>
                                            <CardHeader>
                                                <h4 className={classes.cardTitle}>
                                                    Cash Received from Other Income - <small>{this.state.CfHistoryCaption}</small>
                                                </h4>
                                            </CardHeader>
                                            <CardBody>
                                                <ReactTable
                                                    data={this.state.otherIncomeReceivedDetails}
                                                    loading={this.state.otherIncomeReceivedTableLoading}
                                                    filterable={false}
                                                    sortable={false}
                                                    showPagination={false}
                                                    noDataText=""
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
                                                                <div className="actions-center"><strong>Id</strong></div>),
                                                            accessor: "otherIncomeId",
                                                            filterable: false,
                                                            width: 100,
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
                                                                <div className="actions-right"><strong>Amount</strong></div>),
                                                            accessor: "cashPaid",
                                                            width: 120,
                                                            Cell: row => <div className="actions-right">{row.value}</div>
                                                        }
                                                    ]}
                                                    className="-striped -highlight"
                                                    pageSize={this.state.OInumberOfRows}
                                                />
                                            </CardBody>
                                        </Card>
                                    )
                                },
                                {
                                    tabButton: "Cash Paid",
                                    tabIcon: cashPaidIcon,
                                    tabContent: (
                                        <Card>
                                                <CardHeader>
                                                    <h4 className={classes.cardTitle}>
                                                        Cash Paid to Suppliers  - <small>{this.state.CfHistoryCaption}</small>
                                                    </h4>
                                                </CardHeader>
                                                <CardBody>
                                                    <ReactTable
                                                        data={this.state.cashPaidDetails}
                                                        loading={this.state.cashPaidLoading}
                                                        filterable={false}
                                                        sortable={false}
                                                        showPagination={false}
                                                        noDataText=""
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
                                                                    <div className="actions-left"><strong>Suppleir Name</strong></div>),
                                                                accessor: "supplierName",
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
                                                        pageSize={this.state.CPnumberOfRows}
                                                    />
                                                </CardBody>
                                        </Card>
                                    )
                                },
                                {
                                    tabButton: "Expenses",
                                    tabIcon: expenseIcon,
                                    tabContent: (
                                        <Card>
                                            <CardHeader>
                                                <h4 className={classes.cardTitle}>
                                                    Expenses Details  - <small>{this.state.CfHistoryCaption}</small>
                                                </h4>
                                            </CardHeader>
                                            <CardBody>
                                                <ReactTable
                                                    data={this.state.expenseDetails}
                                                    loading={this.state.expenseLoading}
                                                    filterable={false}
                                                    sortable={false}
                                                    showPagination={false}
                                                    noDataText=""
                                                    defaultSorted={[
                                                        {
                                                            id: "date",
                                                            desc: true
                                                        }
                                                    ]}
                                                    columns={[
                                                        {
                                                            Header: () => (
                                                                <strong>Date</strong>),
                                                            accessor: "date",
                                                            filterable: false,
                                                            sortable: false,
                                                            width: 100
                                                        },
                                                        {
                                                            Header: () => (
                                                                <strong>Expense</strong>),
                                                            accessor: "expenseName",
                                                            filterable: false,
                                                            sortable: false,
                                                            width: 100,
                                                            Cell: row => <div className="actions-left">{row.value}</div>
                                                        },
                                                        {
                                                            Header: () => (
                                                                <div className="actions-left">
                                                                    <strong>Details</strong></div>),
                                                            accessor: "details",
                                                            filterable: false,
                                                            sortable: false,
                                                            width: 150,
                                                            Cell: row => <div className="actions-left">{row.value}</div>
                                                        },
                                                        {
                                                            Header: () => (
                                                                <div className="actions-right">
                                                                    <strong>Amount</strong></div>),
                                                            accessor: "cashPaid",
                                                            filterable: false,
                                                            sortable: false,
                                                            width: 100,
                                                            Cell: row => <div className="actions-right">{row.value}</div>
                                                        }
                                                    ]}
                                                    pageSize={this.state.ExnumberOfRows}
                                                    showPaginationBottom={false}
                                                    className="-striped -highlight"
                                                />
                                            </CardBody>
                                        </Card>
                                    )
                                },
                                {
                                    tabButton: "Salary",
                                    tabIcon: salaryIcon,
                                    tabContent: (
                                        <Card>
                                            <CardHeader>
                                                <h4 className={classes.cardTitle}>
                                                    Expenses Details  - <small>{this.state.CfHistoryCaption}</small>
                                                </h4>
                                            </CardHeader>
                                            <CardBody>
                                                <ReactTable
                                                    data={this.state.salaryDetails}
                                                    loading={this.state.salaryLoading}
                                                    filterable={false}
                                                    sortable={false}
                                                    showPagination={false}
                                                    noDataText=""
                                                    defaultSorted={[
                                                        {
                                                            id: "date",
                                                            desc: true
                                                        }
                                                    ]}
                                                    columns={[
                                                        {
                                                            Header: () => (
                                                                <strong>Date</strong>),
                                                            accessor: "date",
                                                            filterable: false,
                                                            sortable: false,
                                                            width: 100
                                                        },
                                                        {
                                                            Header: () => (
                                                                <strong>Employee</strong>),
                                                            accessor: "empName",
                                                            filterable: false,
                                                            sortable: false,
                                                            width: 150,
                                                            Cell: row => <div className="actions-left">{row.value}</div>
                                                        },
                                                        {
                                                            Header: () => (
                                                                <div className="actions-left">
                                                                    <strong>Details</strong></div>),
                                                            accessor: "details",
                                                            filterable: false,
                                                            sortable: false,
                                                            width: 100,
                                                            Cell: row => <div className="actions-left">{row.value}</div>
                                                        },
                                                        {
                                                            Header: () => (
                                                                <div className="actions-right">
                                                                    <strong>Amount</strong></div>),
                                                            accessor: "cashPaid",
                                                            filterable: false,
                                                            sortable: false,
                                                            width: 100,
                                                            Cell: row => <div className="actions-right">{row.value}</div>
                                                        }
                                                    ]}
                                                    pageSize={this.state.SalnumberOfRows}
                                                    showPaginationBottom={false}
                                                    className="-striped -highlight"
                                                />
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