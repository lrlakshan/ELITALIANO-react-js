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
import Bill from "@material-ui/icons/ShoppingCart";
import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
import Done from "@material-ui/icons/Done";
import Close from "@material-ui/icons/Close";
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
    viewSalesButtons: {
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

class SalesHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            salesInvoices: [],
            customerNames: [],
            salesHistoryItems: [],
            loading: false,
            open: false,
            customerTableLoading: false,
            invoiceOpen: false,
            numberOfRows: 1,
            selectedCustomerId: '',
            selectedCustomerName: '',
            typingName: '',
            typingDetail: '',
            typingInvoice: '',
            formTitle: "",
            invoiceNum: "",
            cumRevenue: '0',
            cumCostOfSales: '0',
            cumDiscount: '0',
            cashPaid: "0",
            balance: "0",
            invoiceTotalBill: '',
            invoiceDate: '',
            invoiceDiscount: '',
            invoiceCashPaid: '',
            invoiceBalance: '',
            invoiceInvoiceNumber: '',
            selectedRadioBtn: "radio1",
            salesBtn: '',
            selectedToDate: Moment(Date()).format("YYYY-MM-DD"),
            selectedFromDate: Moment(Date()).format("YYYY-MM-DD"),
            salesHistoryCaption: '',
            salesSummaryCaption: ''
        };
        this.updateToDate = this.updateToDate.bind(this);
        this.updateFromDate = this.updateFromDate.bind(this);
    }

    componentDidMount() {
        this.getTodaySalesInvoiceDetails();
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

    //get all sales invoice details
    getAllSalesInvoiceDetails = () => {
        const salesInvoices = [];
        this.setState({ 
            loading: true,
            salesHistoryCaption: 'From all sales history details',
            salesSummaryCaption: 'From all sales history details'
         });

        Helper.http
            .jsonGet("getAllSalesInvoiceDetails")
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
                                            formTitle: "Invoice Details",
                                        })
                                        this.loadItemsOfSelectedInvoice(data[i].invoiceNum, data[i].date, data[i].totalBill, data[i].discount, data[i].cashPaid, data[i].balance);
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
                    cumRevenue: response.cumRevenue,
                    cumCostOfSales: response.cumCostOfSales,
                    cumDiscount: response.cumDiscount,
                    cashPaid: response.cashPaid,
                    balance: response.balance,
                    customerNames: [],
                    selectedCustomerId: '',
                    selectedCustomerName: '', 
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //get today sales invoice details
    getTodaySalesInvoiceDetails = () => {
        const salesInvoices = [];
        this.setState({ 
            loading: true,
            salesBtn: 'todaySales',
            salesHistoryCaption: "From today's (" + Moment(Date()).format("YYYY-MM-DD") + ") sales history details",
            salesSummaryCaption: "From today's (" + Moment(Date()).format("YYYY-MM-DD") + ") sales history details",
         });

        Helper.http
            .jsonGet("getTodaySalesInvoiceDetails")
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
                                            formTitle: "Invoice Details",
                                        })
                                        this.loadItemsOfSelectedInvoice(data[i].invoiceNum, data[i].date, data[i].totalBill, data[i].discount, data[i].cashPaid, data[i].balance);
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
                    cumRevenue: response.cumRevenue,
                    cumCostOfSales: response.cumCostOfSales,
                    cumDiscount: response.cumDiscount,
                    cashPaid: response.cashPaid,
                    balance: response.balance,
                    customerNames: [],
                    selectedCustomerId: '',
                    selectedCustomerName: '', 
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //det the typed invoice number to typingInvoice state 
    invoiceNumberCatch = (value) =>{
        this.setState({ typingInvoice: value });
    }

    //search details of a paticular invoice number
    searchByInvoiceNumber = () => {
        const salesInvoices = [];
        this.setState({ 
            loading: true,
            salesHistoryCaption: "From sales invoice number " + this.state.typingInvoice,
            salesSummaryCaption: "From sales invoice number " + this.state.typingInvoice,
            salesBtn: ''
         });
        Helper.http
            .jsonPost("searchByInvoiceNumber", {
                invoiceNum: this.state.typingInvoice
            })
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
                                            formTitle: "Invoice Details",
                                        })
                                        this.loadItemsOfSelectedInvoice(data[i].invoiceNum, data[i].date, data[i].totalBill, data[i].discount, data[i].cashPaid, data[i].balance);
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
                    cumRevenue: response.cumRevenue,
                    cumCostOfSales: response.cumCostOfSales,
                    cumDiscount: response.cumDiscount,
                    cashPaid: response.cashPaid,
                    balance: response.balance,
                    customerNames: [],
                    selectedCustomerId: '',
                    selectedCustomerName: '',
                    typingInvoice: ''
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //search details of a paticular customer name from all sales history or between two dates
    searchByCustomerName = () => {
        if(this.state.selectedRadioBtn === 'radio1'){
            const salesInvoices = [];
            this.setState({
                loading: true,
                salesHistoryCaption: "From all sales history of " + this.state.selectedCustomerName,
                salesSummaryCaption: "From all sales history of " + this.state.selectedCustomerName,
                salesBtn: ''
            });
            Helper.http
                .jsonPost("searchBycustomerFromAllData", {
                    customerId: this.state.selectedCustomerId
                })
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
                                                formTitle: "Invoice Details",
                                            })
                                            this.loadItemsOfSelectedInvoice(data[i].invoiceNum, data[i].date, data[i].totalBill, data[i].discount, data[i].cashPaid, data[i].balance);
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
                        cumRevenue: response.cumRevenue,
                        cumCostOfSales: response.cumCostOfSales,
                        cumDiscount: response.cumDiscount,
                        cashPaid: response.cashPaid,
                        balance: response.balance,
                        customerNames: [],
                        selectedCustomerId: '',
                        selectedCustomerName: '',
                    });
                })
                .catch(exception => {
                    console.log(exception);
                });
        }else {
            const salesInvoices = [];
            this.setState({
                loading: true,
                salesHistoryCaption: "From sales history of " + this.state.selectedCustomerName + " between " + this.state.selectedFromDate + " and " + this.state.selectedToDate,
                salesSummaryCaption: "From sales history of " + this.state.selectedCustomerName + " between " + this.state.selectedFromDate + " and " + this.state.selectedToDate,
                salesBtn: ''
            });
            Helper.http
                .jsonPost("searchBycustomerBetweenTimePeriod", {
                    customerId: this.state.selectedCustomerId,
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
                                                formTitle: "Invoice Details",
                                            })
                                            this.loadItemsOfSelectedInvoice(data[i].invoiceNum, data[i].date, data[i].totalBill, data[i].discount, data[i].cashPaid, data[i].balance);
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
                        cumRevenue: response.cumRevenue,
                        cumCostOfSales: response.cumCostOfSales,
                        cumDiscount: response.cumDiscount,
                        cashPaid: response.cashPaid,
                        balance: response.balance,
                        customerNames: [],
                        selectedCustomerId: '',
                        selectedCustomerName: '',
                    });
                })
                .catch(exception => {
                    console.log(exception);
                });
        }
        
    };

    //search details between two dates from all sales data
    searchBetweenTimePeriod = () => {
        const salesInvoices = [];
        this.setState({
            loading: true,
            salesHistoryCaption: "From sales history between " + this.state.selectedFromDate + " and " + this.state.selectedToDate,
            salesSummaryCaption: "From sales history between " + this.state.selectedFromDate + " and " + this.state.selectedToDate,
            salesBtn: ''
        });
        Helper.http
            .jsonPost("searchBetweenTimePeriod", {
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
                                            formTitle: "Invoice Details",
                                        })
                                        this.loadItemsOfSelectedInvoice(data[i].invoiceNum, data[i].date, data[i].totalBill, data[i].discount, data[i].cashPaid, data[i].balance);
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
                    cumRevenue: response.cumRevenue,
                    cumCostOfSales: response.cumCostOfSales,
                    cumDiscount: response.cumDiscount,
                    cashPaid: response.cashPaid,
                    balance: response.balance,
                    customerNames: [],
                    selectedCustomerId: '',
                    selectedCustomerName: '',
                });
            })
            .catch(exception => {
                console.log(exception);
            });

    };

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
                        searchResult: data[i].customerName,
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

    //search sales history by details
    searchByDetails = (value) => {
        if (this.state.selectedRadioBtn === 'radio1'){
            const salesInvoices = [];
            this.setState({
                loading: true,
                salesHistoryCaption: "From details captured as '" + value + "'",
                salesSummaryCaption: "From details captured as '" + value + "'",
                salesBtn: '',
                typingDetail: value
            });
            Helper.http
                .jsonPost("getSalesDataFromDetails", {
                    details: value
                })
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
                                                formTitle: "Invoice Details",
                                            })
                                            this.loadItemsOfSelectedInvoice(data[i].invoiceNum, data[i].date, data[i].totalBill, data[i].discount, data[i].cashPaid, data[i].balance);
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
                        cumRevenue: response.cumRevenue,
                        cumCostOfSales: response.cumCostOfSales,
                        cumDiscount: response.cumDiscount,
                        cashPaid: response.cashPaid,
                        balance: response.balance,
                        customerNames: [],
                        selectedCustomerId: '',
                        selectedCustomerName: '',
                    });
                })
                .catch(exception => {
                    console.log(exception);
                    this.getTodaySalesInvoiceDetails();
                });
        }else {
            const salesInvoices = [];
            this.setState({
                loading: true,
                salesHistoryCaption: "From details captured as '" + value + "' between " + this.state.selectedFromDate +" and " + this.state.selectedToDate,
                salesSummaryCaption: "From details captured as '" + value + "' between " + this.state.selectedFromDate + " and " + this.state.selectedToDate,
                salesBtn: '',
                typingDetail: value
            });
            Helper.http
                .jsonPost("getSalesDataFromDetailsBetweenTimePeriod", {
                    details: value,
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
                                                formTitle: "Invoice Details",
                                            })
                                            this.loadItemsOfSelectedInvoice(data[i].invoiceNum, data[i].date, data[i].totalBill, data[i].discount, data[i].cashPaid, data[i].balance);
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
                        cumRevenue: response.cumRevenue,
                        cumCostOfSales: response.cumCostOfSales,
                        cumDiscount: response.cumDiscount,
                        cashPaid: response.cashPaid,
                        balance: response.balance,
                        customerNames: [],
                        selectedCustomerId: '',
                        selectedCustomerName: '',
                    });
                })
                .catch(exception => {
                    console.log(exception);
                    this.getTodaySalesInvoiceDetails();
                });
        }
        

    }

    //save the selected customer ID and customer name in a state
    selectCustomer = (customerId, customerName) => {
        this.setState({
            selectedCustomerId: customerId,
            selectedCustomerName: customerName,
        });
    }

    //clear the selected customer ID and customer name from the state
    clearSelectedCustomer = () => {
        this.setState({
            selectedCustomerId: '',
            selectedCustomerName: '',
        });
    }

    //radio button change handling function
    handleRadioBtnChange = (event) => {
        console.log(event.target.value);
        this.setState({
            selectedRadioBtn: event.target.value
        });
        if (event.target.value === 'radio1'){
            this.setState({
                selectedToDate: Moment(Date()).format("YYYY-MM-DD"),
                selectedFromDate: Moment(Date()).format("YYYY-MM-DD"),
            });
        }
    };

    //today sales button click function
    todaySalesBtnClick = () => {
        this.setState({
            salesBtn: 'todaySales',
        });
        this.getTodaySalesInvoiceDetails();
    }

    //all sales button click function
    allSalesBtnClick = () => {
        this.setState({
            salesBtn: 'allSales',
        });
        this.getAllSalesInvoiceDetails();
    }

    //this will get the invoice details as well as the items that purchased under that invoice number
    loadItemsOfSelectedInvoice = (invoiceNumber, date, totalBill, discount, cashPaid, balance) => {
        const salesHistoryItems = [];
        this.setState({ invoiceFormLoading: true });
        Helper.http
            .jsonPost("salesHistoryMoreDetails", {
                invoiceNum: invoiceNumber
            })
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        id: data[i].id,
                        productName: data[i].productName,
                        marketPrice: data[i].marketPrice,
                        amount: data[i].amount,
                        regAmount: data[i].regAmount,
                        sellingPrice: data[i].sellingPrice,
                        amountPurchases: data[i].amountPurchases,
                    };
                    salesHistoryItems.push(_data);
                }
                this.setState({ 
                    salesHistoryItems,
                    invoiceTotalBill: totalBill,
                    invoiceDate: date,
                    invoiceDiscount: discount,
                    invoiceCashPaid: cashPaid,
                    invoiceBalance: balance,
                    invoiceInvoiceNumber: invoiceNumber,
                    invoiceTotalBillRegular: response.sum.totalBillRegular,
                    invoiceFormLoading: false
                 });
            })
            .catch(exception => {
                console.log(exception);
                this.setState({ invoiceFormLoading: false });
            });
    }

    //invoice details form close icon click function
    invoiceFormHandleClose = () => {
        this.setState({
            open: false,
            invoiceTotalBill: '',
            invoiceDate: '',
            invoiceDiscount: '',
            invoiceCashPaid: '',
            invoiceBalance: '',
            invoiceInvoiceNumber: ''
        });
    }

    //view purcase details button click function
    viewPurchaseDetailsBtnClick = () => {
        this.setState({
            open: false,
            invoiceOpen: true
        });
    }

    //invoice close button click function
    invoiceClose = () => {
        this.setState({
            open: true,
            invoiceOpen: false
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>

                {/* dialog box which is open after action button clicked in sales history table */}
                <Dialog
                    open={this.state.open}
                    aria-labelledby="form-dialog-title">
                    <Button
                        justIcon
                        round
                        simple
                        onClick={this.invoiceFormHandleClose}
                        color="danger"
                        className={classes.invoiceFormCloseIcon}
                    >
                        <Close />
                    </Button>
                    <br />
                    <Card className={classes.cardSize}>
                        <CardHeader color="info" icon>
                            <CardIcon color="info">
                                <LocalMall />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>{this.state.formTitle} - <small>{this.state.invoiceInvoiceNumber}</small></h4>
                        </CardHeader>
                        <CardBody>
                            <LoadingOverlay
                                active={this.state.invoiceFormLoading}
                                spinner
                                text='Loading...'
                            >
                            <form>
                                <CustomInput
                                    disabled={true}
                                    labelText="Total Bill"
                                    id="invoiceTotalBill"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    value={this.state.invoiceTotalBill}
                                />
                                <CustomInput
                                    disabled={true}
                                    labelText="Promo Discount"
                                    id="invoiceDiscount"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    value={this.state.invoiceDiscount}
                                />
                                <CustomInput
                                    disabled={true}
                                    labelText="Cash Paid"
                                    id="invoiceCashPaid"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    value={this.state.invoiceCashPaid}
                                />
                                <CustomInput
                                    disabled={true}
                                    labelText="Payment Due"
                                    id="invoiceBalance"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    value={this.state.invoiceBalance}
                                />
                                <Button
                                    size='sm'
                                    round
                                    color="twitter"
                                    className={classes.viewPurchaseDetailsButton}
                                    onClick={this.viewPurchaseDetailsBtnClick}> View Purchase Details
                                </Button>
                            </form>
                            </LoadingOverlay>
                        </CardBody>
                    </Card>
                </Dialog>

                {/* Historical Invoice dialog box */}
                <Dialog
                    open={this.state.invoiceOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="md"
                    scroll="body"
                    classes={{ paper: classes.dialogPaper }}
                >
                    <Button
                        justIcon
                        round
                        simple
                        onClick={this.invoiceClose}
                        color="danger"
                        className={classes.invoiceCloseIcon}
                    >
                        <Close />
                    </Button>
                    <br />
                    <Card className={classes.invoiceSize}>
                        <CardHeader color="primary" icon>
                            <CardIcon color="primary">
                                <Bill />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Invoice</h4>
                        </CardHeader>
                        <br />
                        <CardBody>
                            <div id="divToPrint" className="container">
                                <div >
                                    <h1 className="no-margin">Sales Invoice</h1>
                                </div>
                                <div className="inv-header">
                                    <div>
                                        <img src={elitaliano_logo} alt="elitaliano logo" className="inv-logo" />
                                        <h2>ELITALIANO</h2>
                                        <ul>
                                            <li>Liyanage Distributors</li>
                                            <li>1394/7, Hokandara road,Pannipitiya</li>
                                            <li>Lakshan : +94 71 303 2396</li>
                                            <li>Janith : +94 71 329 9627</li>
                                            <li>Email : elitaliano.lanka@gmail.com</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <th>Invoice Number</th>
                                                    <td>{this.state.invoiceInvoiceNumber}</td>
                                                </tr>
                                                <tr>
                                                    <th>Issue Date</th>
                                                    <td>{this.state.invoiceDate}</td>
                                                </tr>
                                                <tr>
                                                    <th>Total</th>
                                                    <td>{parseInt(this.state.invoiceTotalBill - this.state.invoiceDiscount, 10).toLocaleString() + ".00"}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="inv-body">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Product Name</th>
                                                <th>Qty</th>
                                                <th>Regular Price *1</th>
                                                <th>Total</th>
                                                <th>Sale Price *1</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.salesHistoryItems.map((item, index) =>
                                                    <tr key={item.id}>
                                                        <td>
                                                            <p>{item.productName}</p>
                                                        </td>
                                                        <td>{item.amountPurchases}</td>
                                                        <td>{item.marketPrice}</td>
                                                        <td>{item.regAmount}</td>
                                                        <td>{item.sellingPrice}</td>
                                                        <td>{item.amount}</td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <div className="inv-footer">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>Sub Total</th>
                                                <td>{parseInt(this.state.invoiceTotalBillRegular, 10).toLocaleString() + ".00"}</td>
                                            </tr>
                                            <tr>
                                                <th>Discount (-)</th>
                                                <td>{parseInt(this.state.invoiceTotalBillRegular - this.state.invoiceTotalBill, 10).toLocaleString() + ".00"}</td>
                                            </tr>
                                            {this.state.invoiceDiscount !== "0.00"
                                                ? <tr>
                                                    <th>Promo Discount (-)</th>
                                                    <td>{parseInt(this.state.invoiceDiscount, 10).toLocaleString() + ".00"}</td>
                                                </tr> :
                                                null
                                            }
                                            <tr>
                                                <th>Total</th>
                                                <td>{parseInt(this.state.invoiceTotalBill - this.state.invoiceDiscount, 10).toLocaleString() + ".00"}</td>
                                            </tr>
                                            <tr>
                                                <th>Cash Paid</th>
                                                <td>{parseInt(this.state.invoiceCashPaid, 10).toLocaleString() + ".00"}</td>
                                            </tr>
                                            <tr>
                                                <th>Payment Due</th>
                                                <td>{parseInt(this.state.invoiceBalance, 10).toLocaleString() + ".00"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Dialog>

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
                                        <div className="k-form-field" >
                                            <input type="radio" name="radio" value="radio1" className="k-radio" onChange={this.handleRadioBtnChange} defaultChecked={true} />
                                            <label className="k-radio-label">Search within all sales</label>
                                            <br />
                                            <br />
                                            <input type="radio" name="radio" value="radio2" className="k-radio" onChange={this.handleRadioBtnChange} />
                                            <label className="k-radio-label">Search within a time period</label>
                                        </div>
                                    </CardBody>
                                </GridItem>
                                {this.state.selectedRadioBtn === 'radio1' 
                                    ? <GridItem xs={12} sm={12} md={6}>
                                        <GridContainer>
                                            <Button
                                                simple={this.state.salesBtn === 'allSales' || this.state.salesBtn === ''}
                                                size='sm'
                                                round
                                                color="twitter"
                                                className={classes.viewSalesButtons}
                                                onClick={this.todaySalesBtnClick}> View today Sales
                                            </Button>
                                            <Button
                                                simple={this.state.salesBtn === 'todaySales' || this.state.salesBtn === ''}
                                                size='sm'
                                                round
                                                color="twitter"
                                                className={classes.viewSalesButtons}
                                                onClick={this.allSalesBtnClick}> View all Sales
                                            </Button>
                                        </GridContainer>
                                    </GridItem> 
                                    : <GridItem xs={12} sm={12} md={6}>
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
                                                        disabled={this.state.selectedCustomerId !== '' || this.state.typingInvoice !== ''}
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
                                }
                                
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <NavPills
                                            color="info"
                                            tabs={[
                                                {
                                                    tabButton: "Invoice",
                                                    tabContent: (
                                                        <span>
                                                            <ReactSearchBox
                                                                placeholder="Insert Sales Invoice Number"
                                                                value={this.state.typingName}
                                                                callback={record => console.log(record)}
                                                                onChange={this.invoiceNumberCatch}
                                                            />
                                                            <Button
                                                                disabled={this.state.typingInvoice === ''}
                                                                size='sm'
                                                                color="success"
                                                                className={classes.searchButton}
                                                                onClick={this.searchByInvoiceNumber}>
                                                                <Search className={classes.icons} /> Search
                                                            </Button>
                                                            <ReactSearchBox
                                                                placeholder="Search By Details"
                                                                value={this.state.typingDetail}
                                                                callback={record => console.log(record)}
                                                                onChange={this.searchByDetails}
                                                            />
                                                        </span>
                                                    )
                                                },
                                                {
                                                    tabButton: "Customer",
                                                    tabContent: (
                                                        <span>
                                                            <CustomInput
                                                                labelText="Selected Customer"
                                                                id="selectedCustomerName"
                                                                disabled
                                                                formControlProps={{
                                                                    fullWidth: true
                                                                }}
                                                                value={this.state.selectedCustomerName}
                                                            />
                                                            <ReactSearchBox
                                                                placeholder="Insert Customer Name"
                                                                value={this.state.typingName}
                                                                callback={record => console.log(record)}
                                                                onChange={this.selectByCustomerName}
                                                            />
                                                            <Button
                                                                disabled={this.state.selectedCustomerId === ''}
                                                                size='sm'
                                                                color="success"
                                                                className={classes.searchButton}
                                                                onClick={this.searchByCustomerName}> Search
                                                            </Button>
                                                            <Button
                                                                disabled={this.state.selectedCustomerId === ''}
                                                                size='sm'
                                                                color="danger"
                                                                className={classes.searchButton}
                                                                onClick={this.clearSelectedCustomer}> Clear
                                                            </Button>
                                                        </span>
                                                    )
                                                },
                                            ]}
                                        />
                                    </CardBody>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <ReactTable
                                            loading={this.state.customerTableLoading}
                                            data={this.state.customerNames}
                                            noDataText=""
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
                                                            <strong>Search Result</strong></div>),
                                                    accessor: "searchResult",
                                                    filterable: false,
                                                    sortable: false,
                                                    width: 140,
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
                                            pageSize="3"
                                            showPaginationBottom={false}
                                            className="-striped -highlight"
                                        />
                                    </CardBody>
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
                                <h4 className={classes.cardIconTitle}>Sales Summary - <small>{this.state.salesSummaryCaption}</small></h4>
                            </CardHeader>
                            <LoadingOverlay
                                active={this.state.loading}
                                spinner
                                text='Loading...'
                            >
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <h4>Revenue</h4>
                                        <h4>Cost of Sales (-)</h4>
                                        <h4>Discounts given (-)</h4>
                                        <br />
                                        <h4>Gross Profit/Loss</h4>
                                    </CardBody>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <h4 className={classes.alignright}><small>{parseInt(this.state.cumRevenue,10).toLocaleString() + ".00"}</small></h4>
                                            <h4 className={classes.alignright}><small>{(this.state.cumCostOfSales === null)  ? "0.00" : (parseInt(this.state.cumCostOfSales, 10).toLocaleString() + ".00")}</small></h4>
                                            <h4 className={classes.alignright}><small>{parseInt(this.state.cumDiscount, 10).toLocaleString() + ".00"}</small></h4>
                                        <br />
                                            <h4 className={classes.alignright}><small>{parseInt((this.state.cumRevenue - this.state.cumCostOfSales - this.state.cumDiscount), 10).toLocaleString() + ".00"}</small></h4>
                                    </CardBody>
                                </GridItem>
                            </GridContainer>
                            </LoadingOverlay>
                        </Card>
                        <Card>
                            <LoadingOverlay
                                active={this.state.loading}
                                spinner
                                text='Loading...'
                            >
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <CardBody>
                                            <h4>Cash Received</h4>
                                            <h4>Payment Due</h4>
                                        </CardBody>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <CardBody>
                                            <h4 className={classes.alignright}><small>{parseInt(this.state.cashPaid, 10).toLocaleString() + ".00"}</small></h4>
                                            <h4 className={classes.alignright}><small>{parseInt(this.state.balance, 10).toLocaleString() + ".00"}</small></h4>
                                       </CardBody>
                                    </GridItem>
                                </GridContainer>
                            </LoadingOverlay>
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
                                <h4 className={classes.cardIconTitle}>Sales History - <small>{this.state.salesHistoryCaption}</small></h4>
                            </CardHeader>
                            <CardBody>
                                    <ReactTable
                                        data={this.state.salesInvoices}
                                        filterable={false}
                                        sortable={false}
                                        showPagination={false}
                                        defaultSorted={[
                                            {
                                                id: "invoiceNum",
                                                desc: true
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