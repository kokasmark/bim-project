import './App.css';
import React, {Component} from 'react';
import logo from './assets/logo.png';
import { Link } from 'react-router-dom';


class NavBar extends Component{
  render(){
    return(
      <div className='navbar'>
        <Link to={'/'}><img src={logo}/></Link>
        <div style={{width: '100%'}}>
          <div style={{marginTop: -50, marginLeft: 200}}>
              <Link to={'/dashboard'}><p>Dashboard</p></Link>
              <Link to={'/admin_dashboard'}><p>Admin Dashboard(For testing)</p></Link>
              <Link to={'/orders'}><p>Orders</p></Link>
          </div>

          <p  style={{position: 'relative', top: -30, left: '88%', fontSize: 20}}>Sign In</p>
          <button className='rounded-btn-primary' style={{position: 'relative', top: -30, left: '88%'}}>Sign Up</button>
        </div>
      </div>
    )
  }
}

export default NavBar;
