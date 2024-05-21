import './App.css';
import React, {Component} from 'react';
import logo from './assets/logo.png';
import { Link } from 'react-router-dom';
import PasswordStrengthBar from 'react-password-strength-bar';
import Swal from 'sweetalert2';
import {setCookie} from './cookie';


class SignUpPage extends Component{
  state = {
    firstName: '',
    lastName: '',
    email:'',
    password: ''
  }
  validate(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "email": this.state.email,
      "password": this.state.password,
      "name": `${this.state.firstName} ${this.state.lastName}`
    });
    console.log(`Trying register with ${this.state.email}`)
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3001/api/register", requestOptions)
      .then(response => response.text())
      .then(result => {
        var r = JSON.parse(result)
        if(r.success){
          Swal.fire("Success!", "Successfully registered!","success"); 
          setCookie("login-token", r.token,1);
          setCookie("login-name", r.name,1);
        }else{
          Swal.fire("Oops!",r.error,"error")
        }
      })
      .catch(error => {Swal.fire(error,"error")});
      }
  render(){
    return(
      <div>
        <div className='panel'>
          <h1>Regisztrálás</h1>
          <p>Kérem adja meg adatait a folytatáshoz</p>
          <div>
            <div className='inputs'>
              <input placeholder='First Name' style={{marginRight: "10%"}} onChange={(e) => this.setState({firstName: e.target.value})}></input>
              <input placeholder='Last Name' onChange={(e) => this.setState({lastName: e.target.value})}></input>
              <input placeholder='Email address' style={{width: "92%", marginTop: 20}} onChange={(e) => this.setState({email: e.target.value})}></input>
              <input placeholder='Password' style={{width: "92%", marginTop: 20}} type='password' onChange={(e) => this.setState({password: e.target.value})}></input>
              <PasswordStrengthBar style={{width: "92%", marginLeft: "4%", marginTop: 20}} password={this.state.password} />
              <button className='validate-btn interactable' onClick={()=>this.validate()}>Regisztrálás</button>
              <Link to={"/login"} style={{textDecoration: "none", color: 'white'}} className='interactable'><p>Van már fiókja?</p></Link>
            </div>
            
          </div>
        </div>
      </div>
    )
  }
}

export default SignUpPage;
