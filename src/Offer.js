import './App.css';
import React, { Component } from 'react';
import logo from './assets/logo.png';
import { ReactComponent as Icon_close } from './assets/dashboard_icons/icon-close.svg';


class Offer extends Component {
  state = {
    open: false,
    data: [{ title: "Helységkönyv", elements: [{ title: "helységkönyv", ftDb: 0, db: 0 }] }],
    editingData: [],//[[{data:[0,0,0]}],[{data:[0]}]]
    editing: false
  }
  popUpOpen() {
    this.setState({ open: true })
  }
  popUpClose() {
    this.props.parent.blur(false)
    this.setState({ open: false })
  }
  offerDateFormat(date) {
    return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
  }
  addDataLine(){
    var updatedData = this.state.editingData;
    updatedData.push({elements: [0]});
    console.log("Added new line")
    this.setState({editingData: updatedData})
  }
  addElementLine(index){
    var updatedData = this.state.editingData;
    updatedData[index].elements.push(0);
    this.setState({editingData: updatedData})
  }
  render() {
    return (
      <div className='offer' style={{ display: this.state.open ? "block" : "none" }}>
        {this.state.open && <div>
          <div className='offer-order-data'>
            <Icon_close style={{ marginBottom: -20, marginLeft: "100%" }} className='interactable' onClick={() => this.popUpClose()} />
            <h1 style={{ marginTop: 0 }}>Order Data</h1>

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
              <p>{this.offerDateFormat(this.props.offer.datum)}</p>
            </div>
          </div>
          <div className='offer-order'>
            <div className='column-headers-rw-4'>
              <p style={{ width: '27%' }}>drawings to process</p>
              <p>unit price</p>
              <p>quantity</p>
              <p style={{ width: '23%' }}>Ft</p>
              <div className='line'></div>
            </div>

            {this.props.editing == null && <ul className='fields'>
              {this.state.data.map(data => (
                <li key={data.id}>
                  <p>{data.title}</p>
                  <ul className='row'>
                    {data.elements.map(element => (
                      <li key={element.id}>
                        <div className='rows-rw-4'>
                          <p>{element.title}</p>
                          <p>{element.ftDb}/db</p>
                          <p>{element.db}db</p>
                          <p>{element.ftDb * element.db}Ft</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>}
            {this.props.editing != null && <ul className='fields'>
              {this.state.editingData.map((data, index) => (
                <li key={data.id}>
                  <input style={{backgroundColor: "var(--darker-bg)", border: "none", margin: 5}}  placeholder='Pl. helységköny'></input>
                  <ul className='row'>
                    {data.elements.map((element,eindex) => (
                      <li key={element.id}>
                        <div className='rows-rw-4'>
                        <div><input style={{backgroundColor: "var(--lighter-bg)", border: "none", margin: 5}} placeholder='Pl. helységköny'></input></div>
                        <div><input id={`${data.index}-${eindex}-ftdb`} style={{width: 50,backgroundColor: "var(--lighter-bg)", border: "none"}}></input><p>Ft/db</p></div>
                        <div><input id={`${data.index}-${eindex}-db`} style={{width: 50, backgroundColor: "var(--lighter-bg)", border: "none"}}></input><p>db</p></div>
                        <div><input disabled style={{width: 50, backgroundColor: "var(--lighter-bg)", border: "none"}}></input><p>Ft</p></div>
                        </div>
                      </li>
                    ))}
                    <h2 onClick={()=> this.addElementLine(index)} className='interactable'>+</h2>
                  </ul>
                </li>
              ))}
              <h1 onClick={()=> this.addDataLine()} className='interactable'>+</h1>
            </ul>}
          </div>
        </div>}
      </div>
    )
  }
}

export default Offer;
