import React from 'react';
import ReactTable from "react-table";
import Datetime from "react-datetime";
import ReactSearchBox from 'react-search-box'
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
import Person from "@material-ui/icons/GroupAdd";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import Add from "@material-ui/icons/AddToQueue";
import Remove from "@material-ui/icons/RemoveFromQueue";
import Bill from "@material-ui/icons/ShoppingCart";
import Close from "@material-ui/icons/Close";
import Done from "@material-ui/icons/Done";
import AddCircle from "@material-ui/icons/AddCircle";
import Customer from "@material-ui/icons/PermIdentity";
import Checkout from "@material-ui/icons/FindInPage";
import Payment from "@material-ui/icons/AssignmentTurnedIn";
import Invoice from "@material-ui/icons/Description";

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

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import elitaliano_logo from '../assets/img/elitaliano_logo.png';
import "../assets/scss/purchaseInvoice.css"

const styles = {
    dialogPaper: {
        maxWidth: '850px',
    },
    cardIconTitle: {
        ...cardTitle,
        marginTop: "15px",
        marginBottom: "0px"
    },
    AddNewCustomerButton: {
        marginTop: "15px",
        marginLeft: "25px",
        marginBottom: "0px",
        width: "150px"
    },
    CustomerSelectFormOpenButton: {
        position: "absolute",
        marginTop: "25px",
        paddingLeft: "10%",
    },
    marginCenter: {
        marginTop: "15px",
        marginLeft: "25px",
        marginBottom: "0px",
        width: "150px"
    },
    ProceedButtonStyle: {
        position: "absolute",
        marginTop: "50px",
        marginLeft: "87%",
        marginBottom: "20px",
    },
    closeIcon: {
        position: "absolute",
        marginLeft: "96%",
        marginBottom: "0px",
    },
    paymentCloseIcon: {
        position: "absolute",
        marginLeft: "89%",
        marginBottom: "0px",
    },
    selectCustomerCloseIcon: {
        position: "absolute",
        marginLeft: "95%",
        marginBottom: "0px",
    },
    addNewCustomerCloseIcon: {
        position: "absolute",
        marginLeft: "92%",
        marginBottom: "0px",
    },
    invoiceCloseIcon: {
        position: "absolute",
        marginLeft: "94%",
        marginBottom: "0px",
    },
    cardSize: {
        width: "100%"
    },
    paymentCardSize: {
        width: "400px"
    },
    printInvoiceSize: {
        width: "842px"
    },
    addButton: {
        float: "right"
    },
    invoiceButton: {
        float: "right"
    },
    ...extendedFormsStyle,
    ...extendedTablesStyle,
    ...sweetAlertStyle
};

function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    return (
        row[id] !== undefined ?
            String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
            :
            true
    );
}

