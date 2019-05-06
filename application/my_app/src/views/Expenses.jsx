import React from 'react';
import ReactTable from "react-table";
import Datetime from "react-datetime";
import Helper from '../utils/Helper';
import LoadingOverlay from 'react-loading-overlay';
import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Moment from "moment";

// @material-ui/icons
import Cash from "@material-ui/icons/Work";
import Add from "@material-ui/icons/LibraryAdd";
import Close from "@material-ui/icons/Close";
import AddCircle from "@material-ui/icons/AddCircle";

// core components
import GridContainer from "../components/Grid/GridContainer.jsx";
import GridItem from "../components/Grid/GridItem.jsx";
import Card from "../components/Card/Card.jsx";
import CardHeader from "../components/Card/CardHeader.jsx";
import CardBody from "../components/Card/CardBody.jsx";
import CardIcon from "../components/Card/CardIcon.jsx";
import CustomInput from "../components/CustomInput/CustomInput.jsx";
import Button from "../components/CustomButtons/Button.jsx";

import { cardTitle } from "../assets/jss/material-dashboard-pro-react.jsx";
import extendedFormsStyle from "../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";
import extendedTablesStyle from "../assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import sweetAlertStyle from "../assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";

const styles = {
    cardIconTitle: {
        ...cardTitle,
        marginTop: "15px",
        marginBottom: "0px"
    },
    addNewExpenseTypeButton: {
        position: "absolute",
        marginTop: "0px",
        paddingLeft: "55%",
        paddingTop: "1px"
    },
    addNewExpenseTypeCloseIcon: {
        position: "absolute",
        marginLeft: "88%",
        marginBottom: "0px",
    },
    cardSize: {
        width: "100%"
    },
    expenseTypeSaveButton: {
        float: "right"
    },
    ...extendedFormsStyle,
    ...extendedTablesStyle,
    ...sweetAlertStyle
};


