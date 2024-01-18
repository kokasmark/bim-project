import './App.css';
import React, { Component } from 'react';
import logo from './assets/logo.png';


class Offer extends Component {
  render() {
    return (
      <div className='offer'>
        <div className='offer-order-data'>
          <h1>Order Data</h1>

          <div className='column-headers-rw-5'>
            <p>Ajánlatkérési sorszám</p>
            <p>Projekt</p>
            <p>Munkanem</p>
            <p>Rövid cégnév</p>
            <p>Ajánlatkérési dátum</p>
            <div className='line'></div>
          </div>
          <div className='rows-rw-5'>
            <p>{this.props.offer.sorszam}</p>
            <p>{this.props.offer.projekt}</p>
            <p>{this.props.offer.munkanem}</p>
            <p>{this.props.offer.cegnev}</p>
            <p>{this.props.offer.datum}</p>
          </div>
        </div>
        <div className='offer-order'>
          <div className='column-headers-rw-4'>
            <p style={{width: '27%'}}>drawings to process</p>
            <p>unit price</p>
            <p>quantity</p>
            <p style={{width: '23%'}}>Ft</p>
            <div className='line'></div>
          </div>

          <ul className='fields'>
            <li>
              <p>Helységkönyv</p>
              <ul className='row'>
                <li>
                  <div className='rows-rw-4'>
                    <p>helységkönyv</p>
                    <p>x/db</p>
                    <p>10db</p>
                    <p>0Ft</p>
                  </div>
                </li>
                <li>
                  <div className='rows-rw-4'>
                    <p>helységkönyv</p>
                    <p>x/db</p>
                    <p>10db</p>
                    <p>0Ft</p>
                  </div>
                </li>
                
              </ul>
            </li>

            <li>
              <p>Helységkönyv</p>
              <ul className='row'>
                <li>
                  <div className='rows-rw-4'>
                    <p>helységkönyv</p>
                    <p>x/db</p>
                    <p>10db</p>
                    <p>0Ft</p>
                  </div>
                </li>
                <li>
                  <div className='rows-rw-4'>
                    <p>helységkönyv</p>
                    <p>x/db</p>
                    <p>10db</p>
                    <p>0Ft</p>
                  </div>
                </li>
                <li>
                  <div className='rows-rw-4'>
                    <p>helységkönyv</p>
                    <p>x/db</p>
                    <p>10db</p>
                    <p>0Ft</p>
                  </div>
                </li>
                <li>
                  <div className='rows-rw-4'>
                    <p>helységkönyv</p>
                    <p>x/db</p>
                    <p>10db</p>
                    <p>0Ft</p>
                  </div>
                </li>
                <li>
                  <div className='rows-rw-4'>
                    <p>helységkönyv</p>
                    <p>x/db</p>
                    <p>10db</p>
                    <p>0Ft</p>
                  </div>
                </li>
                
              </ul>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Offer;
