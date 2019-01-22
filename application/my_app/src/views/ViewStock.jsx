import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";
import Helper from '../utils/Helper'

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
import Favorite from "@material-ui/icons/Favorite";
import Close from "@material-ui/icons/Close";
// core components
import GridContainer from "../components/Grid/GridContainer.jsx";
import GridItem from "../components/Grid/GridItem.jsx";
import Button from "../components/CustomButtons/Button.jsx";
import Card from "../components/Card/Card.jsx";
import CardBody from "../components/Card/CardBody.jsx";
import CardIcon from "../components/Card/CardIcon.jsx";
import CardHeader from "../components/Card/CardHeader.jsx";

import { cardTitle } from "../assets/jss/material-dashboard-pro-react.jsx";

const styles = {
    cardIconTitle: {
        ...cardTitle,
        marginTop: "15px",
        marginBottom: "0px"
    }
};

class viewStock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        };
    }

    componentDidMount() {
        this.getProductDetails();
    }

    getProductDetails = () => {
        const products = [];

        Helper.http
            .jsonGet("productDetails")
            .then(response => {
                let data = response.data;
                for (let i = 0; i < data.length; i++) {
                    const _data = {
                        productId: data[i].productId,
                        productName: data[i].productName,
                        purchasePrice: data[i].purchasePrice,
                        sellingPrice: data[i].sellingPrice,
                        amountAvailable: data[i].amountAvailable,
                        actions: (
                            // we've added some custom button actions
                            <div className="actions-right">
                                {/* use this button to add a like kind of action */}
                                <Button
                                    justIcon
                                    round
                                    simple
                                    // onClick={() => {
                                    //     let obj = this.state.data.find(o => o.id === key);
                                    //     alert(
                                    //         "You've clicked LIKE button on \n{ \nName: " +
                                    //         obj.name +
                                    //         ", \nposition: " +
                                    //         obj.position +
                                    //         ", \noffice: " +
                                    //         obj.office +
                                    //         ", \nage: " +
                                    //         obj.age +
                                    //         "\n}."
                                    //     );
                                    // }}
                                    color="info"
                                    className="like"
                                >
                                    <Favorite />
                                </Button>{" "}
                                {/* use this button to add a edit kind of action */}
                                <Button
                                    justIcon
                                    round
                                    simple
                                    // onClick={() => {
                                    //     let obj = this.state.data.find(o => o.id === key);
                                    //     alert(
                                    //         "You've clicked EDIT button on \n{ \nName: " +
                                    //         obj.name +
                                    //         ", \nposition: " +
                                    //         obj.position +
                                    //         ", \noffice: " +
                                    //         obj.office +
                                    //         ", \nage: " +
                                    //         obj.age +
                                    //         "\n}."
                                    //     );
                                    // }}
                                    color="warning"
                                    className="edit"
                                >
                                    <Dvr />
                                </Button>{" "}
                                {/* use this button to remove the data row */}
                                <Button
                                    justIcon
                                    round
                                    simple
                                    onClick={() => {
                                        var data = this.state.data;
                                        // data.find((o, i) => {
                                        //     if (o.id === key) {
                                        //         // here you should add some custom code so you can delete the data
                                        //         // from this component and from your server as well
                                        //         data.splice(i, 1);
                                        //         return true;
                                        //     }
                                        //     return false;
                                        // });
                                        this.setState({ data: data });
                                    }}
                                    color="danger"
                                    className="remove"
                                >
                                    <Close />
                                </Button>{" "}
                            </div>
                        )
                    };
                    products.push(_data);
                }
                this.setState({ products });
                // this.setState({ loading: false });
            })
            .catch(exception => {
                console.log(exception);
            });
    };
    render() {
        const { classes } = this.props;
        return (
            <GridContainer>
                <GridItem xs={12}>
                    <Card>
                        <CardHeader color="primary" icon>
                            <CardIcon color="primary">
                                <Assignment />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Available Stocks</h4>
                        </CardHeader>
                        <CardBody>
                            <ReactTable
                                data={this.state.products}
                                filterable
                                columns={[
                                    {
                                        Header: "ID",
                                        accessor: "productId",
                                        width: 100
                                    },
                                    {
                                        Header: "Product Name",
                                        accessor: "productName",
                                        width: 250
                                    },
                                    {
                                        Header: "Purchase Price",
                                        accessor: "purchasePrice"
                                    },
                                    {
                                        Header: "Selling Price",
                                        accessor: "sellingPrice"
                                    },
                                    {
                                        Header: "Stock",
                                        accessor: "amountAvailable",
                                        width: 100
                                    },
                                    {
                                        Header: "Actions",
                                        accessor: "actions",
                                        sortable: false,
                                        filterable: false
                                    }
                                ]}
                                defaultPageSize={10}
                                showPaginationTop
                                showPaginationBottom={false}
                                className="-striped -highlight"
                            />
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        );
    }
}

export default withStyles(styles)(viewStock);
