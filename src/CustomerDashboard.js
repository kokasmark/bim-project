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
import AuthRedirect from './authRedirect';
import { getCookie } from './cookie';

class CustomerDashboard extends Component {
    dashboard = React.createRef();
    offer_requestsRef = React.createRef();
    sent_offersRef = React.createRef();
    ordersRef = React.createRef();
    processingRef = React.createRef();
    invoicedRef = React.createRef();
    offerRef = React.createRef();

    state = {
        onTop: true,
        offers: [[],[],[],[],[]],
        requestingOffer: false,
        requestSent: false,
        acceptedFilesOnUpload: ["JPG", "PNG", "SVG", "PDF"],
        request: { sorszam: '', projekt: '', munkanem: '', cegnev: '', datum: '' },
        selectedOffer: {},
        selectedWorktypes: '',
        selectedCompany: "",
        depositpopup: false,
        offerpopup: false,
        seeOffer: {},
        blur: false,
        statusText: ["Waiting Calculation", "Waiting payment", "Paid", "Can be downloaded", "Billed"],
        companies: [],
        selectableWorkTypes: []
    }
    getOffers(){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "company": getCookie("login-company")
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("http://localhost:3001/api/get-orders", requestOptions)
        .then(response => response.text())
        .then(result => {var r = JSON.parse(result); this.assignOffers(r.orders)})
        .catch(error => console.log('error', error));
    }
    sendOffers(header){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "token": getCookie("login-token"),
        "header": header
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("http://localhost:3001/api/add-offer", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }
    assignOffers(offers){
        offers.forEach(offer => {
            console.log(offer)
            let updatedOffers = this.state.offers;
            if(offer.status != 0){
                updatedOffers[0].push(offer)
            }
            updatedOffers[offer.status].push(offer)
            this.setState({offers: updatedOffers})
        });
    }
    start(){
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
            };
    
            fetch("http://localhost:3001/api/get-companies", requestOptions)
            .then(response => response.text())
            .then(result => 
                {
                    var r = JSON.parse(result);
                    if(r.success){
                        this.setState({companies: r.companies})
                    }
                })
            .catch(error => console.log('error', error));
    
            
    }
    setWorkTypes(company){
        var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
    
            var raw = JSON.stringify({
            "company": company
            });
    
            const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };
    
