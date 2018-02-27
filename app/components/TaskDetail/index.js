import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import style from './style.css';

class TaskDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={style.RunrunItemDetail__area}>
        <div className={style.RunrunItemDetail__flexDiv}>
          <div className={style.RunrunItemDetail__flexItem}>
            <p className={style.RunrunItemDetail__flexTitle}>START<br />DATE</p>
            <p className={style.RunrunItemDetail__flexContent}><b>{moment(this.props.task.start_date).format("DD MMM")}</b></p>
          </div>
          <div className={style.RunrunItemDetail__flexItem}>
            <p className={style.RunrunItemDetail__flexTitle}>ESTIMATED<br />EFFORT</p>
          </div>
          <div className={style.RunrunItemDetail__flexItem}>
            <p className={style.RunrunItemDetail__flexTitle}>DELIVERY<br />DATE</p>
          </div>
          <div className={style.RunrunItemDetail__flexItem}>
            <p className={style.RunrunItemDetail__flexTitle}>DESIRED<br />DUE DATE</p>
          </div>
        </div>
        {/* <ul className="list-group mt-1 mb-1">
          <li className="list-group-item list-group-item-light">
            <strong>Responsible:</strong> {this.props.task.responsible_name}
          </li>
          <li className="list-group-item list-group-item-light">
            <strong>Type:</strong> {this.props.task.type_name}
          </li>
          <li className="list-group-item list-group-item-light">
            <strong>Client > Project:</strong> {this.props.task.client_name} > {this.props.task.project_name}
          </li>
          <li className="list-group-item list-group-item-light">
            <strong>Tags:</strong> {this.props.task.task_tags.map((tag, index) => (
              <span key={index} className="badge badge-secondary mr-1">{tag}</span>
            ))}
          </li>
          <li className="list-group-item list-group-item-light">
            <div className="row">
              <div className="col">
                <strong>Started:</strong> {moment(this.props.task.start_date).format("MMM DD, hh:mm A")}
              </div>
              {(this.props.task.is_closed) ? (
                <div className="col">
                  <strong>Completed:</strong> {moment(this.props.task.close_date).format("MMM DD, hh:mm A")}
                </div>
              ) : ''}
            </div>
          </li>
        </ul> */}
      </div>
    );
  }
}

TaskDetail.propTypes = {
  task: PropTypes.object.isRequired
};

export default TaskDetail;