import './App.css';
import React, { Component } from 'react';
import logo from './assets/logo.png';
import { ReactComponent as Icon_close } from './assets/dashboard_icons/icon-close.svg';
import Swal from 'sweetalert2';
import { getCookie } from './cookie';

class Offer extends Component {
  state = {
    open: false,
    data: [],
    editingData: [],//[[{data:[0,0,0]}],[{data:[0]}]]
    editing: false
  }
  popUpOpen() {
    this.setState({ open: true, editingData: this.props.editing ? [] : this.state.editingData })
  }
  popUpClose() {
    this.props.parent.blur(false)
    this.setState({ open: false })
  }
  offerDateFormat(date) {
    try{
    return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
    }
    catch{
      return date
    }
  }
  addDataLine(){
    var updatedData = this.state.editingData;
    updatedData.push({title: "",elements: [{title: "", ftDb: 0, db: 0 }]});
    console.log("Added new line")
    this.setState({editingData: updatedData})
  }
  addElementLine(index){
    var updatedData = this.state.editingData;
    updatedData[index].elements.push({title: "", ftDb: 0, db: 0 });//add new line to elements
    this.setState({editingData: updatedData})
  }
  ChangeDataFtDb(index,eindex, value){
    var updatedData = this.state.editingData;
    updatedData[index].elements[eindex].ftDb = (value == NaN ? 0 : value);
    this.setState({editingData: updatedData})
  }
  ChangeDataDb(index,eindex, value){
    var updatedData = this.state.editingData;
    updatedData[index].elements[eindex].db = (value == NaN ? 0 : value);
    this.setState({editingData: updatedData})
  }
  ChangeDataTitle(index, value){
    var updatedData = this.state.editingData;
    updatedData[index].title = (value == "" ? "Empty" : value);
    this.setState({editingData: updatedData})
  }
  ChangeDataInnerTitle(index,eindex, value){
    var updatedData = this.state.editingData;
    updatedData[index].elements[eindex].title = (value == "" ? "Empty" : value);
    this.setState({editingData: updatedData})
  }
  CalculateFt(index,eindex){
    var updatedData = this.state.editingData;
    return (updatedData[index].elements[eindex].db == NaN ? 0 : updatedData[index].elements[eindex].db) * (updatedData[index].elements[eindex].ftDb == NaN ? 0 : updatedData[index].elements[eindex].ftDb);
  }
  updateOffer(offer){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      "companyName": offer.header.companyName,
      "offerId": offer.id,
      "data": this.state.editingData,
      "status": offer.status > 1 ? offer.status : 1,
      "token": getCookie("login-token")
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3001/api/update-offer", requestOptions)
      .then(response => response.text())
      .then(result => {Swal.fire("Success!", `Offer [${this.formatOfferId(offer)}] updated successfully!`,"success"); this.popUpClose()})
      .catch(error => {Swal.fire("Oops!", error.error, "error")});
  }
  calculateDepositOsszeg(e){
    var offer = this.props.offer;
    var osszeg = 0
    offer.data.forEach(data => {
        data.elements.forEach(element => {
            osszeg += Number(element.ftDb * element.db);
        });
    });
    return osszeg / e;
}
componentDidUpdate(prevProps, prevState){
  if(prevProps.offer != this.props.offer){
    if(this.props.offer.data.length > 0){
      this.setState({editingData: this.props.offer.data})
    }
  }
}
formatOfferId(offer) {
  return offer.id;
}
  render() {
    return (
      <div className='offer' style={{ display: this.state.open ? "block" : "none" }}>
        {this.state.open && <div>
          <div className='offer-order-data'>
            <Icon_close style={{ marginBottom: -20, marginLeft: "100%", filter: "invert(1)" }} className='interactable' onClick={() => this.popUpClose()} />
            <h1 style={{ marginTop: 0 }}>Order Data</h1>

            <div className='column-headers-rw-4'>
              <p>Ajánlatkérési sorszám</p>
              <p>Projekt</p>
              <p>Munkanem</p>
              <p>Ajánlatkérési dátum</p>
              <div className='line'></div>
            </div>
            <div className='rows-rw-4'>
              <p>{this.formatOfferId(this.props.offer)}</p>
              <p>{this.props.offer.header.projectName}</p>
              <p>{this.props.offer.header.workTypes}</p>
              <p>{this.offerDateFormat(this.props.offer.header.datum)}</p>
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

            {!this.props.editing && 
            <div>
              <ul className='fields'>
                {this.props.offer.data.map(data => (
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
              </ul>
              <div style={{border:'1px solid white',padding: 5, borderRadius: 10, width: "fit-content", display: 'flex', gap: 10}}>
                <h3>Összeszen: {this.calculateDepositOsszeg(1)} Ft</h3>
                <h3>Deposit: {this.calculateDepositOsszeg(2)} Ft</h3>
              </div>
            </div>}
            {this.props.editing && 
            <div>
            <ul className='fields'>
              {this.state.editingData.map((data, index) => (
                <li key={data.id}>
                  <input style={{backgroundColor: "var(--darker-bg)", border: "none", margin: 5}}  placeholder='Pl. helységköny' value={data.title} onChange={(e) => this.ChangeDataTitle(index,e.target.value)}></input>
                  <ul className='row'>
                    {data.elements.map((element,eindex) => (
                      <li key={element.id}>
                        <div className='rows-rw-4'>
                        <div><input style={{border: "1px solid var(--primary)", background: "var(--darker-bg)", margin: 5}} placeholder='Pl. helységköny' value={element.title} onChange={(e) => this.ChangeDataInnerTitle(index,eindex,e.target.value)}></input></div>
                        <div><input id={`${index}-${eindex}-ftdb`} style={{width: 50, border: "1px solid var(--primary)", background: "var(--darker-bg)"}} value={element.ftDb} onChange={(e) => this.ChangeDataFtDb(index,eindex,e.target.value)}></input><p>Ft/db</p></div>
                        <div><input id={`${index}-${eindex}-db`} style={{width: 50, border: "1px solid var(--primary)",background: "var(--darker-bg)"}} value={element.db} onChange={(e) => this.ChangeDataDb(index,eindex,e.target.value)}></input><p>db</p></div>
                        <div><input disabled style={{width: 50, border: "1px solid var(--primary)", background: "var(--darker-bg)"}}value={this.CalculateFt(index,eindex)}></input><p>Ft</p></div>
                        </div>
                      </li>
                    ))}
                    <h2  style={{width: "90%", padding: 5,backgroundColor: "var(--bg)", borderRadius: 10}} onClick={()=> this.addElementLine(index)} className='interactable'>+</h2>
                  </ul>
                </li>
              ))}
              <h1 style={{width: "90%", padding: 5,backgroundColor: "var(--bg)", borderRadius: 10}} onClick={()=> this.addDataLine()} className='interactable'>+</h1>
            </ul>
            <button className='rounded-btn-primary' onClick={()=> this.updateOffer(this.props.offer)}>Update Offer</button>
            </div>
            }
            
          </div>
        </div>}
      </div>
    )
  }
}

export default Offer;
