import './App.css';
import React, { Component } from 'react';
import logo from './assets/logo.png';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { getCookie, setCookie } from './cookie';
import AuthRedirect from './authRedirect';
import NavBar from './NavBar';
const ManageWrapper = () => {
  const navigate = useNavigate();

  return <ManagePage navigate={navigate} />;
};
class ManagePage extends Component {
  state = {
    emailToCompany: "",
    emailToAdmin: "",
    colleagues: [{}],
    workTypes: [{}],
    logs: []
  }
  addAdmin(email) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "token": getCookie("login-token"),
      "newAdmin": email
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3001/api/admin/add", requestOptions)
      .then(response => response.text())
      .then(result => {
        var r = JSON.parse(result);
        if (r.success) {
          Swal.fire("Success!", `${email} was added as an admin!`, "success")
        }
        else {
          Swal.fire("Oops!", r.error, "error")
        }
      })
      .catch(error => { Swal.fire("Oops!", error.error, "error") });

  }
  removeAdmin(email) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "token": getCookie("login-token"),
      "newAdmin": email
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3001/api/admin/remove", requestOptions)
      .then(response => response.text())
      .then(result => {
        var r = JSON.parse(result);
        if (r.success) {
          Swal.fire("Success!", `${email} was removed as an admin!`, "success")
        }
        else {
          Swal.fire("Oops!", r.error, "error")
        }
      })
      .catch(error => { Swal.fire("Oops!", error.error, "error") });

  }
  addColleague(email) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "token": getCookie("login-token"),
      "newColleauge": email
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3001/api/admin/add-colleague", requestOptions)
      .then(response => response.text())
      .then(result => {
        var r = JSON.parse(result);
        if (r.success) {
          Swal.fire("Success!", `${email} was added as a colleague!`, "success")
        }
        else {
          Swal.fire("Oops!", r.error, "error")
        }
      })
      .catch(error => { Swal.fire("Oops!", error.error, "error") });

  }
  removeColleague(email) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "token": getCookie("login-token"),
      "newColleauge": email
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3001/api/admin/remove-colleague", requestOptions)
      .then(response => response.text())
      .then(result => {
        var r = JSON.parse(result);
        if (r.success) {
          Swal.fire("Success!", `${email} was removed as a colleague!`, "success")
        }
        else {
          Swal.fire("Oops!", r.error, "error")
        }
      })
      .catch(error => { Swal.fire("Oops!", error.error, "error") });

  }
  getColleagues() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "company": getCookie("login-company")
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:3001/api/get-colleagues", requestOptions)
      .then((response) => response.text())
      .then((result) => { var r = JSON.parse(result); this.setState({ colleagues: r.colleagues }); })
      .catch((error) => console.error(error));
  }
  getLogs(){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "company": getCookie("login-company")
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:3001/api/get-logs", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        var r = JSON.parse(result); 
        if(r.success){
          this.setState({logs: r.logs})
        }
      })
      .catch((error) => console.error(error));
  }
  componentDidMount() {
    this.getColleagues()
    this.getWorkTypes()
    this.getLogs()
  }
  warn(person, asA, action, func) {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you wanna ${action} ${person} as a/an ${asA}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Continue"
    }).then((result) => {
      if (result.isConfirmed) {
        func(person)
      }
    });
  }
  getWorkTypes() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "company": getCookie("login-company")
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3001/api/get-worktypes", requestOptions)
      .then(response => response.text())
      .then(result => {
        var r = JSON.parse(result);
        if (r.success) {
          this.setState({ workTypes: r.workTypes })
        }
      })
      .catch(error => console.log('error', error));
  }
  add(){

    var worktype = document.getElementById("new-worktype").value;
    this.addWorkTypes([...this.state.workTypes, {"label": worktype}])
    this.setState({workTypes: [...this.state.workTypes, {"label": worktype}]})
  }
  addWorkTypes(workTypes) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "company": getCookie("login-company"),
      "workTypes": workTypes
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3001/api/add-worktypes", requestOptions)
      .then(response => response.text())
      .then(result => {})
      .catch(error => console.log('error', error));
  }
  removeWorkTypes(index) {
    var workTypes = this.state.workTypes;
    workTypes.splice(index,1);
    this.setState({workTypes: workTypes})

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "company": getCookie("login-company"),
      "index": index
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3001/api/remove-worktypes", requestOptions)
      .then(response => response.text())
      .then(result => {})
      .catch(error => console.log('error', error));
  }
  offerDateFormat(timestamp){
    try{
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        // Convert milliseconds to minutes and days
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        // Format the output
        let formattedDate;
        if (hours < 1) {
          formattedDate = `${minutes} minutes ago`;
        } else if (days < 1) {
          formattedDate = `${hours} hours ago`;
        } else {
          formattedDate = `${days} days ago`;
        }
        return formattedDate
    }catch{
        return "Error"
    }
}
  render() {
    return (
      <div className='page'>
        <div className='manage-panel'>
          <h1>Manage({getCookie("login-company")})</h1>
          <div className='colleagues-panel'>
            <h2>Add to company</h2>
            <input type='text' placeholder='Email' onChange={(e) => this.setState({ emailToCompany: e.target.value })}></input>
            <button className='rounded-btn-secondary' onClick={() => this.warn(this.state.emailToCompany, "colleague", "add", this.addColleague)}>Add</button>
            <ul>
              {this.state.colleagues.map((colleague, index) => (
                <div className='li-i' key={index}>
                  <li><h5>{colleague.email} - {colleague.role == 1 ? "Admin" : "Colleague"}</h5></li>
                  <p className='interactable' onClick={() => this.warn(colleague.email, "colleague", "remove", this.removeColleague)}>Remove</p>
                  {colleague.role == 1 && <p className='interactable' onClick={() => this.removeAdmin(colleague.email)}>Remove as admin</p>}
                  {colleague.role == 0 && <p className='interactable' style={{ color: "var(--success)" }} onClick={() => this.warn(colleague.email, "admin", "add", this.addAdmin)}>Promote to admin</p>}
                  <br></br>
                </div>
              ))}
            </ul>
          </div>
          <div className='workTypes-panel'>
            <h2>Saved Work Types</h2>
            <input placeholder='New work type' className='new-worktype-input' id="new-worktype"></input>
            <p className='interactable' style={{ color: "var(--success)"}} onClick={()=>this.add()}>+</p>
              <div className='work-types'>
              {this.state.workTypes.map((workType, index) => (
                <div key={index} className='worktype'>
                  <p>{workType.label}</p>
                  <p className='interactable' style={{ color: "var(--error)" }} onClick={()=> this.removeWorkTypes(index)}>-</p>
                </div>
              ))}
            </div>
          </div>
          <div className='logs-panel'>
              {this.state.logs.map((log, index) => (
                <div key={index} className='log'>
                  <p>{log.message} </p>
                  <p>{log.user}</p>
                  <p>{this.offerDateFormat(log.timestamp)}</p>
                </div>
              ))}
          </div>
        </div>
        <NavBar />
      </div>
    )
  }
}

export default AuthRedirect(ManageWrapper, 1);
