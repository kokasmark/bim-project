import './App.css';
import React, {Component} from 'react';
import logo from './assets/logo.png';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
const SignInWrapper = () => {
  const navigate = useNavigate();

  return <SignInPage navigate={navigate} />;
};
class SignInPage extends Component{
  validate(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "email": this.state.email,
      "password": this.state.password
    });
    console.log(`Trying register with ${this.state.email}`)
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3001/api/login", requestOptions)
      .then(response => response.text())
      .then(result => {
        var r = JSON.parse(result)
        if(r.success){
          Swal.fire("Success!", "Successfully logged in!","success"); 
          localStorage.setItem("login-token", r.token);
          localStorage.setItem("login-name", r.name);
          const { navigate } = this.props;
          navigate("/dashboard");
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
          <img className='logo' src={require("./assets/logo.png")}/>
          <h1>Sign In</h1>
          <p>Enter your credentials to continue</p>
          <div>
            <div className='inputs'>
              <input placeholder='Email address' style={{width: "92%", marginTop: 20}} onChange={(e) => this.setState({email: e.target.value})}></input>
              <input placeholder='Password' style={{width: "92%", marginTop: 20}} type='password' onChange={(e) => this.setState({password: e.target.value})}></input>
              
              <button className='validate-btn interactable' onClick={()=>this.validate()}>Sign In</button>
            </div>
            
          </div>
        </div>
      </div>
    )
  }
}

export default SignInWrapper;
