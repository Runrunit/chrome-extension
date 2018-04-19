import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

class PopupNav extends React.Component {
  constructor(props) {
    super(props);
    this.routeName = {
      class: (this.props.routeName === 'opened') ? ['active-nav', 'inactive-nav'] : ['inactive-nav', 'active-nav']
    }
  }

  render() {
    if (!localStorage.getItem("appkey"))
      return (
        <span></span>
      );
    else 
      return (
        <div className="nav justify-content-center mb-3">
          <div className="btn-group" role="group">
            <Link to="/opened-tasks" className={`btn btn-nav ${this.routeName.class[0]}`}>Open</Link>
            <Link to="/closed-tasks" className={`btn btn-nav ${this.routeName.class[1]}`}>Complete</Link>
          </div>
        </div>
      );
  }
}

PopupNav.propTypes = {
  routeName: PropTypes.string.isRequired
};

export default PopupNav;