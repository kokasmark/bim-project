import './App.css';
import React, { Component } from 'react';
import NavBar from './NavBar';
import { Card } from 'react-bootstrap';
import { ReactComponent as Icon_arrow } from './assets/icon-arrow-up.svg';
import { ReactComponent as Icon_close } from './assets/dashboard_icons/icon-close.svg';
import card_icon from './assets/dashboard_icons/credit_card.png';
import card_icon_with_bg from './assets/dashboard_icons/icon-4.png';
import download_icon from './assets/dashboard_icons/download.png';
import icon_copy from './assets/dashboard_icons/icon-copy.png';

import Select from 'react-select';
import { FileUploader } from "react-drag-drop-files";
import upload_file_icon from './assets/dashboard_icons/UploadFileFilled.png';
import logo from './assets/logo.png';

import Swal from 'sweetalert2';
import Offer from './Offer';
import calc_icon from './assets/dashboard_icons/calculate_black_24dp 1.png'
import AuthRedirect from './authRedirect';
import { getCookie } from './cookie';


class Dashboard extends Component {
    dashboard = React.createRef();
    offer_requestsRef = React.createRef();
    sent_offersRef = React.createRef();
    ordersRef = React.createRef();
    processingRef = React.createRef();
    invoicedRef = React.createRef();
    offerRef = React.createRef();

    state = {
        onTop: true,
        offers: [[],[],[],[],[]],//based on status
        requestingOffer: false,
        requestSent: false,
        acceptedFilesOnUpload: ["JPG", "PNG", "SVG", "PDF"],
        request: {},
        selectedOffer: {},
        selectedWorktypes: '',
        depositpopup: false,
        offerpopup: false,
        seeOffer: {},
        blur: false,
        offerAction: true, //true if editing
        selectedCategory: "requests"

    }