            fetch("http://localhost:3001/api/get-worktypes", requestOptions)
            .then(response => response.text())
            .then(result => 
                {
                    var r = JSON.parse(result);
                    if(r.success){
                        this.setState({workTypes: r.workTypes})
                    }
                })
            .catch(error => console.log('error', error));
    }
    componentDidMount() {
        this.getOffers()
        this.start()
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
    handleSelectChange(option, t){
        this.setWorkTypes(option.label)
        t.setState({selectedCompany: option.label})
    }
    sendOfferRequest() {
        var date = new Date();
        var r = {
            projectName: document.getElementById('project-name').value,
            workTypes: this.state.selectedWorktypes,
            companyName: this.state.selectedCompany,
            author: `${getCookie("login-company")}`,
            datum: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
        };
        console.log(r)
        this.sendOffers(r)
        this.setState({ requestingOffer: false, requestSent: true, request: r });
    }
    depositPopUp(offer){
        this.setState({depositpopup: true, blur: true,selectedOffer: offer})
    }
    closeOfferPopUp(){
        this.setState({offerpopup: false})
    }
    offerPopUp(offer){
        this.setState({blur: true, seeOffer: offer});
        console.log(offer.data)
        this.offerRef.current.popUpOpen()
    }
    blur(flag){
        this.setState({blur: flag})
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
    offerDateFormat(timestamp){
        try{
            const date = new Date(timestamp);
            const now = new Date();
            const diff = now - date;
            
            // Convert milliseconds to minutes and days
            const minutes = Math.floor(diff / (1000 * 60));
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            
            // Format the output
            let formattedDate;
            if (hours < 1) {
              formattedDate = `${minutes} minutes ago`;
            } else if (days < 1) {
              formattedDate = `${hours} hours ago`;
            } else {
              formattedDate = `${days} days ago`;
            }
            return formattedDate
        }catch{
            return "Error"
        }
    }
    formatOfferId(offer) {
            // Ensure the ID is a string
        var id = offer.offerId.toString();
        
        // Calculate the number of leading zeros needed
        var leadingZeros = 6 - id.length;

        // Add leading zeros
        var formatted = offer.header.companyName+"-"+"0".repeat(leadingZeros) + id;

        return formatted;
    }
    render() {
        return (
            <div style={{ backgroundColor: 'var(--darker-bg)', overflowY: this.state.blur == false ? 'scroll' : 'hidden', maxHeight: '1000px' }} ref={this.dashboard}>
                <h1 style={{ marginTop: 100, padding: '50px 0px 0px 0px', marginLeft: '15%', display: 'inline-block', filter: this.state.blur == true ? 'blur(3px) brightness(50%)' : ''}}>Customer Dashboard</h1>
                <button className='rounded-btn-primary' style={{ position: 'relative', top: 0, left: '50%', filter: this.state.blur == true ? 'blur(3px) brightness(50%)' : '' }}
                    onClick={() => this.requestOfferPopUp()}>Request New Offer</button>
                <div className='dashboard-header' style={{ filter: this.state.blur == true ? 'blur(3px) brightness(50%)' : '' }}>
                    <Card>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-5.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>{this.state.offers[0].length}</Card.Text>
                                <Card.Text style={{ marginTop: -30 }}>Orders</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-2.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>{this.state.offers[1].length}</Card.Text>
                                <Card.Text style={{ marginTop: -30 }}>Orders (waiting payment)</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-6.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>{this.state.offers[2].length}</Card.Text>
                                <Card.Text style={{ marginTop: -30 }}>Orders (paid)</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-1.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>{this.state.offers[3].length}</Card.Text>
                                <Card.Text style={{ marginTop: -30 }}>Finished jobs</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-7.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>{this.state.offers[4].length}</Card.Text>
                                <Card.Text style={{ marginTop: -30 }}>Billed Jobs</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <div className='dashboard-category' ref={this.offer_requestsRef} style={{ filter: this.state.blur == true ? 'blur(3px) brightness(50%)' : '' }}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}><img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-5.png')} />Orders</Card.Title>
                        <Card.Body>
                            <div className='column-headers-rw-6'>
                                <p>Ajánlatkérési sorszám</p>
                                <p>Projekt</p>
                                <p>Munkanem</p>
                                <p>Rövid cégnév</p>
                                <p>Ajánlatkérési dátum</p>
                                <p>Status</p>
                                <div className='line'></div>
                            </div>

                            {this.state.offers[0].map((offer,index) =>
                                <div className='rows-rw-6' style={{animation: `row-load ${index}s`}}>
                                    <p>{this.formatOfferId(offer)}</p>
                                    <p>{offer.header.projectName}</p>
                                    <p>{offer.header.workTypes}</p>
                                    <p>{offer.header.companyName}</p>
                                    <p>{offer.header.datum}</p>
                                    <p className='outlined-btn-secondary' style={{width: 'fit-content', marginLeft: -20}}>{this.state.statusText[offer.status]}</p>
                                    <div className='line'>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>
                <div className='dashboard-category' ref={this.sent_offersRef} style={{ filter: this.state.blur == true ? 'blur(3px) brightness(50%)' : '' }}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}><img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-2.png')} /> Orders (waiting payment)</Card.Title>
                        <Card.Body>
                            <div className='column-headers-rw-7'>
                                <p>Ajánlatkérési sorszám</p>
                                <p>Projekt</p>
                                <p>Munkanem</p>
                                <p>Rövid cégnév</p>
                                <p>Ajánlatkérési dátum</p>
                                <p>Status</p>
                                <p>Action</p>
                                <div className='line'></div>
                            </div>

                            {this.state.offers[1].map((offer,_index) =>
                                <div className='rows-rw-7' index={_index}  style={{animation: `row-load ${_index}s`}}>
                                    <p>{this.formatOfferId(offer)}</p>
                                    <p>{offer.header.projectName}</p>
                                    <p>{offer.header.workTypes}</p>
                                    <p>{offer.header.companyName}</p>
                                    <p>{offer.header.datum}</p>
                                    <p className='outlined-btn-secondary' style={{width: 'fit-content', marginLeft: -20}} onClick={()=> this.offerPopUp(offer)}>See offer</p>
                                    <p className='rounded-btn-primary' style={{width: 'fit-content', marginLeft: 50}} onClick={()=> this.depositPopUp(offer)}><img src={card_icon} /> Pay the deposit</p>
                                    <div className='line'>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>
                <div className='dashboard-category' ref={this.ordersRef} style={{ filter: this.state.blur == true ? 'blur(3px) brightness(50%)' : '' }}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}><img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-6.png')} /> Orders (paid)</Card.Title>
                        <Card.Body>
                            <div className='column-headers-rw-6'>
                                <p>Ajánlatkérési sorszám</p>
                                <p>Projekt</p>
                                <p>Munkanem</p>
                                <p>Rövid cégnév</p>
                                <p>Frissítve</p>
                                <p>Status</p>
                                <div className='line'></div>
                            </div>

                            {this.state.offers[2].map((offer,index) =>
                                <div className='rows-rw-6'  style={{animation: `row-load ${index}s`}}>
                                    <p>{this.formatOfferId(offer)}</p>
                                    <p>{offer.header.projectName}</p>
                                    <p>{offer.header.workTypes}</p>
                                    <p>{offer.header.companyName}</p>
                                    <p>{this.offerDateFormat(offer.header.updated)}</p>
                                    <p className='outlined-btn-secondary' style={{width: 'fit-content', marginLeft: -20}} onClick={()=> this.offerPopUp(offer)}>See offer</p>
                                    <div className='line'>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>
                <div className='dashboard-category' ref={this.processingRef} style={{ filter: this.state.blur == true ? 'blur(3px) brightness(50%)' : '' }}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}><img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-1.png')} /> Finished Jobs</Card.Title>
                        <Card.Body>
                            <div className='column-headers-rw-7'>
                                <p>Ajánlatkérési sorszám</p>
                                <p>Projekt</p>
                                <p>Munkanem</p>
                                <p>Rövid cégnév</p>
                                <p>Ajánlatkérési dátum</p>
                                <p>Status</p>
                                <p>Action</p>
                                <div className='line'></div>
                            </div>

                            {this.state.offers[3].map((offer, index) =>
                                <div className='rows-rw-7'  style={{animation: `row-load ${index}s`}}>
                                    <p>{this.formatOfferId(offer)}</p>
                                    <p>{offer.header.projectName}</p>
                                    <p>{offer.header.workTypes}</p>
                                    <p>{offer.header.companyName}</p>
                                    <p>{offer.header.datum}</p>
                                    <p className='outlined-btn-secondary' style={{width: 'fit-content', marginLeft: -20}}>Sample</p>
                                    <p className='rounded-btn-primary' style={{width: 'fit-content', marginLeft: 40}}> <img src={card_icon}/>Pay remaining</p>
                                    <div className='line'>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>
                <div className='dashboard-category' ref={this.invoicedRef} style={{ filter: this.state.blur == true ? 'blur(3px) brightness(50%)' : '' }}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}><img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-7.png')} /> Billed Jobs</Card.Title>
                        <Card.Body>
                            <div className='column-headers-rw-6'>
                                <p>Ajánlatkérési sorszám</p>
                                <p>Projekt</p>
                                <p>Munkanem</p>
                                <p>Rövid cégnév</p>
                                <p>Ajánlatkérési dátum</p>
                                <p>Status</p>
                                <div className='line'></div>
                            </div>

                            {this.state.offers[4].map((offer,index) =>
                                <div className='rows-rw-6'  style={{animation: `row-load ${index}s`}}>
                                    <p>{this.formatOfferId(offer)}</p>
                                    <p>{offer.header.projectName}</p>
                                    <p>{offer.header.workTypes}</p>
                                    <p>{offer.header.companyName}</p>
                                    <p>{offer.header.datum}</p>
                                    <p className='rounded-btn-primary' style={{width: 'fit-content', marginLeft: -60, backgroundColor: 'var(--success)'}}><img src={download_icon}/>Download Job</p>
                                    <div className='line'>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>

                {this.state.requestingOffer &&
                    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                        <div className='request-offer'>

                            <h1 style={{ textAlign: 'center', fontSize: 56 }}>Offer Details</h1>
                            <p style={{ textAlign: 'center', marginTop: -30 }}>To request an offer, fill in all the details and we will process it within  2 business days</p>

                            <div className='form'>
                                <Select
                                    name="Work types"
                                    options={this.state.companies}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    placeholder="Company"
                                    id='company-select'
                                    onChange={(e) => this.handleSelectChange(e, this)}
                                />
                                <input placeholder='Short project Name' id='project-name' style={{marginTop: 20}}></input>
                                
                                <Select
                                    isMulti
                                    name="Work types"
                                    options={this.state.workTypes}
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
                {this.state.requestSent &&
                    <div tyle={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}}>
                        <div className='request-sent'>
                            <div className='request-head'>
                                <Icon_close style={{position: 'relative', left: '58%', top: -30}} className='interactable' onClick={()=> this.setState({requestSent: false,blur: false})}/>
                                <img src={logo} />
                                <p style={{ color: 'green' }}>We recieved your request with the following datas</p>
                                <p style={{ color: 'gray' }}>The expected time to recieve your offer is 5 working days</p>
                            </div>
                            <div className='request-data'>
                                <div className='column-headers-rw-4'>
                                    <p>Projekt</p>
                                    <p>Munkanem</p>
                                    <p>Rövid cégnév</p>
                                    <p>Ajánlatkérési dátum</p>
                                    <div className='line'></div>
                                </div>
                                <div className='rows-rw-4'>
                                    <p>{this.state.request.projectName}</p>
                                    <p>{this.state.request.workTypes}</p>
                                    <p>{this.state.request.companyName}</p>
                                    <p>{this.state.request.datum}</p>
                                </div>
                            </div>
                        </div>
                    </div>}

                {this.state.depositpopup && 
                    <div className='deposit-popup'>
                        <div className='deposit-popup-head'>
                            <Icon_close style={{position: 'relative', left: '70%', top: -40}} className='interactable' onClick={()=> this.setState({depositpopup: false,blur: false})}/>
                            <img src={logo}/>
                            <p style={{color: 'var(--success)'}}>We recieved your order with the following data</p>
                            <div className='line'></div>
                        </div>
                        <div className='deposit-popup-order-info'>
                            <p className='header-text'>Offer</p>
                            <p className='text' style={{color: 'var(--success)',fontWeight: 'bolder'}}>{this.formatOfferId(this.state.selectedOffer)}</p>
                            <p className='header-text'>Project</p>
                            <p className='text'>{this.state.selectedOffer.header.projectName}</p>
                            <p className='header-text'>Work type</p>
                            <p className='text'>{this.state.selectedOffer.header.workTypes}</p>
                            <p className='header-text'>Short company name</p>
                            <p className='text'>{this.state.selectedOffer.header.companyName}</p>
                            <p className='header-text'>Offer request date</p>
                            <p className='text'>{this.state.selectedOffer.header.datum}</p>
                            <div className='vline'></div> 
                        </div>
                        <div className='deposit-popup-payment-info'>
                            <p className='img-text'><img src={card_icon_with_bg}/>50% advance payment details</p>
                            <p className='header-text'>Név</p>
                            <p className='text'>Bim Revolution Kft. <img className='interactable' src={icon_copy} onClick={() => {navigator.clipboard.writeText('Bim Revolution Kft.')}}/></p>
                            <p className='header-text'>Bank számlaszám</p>
                            <p className='text'>123145678-12345678-121345678 <img className='interactable' src={icon_copy} onClick={() => {navigator.clipboard.writeText('123145678-12345678-121345678')}}/></p>
                            <p className='header-text'>Közlemény</p>
                            <p className='text'>{this.formatOfferId(this.state.selectedOffer)} <img className='interactable' src={icon_copy} onClick={() => {navigator.clipboard.writeText(this.state.selectedOffer.sorszam)}}/></p>
                            <div className='line' style={{marginBottom: 50}}></div>
                            <p className='header-text'>Összeg</p>
                            <p className='text'>{this.calculateDepositOsszeg(this.state.selectedOffer)} Ft</p>
                            <p style={{color: 'gray', marginTop: -30, fontSize: 12}}>(net offer price x1.27 what is our vat (=VAT))</p>
                        </div>
                    </div>}
                    
                    
                    <Offer offer={this.state.seeOffer} ref={this.offerRef} parent={this} editing={false}/>
                    
                <NavBar />
            </div>
        )
    }
}

export default AuthRedirect(CustomerDashboard);
