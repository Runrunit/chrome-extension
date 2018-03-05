import React from 'react';
import style from './style.css';
import request from '../AuthInterceptor';

class OptionsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      appkey: localStorage.getItem("appkey") || "",
      usertoken: localStorage.getItem("usertoken") || "",
      reminderEnabled: (localStorage.getItem("reminderEnabled") && localStorage.getItem("reminderEnabled") === "true") ? true : false,
      reminderTimeInMinutes: localStorage.getItem("reminderTimeInMinutes") || 30,
      view: "options",
      msg: "",
      autoPauseResume: (localStorage.getItem("autoPauseResume") && localStorage.getItem("autoPauseResume") === "true") ? true : false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMsgHide = this.handleMsgHide.bind(this);
    this.handleViewToggle = this.handleViewToggle.bind(this);
  }

  handleMsgHide() {
    this.setState({
      msg: ""
    });
  }

  handleInputChange(e) {
    const {name, value, type, checked} = e.target;

    const getValueByType = () => {
      switch(type) {
        case 'number':
          return Number(value);
        case 'checkbox':
          return checked;
        default:
          return value;
      }
    };

    this.setState({
      [name]: getValueByType()
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    localStorage.setItem("appkey", this.state.appkey);
    localStorage.setItem("usertoken", this.state.usertoken);
    localStorage.setItem("reminderEnabled", this.state.reminderEnabled);
    localStorage.setItem("reminderTimeInMinutes", this.state.reminderTimeInMinutes);
    localStorage.setItem("autoPauseResume", this.state.autoPauseResume);

    if(!this.state.autoPauseResume) {
      localStorage.setItem("lastMachineStatus", "active");
      localStorage.setItem("trackedTask", "");
    }

    request.get(`https://secure.runrun.it/api/v1.0/users/me`)
      .then(response => {
        localStorage.setItem("user", JSON.stringify(response.data));
        this.setState({
          msg: {
            type: 'success',
            text: "Success!"
          }
        });
      });
  }

  handleViewToggle() {
    this.setState({
      view: (this.state.view === "options") ? "tutorial" : "options"
    });
  }

  render() {
    const msg = (this.state.msg) ? (
      <div className={`alert alert-${this.state.msg.type} alert-dismissible fade show`} role="alert">
        <button type="button" className="close alert-close" onClick={this.handleMsgHide}>
          <span aria-hidden="true">&times;</span>
        </button>
        {this.state.msg.text}
      </div>
    ) : "";

    const form = (
      <div>
        <div className={style.RunrunSettings__title}>
          <p>Settings</p>
          <span onClick={this.handleViewToggle} className={style.RunrunSettings__tutorialLink}>
            <img className="float-right" src="/images/question_white.svg" />
            <p className="float-right">See the tutorial</p>
          </span>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label className="text-size-md" htmlFor="appkey">App Key</label>
            <input type="text" className="form-control" name="appkey" value={this.state.appkey} required onChange={this.handleInputChange} />
          </div>
          <div className="form-group">
            <label className="text-size-md" htmlFor="usertoken">User Token</label>
            <input type="text" className="form-control" name="usertoken" value={this.state.usertoken} required onChange={this.handleInputChange} />
          </div>
          <div className="form-group">
            <div className={style.RunrunSettings__offOnTitle}>
              <label className="text-size-md" htmlFor="reminderTimeInMinutes">Reminder's interval</label>
              <p className="text-size-sm">ON/OFF</p>
            </div>
            <div className={style.RunrunSettings__reminderExplanation}>
              <small className="text-muted">
                * You will be reminded every X minutes whether you are either working on the same task or haven't started one. In case you either pause or start a task, the timer will reset.
              </small>
              <input type="number" min="1" className="form-control" name="reminderTimeInMinutes" value={this.state.reminderTimeInMinutes} disabled={!this.state.reminderEnabled} required onChange={this.handleInputChange} />
              <label className={style.RunrunSettings__settingsSwitch}>
                <input className="display-none" type="checkbox" name="reminderEnabled" checked={this.state.reminderEnabled} onChange={this.handleInputChange} />
                <span className={(this.state.reminderEnabled) ? 'activatedSwitch' : 'disabledSwitch'}></span>
              </label>
            </div>
          </div>
          <div className="form-group">
            <div className={style.RunrunSettings__offOnTitle}>
              <label className="text-size-md" htmlFor="reminderTimeInMinutes">Auto Pause/Resume</label>
              <p className="text-size-sm">ON/OFF</p>
            </div>
            <div className={style.RunrunSettings__autoPauseExplanation}>
              <small className="text-muted">
                 * By enabling this option, an icon will be displayed to the right of the task you're currently working on, allowing it be automatically paused/resumed when you lock/unlock your computer. However, we've noticed that this feature doesn't work as expected on some computers. If you really wish to use this feature, we strongly suggest you to test it by locking your computer for a few minutes and then checking on your task details to see if the recorded time is correct.
              </small>
              <label className={style.RunrunSettings__settingsSwitch}>
                <input className="display-none" type="checkbox" name="autoPauseResume" checked={this.state.autoPauseResume} onChange={this.handleInputChange} />
                <span className={(this.state.autoPauseResume) ? 'activatedSwitch' : 'disabledSwitch'}></span>
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-block">Save</button>
        </form>
      </div>
    );

    const tutorial = (
      <div>
        <div className={style.RunrunTutorial__title}>
          <span onClick={this.handleViewToggle}>
            <img className="float-left" src="/images/nav-circle-left-blue.svg" />
            <p className="float-left">Settings</p>
          </span>
        </div>
        <div className={style.RunrunTutorial__steps}>
          <div>
            <p>1. Go to your profile on Runrun.it</p>
            <img src="/images/tutorial_01.svg" />
          </div>
          <div>
            <p>2. Then, if there is no "App key", click on "Generate".</p>
            <p className={style.RunrunTutorial__stepTextMuted}><small className="text-muted">* Permission needed. If it does not appear, contact anyone with "Administrator" role.</small></p>
            <img src="/images/tutorial_02.svg" />
          </div>
          <div>
            <p>3. Your "App Key" and "User Token" will be displayed (or only the "User Token" if you aren't an "Administrator").</p>
            <img src="/images/tutorial_03.svg" />
          </div>
        </div>
      </div>
    );

    return (
      <div className="container">
        <div className="content">
          <div className="row justify-content-md-center">
            <div className="col col-md-6">
              <div className={style.RunrunSettings}>
                {msg}
                {(this.state.view === "options") ? form : tutorial}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OptionsPage;