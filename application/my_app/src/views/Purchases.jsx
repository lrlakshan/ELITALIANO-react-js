import React from "react";
import Datetime from "react-datetime";
import Helper from '../utils/Helper';


// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Moment from "moment";

// @material-ui/icons
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import Add from "@material-ui/icons/AddToQueue";
import Remove from "@material-ui/icons/RemoveFromQueue";
import Bill from "@material-ui/icons/ShoppingCart";
// import Dashboard from "@material-ui/icons/Dashboard";
// import Schedule from "@material-ui/icons/Schedule";
// import Info from "@material-ui/icons/Info";
// import LocationOn from "@material-ui/icons/LocationOn";
// import Gavel from "@material-ui/icons/Gavel";
// import HelpOutline from "@material-ui/icons/HelpOutline";

// core components
import GridContainer from "../components/Grid/GridContainer.jsx";
import GridItem from "../components/Grid/GridItem.jsx";
//import NavPills from "../components/NavPills/NavPills.jsx";
//import Accordion from "components/Accordion/Accordion.jsx";
import Card from "../components/Card/Card.jsx";
import CardHeader from "../components/Card/CardHeader.jsx";
import CardBody from "../components/Card/CardBody.jsx";
import CardIcon from "../components/Card/CardIcon.jsx";
import CustomInput from "../components/CustomInput/CustomInput.jsx";
import Button from "../components/CustomButtons/Button.jsx";

import { cardTitle } from "../assets/jss/material-dashboard-pro-react.jsx";
import extendedFormsStyle from "../assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";

const styles = {
    cardIconTitle: {
        ...cardTitle,
        marginTop: "15px",
        marginBottom: "0px"
    },
    marginCenter: {
        marginTop: "15px",
        marginLeft: "25px",
        marginBottom: "0px",
        width: "150px"
    },
    ...extendedFormsStyle
};
class Purchases extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            simpleSelectSupplier: "",
            simpleSelectProduct: "",
            productList: [],
            supplierList: [],
            amountAvailable: "0",
            purchasePrice: "0.00"
        };
    }

    onChangeFunction(component, value) {
        this.setState({ amountAvailable: value });
    }

    componentDidMount() {
        this.getMenuList();
        this.getSupplierList();
    }

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

    getSupplierList = () => {
        const supplierList = [];

        Helper.http
            .jsonGet("supplierDetails")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        id: data[i].id,
                        supplierName: data[i].supplierName,
                    };
                    supplierList.push(_data);
                }
                this.setState({ supplierList });
                console.log('data', this.state.supplierList);
            })
            .catch(exception => {
                console.log(exception);
            });
    };

    handleSelectedProduct = event => {
        this.setState({ [event.target.name]: event.target.value });
        Helper.http
            .jsonPost("getSelectedProductDetails", {
                productId: event.target.value
            })
            .then(response => {

                this.setState({
                    amountAvailable: response.data.amountAvailable,
                    purchasePrice: response.data.purchasePrice
                });

            })
            .catch(exception => {
                console.log(exception);
            });
    };

    handleSelectedSupplier = event => {
        this.setState({ [event.target.name]: event.target.value });
        // Helper.http
        //     .jsonPost("getSelectedSupplierDetails", {
        //         id: event.target.value
        //     })
        //     .then(response => {

        //         // this.setState({
        //         //     amountAvailable: response.data.amountAvailable,
        //         //     purchasePrice: response.data.purchasePrice
        //         // });
        //         console.log(response);
        //     })
        //     .catch(exception => {
        //         console.log(exception);
        //     });
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
                                    <LibraryBooks />
                                </CardIcon>
                                <h4 className={classes.cardIconTitle}>Invoice number <small> - 120</small></h4>
                            </CardHeader>
                            <br />
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>

                                    <CardBody>
                                        <InputLabel className={classes.label}>Supplier</InputLabel>
                                        <FormControl
                                            fullWidth
                                            className={classes.selectFormControl}
                                        >
                                            <InputLabel
                                                htmlFor="simple-selectSupplier"
                                                className={classes.selectLabel}
                                            >
                                                Selcet Supplier
                          </InputLabel>

                                            <Select
                                                MenuProps={{
                                                    className: classes.selectMenu
                                                }}
                                                classes={{
                                                    select: classes.select
                                                }}
                                                value={this.state.simpleSelectSupplier}
                                                onChange={this.handleSelectedSupplier}
                                                inputProps={{
                                                    name: "simpleSelectSupplier",
                                                    id: "simple-selectSupplier"
                                                }}
                                            >
                                                <MenuItem
                                                    disabled
                                                    classes={{
                                                        root: classes.selectMenuItem
                                                    }}
                                                >
                                                    Select Supplier
                                                </MenuItem>
                                                {this.state.supplierList.map((supplier, index) =>
                                                    <MenuItem
                                                        key={supplier.id}
                                                        value={supplier.id}
                                                        classes={{
                                                            root: classes.selectMenuItem,
                                                            selected: classes.selectMenuItemSelected
                                                        }} >
                                                        {supplier.supplierName}
                                                    </MenuItem>
                                                )}

                                            </Select>
                                        </FormControl>
                                        <br />
                                        <br />
                                        <InputLabel className={classes.label}>Date</InputLabel>
                                        <br />
                                        <FormControl >
                                            <Datetime
                                                timeFormat={false}
                                                dateFormat="YYYY-MM-DD"
                                                defaultValue={Moment(Date()).format("YYYY-MM-DD")}
                                            />
                                        </FormControl>
                                        <br />
                                        <br />
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
                                                labelText="Purchase Price (Rs.)"
                                                id="purchasePrice"
                                                disabled
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "number"
                                                }}
                                                value={this.state.purchasePrice.toString()}

                                            />
                                        </FormControl>
                                        <FormControl >
                                            <CustomInput
                                                labelText="Amount Purchases"
                                                id="amountPurchases"
                                                defaultValue="0"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
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
                                        <Button color="success" className={classes.marginCenter} onClick={this.handleClickOpen}>
                                            <Add className={classes.icons} /> Add To List
                            </Button>
                                        <Button color="danger" className={classes.marginCenter} onClick={this.handleClickOpen}>
                                            <Remove className={classes.icons} /> Remove
                            </Button>
                                        <Button color="github" className={classes.marginCenter} onClick={this.handleClickOpen}>
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

                                        <h3 className={classes.marginCenter}><small>Rs. 124,560.00</small></h3>
                                        {/* </CardBody>
                                    <CardBody> */}
                                        {/* <InputLabel className={classes.label}>Amount Available</InputLabel> */}
                                        {/* <FormControl >
                                            <CustomInput
                                                labelText="Email adress"
                                                id="email_adress"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "email"
                                                }}
                                            />
                                        </FormControl> */}
                                    </CardBody>
                                </GridItem>
                            </GridContainer>

                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                        <Card>
                            {/* <CardHeader>
                                <h4 className={classes.cardTitle}>
                                    Navigation Pills <small> - Horizontal Tabs</small>
                                </h4>
                            </CardHeader> */}
                            <CardBody>
                                <p>the grid</p>
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

export default withStyles(styles)(Purchases);