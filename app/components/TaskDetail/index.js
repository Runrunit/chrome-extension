import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import style from './style.css';

class TaskDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  returnDetailClass(task) {
    const estDeliveryDate = (task.estimated_delivery_date) ? moment(task.estimated_delivery_date).format("YYYY-MM-DD") : '';
    const desiredDate = (task.desired_date) ? moment(task.desired_date).format("YYYY-MM-DD") : '';
    const todayDate = moment().format("YYYY-MM-DD");
    if (estDeliveryDate && desiredDate) {
      if (estDeliveryDate <= desiredDate) {
        return 'task-detail-on-time'
      } else if (todayDate > desiredDate) {
        return 'task-detail-delayed'
      } else if (estDeliveryDate > desiredDate) {
        return 'task-detail-estimated-delay'
      } else {
        return ''
      }
    } else {
      return ''
    }
  }

  render() {
    const timer = (seconds) => moment.duration(seconds, 'seconds').format('HH:mm', { trim: false });
    return (
      <div className={style.RunrunItemDetail__area}>
        {
          (this.props.task.on_going) ?
          (
            <span></span>
          ) : 
          (<div className={style.RunrunItemDetail__flexDiv}>
            <div className={style.RunrunItemDetail__flexItem}>
              <p className={style.RunrunItemDetail__flexTitle}>START<br />DATE</p>
              <p className={style.RunrunItemDetail__flexContent}>{moment(this.props.task.start_date).format("DD MMM")}</p>
            </div>
            <div className={style.RunrunItemDetail__flexItem}>
              <p className={style.RunrunItemDetail__flexTitle}>ESTIMATED<br />EFFORT</p>
              <p className={style.RunrunItemDetail__flexContent}>{timer(this.props.task.current_estimate_seconds)}</p>
            </div>
            <div className={style.RunrunItemDetail__flexItem}>
              <p className={style.RunrunItemDetail__flexTitle}>DELIVERY<br />DATE</p>
              <p className={style.RunrunItemDetail__flexContent}>{moment(this.props.task.estimated_delivery_date).format("DD MMM")}</p>
            </div>
            <div className={style.RunrunItemDetail__flexItem}>
              <p className={style.RunrunItemDetail__flexTitle}>DESIRED<br />DUE DATE</p>
              {
                (this.props.task.desired_date) ?
                (<p className={style.RunrunItemDetail__flexContent}><span className={this.returnDetailClass(this.props.task)}>{moment(this.props.task.desired_date).format("DD MMM")}</span></p>) :
                (<p className={style.RunrunItemDetail__flexContent}>--</p>)
              }
            </div>
          </div>)
        }
        <div className={style.RunrunItemDetail__listDiv}>
          <p className={style.RunrunItemDetail__listTitle}>TYPE</p>
          <p className={style.RunrunItemDetail__listText}>{this.props.task.type_name}</p>
          <p className={style.RunrunItemDetail__listTitle}>CLIENT > PROJECT</p>
          <p className={style.RunrunItemDetail__listText}>{this.props.task.client_name} > {this.props.task.project_name}</p>
          <p className={style.RunrunItemDetail__listTitle}>TAGS</p>
          <p className={style.RunrunItemDetail__listTags}>
            { 
              (this.props.task.task_tags.length) ?
              this.props.task.task_tags.map((tag, index) => (
                <span key={index} className="badge badge-secondary mr-2">{tag}</span>
              ))
              : 'Nenhuma'
            }
          </p>
        </div>
      </div>
    );
  }
}

TaskDetail.propTypes = {
  task: PropTypes.object.isRequired
};

export default TaskDetail;