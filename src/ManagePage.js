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
  addAdmin(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "token": getCookie("login-token"),
    "newAdmin": this.state.emailToAdmin
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
          Swal.fire("Success!", `${this.state.emailToAdmin} was added as an admin!`,"success")
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
          <button className='rounded-btn-secondary'>Add</button>
          <h2>Add as admin</h2>
          <input type='text' placeholder='Email'  onChange={(e)=> this.setState({emailToAdmin: e.target.value})}></input>
          <button className='rounded-btn-secondary' onClick={()=>this.addAdmin()}>Add</button>
          <ul>
            {this.state.colleagues.map((colleague) => (
              <li>{colleague.email} - {colleague.role == 1? "Admin" : "Colleague"}</li>
            ))}
          </ul>
        </div>
        <NavBar />
      </div>
    )
  }
}

export default AuthRedirect(ManageWrapper,1);