class Cashier extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alertOpen: false,
            customerSelectOpen: false,
            customerTableLoading: false,
            AddNewCustomerForm: false,
            tableLoading: false,
            checkoutOpen: false,
            proceedOpen: false,
            nextButtonDisabled: true,
            pdfPrinted: false,
            invoiceOpen: false,
            totalBill: "0.00",
            totalBillRegular: "0.00",
            cashPaid: "0.00",
            discount: "0.00",
            balance: "0.00",
            purchasePrice: "0.00",
            salesInvoiceNextNumber: null,
            numberOfRows: 1,
            customerIdNextNumber: '',
            customerNames: [],
            productList :[],
            saleDetailsList: [],
            selectedCustomerId: '',
            selectedCustomerName: '',
            newCustomerName: '',
            newCustomerMobile: '',
            typingName: '',
            typingMobile: '',
            addNewCustomerloading: false,
            successAlert: false,
            saleCompleted: false,
            succesAlertMsg: "",
            simpleSelectProduct: "",
            details: "",
            selectedDate: Moment(Date()).format("YYYY-MM-DD"),

            //cashier product details states
            amountAvailable: "0",
            marketPrice: '0.00',
            sellingPrice: '0.00',
            amountPurchases: 0,

            //delete alert states
            deleteAlert: false,
            deleteAlertSuccess: false,

            //states success false
            newCustomerNameState: '',
            newCustomerMobileState: '',
            amountPurchasesState: ''
        };
        this.customerSaveButtonClick = this.customerSaveButtonClick.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    componentDidMount() {
        this.getMenuList();
        this.getSalesInvoiceNextNumber();
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

    //print PDF button click
    printPDF = () => {
        const input = document.getElementById('divToPrint');
        html2canvas(input, {
            scale: "1.2"
        })
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                var imgWidth = 210;
                var pageHeight = 295;
                var imgHeight = canvas.height * imgWidth / canvas.width;
                var heightLeft = imgHeight;
                const pdf = new jsPDF();
                var position = 0;

                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                pdf.save(this.state.salesInvoiceNextNumber + "-" + this.state.selectedCustomerName + "-" + this.state.details + ".pdf");

                //un comment this to enable print feature
                // pdf.autoPrint();
                // window.open(pdf.output('bloburl'), '_blank');

                this.setState({ pdfPrinted: true });
            });
    }

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
                        mobileNumber: data[i].mobileNumber,
                        customerName: data[i].customerName,
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

    //customer select by mobile number
    selectByCustomerMobile = (value) => {
        const customerNames = [];
        this.setState({ 
            customerTableLoading: true,
            typingMobile: value
         });
        Helper.http
            .jsonPost("getSelectedCustomerByMobile", {
                mobileNumber: value
            })
            .then(response => {
                let data = response.data.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        id: data[i].id,
                        mobileNumber: data[i].mobileNumber,
                        customerName: data[i].customerName,
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

    //this will open the customer selecting form 
    CustomerSelectFormOpenButtonClick = () => {
        this.setState({
            customerSelectOpen: true
        })
    } 
    
    //Add new customer form open button
    AddNewCustomerButtonClick = () => {
        this.setState({ loading: true });
        Helper.http
            .jsonGet("customerIdNextNumber")
            .then(response => {
                this.setState({ 
                    AddNewCustomerForm: true,
                    customerIdNextNumber: response.data
                 });
                this.setState({ loading: false });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //Add new customer form close button
    AddNewCustomerFormClose = () => {
        this.setState({
            AddNewCustomerForm: false,
            newCustomerNameState: '',
            newCustomerMobileState: '',
            newCustomerName: '',
            newCustomerMobile: ''
        })
    } 

    //Saving the new customer
    customerSaveButtonClick = () => {
        this.setState({
            addNewCustomerloading: true
        })
        if (this.state.newCustomerName === "") {
            this.setState({ newCustomerNameState: "error" });
        }
        if (this.state.newCustomerName !== ""){
            Helper.http
                .jsonPost("addNewCustomer", {
                    customerName: this.state.newCustomerName,
                    mobileNumber: this.state.newCustomerMobile,
                })
                .then(response => {
                    this.setState({
                        addNewCustomerloading: false,
                        newCustomerNameState: '',
                        newCustomerMobileState: '',
                        newCustomerName: '',
                        newCustomerMobile: '',
                        successAlert: true,
                        succesAlertMsg: "New customer added successfully"
                    });
                })
                .catch(exception => {
                    if (exception === 2002){
                        this.setState({
                            alertOpen: true,
                            alertDiscription: "Please Check your connection",
                            addNewCustomerloading: false
                        });
                    }
                });
        }
        this.setState({
            addNewCustomerloading: false
        })
    } 

    //save the selected customer ID and customer name in a state
    selectCustomer = (customerId, customerName) => {
        this.setState({
            selectedCustomerId: customerId,
            selectedCustomerName: customerName,
        })
    }

    //clear the selected customer ID and customer name from the state
    clearSelectedCustomer = () => {
        this.setState({
            selectedCustomerId: '',
            selectedCustomerName: '',
        })
    }

    //close the pop up window after selecting the customer
    customerSelectClose = () => {
        this.setState({
            customerSelectOpen: false,
            customerNames: []
        })
    }

    //alert dialog box close
    handleClose = () => {
        this.setState({ alertOpen: false });
    };

    //success message sweet alert hide function
    hideAlert_success = () => {
        this.setState({
            successAlert: false,
            succesAlertMsg: "",
            AddNewCustomerForm: false
        });
    };

    //get the product list for product drop down
    getMenuList = () => {
        const productList = [];
        Helper.http
            .jsonGet("productDetails")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        productId: data[i].productId,
                        productName: data[i].productName,
                    };
                    productList.push(_data);
                }
                this.setState({ productList });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //select item from the select product drop down menu and send to backend
    handleSelectedProduct = event => {
        this.setState({
            [event.target.name]: event.target.value,
            productId: event.target.value
        });
        Helper.http
            .jsonPost("getSelectedProductDetails", {
                productId: event.target.value
            })
            .then(response => {

                this.setState({
                    amountAvailable: response.data.amountAvailable,
                    marketPrice: response.data.marketPrice,
                    sellingPrice: response.data.sellingPrice,
                    purchasePrice: response.data.purchasePrice,
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //add to list button handle function
    addToListButtonClick = () => {
        if (this.state.simpleSelectProduct === "") {
            this.setState({
                alertOpen: true,
                alertDiscription: "You have to select a product from the dropdown menu. If not you have to add the product details from Inventory => View Stocks => Add New"
            })
        } else {
            if (this.state.amountPurchases <= 0) {
                this.setState({
                    amountPurchasesState: "error",
                    alertOpen: true,
                    alertDiscription: "You have to enter a valid amount as amount purchases"
                });
            }
            if (this.state.amountPurchases > 0) {
                this.setState({ tableLoading: true });
                Helper.http
                    .jsonPost("addSales", {
                        invoiceNum: this.state.salesInvoiceNextNumber,
                        date: this.state.selectedDate,
                        productId: this.state.productId,
                        customerId: this.state.selectedCustomerId,
                        purchasePrice: this.state.purchasePrice,
                        sellingPrice: this.state.sellingPrice,
                        amountPurchases: this.state.amountPurchases,
                        marketPrice: this.state.marketPrice
                    })
                    .then(response => {
                        this.setState({
                            tableLoading: false,
                            productList: [],
                            amountAvailable: "0",
                            purchasePrice: "0.00",
                            sellingPrice: "0.00",
                            marketPrice: "0.00",
                            amountPurchasesState: "",
                            amountPurchases: 0,
                            simpleSelectProduct: ""
                        });
                        this.getMenuList();
                        this.getSalesDetails();
                    })
                    .catch(exception => {
                        console.log(exception);
                    });
            }
        }
    }

    //get the next sales invoice number after the last bil generated
    getSalesInvoiceNextNumber = () => {
        Helper.http
            .jsonGet("salesInvoiceNextNumber")
            .then(response => {
                this.setState({ salesInvoiceNextNumber: response.data });
                this.removeListInReload();
                this.getSalesDetails();
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    //preview items in the current invoice number 
    getSalesDetails = () => {
        const saleDetailsList = [];
        this.setState({ tableLoading: true });
        Helper.http
            .jsonPost("getsaleListDetails", {
                invoiceNum: this.state.salesInvoiceNextNumber,
            })
            .then(response => {
                let data = response.data;
                this.setState({
                    numberOfRows: data.length,
                    totalBill: (response.sum.totalBill != null) ? response.sum.totalBill : "0.00",
                    totalBillRegular: (response.sum.totalBillRegular != null) ? response.sum.totalBillRegular : "0.00"
                });
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        id: data[i].id,
                        productName: data[i].productName,
                        amountPurchases: data[i].amountPurchases,
                        sellingPrice: data[i].sellingPrice,
                        marketPrice: data[i].marketPrice,
                        amount: data[i].amount,
                        regAmount: data[i].regAmount,
                        actions: (
                            // we've added some custom button actions
                            <div className="actions-right">
                                {/* use this button to remove the data row */}
                                <Button
                                    justIcon
                                    round
                                    simple
                                    onClick={() => {
                                        this.listItemDelete(data[i].id);
                                    }}
                                    color="danger"
                                    className="remove"
                                >
                                    <Close />
                                </Button>{" "}
                            </div>
                        )
                    };
                    saleDetailsList.push(_data);
                }
                this.setState({
                    saleDetailsList,
                    tableLoading: false
                });
            })
            .catch(exception => {
                console.log(exception);
            });
    }

    //removing previous puchase list after reloading
    removeListInReload = () => {
        Helper.http
            .jsonPost("salesClearList", {
                invoiceNum: this.state.salesInvoiceNextNumber
            })
            .then(response => {
                this.setState({
                    alertOpen: true,
                    alertDiscription: "Your previous list has been cleared. Re-Enter your list you wish to buy"
                });
                this.getSalesDetails();
            })
            .catch(exception => {
                console.log(exception);
            });
    }

    //delete items from the list
    listItemDelete = (id) => {
        Helper.http
            .jsonPost("deleteSales", {
                Id: id
            })
            .then(response => {
                this.getSalesDetails();
            })
            .catch(exception => {
                console.log(exception);
                this.setState({
                    alertOpen: true,
                    alertDiscription: "Error occured when removing this item"
                });
            });
    }

    //remove all button click function
    removeAllButtonClick = () => {
        Helper.http
            .jsonPost("salesClearList", {
                invoiceNum: this.state.salesInvoiceNextNumber
            })
            .then(response => {
                this.setState({
                    deleteAlertSuccess: true,
                    deleteAlert: false
                });
                this.getSalesDetails();
            })
            .catch(exception => {
                console.log(exception);
                this.setState({
                    alertOpen: true,
                    deleteAlert: false,
                    alertDiscription: "Error occured when clearing the List"
                });
            });
    }

    //are you sure to delete sweet alert cancel button function
    hideAlert_delete = () => {
        this.setState({
            deleteAlert: false,
        });
    };

    //item delete success message hide function
    Alert_delete_success_close = () => {
        this.setState({
            deleteAlertSuccess: false
        });
    };

    //checkout button function
    checkOutOpen = () => {
        this.setState({
            checkoutOpen: true
        });
    };

    //checkout dialog box close
    checkoutClose = () => {
        this.setState({ checkoutOpen: false });
    };

    //proceed button function
    proceedOpen = () => {
        this.setState({
            proceedOpen: true,
            checkoutOpen: false,
            balance: this.state.totalBill,
            cashPaid: "0.00",
            discount: "0.00",
            details: ""
        });
    };

    //payment dialog box close and checkout dialog box open again
    proceedClose = () => {
        this.setState({
            proceedOpen: false,
            checkoutOpen: true,
            nextButtonDisabled: true
        });
    };

    //calculate remaining cash to be paid to the customer
    calBalance = () => {
        let x = this.state.totalBill - this.state.cashPaid - this.state.discount;
        if (x < 0) {
            this.setState({
                alertOpen: true,
                alertDiscription: "You are entering a cash paid amount which is greater than the total bill"
            });
        } else {
            this.setState({
                balance: x,
                nextButtonDisabled: false
            });
            const element = document.getElementById("nextBtn");
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    //Next button function
    nextButton = () => {

        // --------------- USe this if you want to add a detail note is compulsory
        // if (this.state.details === "") {
        //     this.setState({
        //         alertOpen: true,
        //         alertDiscription: "You have to add a small note on the purchase"
        //     });
        // } else {
        //     this.setState({
        //         invoiceOpen: true,
        //         proceedOpen: false,
        //     });
        // }

        this.setState({
            invoiceOpen: true,
            proceedOpen: false,
        });
    };

    //invocie dialog box close and payment dialog box open again
    invoiceClose = () => {
        this.setState({
            invoiceOpen: false,
            proceedOpen: true,
            nextButtonDisabled: true,
            pdfPrinted: false
        });
    };

    //final purchase done button click. This will call sales invoice API
    purchaseDoneButtonClick = () => {
        Helper.http
            .jsonPost("addSalesInvoice", {
                invoiceNum: this.state.salesInvoiceNextNumber,
                customerId: this.state.selectedCustomerId,
                date: this.state.selectedDate,
                details: this.state.details,
                totalBill: this.state.totalBill,
                discount: this.state.discount,
                cashPaid: this.state.cashPaid,
                balance: this.state.balance,
            })
            .then(response => {
                this.setState({
                    saleCompleted: true,
                    invoiceOpen: false
                });
                // this.getMenuList();
                // this.getSupplierList();
                // this.getPurchaseInvoiceNextNumber();
                // this.getPurchaseDetails();
            })
            .catch(exception => {
                console.log(exception);
            });

            if(this.state.cashPaid !== "0.00"){
                Helper.http
                    .jsonPost("addCashReceived", {
                        invoiceNum: this.state.salesInvoiceNextNumber,
                        date: this.state.selectedDate,
                        cashPaid: this.state.cashPaid,
                    })
                    .then(response => {
                        console.log('added cash received from sales');
                    })
                    .catch(exception => {
                        console.log(exception);
                    });
            }

    };

    //sale complete sweet alert close function
    sale_complete_alert_close = () => {
        this.setState({
            saleCompleted: false,
        });
        window.location.reload();

        ////-------use this code if reload takes too much time. check it after live deployment------

        // this.setState({
        //     saleCompleted: false,
        //     selectedDate: Moment(Date()).format("YYYY-MM-DD"),
        //     simpleSelectSupplier:""
        // });
        // this.getPurchaseInvoiceNextNumber();
        // this.getPurchaseDetails();

        //------------------------------------------------------------------------------------
    };

    // function that verifies if a string has a given length or not
    verifyLength(value, length) {
        if (value.length >= length) {
            return true;
        }
        return false;
    }
    // function that verifies if value contains only numbers
    verifyNumber(value) {
        var numberRex = new RegExp("^[0-9]+$");
        if (numberRex.test(value)) {
            return true;
        }
        return false;
    }

    change(event, stateName, type, stateNameEqualTo, maxValue) {
        switch (type) {
            case "number":
                if (this.verifyNumber(event.target.value)) {
                    this.setState({ [stateName + "State"]: "success" });
                } else {
                    this.setState({ [stateName + "State"]: "error" });
                }
                break;
            case "newCustomerNameLength":
                if (this.verifyLength(event.target.value, stateNameEqualTo)) {
                    this.setState({ 
                        [stateName + "State"]: "success",
                        newCustomerName: event.target.value 
                    });
                } else {
                    this.setState({ 
                        [stateName + "State"]: "error",
                        newCustomerName: event.target.value  
                    });
                }
                break;
            case "newCustomerMobileLength":
                if (this.verifyLength(event.target.value, stateNameEqualTo)) {
                    this.setState({
                        [stateName + "State"]: "success",
                        newCustomerMobile: event.target.value
                    });
                } else {
                    this.setState({
                        [stateName + "State"]: "error",
                        newCustomerMobile: event.target.value 
                    });
                }
                break;
            case "amoutPurchaseNumber":
                if (event.target.value <= 0) {
                    this.setState({ [stateName + "State"]: "error" });
                    this.setState({ amountPurchases: event.target.value })
                } else {
                    this.setState({ [stateName + "State"]: "success" });
                    this.setState({ amountPurchases: event.target.value })
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

                {/* checkout dialog box */}
                <Dialog
                    open={this.state.checkoutOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    scroll="body"
                >
                    <Button
                        justIcon
                        round
                        simple
                        onClick={this.checkoutClose}
                        color="danger"
                        className={classes.closeIcon}
                    >
                        <Close />
                    </Button>
                    <br />
                    <Card className={classes.cardSize}>
                        <CardHeader color="primary" icon>
                            <CardIcon color="primary">
                                <Checkout />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Checkout</h4>
                        </CardHeader>
                        <br />
                        <Button
                            size='sm'
                            color="info"
                            className={classes.ProceedButtonStyle}
                            onClick={this.proceedOpen}>
                            <Bill className={classes.icons} /> Proceed
                            </Button>
                        <br />
                        <CardBody>
                            <ReactTable
                                loading={this.state.tableLoading}
                                data={this.state.saleDetailsList}
                                noDataText=""
                                defaultFilterMethod={filterCaseInsensitive}
                                defaultSorted={[
                                    {
                                        id: "id",
                                        desc: true
                                    }
                                ]}
                                columns={[
                                    {
                                        Header: () => (
                                            <strong>Product Name</strong>),
                                        accessor: "productName",
                                        filterable: false,
                                        sortable: false,
                                        width: 150
                                    },
                                    {
                                        Header: () => (
                                            <strong>Qty</strong>),
                                        accessor: "amountPurchases",
                                        filterable: false,
                                        sortable: false,
                                        width: 50,
                                        Cell: row => <div className="actions-right">{row.value}</div>
                                    },
                                    {
                                        Header: () => (
                                            <div className="actions-right">
                                                <strong>Regular Price *1</strong></div>),
                                        accessor: "marketPrice",
                                        filterable: false,
                                        sortable: false,
                                        width: 150,
                                        Cell: row => <div className="actions-right">{row.value}</div>
                                    },
                                    {
                                        Header: () => (
                                            <div className="actions-right">
                                                <strong>Total</strong></div>),
                                        accessor: "regAmount",
                                        filterable: false,
                                        sortable: false,
                                        width: 100,
                                        Cell: row => <div className="actions-right">{row.value}</div>
                                    },
                                    {
                                        Header: () => (
                                            <div className="actions-right">
                                                <strong>Sale Price *1</strong></div>),
                                        accessor: "sellingPrice",
                                        filterable: false,
                                        sortable: false,
                                        width: 150,
                                        Cell: row => <div className="actions-right">{row.value}</div>
                                    },
                                    {
                                        Header: () => (
                                            <div className="actions-right">
                                                <strong>Total</strong></div>),
                                        accessor: "amount",
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
                            <br />
                            <div className="inv-footer">
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>Sub Total</th>
                                            <td>{parseInt(this.state.totalBillRegular, 10).toLocaleString() + ".00"}</td>
                                        </tr>
                                        <tr>
                                            <th>Discount (-)</th>
                                            <td>{parseInt(this.state.totalBillRegular - this.state.totalBill, 10).toLocaleString() + ".00"}</td>
                                        </tr>
                                        <tr>
                                            <th>Total</th>
                                            <td>{parseInt(this.state.totalBill, 10).toLocaleString() + ".00"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardBody>
                    </Card>
                </Dialog>

                {/* payment dialog box */}
                <Dialog
                    open={this.state.proceedOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                // maxWidth="sm"
                // scroll="body"
                >
                    <Button
                        justIcon
                        round
                        simple
                        onClick={this.proceedClose}
                        color="danger"
                        className={classes.paymentCloseIcon}
                    >
                        <Close />
                    </Button>
                    <br />
                    <Card className={classes.paymentCardSize}>
                        <CardHeader color="primary" icon>
                            <CardIcon color="primary">
                                <Payment />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Payment</h4>
                        </CardHeader>
                        <CardBody>
                            <form>
                                <CustomInput
                                    labelText="Details"
                                    id="details"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        type: "text"
                                    }}
                                    onChange={(event) => this.setState({ details: event.target.value })}
                                    defaultValue={this.state.details}
                                />
                                <CustomInput
                                    disabled= {true}
                                    labelText="Total Bill"
                                    id="totalBill"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    defaultValue={parseInt(this.state.totalBill, 10).toLocaleString() + ".00"}
                                />
                                <CustomInput
                                    labelText="Discount"
                                    id="discount"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        type: "number"
                                    }}
                                    onChange={(event) => this.setState({ discount: event.target.value })}
                                    defaultValue={this.state.discount}
                                />
                                <CustomInput
                                    labelText="Cash Paid"
                                    id="cashPaid"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        type: "number"
                                    }}
                                    onChange={(event) => this.setState({ cashPaid: event.target.value })}
                                    defaultValue={this.state.cashPaid}
                                />
                                <div>
                                    <Button
                                        size='sm'
                                        color="info"
                                        onClick={this.calBalance}
                                        className={classes.addButton}
                                    >
                                        Calculate
                                    </Button>
                                </div>
                                <CustomInput
                                    disabled={true}
                                    labelText="Balance"
                                    id="balance"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    value={parseInt(this.state.balance, 10).toLocaleString() + ".00"}
                                />
                                <div>
                                    <Button
                                        id="nextBtn"
                                        disabled={this.state.nextButtonDisabled}
                                        size='sm'
                                        color="info"
                                        onClick={this.nextButton}
                                        className={classes.addButton}
                                    >
                                        Next>>
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </Dialog>

                {/* Invoice dialog box */}
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
                    <Card className={classes.printInvoiceSize}>
                        <CardHeader color="primary" icon>
                            <CardIcon color="primary">
                                <Invoice />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Invoice</h4>
                        </CardHeader>
                        <br />
                        <CardBody>
                            <div >
                                <Button
                                    disabled={!this.state.pdfPrinted}
                                    size='sm'
                                    color="info"
                                    onClick={this.purchaseDoneButtonClick}
                                    className={classes.invoiceButton}
                                > Purchase
                            </Button>
                                <Button
                                    size='sm'
                                    color="info"
                                    onClick={this.printPDF}
                                    className={classes.invoiceButton}
                                > Print PDF
                            </Button>
                            </div>
                            <div id="divToPrint" className="container">
                                <div >
                                    <h1 className="no-margin">Sales Invoice</h1>
                                </div>
                                <div className="inv-header">
                                    <div>
                                        <img src={elitaliano_logo} alt = "elitaliano logo" className="inv-logo" />
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
                                                    <td>{this.state.salesInvoiceNextNumber}</td>
                                                </tr>
                                                <tr>
                                                    <th>Issue Date</th>
                                                    <td>{this.state.selectedDate}</td>
                                                </tr>
                                                <tr>
                                                    <th>Total</th>
                                                    <td>{parseInt(this.state.totalBill - this.state.discount, 10).toLocaleString() + ".00"}</td>
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
                                                this.state.saleDetailsList.map((item, index) =>
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
                                                <td>{parseInt(this.state.totalBillRegular, 10).toLocaleString() + ".00"}</td>
                                            </tr>
                                            <tr>
                                                <th>Discount (-)</th>
                                                <td>{parseInt(this.state.totalBillRegular - this.state.totalBill, 10).toLocaleString() + ".00"}</td>
                                            </tr>
                                            {this.state.discount !== "0.00"
                                                ? <tr>
                                                    <th>Promo Discount (-)</th>
                                                    <td>{parseInt(this.state.discount, 10).toLocaleString() + ".00"}</td>
                                                </tr> :
                                                null
                                            }
                                            <tr>
                                                <th>Total</th>
                                                <td>{parseInt(this.state.totalBill - this.state.discount, 10).toLocaleString() + ".00"}</td>
                                            </tr>
                                            <tr>
                                                <th>Cash Paid</th>
                                                <td>{parseInt(this.state.cashPaid, 10).toLocaleString() + ".00"}</td>
                                            </tr>
                                            <tr>
                                                <th>Payment Due</th>
                                                <td>{parseInt(this.state.balance, 10).toLocaleString() + ".00"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Dialog>

                {/* customer select dialog box */}
                <Dialog
                    open={this.state.customerSelectOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    scroll="body"
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
                        onClick={this.customerSelectClose}
                        color="danger"
                        className={classes.selectCustomerCloseIcon}
                    >
                        <Close />
                    </Button>
                    <br />
                    <Card className={classes.cardSize}>
                        <CardHeader color="primary" icon>
                            <CardIcon color="primary">
                                    <Customer />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Select Customer</h4>
                        </CardHeader>
                        <CardBody>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <Button
                                            color="info"
                                            onClick={this.AddNewCustomerButtonClick}
                                            className={classes.AddNewCustomerButton}
                                        > <AddCircle className={classes.icons} />Add New
                                        </Button>
                                        <br />
                                        <br />
                                        <InputLabel className={classes.label}>Search By Customer Name</InputLabel>
                                        <br />
                                        <br />
                                        <ReactSearchBox
                                            placeholder="Customer Name"
                                            value={this.state.typingName}
                                            callback={record => console.log(record)}
                                            onChange={this.selectByCustomerName}
                                        />
                                        <br />
                                        <br />
                                        <InputLabel className={classes.label}>Search By Mobile Number</InputLabel>
                                        <br />
                                        <br />
                                        <ReactSearchBox
                                            placeholder="Mobile Number"
                                            value={this.state.typingMobile}
                                            callback={record => console.log(record)}
                                            onChange={this.selectByCustomerMobile}
                                        />
                                        <br />
                                        <CustomInput
                                            labelText="Selected Customer"
                                            id="selectedCustomerName"
                                            disabled
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            value={this.state.selectedCustomerName}
                                        />
                                        <br />
                                        <br />
                                        <Button
                                            disabled={this.state.selectedCustomerId === ''}
                                            size='sm'
                                            color="danger"
                                            onClick={this.clearSelectedCustomer}
                                            className={classes.invoiceButton}
                                        > Clear
                                        </Button>
                                        <Button
                                            disabled={this.state.selectedCustomerId === ''}
                                            size='sm'
                                            color="success"
                                            onClick={this.customerSelectClose}
                                            className={classes.invoiceButton}
                                        > Continue
                                        </Button>
                                    </CardBody>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <ReactTable
                                            loading={this.state.customerTableLoading}
                                            data={this.state.customerNames}
                                            noDataText="No Matching Results"
                                            defaultFilterMethod={filterCaseInsensitive}
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
                                                            <strong>Customer Name</strong></div>),
                                                    accessor: "customerName",
                                                    filterable: false,
                                                    sortable: false,
                                                    width: 250,
                                                    Cell: row => <div className="actions-left">{row.value}</div>
                                                },
                                                {
                                                    Header: () => (
                                                        <div className="actions-left">
                                                            <strong>Mobile Number</strong></div>),
                                                    accessor: "mobileNumber",
                                                    filterable: false,
                                                    sortable: false,
                                                    width: 135,
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
                                            pageSize="5"
                                            showPaginationBottom={false}
                                            className="-striped -highlight"
                                        />
                                    </CardBody>
                                </GridItem>
                            </GridContainer>
                            
                        </CardBody>
                    </Card>
                    </LoadingOverlay>
                </Dialog>

                {/* Add new customer detials */}
                <Dialog
                    open={this.state.AddNewCustomerForm}
                    aria-labelledby="form-dialog-title">
                    <LoadingOverlay
                        active={this.state.addNewCustomerloading}
                        spinner
                        text='Please Wait...'
                    >
                    <Button
                        justIcon
                        round
                        simple
                        onClick={this.AddNewCustomerFormClose}
                        color="danger"
                        className={classes.addNewCustomerCloseIcon}
                    >
                        <Close />
                    </Button>
                    <br />
                    <Card className={classes.cardSize}>
                        <CardHeader color="info" icon>
                            <CardIcon color="info">
                                <Person />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Add New Customer</h4>
                        </CardHeader>
                        <CardBody>
                            <form>
                                <CustomInput
                                    disabled={true}
                                    labelText="Customer ID"
                                    id="customerId"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    defaultValue={this.state.customerIdNextNumber.toString()}
                                />
                                <CustomInput
                                    success={this.state.newCustomerNameState === "success"}
                                    error={this.state.newCustomerNameState === "error"}
                                    labelText="Customer Name *"
                                    id="newCustomerName"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event =>
                                            this.change(event, "newCustomerName", "newCustomerNameLength", 1),
                                        type: "text"
                                    }}
                                    onChange={(event) => this.setState({ newCustomerName: event.target.value })}
                                    defaultValue={this.state.newCustomerName}
                                />
                                <CustomInput
                                    success={this.state.newCustomerMobileState === "success"}
                                    error={this.state.newCustomerMobileState === "error"}
                                    labelText="Mobile Number *"
                                    id="newCustomerMobile"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        type: "number"
                                    }}
                                    onChange={(event) => this.setState({ newCustomerMobile: event.target.value })}
                                    defaultValue={this.state.newCustomerMobile.toString()}
                                />
                                <div>
                                    <Button
                                        size='sm'
                                        color="info"
                                        onClick={this.customerSaveButtonClick}
                                        className={classes.addButton}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                    </LoadingOverlay>
                </Dialog>

                {/* alert dialog box */}
                <Dialog
                    open={this.state.alertOpen}
                    onClose={this.handleClose}
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
                        <Button onClick={this.handleClose} color="info" autoFocus simple> Got it! </Button>
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

                {/* delete sale item alert */}
                <SweetAlert
                    show={this.state.deleteAlert}
                    warning
                    style={{ display: "block", marginTop: "-150px" }}
                    title="Are you sure?"
                    onConfirm={() => this.removeAllButtonClick()}
                    onCancel={() => this.hideAlert_delete()}
                    confirmBtnCssClass={
                        this.props.classes.button + " " + this.props.classes.success
                    }
                    cancelBtnCssClass={
                        this.props.classes.button + " " + this.props.classes.danger
                    }
                    confirmBtnText="Yes, delete all!"
                    cancelBtnText="Cancel"
                    showCancel
                >
                    You will not be able to recover this sales list again!
                </SweetAlert>
                <SweetAlert
                    show={this.state.deleteAlertSuccess}
                    success
                    style={{ display: "block", marginTop: "-150px" }}
                    title="Deleted!"
                    onConfirm={() => this.Alert_delete_success_close()}
                    onCancel={() => this.Alert_delete_success_close()}
                    confirmBtnCssClass={
                        this.props.classes.button + " " + this.props.classes.success
                    }
                >
                    Sales list has been deleted.
                </SweetAlert>

                {/* sale complete sweet alert */}
                <SweetAlert
                    show={this.state.saleCompleted}
                    success
                    style={{ display: "block", marginTop: "-150px" }}
                    title="Successful"
                    onConfirm={() => this.sale_complete_alert_close()}
                    onCancel={() => this.sale_complete_alert_close()}
                    confirmBtnCssClass={
                        this.props.classes.button + " " + this.props.classes.success
                    }
                >
                    Your purchase has been completed
                </SweetAlert>

                <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                        <Card>
                            <CardHeader color="primary" icon>
                                <CardIcon color="primary">
                                    <LibraryBooks />
                                </CardIcon>
                                <h4 className={classes.cardIconTitle}>Invoice number <small> - {this.state.salesInvoiceNextNumber}</small></h4>
                            </CardHeader>
                            <br />
                            <GridContainer>
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
                                            inputProps={
                                                { disabled: this.state.saleDetailsList.length !== 0 }
                                            }
                                            />
                                        </FormControl>
                                        <br />
                                        <FormControl >
                                            <CustomInput
                                                labelText="Select Customer"
                                                id="customer"
                                                disabled
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "text"
                                                }}
                                                value={this.state.selectedCustomerName}
                                            />
                                        </FormControl>
                                        <Button 
                                        simple 
                                        round 
                                        color="success" 
                                        disabled={this.state.saleDetailsList.length !== 0}
                                        className={classes.CustomerSelectFormOpenButton} 
                                            onClick={this.CustomerSelectFormOpenButtonClick}>
                                            <AddCircle className={classes.icons} />
                                        </Button>

                                        <FormControl >
                                            <CustomInput
                                                labelText="Amount Available"
                                                id="amountAvailable"
                                                disabled
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "number"
                                                }}
                                                value={this.state.amountAvailable.toString()}
                                            />
                                        </FormControl>
                                        <FormControl >
                                            <CustomInput
                                                labelText="Market Price (Rs.)"
                                                id="marketPrice"
                                                disabled
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "number"
                                                }}
                                                value={this.state.marketPrice.toString()}
                                            />
                                        </FormControl>
                                        <FormControl >
                                            <CustomInput
                                                labelText="Selling Price (Rs.)"
                                                id="sellingPrice"
                                                disabled
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "number"
                                                }}
                                                value={this.state.sellingPrice.toString()}
                                            />
                                        </FormControl>
                                        <FormControl >
                                            <CustomInput
                                                success={this.state.amountPurchasesState === "success"}
                                                error={this.state.amountPurchasesState === "error"}
                                                disabled={this.state.selectedCustomerName === ''}
                                                labelText="Amount Purchases"
                                                id="amountPurchases"
                                                value={this.state.amountPurchases.toString()}
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    onChange: event =>
                                                        this.change(event, "amountPurchases", "amoutPurchaseNumber"),
                                                    type: "number"
                                                }}
                                            />
                                        </FormControl>
                                        <h1>Total</h1>
                                    </CardBody>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CardBody>
                                        <InputLabel className={classes.label}>Product Category</InputLabel>
                                        <FormControl
                                            fullWidth
                                            className={classes.selectFormControl}
                                        >
                                            <InputLabel
                                                htmlFor="simple-selectProduct"
                                                className={classes.selectLabel}
                                            >
                                                Selcet Product
                                            </InputLabel>
                                            <Select
                                                disabled = {this.state.selectedCustomerName === ''}
                                                MenuProps={{
                                                    className: classes.selectMenu
                                                }}
                                                classes={{
                                                    select: classes.select
                                                }}
                                                value={this.state.simpleSelectProduct}
                                                onChange={this.handleSelectedProduct}
                                                inputProps={{
                                                    name: "simpleSelectProduct",
                                                    id: "simple-selectProduct"
                                                }}
                                            >
                                                <MenuItem
                                                    disabled
                                                    classes={{
                                                        root: classes.selectMenuItem
                                                    }}
                                                >
                                                    Select Product
                                                </MenuItem>
                                                {this.state.productList.map((product, index) =>
                                                    <MenuItem
                                                        key={product.productId}
                                                        value={product.productId}
                                                        classes={{
                                                            root: classes.selectMenuItem,
                                                            selected: classes.selectMenuItemSelected
                                                        }} >
                                                        {product.productName}
                                                    </MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                        <br />
                                        <br />
                                        <Button 
                                            disabled={this.state.selectedCustomerName === ''}
                                            color="success" 
                                            className={classes.marginCenter} 
                                            onClick={this.addToListButtonClick}>
                                                <Add className={classes.icons} /> Add To List
                                        </Button>
                                        <Button
                                            color="danger"
                                            className={classes.marginCenter}
                                            onClick={() => {
                                                this.setState({
                                                    deleteAlert: true,
                                                });
                                            }}
                                            disabled={this.state.saleDetailsList.length === 0}
                                        >
                                            <Remove className={classes.icons} /> Remove All
                                        </Button>
                                        <Button
                                            color="github"
                                            className={classes.marginCenter}
                                            onClick={this.checkOutOpen}
                                            disabled={this.state.saleDetailsList.length === 0}
                                        >
                                            <Bill className={classes.icons} /> Checkout
                                        </Button>
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <h3 className={classes.marginCenter}><small>Rs.{(this.state.totalBill < 1000000) ? parseInt(this.state.totalBill, 10).toLocaleString() + ".00" : parseInt(this.state.totalBill, 10).toLocaleString()}</small></h3>
                                    </CardBody>
                                </GridItem>
                            </GridContainer>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                        <Card>
                            <CardBody>
                                <ReactTable
                                    loading={this.state.tableLoading}
                                    data={this.state.saleDetailsList}
                                    noDataText=""
                                    defaultFilterMethod={filterCaseInsensitive}
                                    defaultSorted={[
                                        {
                                            id: "id",
                                            desc: true
                                        }
                                    ]}
                                    columns={[
                                        {
                                            Header: () => (
                                                <strong>Product Name</strong>),
                                            accessor: "productName",
                                            filterable: false,
                                            sortable: false,
                                            width: 150
                                        },
                                        {
                                            Header: () => (
                                                <strong>Qty</strong>),
                                            accessor: "amountPurchases",
                                            filterable: false,
                                            sortable: false,
                                            width: 50,
                                            Cell: row => <div className="actions-right">{row.value}</div>
                                        },
                                        {
                                            Header: () => (
                                                <div className="actions-right">
                                                    <strong>Price</strong></div>),
                                            accessor: "sellingPrice",
                                            filterable: false,
                                            sortable: false,
                                            width: 70,
                                            Cell: row => <div className="actions-right">{row.value}</div>
                                        },
                                        {
                                            Header: () => (
                                                <div className="actions-right">
                                                    <strong>Amount</strong></div>),
                                            accessor: "amount",
                                            filterable: false,
                                            sortable: false,
                                            width: 100,
                                            Cell: row => <div className="actions-right">{row.value}</div>
                                        },
                                        {
                                            Header: "",
                                            accessor: "actions",
                                            width: 50,
                                            sortable: false,
                                            filterable: false
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

export default withStyles(styles)(Cashier);