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
    marginLeft: {
        marginTop: "15px",
        marginLeft: "25px",
        marginBottom: "0px",
        width: "150px"
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
    viewPurchasesButtons: {
        marginLeft: "20%",
        width: "180px"
    },
    viewPurchaseDetailsButton: {
        marginLeft: "20%",
    },
    cardSize: {
        width: "350px"
    },
    addButton: {
        float: "right"
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

class PurchaseHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            purchasesInvoices: [],
            supplierNames: [],
            purchasesHistoryItems: [],
            loading: false,
            open: false,
            supplierTableLoading: false,
            invoiceOpen: false,
            numberOfRows: 1,
            selectedSupplierId: '',
            selectedSupplierName: '',
            typingName: '',
            typingDetail: '',
            typingInvoice: '',
            formTitle: "",
            invoiceNum: "",
            totalCost: '0',
            cashPaid: "0",
            balance: "0",
            invoiceTotalCost: '',
            invoiceTotalBill: '',
            invoiceDate: '',
            invoiceCashPaid: '',
            invoiceBalance: '',
            invoiceInvoiceNumber: '',
            selectedRadioBtn: "radio1",
            purchasesBtn: '',
            selectedToDate: Moment(Date()).format("YYYY-MM-DD"),
            selectedFromDate: Moment(Date()).format("YYYY-MM-DD"),
            purchasesHistoryCaption: '',
            purchasesSummaryCaption: ''
        };
        this.updateToDate = this.updateToDate.bind(this);
        this.updateFromDate = this.updateFromDate.bind(this);
    }

    componentDidMount() {
        this.getTodayPurchasesInvoiceDetails();
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

    //get all purchases invoice details
    getAllPurchasesInvoiceDetails = () => {
        const purchasesInvoices = [];
        this.setState({
            loading: true,
            purchasesHistoryCaption: 'From all purchases history details',
            purchasesSummaryCaption: 'From all purchases history details'
        });

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
                                            formTitle: "Invoice Details",
                                        })
                                        this.loadItemsOfSelectedInvoice(data[i].invoiceNum, data[i].date, data[i].totalBill, data[i].cashPaid, data[i].balance);
                                    }}
                                    color="warning"
                                    className="edit"
                                >
                                    <Dvr />
                                </Button>{" "}
                            </div>
                        )
                    };
                    purchasesInvoices.push(_data);
                }
                this.setState({ purchasesInvoices });
                this.setState({
                    loading: false,
                    numberOfRows: data.length,
                    totalCost: response.totalCost,
                    cashPaid: response.cashPaid,
                    balance: response.balance,
                    supplierNames: [],
                    selectedSupplierId: '',
                    selectedSupplierName: '',
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //get today purchases invoice details
    getTodayPurchasesInvoiceDetails = () => {
        const purchasesInvoices = [];
        this.setState({
            loading: true,
            purchasesBtn: 'todayPurchases',
            purchasesHistoryCaption: "From today's (" + Moment(Date()).format("YYYY-MM-DD") + ") purchases history details",
            purchasesSummaryCaption: "From today's (" + Moment(Date()).format("YYYY-MM-DD") + ") purchases history details",
        });

        Helper.http
            .jsonGet("getTodayPurchasesInvoiceDetails")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        invoiceNum: data[i].invoiceNum,
                        supplierName: data[i].supplierName,
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
                                        this.loadItemsOfSelectedInvoice(data[i].invoiceNum, data[i].date, data[i].totalBill, data[i].cashPaid, data[i].balance);
                                    }}
                                    color="warning"
                                    className="edit"
                                >
                                    <Dvr />
                                </Button>{" "}
                            </div>
                        )
                    };
                    purchasesInvoices.push(_data);
                }
                this.setState({ purchasesInvoices });
                this.setState({
                    loading: false,
                    numberOfRows: data.length,
                    totalCost: response.totalCost,
                    cashPaid: response.cashPaid,
                    balance: response.balance,
                    supplierNames: [],
                    selectedSupplierId: '',
                    selectedSupplierName: '',
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //the typed invoice number to typingInvoice state 
    invoiceNumberCatch = (value) => {
        this.setState({ typingInvoice: value });
    }

    //search details of a paticular invoice number
    searchByPurchasesInvoiceNumber = () => {
        const purchasesInvoices = [];
        this.setState({
            loading: true,
            purchasesHistoryCaption: "From purchases invoice number " + this.state.typingInvoice,
            purchasesSummaryCaption: "From purchases invoice number " + this.state.typingInvoice,
            purchasesBtn: ''
        });
        Helper.http
            .jsonPost("searchByPurchasesInvoiceNumber", {
                invoiceNum: this.state.typingInvoice
            })
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        invoiceNum: data[i].invoiceNum,
                        supplierName: data[i].supplierName,
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
                                        this.loadItemsOfSelectedInvoice(data[i].invoiceNum, data[i].date, data[i].totalBill, data[i].cashPaid, data[i].balance);
                                    }}
                                    color="warning"
                                    className="edit"
                                >
                                    <Dvr />
                                </Button>{" "}
                            </div>
                        )
                    };
                    purchasesInvoices.push(_data);
                }
                this.setState({ purchasesInvoices });
                this.setState({
                    loading: false,
                    numberOfRows: data.length,
                    totalCost: response.totalCost,
                    cashPaid: response.cashPaid,
                    balance: response.balance,
                    supplierNames: [],
                    selectedSupplierId: '',
                    selectedSupplierName: '',
                    typingInvoice: ''
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //search details of a paticular supplier name from all purchases history or between two dates
    searchBySupplierName = () => {
        if (this.state.selectedRadioBtn === 'radio1') {
            const purchasesInvoices = [];
            this.setState({
                loading: true,
                purchasesHistoryCaption: "From all purchases history of " + this.state.selectedSupplierName,
                purchasesSummaryCaption: "From all purchases history of " + this.state.selectedSupplierName,
                purchasesBtn: ''
            });
            Helper.http
                .jsonPost("searchBySupplierFromAllData", {
                    supplierId: this.state.selectedSupplierId
                })
                .then(response => {
                    let data = response.data;
                    for (let i = 0; i < data.length; i++) {
                        const _data = {
                            invoiceNum: data[i].invoiceNum,
                            supplierName: data[i].supplierName,
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
                                            this.loadItemsOfSelectedInvoice(data[i].invoiceNum, data[i].date, data[i].totalBill, data[i].cashPaid, data[i].balance);
                                        }}
                                        color="warning"
                                        className="edit"
                                    >
                                        <Dvr />
                                    </Button>{" "}
                                </div>
                            )
                        };
                        purchasesInvoices.push(_data);
                    }
                    this.setState({ purchasesInvoices });
                    this.setState({
                        loading: false,
                        numberOfRows: data.length,
                        totalCost: response.totalCost,
                        cashPaid: response.cashPaid,
                        balance: response.balance,
                        supplierNames: [],
                        selectedSupplierId: '',
                        selectedSupplierName: '',
                    });
                })
                .catch(exception => {
                    console.log(exception);
                });
        } else {
            const purchasesInvoices = [];
            this.setState({
                loading: true,
                purchasesHistoryCaption: "From purchases history of " + this.state.selectedSupplierName + " between " + this.state.selectedFromDate + " and " + this.state.selectedToDate,
                purchasesSummaryCaption: "From purchases history of " + this.state.selectedSupplierName + " between " + this.state.selectedFromDate + " and " + this.state.selectedToDate,
                purchasesBtn: ''
            });
            Helper.http
                .jsonPost("searchBySupplierBetweenTimePeriod", {
                    supplierId: this.state.selectedSupplierId,
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
                                            this.loadItemsOfSelectedInvoice(data[i].invoiceNum, data[i].date, data[i].totalBill, data[i].cashPaid, data[i].balance);
                                        }}
                                        color="warning"
                                        className="edit"
                                    >
                                        <Dvr />
                                    </Button>{" "}
                                </div>
                            )
                        };
                        purchasesInvoices.push(_data);
                    }
                    this.setState({ purchasesInvoices });
                    this.setState({
                        loading: false,
                        numberOfRows: data.length,
                        totalCost: response.totalCost,
                        cashPaid: response.cashPaid,
                        balance: response.balance,
                        supplierNames: [],
                        selectedSupplierId: '',
                        selectedSupplierName: '',
                    });
                })
                .catch(exception => {
                    console.log(exception);
                });
        }

    };

    //search details between two dates from all purchases data
    searchPurchasesBetweenTimePeriod = () => {
        const purchasesInvoices = [];
        this.setState({
            loading: true,
            purchasesHistoryCaption: "From purchases history between " + this.state.selectedFromDate + " and " + this.state.selectedToDate,
            purchasesSummaryCaption: "From purchases history between " + this.state.selectedFromDate + " and " + this.state.selectedToDate,
            purchasesBtn: ''
        });
        Helper.http
            .jsonPost("searchPurchasesBetweenTimePeriod", {
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
                                        this.loadItemsOfSelectedInvoice(data[i].invoiceNum, data[i].date, data[i].totalBill, data[i].cashPaid, data[i].balance);
                                    }}
                                    color="warning"
                                    className="edit"
                                >
                                    <Dvr />
                                </Button>{" "}
                            </div>
                        )
                    };
                    purchasesInvoices.push(_data);
                }
                this.setState({ purchasesInvoices });
                this.setState({
                    loading: false,
                    numberOfRows: data.length,
                    totalCost: response.totalCost,
                    cashPaid: response.cashPaid,
                    balance: response.balance,
                    supplierNames: [],
                    selectedSupplierId: '',
                    selectedSupplierName: '',
                });
            })
            .catch(exception => {
                console.log(exception);
            });

    };

    //select the supplier from search bar
    selectBySupplierName = (value) => {
        const supplierNames = [];
        this.setState({
            supplierTableLoading: true,
            typingName: value
        });
        Helper.http
            .jsonPost("getSelectedSupplierByName", {
                supplierName: value
            })
            .then(response => {
                let data = response.data.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        id: data[i].id,
                        searchResult: data[i].supplierName,
                        actions: (
                            // we've added some custom button actions
                            <div className="actions-right">
                                {/* use this button to add supplier */}
                                <Button
                                    justIcon
                                    round
                                    simple
                                    onClick={() => {
                                        this.selectSupplier(data[i].id, data[i].supplierName);
                                    }}
                                    color="success"
                                    className="remove"
                                >
                                    <Done />
                                </Button>{" "}
                            </div>
                        )
                    };
                    supplierNames.push(_data);
                }
                this.setState({ supplierNames });
                this.setState({ supplierTableLoading: false });
            })
            .catch(exception => {
                console.log(exception);
                this.setState({
                    supplierTableLoading: false,
                    supplierNames: []
                });
            });
    }

    //search purchases history by details
    searchByDetails = (value) => {
        if (this.state.selectedRadioBtn === 'radio1') {
            const purchasesInvoices = [];
            this.setState({
                loading: true,
                purchasesHistoryCaption: "From details captured as '" + value + "'",
                purchasesSummaryCaption: "From details captured as '" + value + "'",
                purchasesBtn: '',
                typingDetail: value
            });
            Helper.http
                .jsonPost("getPurchasesDataFromDetails", {
                    details: value
                })
                .then(response => {
                    let data = response.data;
                    for (let i = 0; i < data.length; i++) {
                        const _data = {
                            invoiceNum: data[i].invoiceNum,
                            supplierName: data[i].supplierName,
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
                                            this.loadItemsOfSelectedInvoice(data[i].invoiceNum, data[i].date, data[i].totalBill, data[i].cashPaid, data[i].balance);
                                        }}
                                        color="warning"
                                        className="edit"
                                    >
                                        <Dvr />
                                    </Button>{" "}
                                </div>
                            )
                        };
                        purchasesInvoices.push(_data);
                    }
                    this.setState({ purchasesInvoices });
                    this.setState({
                        loading: false,
                        numberOfRows: data.length,
                        totalCost: response.totalCost,
                        cashPaid: response.cashPaid,
                        balance: response.balance,
                        supplierNames: [],
                        selectedSupplierId: '',
                        selectedSupplierName: '',
                    });
                })
                .catch(exception => {
                    console.log(exception);
                    this.getTodayPurchasesInvoiceDetails();
                });
        } else {
            const purchasesInvoices = [];
            this.setState({
                loading: true,
                purchasesHistoryCaption: "From details captured as '" + value + "' between " + this.state.selectedFromDate + " and " + this.state.selectedToDate,
                purchasesSummaryCaption: "From details captured as '" + value + "' between " + this.state.selectedFromDate + " and " + this.state.selectedToDate,
                purchasesBtn: '',
                typingDetail: value
            });
            Helper.http
                .jsonPost("getPurchasesDataFromDetailsBetweenTimePeriod", {
                    details: value,
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
                                            this.loadItemsOfSelectedInvoice(data[i].invoiceNum, data[i].date, data[i].totalBill, data[i].cashPaid, data[i].balance);
                                        }}
                                        color="warning"
                                        className="edit"
                                    >
                                        <Dvr />
                                    </Button>{" "}
                                </div>
                            )
                        };
                        purchasesInvoices.push(_data);
                    }
                    this.setState({ purchasesInvoices });
                    this.setState({
                        loading: false,
                        numberOfRows: data.length,
                        totalCost: response.totalCost,
                        cashPaid: response.cashPaid,
                        balance: response.balance,
                        supplierNames: [],
                        selectedSupplierId: '',
                        selectedSupplierName: '',
                    });
                })
                .catch(exception => {
                    console.log(exception);
                    this.getTodayPurchasesInvoiceDetails();
                });
        }
    }

    //save the selected supplier ID and supplier name in a state
    selectSupplier = (supplierId, supplierName) => {
        this.setState({
            selectedSupplierId: supplierId,
            selectedSupplierName: supplierName,
        });
    }

    //clear the selected supplier ID and supplier name from the state
    clearSelectedSupplier = () => {
        this.setState({
            selectedSupplierId: '',
            selectedSupplierName: '',
        });
    }

    //radio button change handling function
    handleRadioBtnChange = (event) => {
        console.log(event.target.value);
        this.setState({
            selectedRadioBtn: event.target.value
        });
        if (event.target.value === 'radio1') {
            this.setState({
                selectedToDate: Moment(Date()).format("YYYY-MM-DD"),
                selectedFromDate: Moment(Date()).format("YYYY-MM-DD"),
            });
        }
    };

    //today purchases button click function
    todayPurchasesBtnClick = () => {
        this.setState({
            purchasesBtn: 'todayPurchases',
        });
        this.getTodayPurchasesInvoiceDetails();
    }

    //all purchases button click function
    allPurchasesBtnClick = () => {
        this.setState({
            purchasesBtn: 'allPurchases',
        });
        this.getAllPurchasesInvoiceDetails();
    }

    //this will get the invoice details as well as the items that purchased under that invoice number
    loadItemsOfSelectedInvoice = (invoiceNumber, date, totalBill, cashPaid, balance) => {
        const purchasesHistoryItems = [];
        this.setState({ invoiceFormLoading: true });
        Helper.http
            .jsonPost("purchasesHistoryMoreDetails", {
                invoiceNum: invoiceNumber
            })
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        id: data[i].id,
                        productName: data[i].productName,
                        purchasePrice: data[i].purchasePrice,
                        amount: data[i].amount,
                        amountPurchases: data[i].amountPurchases,
                    };
                    purchasesHistoryItems.push(_data);
                }
                this.setState({
                    purchasesHistoryItems,
                    invoiceTotalBill: totalBill,
                    invoiceDate: date,
                    invoiceCashPaid: cashPaid,
                    invoiceBalance: balance,
                    invoiceInvoiceNumber: invoiceNumber,
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

                {/* dialog box which is open after action button clicked in purchase history table */}
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
                                    <h1 className="no-margin">Purchases Invoice</h1>
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
                                                    <td>{parseInt(this.state.invoiceTotalBill, 10).toLocaleString() + ".00"}</td>
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
                                                <th>Quantity</th>
                                                <th>Price</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.purchasesHistoryItems.map((item, index) =>
                                                    <tr key={item.id}>
                                                        <td>
                                                            <p>{item.productName}</p>
                                                        </td>
                                                        <td>{item.amountPurchases}</td>
                                                        <td>{item.purchasePrice}</td>
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
                                                <th>Total</th>
                                                <td>{parseInt(this.state.invoiceTotalBill, 10).toLocaleString() + ".00"}</td>
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
                                            <label className="k-radio-label">Search within all Purchases</label>
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
                                                simple={this.state.purchasesBtn === 'allPurchases' || this.state.purchasesBtn === ''}
                                                size='sm'
                                                round
                                                color="twitter"
                                                className={classes.viewPurchasesButtons}
                                                onClick={this.todayPurchasesBtnClick}> View today Purchases
                                            </Button>
                                            <Button
                                                simple={this.state.purchasesBtn === 'todayPurchases' || this.state.purchasesBtn === ''}
                                                size='sm'
                                                round
                                                color="twitter"
                                                className={classes.viewPurchasesButtons}
                                                onClick={this.allPurchasesBtnClick}> View all Purchases
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
                                                        disabled={this.state.selectedSupplierId !== '' || this.state.typingInvoice !== ''}
                                                        size='sm'
                                                        color="success"
                                                        className={classes.searchByDateButton}
                                                        onClick={this.searchPurchasesBetweenTimePeriod}>
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
                                                                placeholder="Insert Purchases Number"
                                                                value={this.state.typingInvoice}
                                                                callback={record => console.log(record)}
                                                                onChange={this.invoiceNumberCatch}
                                                            />
                                                            <Button
                                                                disabled={this.state.typingInvoice === ''}
                                                                size='sm'
                                                                color="success"
                                                                className={classes.searchButton}
                                                                onClick={this.searchByPurchasesInvoiceNumber}>
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
                                                    tabButton: "Supplier",
                                                    tabContent: (
                                                        <span>
                                                            <CustomInput
                                                                labelText="Selected Supplier"
                                                                id="selectedSupplierName"
                                                                disabled
                                                                formControlProps={{
                                                                    fullWidth: true
                                                                }}
                                                                value={this.state.selectedSupplierName}
                                                            />
                                                            <ReactSearchBox
                                                                placeholder="Insert Supplier Name"
                                                                value={this.state.typingName}
                                                                callback={record => console.log(record)}
                                                                onChange={this.selectBySupplierName}
                                                            />
                                                            <Button
                                                                disabled={this.state.selectedSupplierId === ''}
                                                                size='sm'
                                                                color="success"
                                                                className={classes.searchButton}
                                                                onClick={this.searchBySupplierName}> Search
                                                            </Button>
                                                            <Button
                                                                disabled={this.state.selectedSupplierId === ''}
                                                                size='sm'
                                                                color="danger"
                                                                className={classes.searchButton}
                                                                onClick={this.clearSelectedSupplier}> Clear
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
                                            loading={this.state.supplierTableLoading}
                                            data={this.state.supplierNames}
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
                                <h4 className={classes.cardIconTitle}>Purchases Summary - <small>{this.state.purchasesSummaryCaption}</small></h4>
                            </CardHeader>
                            <LoadingOverlay
                                active={this.state.loading}
                                spinner
                                text='Loading...'
                            >
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <CardBody>
                                            <h4>Total Cost</h4>
                                            <h4>Cash Paid (-)</h4>
                                            <br />
                                            <h4>Payment Due</h4>
                                        </CardBody>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <CardBody>
                                            <h4 className={classes.alignright}><small>{parseInt(this.state.totalCost, 10).toLocaleString() + ".00"}</small></h4>
                                            <h4 className={classes.alignright}><small>{parseInt(this.state.cashPaid, 10).toLocaleString() + ".00"}</small></h4>
                                            <br />
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
                                    <h4 className={classes.cardIconTitle}>Purchase History - <small>{this.state.purchasesHistoryCaption}</small></h4>
                                </CardHeader>
                                <CardBody>
                                    <ReactTable
                                        data={this.state.purchasesInvoices}
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
                                                    <div className="actions-left"><strong>Supplier Name</strong></div>),
                                                accessor: "supplierName",
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

export default withStyles(styles)(PurchaseHistory);