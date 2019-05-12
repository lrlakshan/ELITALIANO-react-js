import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// import { Manager, Target, Popper } from "react-popper";
import { withRouter } from 'react-router-dom';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Hidden from "@material-ui/core/Hidden";

// @material-ui/icons
import Person from "@material-ui/icons/Person";


// core components
import Button from "../../components/CustomButtons/Button";

import headerLinksStyle from "../../assets/jss/material-dashboard-pro-react/components/headerLinksStyle";

class HeaderLinks extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      open: false
    };
  }
  handleClick = () => {
    this.setState({ open: !this.state.open });
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, rtlActive } = this.props;
    const { open } = this.state;
    const wrapper = classNames({
      [classes.wrapperRTL]: rtlActive
    });
    const managerClasses = classNames({
      [classes.managerClasses]: true
    });
    return (
      <div className={wrapper}>
        <div className={managerClasses}>

          <Button
            color="transparent"
            justIcon
            aria-label="person"
            aria-owns={open ? "menu-list" : null}
            aria-haspopup="true"
            onClick={this.handleClick}
            className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
            muiClasses={{
              label: rtlActive ? classes.labelRTL : ""
            }}
            buttonRef={node => {
              this.anchorEl = node;
            }}
          >
            <Person
              className={
                classes.headerLinksSvg +
                " " +
                (rtlActive
                  ? classes.links + " " + classes.linksRTL
                  : classes.links)
              }
            />
            {/* <span className={classes.notifications}>5</span> */}
            <Hidden mdUp implementation="css">
              <span onClick={this.handleClick} className={classes.linkText}>
                {rtlActive ? "إعلام" : "My Account"}
              </span>
            </Hidden>
          </Button>

        </div>
      </div>
    );
  }
}

HeaderLinks.propTypes = {
  classes: PropTypes.object.isRequired,
  rtlActive: PropTypes.bool
};

export default withRouter(withStyles(headerLinksStyle)(HeaderLinks));
