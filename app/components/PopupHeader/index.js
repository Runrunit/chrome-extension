import React from 'react';
import style from './style.css';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

class PopupHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!localStorage.getItem("appkey"))
      return (
        <span></span>
      );
    else 
      return (
        <header className={style.RunrunHeader}>
          <div className={style.RunrunHeader__left}>
            <a href="https://secure.runrun.it/en-US/tasks" target="_blank">
              <img src="images/rr.svg" className={style.RunrunIcon} />
            </a>
            <span className={style.RunrunHeader__left_title}>{this.props.title}</span>
            <span>Runrun.it</span>
          </div>
          <div className={style.RunrunHeader__right}>      
            <a href="options.html" target="_blank"><img src="/images/kebab_gray.svg" className={style.Settings} /></a>
          </div>
        </header>
      );
  }
}

PopupHeader.propTypes = {
  title: PropTypes.string.isRequired
};

export default PopupHeader;