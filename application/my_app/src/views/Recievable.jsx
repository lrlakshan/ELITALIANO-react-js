import React from 'react';

// react component for creating dynamic tables
import ReactTable from "react-table";
import Helper from '../utils/Helper';
import LoadingOverlay from 'react-loading-overlay';
import SweetAlert from "react-bootstrap-sweetalert";
import Datetime from "react-datetime";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import CustomInput from "../components/CustomInput/CustomInput.jsx";

// @material-ui/icons
import Cash from "@material-ui/icons/MonetizationOn";
import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
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
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Moment from "moment";

import { cardTitle } from "../assets/jss/material-dashboard-pro-react.jsx";
import sweetAlertStyle from "../assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";
import extendedFormsStyle from "../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";

const styles = {
    cardIconTitle: {
        ...cardTitle,
        marginTop: "5px",
        marginBottom: "0px"
    },
    dialogBoxCloseIcon: {
        position: "absolute",
        marginLeft: "89%",
        marginBottom: "0px",
    },
    cardSize: {
        width: "570px"
    },
    otherCardSize: {
        width: "570px",
        height: "390px"
    },
    addButton: {
        float: "right"
    },
    ...sweetAlertStyle,
    ...extendedFormsStyle,
};

class Recievable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tradeReceivables: [],
            otherIncomeReceivables: [],
            loading: false,
            open: false,
            otherIncomeOpen: false,
            alertOpen: false,
            successAlert: false,
            numberOfRows: 1,
            succesAlertMsg: "",
            formTitle: "",
            invoiceNum: "",
            detailsOther: '',
            otherIncomeId: '',
            totalBill: 0,
            discount: 0,
            cashPaid: 0,
            totalBillOther: 0,
            cashPaidOther: 0,
            balanceOther: 0,
            additionalDiscount: 0,
            additionalPayment: 0,
            additionalPaymentOther: 0,
            TRselectedDate: Moment(Date()).format("YYYY-MM-DD"),
            ICselectedDate: Moment(Date()).format("YYYY-MM-DD"),

            //states success false
            additionalDiscountState: '',
            additionalPaymentState: '',
            additionalPaymentOtherState: ''
        };
        this.tradeReceivableRepayDate = this.tradeReceivableRepayDate.bind(this);
        this.OtherIncomeReceivableRepayDate = this.OtherIncomeReceivableRepayDate.bind(this);
    }

    //get the selected date from the calender and convert it to YYYY-MM-DD format
    tradeReceivableRepayDate(date) {
        // This function gives you the moment object of date selected. 
        var dateString = date._d;
        var dateObj = new Date(dateString);
        var momentObj = Moment(dateObj);
        var momentString = momentObj.format('YYYY-MM-DD');
        this.setState({ TRselectedDate: momentString });
    }

    //get the selected date from the calender and convert it to YYYY-MM-DD format
    OtherIncomeReceivableRepayDate(date) {
        // This function gives you the moment object of date selected. 
        var dateString = date._d;
        var dateObj = new Date(dateString);
        var momentObj = Moment(dateObj);
        var momentString = momentObj.format('YYYY-MM-DD');
        this.setState({ ICselectedDate: momentString });
    }

    componentDidMount() {
        this.getTradeReceivableDetails();
        this.getOtherIncomeReceivableDetails();
    }

    //get purhcase invoice details
    getTradeReceivableDetails = () => {
        const tradeReceivables = [];
        this.setState({ loading: true });

        Helper.http
            .jsonGet("getTradeReceivableDetails")
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
                                            invoiceNum: data[i].invoiceNum,
                                            totalBill: data[i].totalBill,
                                            discount: data[i].discount,
                                            cashPaid: data[i].cashPaid,
                                            balance: data[i].balance
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
                    tradeReceivables.push(_data);
                }
                this.setState({ tradeReceivables });
                this.setState({ 
                    loading: false,
                    numberOfRows: data.length, 
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //settle payment due in trade receivable history
    settleTradeReceivable = () =>{
        if (this.state.additionalDiscount + this.state.additionalPayment <= 0) {
            this.setState({
                alertOpen: true,
                alertDiscription: "You have not done any change"
            });
        } else {
            let newDiscount = Number(this.state.discount) + Number(this.state.additionalDiscount);
            let newCashPaid = Number(this.state.cashPaid) + Number(this.state.additionalPayment);
            let newBalance = this.state.balance - this.state.additionalPayment -this.state.additionalDiscount;

            if (newBalance < 0) {
                this.setState({
                    alertOpen: true,
                    alertDiscription: "You are paying more than the payment due"
                });
            }else {
                Helper.http
                    .jsonPost("tradeReceivablePayments", {
                        invoiceNum: this.state.invoiceNum,
                        discount: newDiscount,
                        cashPaid: newCashPaid,
                        balance: newBalance,
                    })
                    .then(response => {
                        this.setState({
                            additionalDiscount: '',
                            additionalPayment: '',
                            additionalDiscountState: '',
                            additionalPaymentState: '',
                            successAlert: true,
                            succesAlertMsg: "Payment Due settlement for invoice number " + this.state.invoiceNum + " is successful"
                        });
                    })
                    .catch(exception => {
                        console.log(exception);
                    });

                    if(this.state.additionalPayment > 0){
                        Helper.http
                            .jsonPost("addCashReceived", {
                                invoiceNum: this.state.invoiceNum,
                                date: this.state.TRselectedDate,
                                cashPaid: this.state.additionalPayment
                            })
                            .then(response => {

                            })
                            .catch(exception => {
                                console.log(exception);
                            });
                    }
            }
            
        }
    }

    //settle payment due in other receivable history
    settleTradeReceivableOther = () => {
        if (this.state.additionalPaymentOther <= 0) {
            this.setState({
                alertOpen: true,
                alertDiscription: "You have not done any change"
            });
        } else {
            let newCashPaid = Number(this.state.cashPaidOther) + Number(this.state.additionalPaymentOther);
            let newBalance = this.state.balanceOther - this.state.additionalPaymentOther;

            if (newBalance < 0) {
                this.setState({
                    alertOpen: true,
                    alertDiscription: "You are paying more than the payment due"
                });
            } else {
                Helper.http
                    .jsonPost("OtherIncomeReceivablePayments", {
                        otherIncomeId: this.state.otherIncomeId,
                        cashPaid: newCashPaid,
                        balance: newBalance,
                    })
                    .then(response => {
                        this.setState({
                            additionalPayment: '',
                            additionalPaymentOtherState: '',
                            successAlert: true,
                            succesAlertMsg: "Payment Due settlement for Other Income ID " + this.state.otherIncomeId + " is successful"
                        });
                    })
                    .catch(exception => {
                        console.log(exception);
                    });

                if (this.state.additionalPaymentOther > 0) {
                    Helper.http
                        .jsonPost("addCashReceivedFromOtherIncome", {
                            otherIncomeId: this.state.otherIncomeId,
                            date: this.state.ICselectedDate,
                            cashPaid: this.state.additionalPaymentOther
                        })
                        .then(response => {

                        })
                        .catch(exception => {
                            console.log(exception);
                        });
                }
            }

        }
    }

    //get purhcase invoice details
    getOtherIncomeReceivableDetails = () => {
        const otherIncomeReceivables = [];
        this.setState({ loading: true });

        Helper.http
            .jsonGet("getOtherIncomeReceivableDetails")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        otherIncomeId: data[i].otherIncomeId,
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
                                            otherIncomeOpen: true,
                                            otherIncomeId: data[i].otherIncomeId,
                                            detailsOther: data[i].details,
                                            totalBillOther: data[i].totalBill,
                                            cashPaidOther: data[i].cashPaid,
                                            balanceOther: data[i].balance
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
                    otherIncomeReceivables.push(_data);
                }
                this.setState({ otherIncomeReceivables });
                this.setState({
                    loading: false,
                    numberOfRows: data.length,
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //dialog box close
    dialogBoxClose = () => {
        this.setState({
            open: false,
            additionalDiscount: 0,
            additionalPayment: 0,

            //states success false
            additionalDiscountState: '',
            additionalPaymentState: '',
        });
    }

    //dialog box close
    otherIncomeDialogBoxClose = () => {
        this.setState({
            otherIncomeOpen: false,
            additionalPaymentOther: 0,

            //states success false
            additionalPaymentOtherState: '',
        });
    }

    //alert close
    alertClose = () => {
        this.setState({
            alertOpen: false
        });
    }

    //success message sweet alert hide function
    hideAlert_success = () => {
        this.setState({
            successAlert: false,
            succesAlertMsg: "",
        });
        this.dialogBoxClose();
        this.otherIncomeDialogBoxClose();
        this.getTradeReceivableDetails();
        this.getOtherIncomeReceivableDetails();
    };

    change(event, stateName, type, stateNameEqualTo, maxValue) {
        switch (type) {
            case "additionalDiscountLength":
                if ((event.target.value >= 0)) {
                    this.setState({
                        [stateName + "State"]: "success",
                        additionalDiscount: event.target.value
                    });
                } else {
                    this.setState({
                        [stateName + "State"]: "error",
                        additionalDiscount: event.target.value
                    });
                }
                break;
            case "additionalPaymentLength":
                if ((event.target.value >= 0)) {
                    this.setState({
                        [stateName + "State"]: "success",
                        additionalPayment: event.target.value
                    });
                } else {
                    this.setState({
                        [stateName + "State"]: "error",
                        additionalPayment: event.target.value
                    });
                }
                break;
            case "additionalPaymentLengthOther":
                if ((event.target.value >= 0)) {
                    this.setState({
                        [stateName + "State"]: "success",
                        additionalPaymentOther: event.target.value
                    });
                } else {
                    this.setState({
                        [stateName + "State"]: "error",
                        additionalPaymentOther: event.target.value
                    });
                }
                break;
            default:
                break;
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>

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
                
                {/* trade receivable more info dialog box */}
                <Dialog
                    open={this.state.open}
                    aria-labelledby="alert-dialog-title"
                >
                <br />
                    <Button
                        justIcon
                        round
                        simple
                        onClick={this.dialogBoxClose}
                        color="danger"
                        className={classes.dialogBoxCloseIcon}
                    >
                        <Close />
                    </Button>
                    <Card className={classes.cardSize}>
                        <CardHeader color="primary" icon>
                            <CardIcon color="primary">
                                <Cash />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Settle Payment - <small>{this.state.invoiceNum}</small></h4>
                        </CardHeader>
                        <br />
                        <CardBody>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={6}>
                                
                                    <FormControl >
                                        <CustomInput
                                            disabled={true}
                                            labelText="Total Bill"
                                            id="totalBill"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            value={this.state.totalBill}
                                        />
                                    </FormControl>
                                    <FormControl >
                                        <CustomInput
                                            disabled = {true}
                                            labelText="Promo Discount"
                                            id="discount"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            value={this.state.discount}
                                        />
                                    </FormControl>
                                    <FormControl >
                                        <CustomInput
                                            disabled = {true}
                                            labelText="Cash Paid"
                                            id="cashPaid"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            value={this.state.cashPaid}
                                        />
                                    </FormControl>
                                    <FormControl >
                                        <CustomInput
                                            disabled={true}
                                            labelText="Payment Due"
                                            id="balance"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            value={this.state.balance}
                                        />
                                    </FormControl>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6}>
                                    <InputLabel className={classes.label}>Date</InputLabel>
                                    <br />
                                    <FormControl >
                                        <Datetime
                                            timeFormat={false}
                                            dateFormat="YYYY-MM-DD"
                                            defaultValue={Moment(Date()).format("YYYY-MM-DD")}
                                            onChange={this.tradeReceivableRepayDate}
                                        />
                                    </FormControl>
                                    <FormControl >
                                        <CustomInput
                                            success={this.state.additionalDiscountState === "success"}
                                            error={this.state.additionalDiscountState === "error"}
                                            labelText="Additional Discount"
                                            id="additionalDiscount"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                onChange: event =>
                                                    this.change(event, "additionalDiscount", "additionalDiscountLength", 1),
                                                type: "number"
                                            }}
                                            onChange={(event) => this.setState({ additionalDiscount: event.target.value })}
                                            value={this.state.additionalDiscount.toString()}
                                        />
                                    </FormControl>
                                    <FormControl >
                                        <CustomInput
                                            success={this.state.additionalPaymentState === "success"}
                                            error={this.state.additionalPaymentState === "error"}
                                            labelText="Additional Payment"
                                            id="additionalPayment"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                onChange: event =>
                                                    this.change(event, "additionalPayment", "additionalPaymentLength", 1),
                                                type: "number"
                                            }}
                                            onChange={(event) => this.setState({ additionalPayment: event.target.value })}
                                            value={this.state.additionalPayment.toString()}
                                        />
                                        <br />
                                        <Button
                                            size='sm'
                                            color="info"
                                            onClick={this.settleTradeReceivable}>
                                            <AddCircle className={classes.icons} /> Add
                                        </Button>
                                    </FormControl>
                            </GridItem>
                        </GridContainer>
                        </CardBody>
                    </Card>
                </Dialog>

                {/* other income receivable more info dialog box */}
                <Dialog
                    open={this.state.otherIncomeOpen}
                    aria-labelledby="alert-dialog-title"
                >
                    <br />
                    <Button
                        justIcon
                        round
                        simple
                        onClick={this.otherIncomeDialogBoxClose}
                        color="danger"
                        className={classes.dialogBoxCloseIcon}
                    >
                        <Close />
                    </Button>
                    <Card className={classes.otherCardSize}>
                        <CardHeader color="primary" icon>
                            <CardIcon color="primary">
                                <Cash />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Settle Payment</h4>
                        </CardHeader>
                        <br />
                        <CardBody>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                    <FormControl >
                                        <CustomInput
                                            disabled={true}
                                            labelText="Details"
                                            id="details"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            value={this.state.detailsOther}
                                        />
                                    </FormControl>
                                    <FormControl >
                                        <CustomInput
                                            disabled={true}
                                            labelText="Total Bill"
                                            id="totalBill"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            value={this.state.totalBillOther}
                                        />
                                    </FormControl>
                                    <FormControl >
                                        <CustomInput
                                            disabled={true}
                                            labelText="Cash Paid"
                                            id="cashPaid"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            value={this.state.cashPaidOther}
                                        />
                                    </FormControl>
                                    <FormControl >
                                        <CustomInput
                                            disabled={true}
                                            labelText="Payment Due"
                                            id="balance"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            value={this.state.balanceOther}
                                        />
                                    </FormControl>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <InputLabel className={classes.label}>Date</InputLabel>
                                    <br />
                                    <FormControl >
                                        <Datetime
                                            timeFormat={false}
                                            dateFormat="YYYY-MM-DD"
                                            defaultValue={Moment(Date()).format("YYYY-MM-DD")}
                                            onChange={this.OtherIncomeReceivableRepayDate}
                                        />
                                    </FormControl>
                                    <FormControl >
                                        <CustomInput
                                            success={this.state.additionalPaymentOtherState === "success"}
                                            error={this.state.additionalPaymentOtherState === "error"}
                                            labelText="Additional Payment"
                                            id="additionalPaymentOther"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                onChange: event =>
                                                    this.change(event, "additionalPaymentOther", "additionalPaymentLengthOther", 1),
                                                type: "number"
                                            }}
                                            onChange={(event) => this.setState({ additionalPaymentOther: event.target.value })}
                                            value={this.state.additionalPaymentOther.toString()}
                                        />
                                        <br />
                                        <Button
                                            size='sm'
                                            color="info"
                                            onClick={this.settleTradeReceivableOther}>
                                            <AddCircle className={classes.icons} /> Add
                                        </Button>
                                    </FormControl>
                                </GridItem>
                            </GridContainer>
                        </CardBody>
                    </Card>
                </Dialog>

                {/* trade receivable card */}
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
                                    <h4 className={classes.cardIconTitle}>Trade Receivables</h4>
                                </CardHeader>
                                <CardBody>
                                    <ReactTable
                                        data={this.state.tradeReceivables}
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
                                                    <div className="actions-right"><strong>Payment Due</strong></div>),
                                                accessor: "balance",
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

                {/* Other Income receivable card */}
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
                                    <h4 className={classes.cardIconTitle}>Other Income Receivables</h4>
                                </CardHeader>
                                <CardBody>
                                    <ReactTable
                                        data={this.state.otherIncomeReceivables}
                                        filterable={false}
                                        sortable={false}
                                        showPagination={false}
                                        defaultSorted={[
                                            {
                                                id: "otherIncomeId",
                                                desc: true
                                            }
                                        ]}
                                        columns={[
                                            {
                                                Header: () => (
                                                    <div className="actions-center"><strong>ID</strong></div>),
                                                accessor: "otherIncomeId",
                                                filterable: false,
                                                width: 100,
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
                                                    <div className="actions-left"><strong>Details</strong></div>),
                                                accessor: "details",
                                                width: 250,
                                                Cell: row => <div className="actions-left">{row.value}</div>
                                            },
                                            {
                                                Header: () => (
                                                    <div className="actions-right"><strong>Payment Due</strong></div>),
                                                accessor: "balance",
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

export default withStyles(styles)(Recievable);