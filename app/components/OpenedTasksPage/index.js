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

class OpenedTasksPage extends React.Component {
  constructor(props) {
    super(props);
    parent = this;
    
    this.state = {
      tasks: undefined,
      trackedTask: localStorage.getItem("trackedTask"),
      autoPauseResume: (localStorage.getItem("autoPauseResume") && localStorage.getItem("autoPauseResume") === "true") ? true : false,
      taskExpanded: undefined
    };
    
    this.handleTaskDetailToggle = this.handleTaskDetailToggle.bind(this);
    this.handleSetList = this.handleSetList.bind(this);
    this.handleGetList = this.handleGetList.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleTaskTracking = this.handleTaskTracking.bind(this);

    chrome.runtime.onMessage.addListener((msg) => {
      if(msg.subject === "taskUpdated")
        parent.handleSetList(msg.body);
    });
  }

  componentDidMount() {
    this.handleGetList();
  }

  handleTaskDetailToggle(id) {
    return () => {
      this.setState({
        taskExpanded: (this.state.taskExpanded === id) ? undefined : id
      });
    };
  }

  handlePlay(id) {
    return () => {
      request.post(`https://secure.runrun.it/api/v1.0/tasks/${id}/play`)
        .then(response => {
          this.handleGetList();
        });
    };
  }

  handlePause(id) {
    return () => {
      localStorage.setItem("trackedTask", "");
      request.post(`https://secure.runrun.it/api/v1.0/tasks/${id}/pause`)
        .then(response => {
          this.handleGetList();
        });
    };
  }

  handleClose(id) {
    return () => {
      request.post(`https://secure.runrun.it/api/v1.0/tasks/${id}/close`)
        .then(response => {
          this.handleGetList();
        });
    };
  }

  handleSetList(tasks) {
    this.setState({
      tasks,
      trackedTask: localStorage.getItem("trackedTask")
    });
  }

  handleGetList() {
    chrome.runtime.sendMessage({
      subject: "taskUpdateRequest"
    });
  }

  handleTaskTracking(id) {
    return () => {
      if(localStorage.getItem("trackedTask") && localStorage.getItem("trackedTask") == id)
        localStorage.setItem("trackedTask", "");
      else
        localStorage.setItem("trackedTask", id);
      this.setState({
        trackedTask: localStorage.getItem("trackedTask")
      });
    };
  }

  returnTaskProgress(task) {
    const progress = task.time_worked / task.current_estimate_seconds * 315;
    const maxProgress = (progress >= 315) ? 315 : progress
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
          <ul className={`list-group ${style.OpenedTasksPage}`}>
            <li key={index} className="list-group-item">
              <div className={style.RunrunItem__area}>
                <span onClick={this.handleTaskDetailToggle(task.id)} className={style.RunrunItem__id}>ID {task.id}</span>
                <span onClick={this.handleTaskDetailToggle(task.id)} className={style.RunrunItem__name}>{task.title} - {task.project_name}</span>
                <span className={style.RunrunItem__autoPause}>
                  {(this.state.autoPauseResume && task.is_working_on) ? (
                    <button title="When this option is active the extension will manage the task for you, pausing/resuming if you lock/unlock the machine." type="button" className={`btn btn-sm btn-${(this.state.trackedTask == task.id) ? 'success' : 'light'} float-right`} onClick={this.handleTaskTracking(task.id)}>
                      <span className="oi" data-glyph="monitor"></span>
                    </button>
                  ) : ""}
                </span>
              </div>
              <div className={`area-enabled-${task.is_working_on}`}>
                {
                  (task.is_working_on) ?
                    (<span className={style.RunrunItem__actionBtn} onClick={this.handlePause(task.id)} title="Pausar a tarefa"><img src="/images/pause_blue.svg" /></span>) :
                    (<span className={style.RunrunItem__actionBtn} onClick={this.handlePlay(task.id)} title="Iniciar a tarefa"><img src="/images/play_blue.svg" /></span>)
                } <span className={style.RunrunItem__completeBtn} onClick={this.handleClose(task.id)} title="Completar a tarefa"><img src="/images/check_blue.svg" /></span>
                <div className={style.RunrunItem__progressDiv}>
                  <span className={style.RunrunItem__progressTime}>
                    {
                      timer(task.time_worked)
                    } {
                      (task.current_estimate_seconds) ? '/ ' + timer(task.current_estimate_seconds) : ""
                    }
                  </span>
                  <a href={`https://secure.runrun.it/tasks/${task.id}`} target="_blank" title="Ver tarefa no site" className={style.RunrunItem__progressLink}><span data-glyph="external-link" className="oi"></span></a>
                  <span className={style.RunrunItem__progressBar}></span>
                  <span className={style.RunrunItem__progressFilledBar} style={{ 'width': this.returnTaskProgress(task) + 'px', 'backgroundColor': (this.returnTaskProgress(task) >= 180) ? 'darkorange' : 'lime' }}></span>
                </div>
      
                
      
              </div>
              <div>
                {(this.state.taskExpanded === task.id) ? (
                  <TaskDetail task={task} />
                ) : ""}
              </div>
            </li>
          </ul>
        ));
    })();

    return (
      <div>
        <div>
          <PopupHeader title="Tasks (Pending)" />
          <PopupNav />
        </div>
        {/* <ul className={`list-group ${style.OpenedTasksPage}`}>
          {tasks}
        </ul> */}
        <div className={style.TasksDiv}>
          {tasks}
        </div>
      </div>
    );
  }
}

export default OpenedTasksPage;