    getOffers(){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "token": getCookie("login-token"),
            "page": 1
            });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("http://localhost:3001/api/get-offers", requestOptions)
        .then(response => response.text())
        .then(result => {var r = JSON.parse(result);this.assignOffers(r.offers)})
        .catch(error => console.log('error', error));
    }
    assignOffers(offers){
        offers.forEach(offer => {
            let updatedOffers = this.state.offers;
            updatedOffers[offer.status].push(offer)
            this.setState({offers: updatedOffers})
        });
    }
    componentDidMount() {
        this.getOffers()
    }
    requestOfferPopUp() {
        this.setState({ requestingOffer: true,blur: true });
    }
    uploadFile() {

    }
    pad(num, size) {
        var s = "000000000" + num;
        return s.substr(s.length - size);
    }
    handleMultiChange(option, t) {
        var wt = '';
        for (var i = 0; i < option.length; i++) {
            wt += option[i].label;
            if (i != option.length - 1) {
                wt += ', '
            }
        }
        t.setState({ selectedWorktypes: wt })
    }
    depositPopUp(offer){
        this.setState({depositpopup: true, blur: true,selectedOffer: offer})
    }
    closeOfferPopUp(){
        this.setState({offerpopup: false})
    }
    offerPopUp(offer,action){
        this.setState({blur: true, seeOffer: offer, offerAction: action});
        this.offerRef.current.popUpOpen()
    }
    blur(flag){
        this.setState({blur: flag})
    }
    offerDateFormat(date){
        try{
        return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
        }catch{
            return date
        }
    }
    daysToFinish(date){
        const offerDate = new Date(date);

        const timeLine = new Date();
        timeLine.setDate(timeLine.getDate() - 5);
        const timeDifference = offerDate-timeLine;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        if(daysDifference > 0){
            return <p>{daysDifference} days</p>;
        }else{
            return <p style={{color: "var(--error)"}}>Behind by {Math.abs(daysDifference)} days</p>
        }
    }
    depositArrivedPopup(offer){
        Swal.fire({
            title: `Did the deposit arrived for order ${this.formatOfferId(offer)}?\n\nPayment: ${this.calculateDepositOsszeg(offer)} Ft`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Deposit arrived",
            denyButtonText: `Cancel`
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                const raw = JSON.stringify({
                "companyName": offer.header.companyName,
                "offerId": offer.id,
                "status": 2,
                "token": getCookie("login-token")
                });

                const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
                };

                fetch("http://localhost:3001/api/update-offer", requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.error(error));
              Swal.fire("Saved!", "", "success");
            } else if (result.isDenied) {

            }
          });
    }
    sendFinishedJob(offer){
        const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                const raw = JSON.stringify({
                "companyName": offer.header.companyName,
                "offerId": offer.id,
                "status": 3,
                "token": getCookie("login-token")
                });

                const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
                };

                fetch("http://localhost:3001/api/update-offer", requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.error(error));
    }
    sendInvoice(offer){
        const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                const raw = JSON.stringify({
                "companyName": offer.header.companyName,
                "offerId": offer.id,
                "status": 4,
                "token": getCookie("login-token")
                });

                const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
                };

                fetch("http://localhost:3001/api/update-offer", requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.error(error));
    }
    calculateDepositOsszeg(offer){
        var osszeg = 0
        offer.data.forEach(data => {
            data.elements.forEach(element => {
                osszeg += Number(element.ftDb * element.db);
            });
        });
        return osszeg / 2;
    }
    formatOfferId(offer) {
        return offer.id;
    }
    render() {
        const options = [
            { value: 'ajzatbeton', label: 'Ajzat Beton' },
            { value: 'ablak', label: 'Ablak' },
            { value: 'ajto', label: 'Ajtó' }
        ]

        return (
            <div style={{ backgroundColor: 'var(--darker-bg)', overflowY: this.state.blur == false ? 'scroll' : 'hidden', maxHeight: '1000px' }} ref={this.dashboard}>
                <div className='dashboard-header' style={{ filter: this.state.blur == true ? 'blur(3px) brightness(50%)' : '' }}>

                    <Card className={this.state.selectedCategory == "requests"?"header selected":"header"}
                        onClick={()=> this.setState({selectedCategory: "requests"})}>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-5.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>{this.state.offers[0].length}</Card.Text>
                                <Card.Text style={{marginTop: -30 }}>Rendelések</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card  className={this.state.selectedCategory == "sent"?"header selected":"header"}
                    onClick={()=> this.setState({selectedCategory: "sent"})}>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-2.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>{this.state.offers[1].length}</Card.Text>
                                <Card.Text style={{marginTop: -30 }}>Elküldött</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card  className={this.state.selectedCategory == "processing"?"header selected":"header"}
                    onClick={()=> this.setState({selectedCategory: "processing"})}>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-6.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>{this.state.offers[2].length}</Card.Text>
                                <Card.Text style={{ marginTop: -30 }}>Feldolgozás alatt</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card  className={this.state.selectedCategory == "finished"?"header selected":"header"}
                    onClick={()=> this.setState({selectedCategory: "finished"})}>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-1.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>{this.state.offers[3].length}</Card.Text>
                                <Card.Text style={{marginTop: -30 }}>Kész</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                    
                    <Card className={this.state.selectedCategory == "invoiced"?"header selected":"header"}
                    onClick={()=> this.setState({selectedCategory: "invoiced"})}>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-7.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>{this.state.offers[4].length}</Card.Text>
                                <Card.Text style={{marginTop: -30 }}>Számlázott</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                {this.state.selectedCategory == "requests" && <div className='dashboard-category' ref={this.offer_requestsRef} style={{ filter: this.state.blur == true ? 'blur(3px) brightness(50%)' : '' }}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}>
                            <img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-5.png')} />
                            Rendelések
                            <select>
                                <option>Sorszám</option>
                                <option>Projekt</option>
                                <option>Munkanem</option>
                                <option>Megrendelő</option>
                            </select>
                            <input></input>
                            <p className='rounded-btn-primary' style={{width: 100, textAlign: 'center', display: 'inline-block'}}>Szűrés</p>
                            </Card.Title>
                        <Card.Body>
                            <div className='column-headers-rw-6'>
                                <p>Ajánlatkérési sorszám</p>
                                <p>Projekt</p>
                                <p>Munkanem</p>
                                <p>Megrendelő</p>
                                <p>Ajánlatkérési dátum</p>
                                <p>Action</p>
                                
                                <div className='line'></div>
                            </div>

                            {this.state.offers[0].map((offer,index) =>
                                <div className='rows-rw-6'  style={{animation: `row-load ${index}s`}}>
                                    <p>{this.formatOfferId(offer)}</p>
                                    <p>{offer.header.projectName}</p>
                                    <p>{offer.header.workTypes}</p>
                                    <p>{offer.header.author}</p>
                                    <p>{this.offerDateFormat(offer.header.datum)}</p>
                                    <p className='rounded-btn-primary' style={{width: 'fit-content', marginLeft: -50}}  onClick={()=> this.offerPopUp(offer, true)}><img src={calc_icon}/>Calculation</p>
                                    <div className='line'>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>}
                {this.state.selectedCategory == "sent" && <div className='dashboard-category' ref={this.sent_offersRef} style={{ filter: this.state.blur == true ? 'blur(3px) brightness(50%)' : '' }}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}><img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-2.png')} />
                        Elküldött
                        <select>
                                <option>Sorszám</option>
                                <option>Projekt</option>
                                <option>Munkanem</option>
                                <option>Megrendelő</option>
                            </select>
                            <input></input>
                            <p className='rounded-btn-primary' style={{width: 100, textAlign: 'center', display: 'inline-block'}}>Szűrés</p>
                        </Card.Title>
                        <Card.Body>
                            <div className='column-headers-rw-6'>
                                <p>Ajánlatkérési sorszám</p>
                                <p>Projekt</p>
                                <p>Munkanem</p>
                                <p>Megrendelő</p>
                                <p>Befejezési határidő</p>
                                <p>Action</p>
                                <div className='line'></div>
                            </div>

                            {this.state.offers[1].map((offer,_index) =>
                                <div className='rows-rw-6' index={_index}  style={{animation: `row-load ${_index}s`}}>
                                    <p>{this.formatOfferId(offer)}</p>
                                    <p>{offer.header.projectName}</p>
                                    <p>{offer.header.workTypes}</p>
                                    <p>{offer.header.author}</p>
                                    {this.daysToFinish(offer.header.datum)}
                                    <p className='rounded-btn-primary' style={{width: 'fit-content', marginLeft: -50}} onClick={()=> this.depositArrivedPopup(offer)}>Deposit arrived</p>
                                    <div className='line'>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>}
                {this.state.selectedCategory == "processing" && <div className='dashboard-category' ref={this.ordersRef} style={{ filter: this.state.blur == true ? 'blur(3px) brightness(50%)' : '' }}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}><img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-6.png')} /> 
                        Feldolgozás alatt
                        <select>
                                <option>Sorszám</option>
                                <option>Projekt</option>
                                <option>Munkanem</option>
                                <option>Megrendelő</option>
                            </select>
                            <input></input>
                            <p className='rounded-btn-primary' style={{width: 100, textAlign: 'center', display: 'inline-block'}}>Szűrés</p>
                        </Card.Title>
                        <Card.Body>
                            <div className='column-headers-rw-7'>
                                <p>Ajánlatkérési sorszám</p>
                                <p>Projekt</p>
                                <p>Munkanem</p>
                                <p>Megrendelő</p>
                                <p>Ajánlatkérési dátum</p>
                                <p>Action</p>
                                <p></p>
                                <div className='line'></div>
                            </div>

                            {this.state.offers[2].map((offer,index) =>
                                <div className='rows-rw-7'  style={{animation: `row-load ${index}s`}}>
                                    <p>{this.formatOfferId(offer)}</p>
                                    <p>{offer.header.projectName}</p>
                                    <p>{offer.header.workTypes}</p>
                                    <p>{offer.header.author}</p>
                                    <p>{this.offerDateFormat(offer.header.datum)}</p>
                                    <p className='rounded-btn-primary' style={{width: 'fit-content', marginLeft: 0}} onClick={()=> this.offerPopUp(offer,true)}>Modify</p>
                                    <p className='rounded-btn-primary' style={{width: 'fit-content', marginLeft: 0 , backgroundColor: 'var(--success)'}} onClick={()=> this.sendFinishedJob(offer)}>Send Finished Job</p>
                                    <div className='line'>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>}
                {this.state.selectedCategory == "finished" &&  <div className='dashboard-category' ref={this.processingRef} style={{ filter: this.state.blur == true ? 'blur(3px) brightness(50%)' : '' }}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}><img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-1.png')} />
                         Kész
                         <select>
                                <option>Sorszám</option>
                                <option>Projekt</option>
                                <option>Munkanem</option>
                                <option>Megrendelő</option>
                            </select>
                            <input></input>
                            <p className='rounded-btn-primary' style={{width: 100, textAlign: 'center', display: 'inline-block'}}>Szűrés</p>
                         </Card.Title>
                        <Card.Body>
                            <div className='column-headers-rw-6'>
                                <p>Ajánlatkérési sorszám</p>
                                <p>Projekt</p>
                                <p>Munkanem</p>
                                <p>Megrendelő</p>
                                <p>Ajánlatkérési dátum</p>
                                <p>Action</p>
                                <div className='line'></div>
                            </div>

                            {this.state.offers[3].map((offer,index) =>
                                <div className='rows-rw-6'  style={{animation: `row-load ${index}s`}}>
                                    <p>{this.formatOfferId(offer)}</p>
                                    <p>{offer.header.projectName}</p>
                                    <p>{offer.header.workTypes}</p>
                                    <p>{offer.header.author}</p>
                                    <p>{this.offerDateFormat(offer.header.datum)}</p>
                                    <p className='rounded-btn-primary' style={{width: 'fit-content', marginLeft: -60, backgroundColor: 'var(--success)'}} onClick={()=>this.sendInvoice(offer)}><img src={download_icon}/>Send Invoice</p>
                                    <div className='line'>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>}
                {this.state.selectedCategory == "invoiced" && <div className='dashboard-category' ref={this.invoicedRef} style={{ filter: this.state.blur == true ? 'blur(3px) brightness(50%)' : '' }}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}><img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-7.png')} />
                         Számlázott
                         <select>
                                <option>Sorszám</option>
                                <option>Projekt</option>
                                <option>Munkanem</option>
                                <option>Megrendelő</option>
                            </select>
                            <input></input>
                            <p className='rounded-btn-primary' style={{width: 100, textAlign: 'center', display: 'inline-block'}}>Szűrés</p>
                         </Card.Title>
                        <Card.Body>
                            <div className='column-headers-rw-6'>
                                <p>Ajánlatkérési sorszám</p>
                                <p>Projekt</p>
                                <p>Munkanem</p>
                                <p>Megrendelő</p>
                                <p>Ajánlatkérési dátum</p>
                                <p>Status</p>
                                <div className='line'></div>
                            </div>

                            {this.state.offers[4].map((offer,index) =>
                                <div className='rows-rw-6'  style={{animation: `row-load ${index}s`}}>
                                    <p>{this.formatOfferId(offer)}</p>
                                    <p>{offer.header.projectName}</p>
                                    <p>{offer.header.workTypes}</p>
                                    <p>{offer.header.author}</p>
                                    <p>{this.offerDateFormat(offer.header.datum)}</p>
                                    <p style={{color: "var(--success)"}}>Done</p>
                                    <div className='line'>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>}

                {this.state.requestingOffer &&
                    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                        <div className='request-offer'>

                            <h1 style={{ textAlign: 'center', fontSize: 56 }}>Offer Details</h1>
                            <p style={{ textAlign: 'center', marginTop: -30 }}>To request an offer, fill in all the details and we will process it within  2 business days</p>

                            <div className='form'>
                                <input placeholder='Company Name' id='company-name'></input>
                                <input placeholder='VAT number'></input>
                                <input placeholder='Short project Name' id='project-name'></input>
                                <Select
                                    isMulti
                                    name="Work types"
                                    options={options}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    placeholder="Work types"
                                    id='work-types'
                                    onChange={(e) => this.handleMultiChange(e, this)}
                                />
                                <input placeholder='Please write here the needed data takeoffs or jobs on the drawings' style={{ height: 100, position: 'relative', top: 20 }}></input>

                                <div className='upload-file-container'><FileUploader classes='upload-file' children={
                                    <div style={{ width: '100%' }}>
                                        <img src={upload_file_icon} />
                                        <p>Click to upload or drag and drop</p>
                                    </div>} name="file" types={this.acceptedFilesOnUpload} /></div>
                                <button className='outlined-btn-secondary' style={{ height: 40 }} onClick={() => this.setState({ requestingOffer: false,blur: false })}>Back</button>
                                <button className='rounded-btn-primary' style={{ width: '90%', position: 'relative', top: -40, left: 100, height: 40 }}
                                    onClick={() => this.sendOfferRequest()}>Send offer Request</button>
                            </div>
                        </div>
                    </div>}

                {this.state.depositpopup && 
                    <div className='deposit-popup'>
                        <div className='deposit-popup-head'>
                            <Icon_close style={{position: 'relative', left: '70%', top: -40}} className='interactable' onClick={()=> this.setState({depositpopup: false,blur: false})}/>
                            <img src={logo}/>
                            <p style={{color: 'green'}}>We recieved your order with your following data</p>
                            <div className='line'></div>
                        </div>
                        <div className='deposit-popup-order-info'>
                            <p className='header-text'>Your order number</p>
                            <p className='text' style={{color: 'green',fontWeight: 'bolder'}}>{this.formatOfferId(this.state.selectedOffer)}</p>
                            <p className='header-text'>Project</p>
                            <p className='text'>{this.state.selectedOffer.header.projectName}</p>
                            <p className='header-text'>Work type</p>
                            <p className='text'>{this.state.selectedOffer.header.workTypes}</p>
                            <p className='header-text'>Short company name</p>
                            <p className='text'>{this.state.selectedOffer.header.companyName}</p>
                            <p className='header-text'>Offer request date</p>
                            <p className='text'>{this.offerDateFormat(this.state.selectedOffer.datum)}</p>
                            <div className='vline'></div> 
                        </div>
                        <div className='deposit-popup-payment-info'>
                            <p className='img-text'><img src={card_icon_with_bg}/>50% advance payment details</p>
                            <p className='header-text'>Név</p>
                            <p className='text'>Bim Revolution Kft. <img className='interactable' src={icon_copy} onClick={() => {navigator.clipboard.writeText('Bim Revolution Kft.')}}/></p>
                            <p className='header-text'>Bank számlaszám</p>
                            <p className='text'>123145678-12345678-121345678 <img className='interactable' src={icon_copy} onClick={() => {navigator.clipboard.writeText('123145678-12345678-121345678')}}/></p>
                            <p className='header-text'>Közlemény</p>
                            <p className='text'>{this.state.selectedOffer.sorszam} <img className='interactable' src={icon_copy} onClick={() => {navigator.clipboard.writeText(this.state.selectedOffer.sorszam)}}/></p>
                            <div className='line' style={{marginBottom: 50}}></div>
                            <p className='header-text'>Összeg</p>
                            <p className='text'>150 000 Ft</p>
                            <p style={{color: 'gray', marginTop: -30, fontSize: 12}}>(net offer price x1.27 what is our vat (=VAT))</p>
                        </div>
                    </div>}
                    
                    
                    <Offer offer={this.state.seeOffer} ref={this.offerRef} parent={this} editing={this.state.offerAction}/>
                    
                <NavBar />
            </div>
        )
    }
}

export default AuthRedirect(Dashboard,1);
