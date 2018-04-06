import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import 'moment-duration-format';

import style from './style.css';
import request from '../AuthInterceptor';
import LoadingIcon from '../LoadingIcon';
import PopupHeader from '../PopupHeader';
import PopupNav from '../PopupNav';
import TaskDetail from '../TaskDetail';

class ClosedTasksPage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      tasks: undefined,
      taskExpanded: undefined
    };
    
    this.handleTaskDetailToggle = this.handleTaskDetailToggle.bind(this);
    this.handleGetList = this.handleGetList.bind(this);
    this.handleReopen = this.handleReopen.bind(this);
  }

  componentDidMount() {
    this.handleGetList();
  }

  handleGetList() {
    this.setState({
      tasks: undefined
    }, () => {
      const user = (localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")) : {};
      request.get('https://secure.runrun.it/api/v1.0/tasks', {
        params: {
          responsible_id: user.id,
          is_closed: true,
          limit: 10
        }
      })
      .then(response => {
        this.setState({
          tasks: response.data
        });
      });
    });
  }

  handleReopen(id) {
    return () => {
      request.post(`https://secure.runrun.it/api/v1.0/tasks/${id}/reopen`)
        .then(response => {
          this.handleGetList();
        });
    };
  }

  handleTaskDetailToggle(id) {
    return () => {
      this.setState({
        taskExpanded: (this.state.taskExpanded === id) ? undefined : id
      });
    };
  }

  returnTaskProgress(task) {
    const progress = task.time_worked / task.current_estimate_seconds * 300;
    const maxProgress = (progress >= 300) ? 300 : progress
    return maxProgress
  }

  render() {
    const timer = (seconds) => moment.duration(seconds, 'seconds').format('HH:mm', {trim:false});

    const tasks = (() => {
      if(!localStorage.getItem("appkey"))
        return (
          <div className="cover-page">
            <a className="cover-page-button btn btn-block" href="options.html" target="_blank">Settings Access</a>
          </div>
        );
      else if(this.state.tasks === undefined)
        return (
          <p className="text-center"><LoadingIcon visible={true} /></p>
        );
      else if(this.state.tasks instanceof Array && this.state.tasks.length === 0)
        return (
          <p className="text-center">
            Não tem nenhuma tarefa.
          </p>
        );
      else
        return this.state.tasks.map((task, index) => (
          <div className={style.RunrunTasksList}>
            <ul className={`list-group ${style.OpenedTasksPage}`}>
              <li key={index}>
                <div onClick={this.handleTaskDetailToggle(task.id)} className={style.RunrunItem__area}>
                  <span className={style.RunrunItem__id}>ID {task.id}</span>
                  <span className={style.RunrunItem__name}>{task.title} - {task.project_name}</span>
                </div>
                <div className={`area-enabled-true`}>
                  <span className={style.RunrunItem__actionBtn} onClick={this.handleReopen(task.id)} title="Reopen"></span>
                  <span className={style.RunrunItem__completeBtn} title="Task complete"><img src="/images/check_green_filled.svg" /></span>
                  {
                    (task.on_going) ?
                      (
                        <div className={style.RunrunItem__progressDiv}>
                          <span className={style.RunrunItem__progressTime}>
                            ONGOING
                      </span>
                          <a href={`https://secure.runrun.it/tasks/${task.id}`} target="_blank" title="Check the task at the website" className={style.RunrunItem__progressLink}><span data-glyph="external-link" className="oi"></span></a>
                          <span className={style.RunrunItem__progressBar}></span>
                        </div>
                      ) : (
                        <div className={style.RunrunItem__progressDiv}>
                          <span className={style.RunrunItem__progressTime}>
                            {
                              timer(task.time_worked)
                            } {
                              (task.current_estimate_seconds) ? '/ ' + timer(task.current_estimate_seconds) : ""
                            }
                          </span>
                          <a href={`https://secure.runrun.it/tasks/${task.id}`} target="_blank" title="Check the task at the website" className={style.RunrunItem__progressLink}><span data-glyph="external-link" className="oi"></span></a>
                          <span className={style.RunrunItem__progressBar}></span>
                          <span className={style.RunrunItem__progressFilledBar} style={{ 'width': this.returnTaskProgress(task) + 'px', 'backgroundColor': (this.returnTaskProgress(task) >= 180) ? '#F77122' : '#38B927' }}></span>
                        </div>
                      )
                  }
                </div>
                <div>
                  {(this.state.taskExpanded === task.id) ? (
                    <TaskDetail task={task} />
                  ) : ""}
                </div>
              </li>
            </ul>
          </div>
        ));
    })();

    return (
      <div>
        <div>
          <PopupHeader title="Tasks (Last 10 Deliveries)" />
          <PopupNav routeName="closed" />
        </div>
        {/* <div className={`style.TasksDiv`}> */}
        <div className={style.TasksDiv}>
          {tasks}
        </div>
      </div>
    );

  }
}

export default ClosedTasksPage;