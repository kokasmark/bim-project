import './App.css';
import React, {Component} from 'react';
import logo from './assets/logo.png';
import { Link } from 'react-router-dom';
import {getCookie, removeCookie, setCookie} from './cookie'
import { IoIosNotifications } from "react-icons/io";
import { MdNotificationsActive } from "react-icons/md";


class NavBar extends Component{
  state = {
    dashboard:"/dashboard",
    role: 0,
    openedNotifications: false,
    notifications: []
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
              setCookie("login-company", r.company,1)
              this.setState({dashboard: r.role === 1 ? "/dashboard" : "/orders", role: r.role})
            }
          })
          .catch(error => console.log('error', error));
  }
  componentDidMount(){
    this.getRole();
  }
  openNotifications(){
    this.setState({openedNotifications: !this.state.openedNotifications, notifications: JSON.parse(getCookie('notifications'))});
  }
  render(){
    return(
      <div className='navbar'>
        <Link to={'/'}><img src={logo}/></Link>
        <Link to={this.state.dashboard}><p>Dashboard</p></Link>
        {this.state.role > 0 && <Link to={'/manage'}><p>Manage</p></Link>}

        {getCookie("login-token") == "" && <div>
          <Link to={'/register'}><button  className='rounded-btn-secondary' style={{right: 120, marginTop: 15}}>Sign Up</button></Link>
          <Link to={'/login'}><button className='rounded-btn-primary'>Sign In</button></Link>
        </div>}

        {getCookie("login-token") != ""  && 
          <div style={{position: "absolute", right: 100, display: 'flex', justifyContent: 'center'}}>
               {getCookie("notifications") == "[]" ? 
               <IoIosNotifications style={{fontSize: 30, marginTop: 15}} onClick={()=> this.openNotifications()}/> : 
               <MdNotificationsActive  style={{fontSize: 30, marginTop: 15}}  onClick={()=> this.openNotifications()}/>}
              <p>Logged in as <b>{getCookie("login-name")}</b></p>
              <p className='interactable' onClick={()=> {removeCookie("login-token");  window.location.reload(false);}} style={{color: "var(--error)"}}>sign out</p>
          </div>
        }
        {this.state.openedNotifications && <div className='notifications'>
          <div style={{display: 'flex', paddingLeft: 20}}>
            <h3>Értesítések</h3>
            <p className='interactable' style={{marginLeft: 225,textAlign: 'right', color: 'var(--error)'}} 
            onClick={()=> {setCookie("notifications","[]"); this.setState({notifications: []})}}>Törlés</p>
          </div>
          <ul>
            {this.state.notifications.map((noti,index) =>
              <li>{noti}</li>
            )}
          </ul>
        </div>}
      </div>
    )
  }
}

export default NavBar;