class Expenses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expenseTypes: [],
            expenseDetails: [],
            expenseTabeleLoading: false,
            addNewExpenseFormOpen: false,
            successAlert: false,
            alertOpen: false,
            numberOfRows: 0,
            selectedExpenseTypeId: '',
            simpleSelectExpense: '',
            enteredDetail: '',
            enteredAmount: '',
            expenseTypeIdNextNumber: '',
            expenseName: '',
            selectedDate: Moment(Date()).format("YYYY-MM-DD"),

            //states success false
            expenseNameState: '',
            amountState: '',
            detailsState: ''
        };
        this.expenseTypeSaveButtonClick = this.expenseTypeSaveButtonClick.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    componentDidMount() {
        this.getAllExpenseTypes();
        this.getExpensesDetails();
    }

    //get last 15 data rows of expense details
    getExpensesDetails = () => {
        const expenseDetails = [];
        this.setState({ expenseTabeleLoading: true });
        Helper.http
            .jsonGet("getExpensesDetails")
            .then(response => {
                let data = response.data.data;
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
                    expenseTabeleLoading: false,
                    numberOfRows: data.length,
                });
            })
            .catch(exception => {
                console.log(exception);
            });
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

    //open pop up form of add new expense type
    getAllExpenseTypes = () => {
        const expenseTypes = [];
        Helper.http
            .jsonGet("getAllExpenseTypes")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        expenseId: data[i].expenseId,
                        expenseName: data[i].expenseName,
                    };
                    expenseTypes.push(_data);
                }
                this.setState({ expenseTypes });
            })
            .catch(exception => {
                console.log(exception);
            });
    }

    //Saving the new expense type
    expenseTypeSaveButtonClick = () => {
        if (this.state.expenseName === "") {
            this.setState({ expenseNameState: "error" });
        }
        if (this.state.expenseName !== "") {
            Helper.http
                .jsonPost("addExpenseType", {
                    expenseId: this.state.expenseTypeIdNextNumber,
                    expenseName: this.state.expenseName,
                })
                .then(response => {
                    this.setState({
                        expenseNameState: '',
                        expenseName: '',
                        successAlert: true,
                        succesAlertMsg: "Expense details added successfully"
                    });
                    this.getAllExpenseTypes();
                    
                })
                .catch(exception => {
                    if (exception === 2002) {
                        this.setState({
                            alertOpen: true,
                            alertDiscription: "Please Check your connection",
                        });
                    }
                });
        }
    }

    //open pop up form of add new expense type
    addNewExpenseType = () =>{
        this.setState({ loading: true });
        Helper.http
            .jsonGet("expenseTypeIdNextNumber")
            .then(response => {
                this.setState({
                    addNewExpenseFormOpen: true,
                    expenseTypeIdNextNumber: response.data
                });
                this.setState({ loading: false });
            })
            .catch(exception => {
                console.log(exception);
            });
    }

    //Add new expense detail to the database
    addNewExpense = () => {
        if (this.state.enteredDetail === "") {
            this.setState({ detailsState: "error" });
        }
        if (this.state.enteredAmount === "") {
            this.setState({ amountState: "error" });
        } 
        if (this.state.selectedExpenseTypeId === "") {
            this.setState({
                alertOpen: true,
                alertDiscription: "You have to pick a expense type"
             });
        } else {
            Helper.http
                .jsonPost("addNewExpense", {
                    expenseTypeId: this.state.selectedExpenseTypeId,
                    date: this.state.selectedDate,
                    details: this.state.enteredDetail,
                    cashPaid: this.state.enteredAmount,
                })
                .then(response => {
                    this.setState({
                        enteredDetail: '',
                        enteredAmount: '',
                        selectedExpenseTypeId: '',
                        simpleSelectExpense: '',
                        amountState: '',
                        detailsState: ''
                    });
                    this.getExpensesDetails();
                    // this.setState({ loading: false });
                })
                .catch(exception => {
                    console.log(exception);
                });
        }
    }

    //select the expense type from the drop down function
    handleSelectedExpense = event => {
        this.setState({
            [event.target.name]: event.target.value,
            selectedExpenseTypeId: event.target.value
        });
    };

    //close pop up form of add new expense type
    addNewExpenseTypeClose = () => {
        this.setState({
            addNewExpenseFormOpen: false,
            expenseName: '',
            expenseNameState: ''
        })
    }

    //success message sweet alert hide function
    hideAlert_success = () => {
        this.setState({
            successAlert: false,
            succesAlertMsg: "",
        });
        this.addNewExpenseTypeClose();
    };

    //alert close
    alertClose = () => {
        this.setState({
            alertOpen: false
        });
    }

    // function that verifies if a string has a given length or not
    verifyLength(value, length) {
        if (value.length >= length) {
            return true;
        }
        return false;
    }

    change(event, stateName, type, stateNameEqualTo, maxValue) {
        switch (type) {
            case "expenseNameLength":
                if (this.verifyLength(event.target.value, stateNameEqualTo)) {
                    this.setState({
                        [stateName + "State"]: "success",
                        expenseName: event.target.value
                    });
                } else {
                    this.setState({
                        [stateName + "State"]: "error",
                        expenseName: event.target.value
                    });
                }
                break;
            case "detailsLength":
                if (this.verifyLength(event.target.value, stateNameEqualTo)) {
                    this.setState({
                        [stateName + "State"]: "success",
                        enteredDetail: event.target.value
                    });
                } else {
                    this.setState({
                        [stateName + "State"]: "error",
                        enteredDetail: event.target.value
                    });
                }
                break;
            case "amountLength":
                if (this.verifyLength(event.target.value, stateNameEqualTo)) {
                    this.setState({
                        [stateName + "State"]: "success",
                        enteredAmount: event.target.value
                    });
                } else {
                    this.setState({
                        [stateName + "State"]: "error",
                        enteredAmount: event.target.value
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

                {/* Add new expense type dialog box */}
                <Dialog
                    open={this.state.addNewExpenseFormOpen}
                    aria-labelledby="alert-dialog-title"
                >
                    <LoadingOverlay
                        active={this.state.loading}
                        spinner
                        text='Loading...'
                    >
                        <Button
                            justIcon
                            round
                            simple
                            onClick={this.addNewExpenseTypeClose}
                            color="danger"
                            className={classes.addNewExpenseTypeCloseIcon}
                        >
                            <Close />
                        </Button>
                        <br />
                        <Card className={classes.cardSize}>
                            <CardHeader color="primary" icon>
                                <CardIcon color="primary">
                                    <Add />
                                </CardIcon>
                                <h4 className={classes.cardIconTitle}>Add new Expense Type</h4>
                            </CardHeader>
                            <CardBody>
                                <form>
                                    <CustomInput
                                        disabled={true}
                                        labelText="Expense Type ID"
                                        id="expenseTypeId"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        defaultValue={this.state.expenseTypeIdNextNumber.toString()}
                                    />
                                    <CustomInput
                                        success={this.state.expenseNameState === "success"}
                                        error={this.state.expenseNameState === "error"}
                                        labelText="Expense Name *"
                                        id="expenseName"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            onChange: event =>
                                                this.change(event, "expenseName", "expenseNameLength", 1),
                                            type: "text"
                                        }}
                                        onChange={(event) => this.setState({ expenseName: event.target.value })}
                                        defaultValue={this.state.expenseName}
                                    />
                                    <div>
                                        <Button
                                            size='sm'
                                            color="info"
                                            onClick={this.expenseTypeSaveButtonClick}
                                            className={classes.expenseTypeSaveButton}
                                        >
                                            Save
                                    </Button>
                                    </div>
                                </form>

                            </CardBody>
                        </Card>
                    </LoadingOverlay>
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

                <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                        <Card>
                            <CardHeader color="primary" icon>
                                <CardIcon color="primary">
                                    <Cash />
                                </CardIcon>
                                <h4 className={classes.cardIconTitle}>Enter Expenses</h4>
                            </CardHeader>
                            <br />
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <Button
                                            simple
                                            round
                                            color="success"
                                            // disabled={this.state.saleDetailsList.length !== 0}
                                            className={classes.addNewExpenseTypeButton}
                                            onClick={this.addNewExpenseType}>
                                            <AddCircle className={classes.icons} />
                                        </Button>
                                        <InputLabel className={classes.label}>Expenses Category</InputLabel>
                                        <br />
                                        <br />
                                        <FormControl
                                            fullWidth
                                            className={classes.selectFormControl}
                                        >
                                            <InputLabel
                                                htmlFor="simple-selectExpense"
                                                className={classes.selectLabel}
                                            >
                                                Select expense type
                                            </InputLabel>
                                            <Select
                                                MenuProps={{
                                                    className: classes.selectMenu
                                                }}
                                                classes={{
                                                    select: classes.select
                                                }}
                                                value={this.state.simpleSelectExpense}
                                                onChange={this.handleSelectedExpense}
                                                inputProps={{
                                                    name: "simpleSelectExpense",
                                                    id: "simple-selectExpense"
                                                }}
                                            >
                                                <MenuItem
                                                    disabled
                                                    classes={{
                                                        root: classes.selectMenuItem
                                                    }}
                                                >
                                                    Selcet Expense Type
                                                </MenuItem>
                                                {this.state.expenseTypes.map((type, index) =>
                                                    <MenuItem
                                                        key={type.expenseId}
                                                        value={type.expenseId}
                                                        classes={{
                                                            root: classes.selectMenuItem,
                                                            selected: classes.selectMenuItemSelected
                                                        }} >
                                                        {type.expenseName}
                                                    </MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                    </CardBody>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
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
                                        <FormControl >
                                            <CustomInput
                                                success={this.state.detailsState === "success"}
                                                error={this.state.detailsState === "error"}
                                                labelText="Details *"
                                                id="details"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    onChange: event =>
                                                        this.change(event, "details", "detailsLength", 1),
                                                    type: "text"
                                                }}
                                                onChange={(event) => this.setState({ enteredDetail: event.target.value })}
                                                value={this.state.enteredDetail}
                                            />
                                        </FormControl>
                                        <FormControl >
                                            <CustomInput
                                                success={this.state.amountState === "success"}
                                                error={this.state.amountState === "error"}
                                                labelText="Amount *"
                                                id="amount"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    onChange: event =>
                                                        this.change(event, "amount", "amountLength", 1),
                                                    type: "number"
                                                }}
                                                onChange={(event) => this.setState({ enteredAmount: event.target.value })}
                                                value={this.state.enteredAmount}
                                            />
                                            <br />
                                            <Button
                                                size='sm'
                                                color="info"
                                                onClick={this.addNewExpense}>
                                                <AddCircle className={classes.icons} /> Add
                                        </Button>
                                        </FormControl>
                                    </CardBody>
                                </GridItem>
                            </GridContainer>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                        <Card>
                            <CardHeader>
                                <h4 className={classes.cardTitle}>
                                    Last 15 Records of Expenses
                                </h4>
                            </CardHeader>
                            <CardBody>
                                <ReactTable
                                    loading={this.state.expenseTabeleLoading}
                                    data={this.state.expenseDetails}
                                    noDataText=""
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
                                    pageSize={this.state.numberOfRows}
                                    showPaginationBottom={false}
                                    className="-striped -highlight"
                                />
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

export default withStyles(styles)(Expenses);