import './App.css';
import React, {Component} from 'react';
import logo from './assets/logo.png';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import {setCookie} from './cookie';
const ForgotPasswordWrapper = () => {
  const navigate = useNavigate();

  return <ForgotPasswordPage navigate={navigate} />;
};
class ForgotPasswordPage extends Component{
  state= {
    email: "",
    status: 0
  }
  sendToken(){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "email": this.state.email
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:3001/api/forgot-password", requestOptions)
      .then((response) => response.text())
      .then((result) => {this.setState({status: 1})})
      .catch((error) => console.error(error));
  }
  resetPassword(){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "token": this.state.token,
      "password": this.state.password
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:3001/api/reset-password", requestOptions)
      .then((response) => response.text())
      .then((result) => {Swal.fire("Success!", "Your password has been updated!", 'success'); const { navigate } = this.props;
      navigate("/signin");})
      .catch((error) => console.error(error));
  }
  render(){
    return(
      <div>
        {this.state.status == 0 &&<div className='panel' style={{top: "15%"}}>
          <img className='logo' src={require("./assets/logo.png")}/>
          <h1>Forgot Password?</h1>
          <div>
            <div className='inputs'>
              <input placeholder='Email address' style={{width: "92%", marginTop: 20}} onChange={(e) => this.setState({email: e.target.value})}></input>
              
              <button className='validate-btn interactable' onClick={()=>this.sendToken()}>Send Token</button>
              <br/>
              <Link to={"/signing"} style={{textDecoration: "none", color: 'white'}} className='interactable'><p>Already have an account?</p></Link>
            </div>
            
          </div>
        </div>}

        {this.state.status == 1 &&<div className='panel' style={{top: "15%"}}>
          <img className='logo' src={require("./assets/logo.png")}/>
          <h1>Reset Password</h1>
          <div>
            <div className='inputs'>
              <input placeholder='Token' style={{width: "92%", marginTop: 20}} onChange={(e) => this.setState({token: e.target.value})}></input>
              <input placeholder='New Password' type='password' style={{width: "92%", marginTop: 20}} onChange={(e) => this.setState({password: e.target.value})}></input>
              
              <button className='validate-btn interactable' onClick={()=>this.resetPassword()}>Reset Password</button>
              <br/>
              <Link to={"/signing"} style={{textDecoration: "none", color: 'white'}} className='interactable'><p>Already have an account?</p></Link>
            </div>
            
          </div>
        </div>}
      </div>
    )
  }
}

export default ForgotPasswordWrapper;
