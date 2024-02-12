import './App.css';
import React, {Component} from 'react';
import logo from './assets/logo.png';
import { Link } from 'react-router-dom';
import {getCookie, removeCookie} from './cookie'

class NavBar extends Component{
  state = {
    dashboard:"/dashboard"
  }
  getRole(){
    var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "token": getCookie("login-token")
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch("http://localhost:3001/api/role", requestOptions)
          .then(response => response.text())
          .then(result => {
            var r = JSON.parse(result);
            if(r.success){
              console.log(r.role)
              this.setState({dashboard: r.role === 1 ? "/admin" : "/dashboard"})
            }
          })
          .catch(error => console.log('error', error));
  }
  componentDidMount(){
    this.getRole();
  }
  render(){
    return(
      <div className='navbar'>
        <Link to={'/'}><img src={logo}/></Link>
        <Link to={this.state.dashboard}><p>Dashboard</p></Link>
        <Link to={'/orders'}><p>Orders</p></Link>

        {getCookie("login-token") == "" && <div>
          <Link to={'/signup'}><button  className='rounded-btn-secondary' style={{right: 120, marginTop: 15}}>Sign Up</button></Link>
          <Link to={'/signin'}><button className='rounded-btn-primary'>Sign In</button></Link>
        </div>}

        {getCookie("login-token") != ""  && 
          <div style={{position: "absolute", right: 100, display: 'flex'}}>
              <h5>Logged in as {getCookie("login-name")}({getCookie("login-company")})</h5>
              <p className='interactable' onClick={()=> {removeCookie("login-token");  window.location.reload(false);}} style={{color: "red"}}>sign out</p>
          </div>
        }

      </div>
    )
  }
}

export default NavBar;
