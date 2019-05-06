import React from 'react';
import ReactTable from "react-table";
import Datetime from "react-datetime";
import ReactSearchBox from 'react-search-box'
import Helper from '../utils/Helper';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Moment from "moment";

// @material-ui/icons
import Done from "@material-ui/icons/Done";
import SalaryIcon from "@material-ui/icons/AllInbox";
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
    cardSize: {
        width: "100%"
    },
    salaryTypeSaveButton: {
        float: "right"
    },
    ...extendedFormsStyle,
    ...extendedTablesStyle,
    ...sweetAlertStyle
};


class Salary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeNames: [],
            typingName: '',
            typingId: '',
            selectedEmployeeName: '',
            selectedEmployeeId: '',
            enteredDetail: '',
            enteredAmount: '',
            selectedDate: Moment(Date()).format("YYYY-MM-DD"),
            alertOpen: false,
            employeeTableLoading: false,
            salaryTabeleLoading: false,

            //states success false
            amountState: '',
            detailsState: ''
        };
        this.updateState = this.updateState.bind(this);
    }

    componentDidMount() {
        this.getSalaryDetails();
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

    //get last 15 data rows of salary details
    getSalaryDetails = () => {
        const salaryDetails = [];
        this.setState({ salaryTabeleLoading: true });
        Helper.http
            .jsonGet("getSalarysDetails")
            .then(response => {
                let data = response.data.data;
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
                    salaryTabeleLoading: false,
                    numberOfRows: data.length,
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    }

    //select the employee from search bar entering employee name
    selectByEmployeeName = (value) => {
        const employeeNames = [];
        this.setState({
            employeeTableLoading: true,
            typingName: value
        });
        Helper.http
            .jsonPost("getSelectedEmployeeByName", {
                employeeName: value
            })
            .then(response => {
                let data = response.data.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        id: data[i].empId,
                        searchResult: data[i].empName,
                        actions: (
                            // we've added some custom button actions
                            <div className="actions-right">
                                {/* use this button to add employee */}
                                <Button
                                    justIcon
                                    round
                                    simple
                                    onClick={() => {
                                        this.selectEmployee(data[i].empId, data[i].empName);
                                    }}
                                    color="success"
                                    className="remove"
                                >
                                    <Done />
                                </Button>{" "}
                            </div>
                        )
                    };
                    employeeNames.push(_data);
                }
                this.setState({ employeeNames });
                this.setState({ employeeTableLoading: false });
            })
            .catch(exception => {
                console.log(exception);
                this.setState({
                    employeeTableLoading: false,
                    employeeNames: []
                });
            });
    }

    //select the employee from search bar entering employee ID
    selectByEmployeeId = (value) => {
        const employeeNames = [];
        this.setState({
            employeeTableLoading: true,
            typingId: value
        });
        Helper.http
            .jsonPost("getSelectedEmployeeById", {
                employeeId: value
            })
            .then(response => {
                let data = response.data.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        id: data[i].empId,
                        searchResult: data[i].empName,
                        actions: (
                            // we've added some custom button actions
                            <div className="actions-right">
                                {/* use this button to add employee */}
                                <Button
                                    justIcon
                                    round
                                    simple
                                    onClick={() => {
                                        this.selectEmployee(data[i].empId, data[i].empName);
                                    }}
                                    color="success"
                                    className="remove"
                                >
                                    <Done />
                                </Button>{" "}
                            </div>
                        )
                    };
                    employeeNames.push(_data);
                }
                this.setState({ employeeNames });
                this.setState({ employeeTableLoading: false });
            })
            .catch(exception => {
                console.log(exception);
                this.setState({
                    employeeTableLoading: false,
                    employeeNames: []
                });
            });
    }

    //Add new salary detail to the database
    addNewSalary = () => {
        if (this.state.enteredDetail === "") {
            this.setState({ detailsState: "error" });
        }
        if (this.state.enteredAmount === "") {
            this.setState({ amountState: "error" });
        }
        if (this.state.selectedEmployeeId === "") {
            this.setState({
                alertOpen: true,
                alertDiscription: "You have to select an employee"
            });
        } else {
            Helper.http
                .jsonPost("addNewSalary", {
                    empId: this.state.selectedEmployeeId,
                    date: this.state.selectedDate,
                    details: this.state.enteredDetail,
                    cashPaid: this.state.enteredAmount,
                })
                .then(response => {
                    this.setState({
                        enteredDetail: '',
                        enteredAmount: '',
                        selectedEmployeeId: '',
                        amountState: '',
                        detailsState: ''
                    });
                    this.getSalaryDetails();
                })
                .catch(exception => {
                    console.log(exception);
                });
        }
    }

    //save the selected employee ID and employee name in a state
    selectEmployee = (employeeId, employeeName) => {
        this.setState({
            selectedEmployeeId: employeeId,
            selectedEmployeeName: employeeName,
        });
    }

    //clear the selected employee ID and employee name from the state
    clearSelectedEmployee = () => {
        this.setState({
            selectedEmployeeId: '',
            selectedEmployeeName: '',
        });
    }

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
                                    <SalaryIcon />
                                </CardIcon>
                                <h4 className={classes.cardIconTitle}>Enter Salaries</h4>
                            </CardHeader>
                            <br />
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <CustomInput
                                            labelText="Selected Employee"
                                            id="selectedEmployeeName"
                                            disabled
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            value={this.state.selectedEmployeeName}
                                        />
                                        <ReactTable
                                            loading={this.state.employeeTableLoading}
                                            data={this.state.employeeNames}
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
                                        <br />
                                        <ReactSearchBox
                                            placeholder="Insert Employee ID"
                                            value={this.state.typingId}
                                            callback={record => console.log(record)}
                                            onChange={this.selectByEmployeeId}
                                        />
                                        <br />
                                        <ReactSearchBox
                                            placeholder="Insert Employee Name"
                                            value={this.state.typingName}
                                            callback={record => console.log(record)}
                                            onChange={this.selectByEmployeeName}
                                        />
                                        <Button
                                            disabled={this.state.selectedEmployeeId === ''}
                                            size='sm'
                                            color="danger"
                                            className={classes.searchButton}
                                            onClick={this.clearSelectedEmployee}> Clear
                                                            </Button>
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
                                                onClick={this.addNewSalary}>
                                                <AddCircle /> Add
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
                                    Last 15 Records of Salaries
                                </h4>
                            </CardHeader>
                            <CardBody>
                                <ReactTable
                                    loading={this.state.salaryTabeleLoading}
                                    data={this.state.salaryDetails}
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

export default withStyles(styles)(Salary);