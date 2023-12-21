import './App.css';
import React, { Component } from 'react';
import NavBar from './NavBar';
import { Card } from 'react-bootstrap';
import { ReactComponent as Icon_arrow } from './assets/icon-arrow-up.svg';

import Select from 'react-select';
import { FileUploader } from "react-drag-drop-files";
import upload_file_icon from './assets/dashboard_icons/UploadFileFilled.png';

import Swal from 'sweetalert2';

class CustomerDashboard extends Component {
    offer_requestsRef = React.createRef();
    sent_offersRef = React.createRef();
    ordersRef = React.createRef();
    processingRef = React.createRef();
    invoicedRef = React.createRef();

    state = {
        onTop: true,
        offer_requests: [{ sorszam: "A-BP123", projekt: "BNE", munkanem: "Ajzatbeton", cegnev: "WHB", datum: "2023/12/21" }],
        requestingOffer: false,
        acceptedFilesOnUpload: ["JPG", "PNG", "SVG", "PDF"]
    }
    scrollToComponent(ref){
        this.setState({onTop: false});
        window.scrollTo({top: ref.current.offsetTop,behavior: "smooth"})
    }
    scrollToTop(){
        this.setState({onTop: true});
        window.scrollTo({top: 0,behavior: "smooth"})
    }
    componentDidMount(){
        this.scrollToTop();
    }
    requestOfferPopUp(){
        this.setState({requestingOffer: true});
    }
    uploadFile(){

    }
    sendOfferRequest(){
        Swal.fire({
            title: "Success",
            text: "Your offer request has been successfully sent!",
            icon: "success"
          });

          this.setState({requestingOffer: false});
    }
    render() {
        const options = [
            { value: 'ajzatbeton', label: 'Ajzat Beton' },
            { value: 'ablak', label: 'Ablak' },
            { value: 'ajto', label: 'Ajtó' }
          ]
        return (
            <div style={{ backgroundColor: 'var(--darker-bg)'}}>
                {!this.state.onTop && <Icon_arrow className='interactable dashboard-up-btn' onClick={()=>this.scrollToTop()}/>}
                <h1 style={{ marginTop: 50, padding: '20px 0px 0px 0px', marginLeft: '15%',display: 'inline-block', filter: this.state.requestingOffer == true? 'blur(3px)' : ''}}>Dashboard</h1>
                <button className='rounded-btn-primary' style={{position: 'relative', top: -5, left: '50%', filter: this.state.requestingOffer == true? 'blur(3px)' : ''}} 
                onClick={()=> this.requestOfferPopUp()}>Request New Offer</button>
                <div className='dashboard-header' style={{filter: this.state.requestingOffer == true? 'blur(3px)' : ''}}>
                    <Card onClick={() => this.scrollToComponent(this.offer_requestsRef)}>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-5.png')} />
                            <div style={{ marginTop: -30}}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>{this.state.offer_requests.length}</Card.Text>
                                <Card.Text style={{ color: "#8492C4", marginTop: -30 }}>Custom Offers</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card onClick={() =>this.scrollToComponent(this.sent_offersRef)}>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-2.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>0</Card.Text>
                                <Card.Text style={{ color: "#8492C4", marginTop: -30 }}>Orders (waiting payment)</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card onClick={() =>this.scrollToComponent(this.ordersRef)}>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-6.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>0</Card.Text>
                                <Card.Text style={{ color: "#8492C4", marginTop: -30 }}>Orders (paid)</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card onClick={() =>this.scrollToComponent(this.processingRef)}>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-1.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>0</Card.Text>
                                <Card.Text style={{ color: "#8492C4", marginTop: -30 }}>Finished jobs</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card onClick={() =>this.scrollToComponent(this.invoicedRef)}>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-7.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>0</Card.Text>
                                <Card.Text style={{ color: "#8492C4", marginTop: -30 }}>Billed Jobs</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <div className='dashboard-category' ref={this.offer_requestsRef} style={{filter: this.state.requestingOffer == true? 'blur(3px)' : ''}}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}><img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-5.png')} /> Custom Offers</Card.Title>
                        <Card.Body>
                            <div className='column-headers'>
                                <p>Ajánlatkérési sorszám</p>
                                <p>Projekt</p>
                                <p>Munkanem</p>
                                <p>Rövid cégnév</p>
                                <p>Ajánlatkérési dátum</p>
                                <div className='line'></div>
                            </div>

                            {this.state.offer_requests.map((offer) =>
                                <div className='rows'>
                                    <p>{offer.sorszam}</p>
                                    <p>{offer.projekt}</p>
                                    <p>{offer.munkanem}</p>
                                    <p>{offer.cegnev}</p>
                                    <p>{offer.datum}</p>
                                    <div className='line'>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>
                <div className='dashboard-category' ref={this.sent_offersRef} style={{filter: this.state.requestingOffer == true? 'blur(3px)' : ''}}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}><img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-2.png')} /> Orders (waiting payment)</Card.Title>
                        <Card.Body>
                            <div className='column-headers'>
                                <p>Ajánlatkérési sorszám</p>
                                <p>Projekt</p>
                                <p>Munkanem</p>
                                <p>Rövid cégnév</p>
                                <p>Ajánlatkérési dátum</p>
                                <div className='line'></div>
                            </div>

                            {this.state.offer_requests.map((offer) =>
                                <div className='rows'>
                                    <p>{offer.sorszam}</p>
                                    <p>{offer.projekt}</p>
                                    <p>{offer.munkanem}</p>
                                    <p>{offer.cegnev}</p>
                                    <p>{offer.datum}</p>
                                    <div className='line'>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>
                <div className='dashboard-category' ref={this.ordersRef} style={{filter: this.state.requestingOffer == true? 'blur(3px)' : ''}}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}><img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-6.png')} /> Orders (paid)</Card.Title>
                        <Card.Body>
                            <div className='column-headers'>
                                <p>Ajánlatkérési sorszám</p>
                                <p>Projekt</p>
                                <p>Munkanem</p>
                                <p>Rövid cégnév</p>
                                <p>Ajánlatkérési dátum</p>
                                <div className='line'></div>
                            </div>

                            {this.state.offer_requests.map((offer) =>
                                <div className='rows'>
                                    <p>{offer.sorszam}</p>
                                    <p>{offer.projekt}</p>
                                    <p>{offer.munkanem}</p>
                                    <p>{offer.cegnev}</p>
                                    <p>{offer.datum}</p>
                                    <div className='line'>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>
                <div className='dashboard-category' ref={this.processingRef} style={{filter: this.state.requestingOffer == true? 'blur(3px)' : ''}}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}><img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-1.png')} /> Finished Jobs</Card.Title>
                        <Card.Body>
                            <div className='column-headers'>
                                <p>Ajánlatkérési sorszám</p>
                                <p>Projekt</p>
                                <p>Munkanem</p>
                                <p>Rövid cégnév</p>
                                <p>Ajánlatkérési dátum</p>
                                <div className='line'></div>
                            </div>

                            {this.state.offer_requests.map((offer) =>
                                <div className='rows'>
                                    <p>{offer.sorszam}</p>
                                    <p>{offer.projekt}</p>
                                    <p>{offer.munkanem}</p>
                                    <p>{offer.cegnev}</p>
                                    <p>{offer.datum}</p>
                                    <div className='line'>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>
                <div className='dashboard-category' ref={this.invoicedRef} style={{filter: this.state.requestingOffer == true? 'blur(3px)' : ''}}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}><img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-7.png')} /> Billed Jobs</Card.Title>
                        <Card.Body>
                            <div className='column-headers'>
                                <p>Ajánlatkérési sorszám</p>
                                <p>Projekt</p>
                                <p>Munkanem</p>
                                <p>Rövid cégnév</p>
                                <p>Ajánlatkérési dátum</p>
                                <div className='line'></div>
                            </div>

                            {this.state.offer_requests.map((offer) =>
                                <div className='rows'>
                                    <p>{offer.sorszam}</p>
                                    <p>{offer.projekt}</p>
                                    <p>{offer.munkanem}</p>
                                    <p>{offer.cegnev}</p>
                                    <p>{offer.datum}</p>
                                    <div className='line'>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>
                
                {this.state.requestingOffer && 
                    <div style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}}>
                    <div className='request-offer'>
                    
                        <h1 style={{textAlign: 'center', fontSize: 56}}>Offer Details</h1>
                        <p style={{textAlign: 'center', marginTop: -30}}>To request an offer, fill in all the details and we will process it within  2 business days</p>

                        <div className='form'>
                            <input placeholder='Company Name'></input>
                            <input placeholder='VAT number'></input>
                            <input placeholder='Short project Name'></input>
                            <Select
                                isMulti
                                name="Work types"
                                options={options}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                placeholder="Work types"
                            />
                            <input placeholder='Please write here the needed data takeoffs or jobs on the drawings' style={{height: 100, position: 'relative', top: 20}}></input>

                            <div className='upload-file-container'><FileUploader classes='upload-file' children={
                            <div style={{width: '100%'}}>
                                <img src={upload_file_icon}/>
                                <p>Click to upload or drag and drop</p>
                            </div>} name="file" types={this.acceptedFilesOnUpload} /></div>
                            <button className='outlined-btn-secondary' style={{height: 40}} onClick={()=> this.setState({requestingOffer: false})}>Back</button>
                            <button className='rounded-btn-primary' style={{width: '90%', position: 'relative', top: -40, left: 100, height:40}}
                            onClick={()=> this.sendOfferRequest()}>Send offer Request</button>
                        </div>
                    </div>
                    </div>}

                <NavBar />
            </div>
        )
    }
}

export default CustomerDashboard;
