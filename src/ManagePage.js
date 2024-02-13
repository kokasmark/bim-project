import './App.css';
import React, {Component} from 'react';
import logo from './assets/logo.png';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import {getCookie, setCookie} from './cookie';
import AuthRedirect from './authRedirect';
import NavBar from './NavBar';
const ManageWrapper = () => {
  const navigate = useNavigate();

  return <ManagePage navigate={navigate} />;
};
class ManagePage extends Component{
  state= {
      emailToCompany: "",
      emailToAdmin: "",
      colleagues: []
  }
  addAdmin(email){
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
    .then(result => 
      {
        var r = JSON.parse(result);
        if(r.success){
          Swal.fire("Success!", `${email} was added as an admin!`,"success")
        }
        else{
          Swal.fire("Oops!", r.error,"error")
        }
    })
    .catch(error => {Swal.fire("Oops!", error.error,"error")});
  }
  removeAdmin(email){
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
    .then(result => 
      {
        var r = JSON.parse(result);
        if(r.success){
          Swal.fire("Success!", `${email} was removed as an admin!`,"success")
        }
        else{
          Swal.fire("Oops!", r.error,"error")
        }
    })
    .catch(error => {Swal.fire("Oops!", error.error,"error")});
  }
  addColleague(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "token": getCookie("login-token"),
    "newColleauge": this.state.emailToCompany
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("http://localhost:3001/api/admin/add-colleague", requestOptions)
    .then(response => response.text())
    .then(result => 
      {
        var r = JSON.parse(result);
        if(r.success){
          Swal.fire("Success!", `${this.state.emailToCompany} was added as a colleague!`,"success")
        }
        else{
          Swal.fire("Oops!", r.error,"error")
        }
    })
    .catch(error => {Swal.fire("Oops!", error.error,"error")});
  }
  removeColleague(email){
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
    .then(result => 
      {
        var r = JSON.parse(result);
        if(r.success){
          Swal.fire("Success!", `${email} was removed as a colleague!`,"success")
        }
        else{
          Swal.fire("Oops!", r.error,"error")
        }
    })
    .catch(error => {Swal.fire("Oops!", error.error,"error")});
  }
  getColleagues(){
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
      .then((result) => {var r = JSON.parse(result); this.setState({colleagues: r.colleagues});})
      .catch((error) => console.error(error));
  }
  componentDidMount(){
    this.getColleagues()
  }
  render(){
    return(
      <div className='page'>
        <div className='manage-panel'>
          <h1>Manage({getCookie("login-company")})</h1>
          <h2>Add to company</h2>
          <input type='text' placeholder='Email' onChange={(e)=> this.setState({emailToCompany: e.target.value})}></input>
          <button className='rounded-btn-secondary' onClick={()=>this.addColleague()}>Add</button>
          <ul>
            {this.state.colleagues.map((colleague) => (
              <div className='li-i'>
                <li><h5>{colleague.email} - {colleague.role == 1? "Admin" : "Colleague"}</h5></li>
                <p className='interactable' onClick={()=>this.removeColleague(colleague.email)}>Remove</p> 
                {colleague.role == 1 && <p className='interactable' onClick={()=>this.removeAdmin(colleague.email)}>Remove as admin</p>}
                {colleague.role == 0 && <p className='interactable' style={{color: "lightgreen"}} onClick={()=>this.addAdmin(colleague.email)}>Promote to admin</p>}
                <br></br>
              </div>
            ))}
          </ul>
        </div>
        <NavBar />
      </div>
    )
  }
}

export default AuthRedirect(ManageWrapper,1);
