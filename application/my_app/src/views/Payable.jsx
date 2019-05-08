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
        marginTop: "15px",
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
    addButton: {
        float: "right"
    },
    ...sweetAlertStyle,
    ...extendedFormsStyle,
};

class Payable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tradePayables: [],
            loading: false,
            open: false,
            alertOpen: false,
            successAlert: false,
            numberOfRows: 1,
            succesAlertMsg: "",
            formTitle: "",
            invoiceNum: "",
            totalBill: 0,
            cashPaid: 0,
            additionalPayment: 0,
            selectedDate: Moment(Date()).format("YYYY-MM-DD"),

            //states success false
            additionalPaymentState: '',
        };
        this.updateState = this.updateState.bind(this);
    }

    //get the selected date from the calender and convert it to YYYY-MM-DD format
    updateState(date) {
        // This function gives you the moment object of date selected. 
        var dateString = date._d;
        var dateObj = new Date(dateString);
        var momentObj = Moment(dateObj);
        var momentString = momentObj.format('YYYY-MM-DD');
        this.setState({ selectedDate: momentString });
    }

    componentDidMount() {
        this.getTradePayableDetails();
    }

    //get purhcase invoice details
    getTradePayableDetails = () => {
        const tradePayables = [];
        this.setState({ loading: true });

        Helper.http
            .jsonGet("getTradePayableDetails")
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
                                            invoiceNum: data[i].invoiceNum,
                                            totalBill: data[i].totalBill,
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
                    tradePayables.push(_data);
                }
                this.setState({ tradePayables });
                this.setState({
                    loading: false,
                    numberOfRows: data.length,
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    settleTradePayable = () => {
        if (this.state.additionalPayment <= 0) {
            this.setState({
                alertOpen: true,
                alertDiscription: "You have not done any change"
            });
        } else {
            let newCashPaid = Number(this.state.cashPaid) + Number(this.state.additionalPayment);
            let newBalance = this.state.balance - this.state.additionalPayment;

            if (newBalance < 0) {
                this.setState({
                    alertOpen: true,
                    alertDiscription: "You are paying more than the payment due"
                });
            } else {
                Helper.http
                    .jsonPost("tradePayablePayments", {
                        invoiceNum: this.state.invoiceNum,
                        cashPaid: newCashPaid,
                        balance: newBalance,
                    })
                    .then(response => {
                        this.setState({
                            additionalPayment: '',
                            additionalPaymentState: '',
                            successAlert: true,
                            succesAlertMsg: "Payment Due settlement for invoice number " + this.state.invoiceNum + " is successful"
                        });
                    })
                    .catch(exception => {
                        console.log(exception);
                    });

                if (this.state.additionalPayment > 0) {
                    Helper.http
                        .jsonPost("addCashPaid", {
                            invoiceNum: this.state.invoiceNum,
                            date: this.state.selectedDate,
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

    //dialog box close
    dialogBoxClose = () => {
        this.setState({
            open: false,
            additionalPayment: 0,

            //states success false
            additionalPaymentState: '',
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
            open: false
        });
        this.getTradePayableDetails();
    };

    change(event, stateName, type, stateNameEqualTo, maxValue) {
        switch (type) {
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

                {/* trade Payable more info dialog box */}
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
                                            disabled={true}
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
                                            onChange={this.updateState}
                                        />
                                    </FormControl>
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
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
                                            onClick={this.settleTradePayable}>
                                            <AddCircle className={classes.icons} /> Add
                                        </Button>
                                    </FormControl>
                                </GridItem>
                            </GridContainer>
                        </CardBody>
                    </Card>
                </Dialog>

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
                                    <h4 className={classes.cardIconTitle}>Trade Payables</h4>
                                </CardHeader>
                                <CardBody>
                                    <ReactTable
                                        data={this.state.tradePayables}
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

export default withStyles(styles)(Payable);