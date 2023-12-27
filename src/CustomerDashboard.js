import './App.css';
import React, { Component } from 'react';
import NavBar from './NavBar';
import { Card } from 'react-bootstrap';
import { ReactComponent as Icon_arrow } from './assets/icon-arrow-up.svg';
import { ReactComponent as Icon_close } from './assets/dashboard_icons/icon-close.svg';
import card_icon from './assets/dashboard_icons/credit_card.png';
import download_icon from './assets/dashboard_icons/download.png';

import Select from 'react-select';
import { FileUploader } from "react-drag-drop-files";
import upload_file_icon from './assets/dashboard_icons/UploadFileFilled.png';
import logo from './assets/logo.png';

import Swal from 'sweetalert2';

class CustomerDashboard extends Component {
    offer_requestsRef = React.createRef();
    sent_offersRef = React.createRef();
    ordersRef = React.createRef();
    processingRef = React.createRef();
    invoicedRef = React.createRef();

    state = {
        onTop: true,
        offer_requests: [{ sorszam: "000001", projekt: "BNE", munkanem: "Ajzatbeton", cegnev: "WHB", datum: "2023/12/21" },
                         { sorszam: "000002", projekt: "BNE", munkanem: "Ajzatbeton", cegnev: "WHB", datum: "2023/12/26" }],
        requestingOffer: false,
        requestSent: false,
        acceptedFilesOnUpload: ["JPG", "PNG", "SVG", "PDF"],
        request: { sorszam: '', projekt: '', munkanem: '', cegnev: '', datum: '' },
        selectedWorktypes: ''
    }
    scrollToComponent(ref) {
        this.setState({ onTop: false });
        window.scrollTo({ top: ref.current.offsetTop, behavior: "smooth" })
    }
    scrollToTop() {
        this.setState({ onTop: true });
        window.scrollTo({ top: 0, behavior: "smooth" })
    }
    componentDidMount() {
        this.scrollToTop();
    }
    requestOfferPopUp() {
        this.setState({ requestingOffer: true });
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
    sendOfferRequest() {
        var date = new Date();
        var r = {
            sorszam: this.pad(this.state.offer_requests.length, 6),
            projekt: document.getElementById('project-name').value,
            munkanem: this.state.selectedWorktypes,
            cegnev: document.getElementById('company-name').value,
            datum: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
        };

        this.setState({ request: r, offer_requests: [...this.state.offer_requests, r] })
        this.setState({ requestingOffer: false, requestSent: true });
    }
    render() {
        const options = [
            { value: 'ajzatbeton', label: 'Ajzat Beton' },
            { value: 'ablak', label: 'Ablak' },
            { value: 'ajto', label: 'Ajtó' }
        ]
        return (
            <div style={{ backgroundColor: 'var(--darker-bg)' }}>
                {!this.state.onTop && <div className='dashboard-up-btn' onClick={() => this.scrollToTop()}>
                    <Icon_arrow className='interactable' style={{marginTop: 5}}/><p style={{width: 'fit-content'}}>Go Back</p></div>}
                <h1 style={{ marginTop: 65, padding: '20px 0px 0px 0px', marginLeft: '15%', display: 'inline-block', filter: (this.state.requestingOffer == true || this.state.requestSent == true) ? 'blur(3px)' : '' }}>Dashboard</h1>
                <button className='rounded-btn-primary' style={{ position: 'relative', top: 0, left: '50%', filter: (this.state.requestingOffer == true || this.state.requestSent == true) ? 'blur(3px)' : '' }}
                    onClick={() => this.requestOfferPopUp()}>Request New Offer</button>
                <div className='dashboard-header' style={{ filter: (this.state.requestingOffer == true || this.state.requestSent == true) ? 'blur(3px)' : '' }}>
                    <Card onClick={() => this.scrollToComponent(this.offer_requestsRef)}>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-5.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>{this.state.offer_requests.length}</Card.Text>
                                <Card.Text style={{ color: "#8492C4", marginTop: -30 }}>Custom Offers</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card onClick={() => this.scrollToComponent(this.sent_offersRef)}>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-2.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>0</Card.Text>
                                <Card.Text style={{ color: "#8492C4", marginTop: -30 }}>Orders (waiting payment)</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card onClick={() => this.scrollToComponent(this.ordersRef)}>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-6.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>0</Card.Text>
                                <Card.Text style={{ color: "#8492C4", marginTop: -30 }}>Orders (paid)</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card onClick={() => this.scrollToComponent(this.processingRef)}>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-1.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>0</Card.Text>
                                <Card.Text style={{ color: "#8492C4", marginTop: -30 }}>Finished jobs</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card onClick={() => this.scrollToComponent(this.invoicedRef)}>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-7.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>0</Card.Text>
                                <Card.Text style={{ color: "#8492C4", marginTop: -30 }}>Billed Jobs</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <div className='dashboard-category' ref={this.offer_requestsRef} style={{ filter: (this.state.requestingOffer == true || this.state.requestSent == true) ? 'blur(3px)' : '' }}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}><img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-5.png')} /> Custom Offers</Card.Title>
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

                            {this.state.offer_requests.map((offer) =>
                                <div className='rows-rw-6'>
                                    <p>{offer.sorszam}</p>
                                    <p>{offer.projekt}</p>
                                    <p>{offer.munkanem}</p>
                                    <p>{offer.cegnev}</p>
                                    <p>{offer.datum}</p>
                                    <p className='outlined-btn-secondary' style={{width: 'fit-content', marginLeft: -20}}>Status</p>
                                    <div className='line'>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>
                <div className='dashboard-category' ref={this.sent_offersRef} style={{ filter: (this.state.requestingOffer == true || this.state.requestSent == true) ? 'blur(3px)' : '' }}>
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

                            {this.state.offer_requests.map((offer) =>
                                <div className='rows-rw-7'>
                                    <p>{offer.sorszam}</p>
                                    <p>{offer.projekt}</p>
                                    <p>{offer.munkanem}</p>
                                    <p>{offer.cegnev}</p>
                                    <p>{offer.datum}</p>
                                    <p className='outlined-btn-secondary' style={{width: 'fit-content', marginLeft: -20}}>See offer</p>
                                    <p className='rounded-btn-primary' style={{width: 'fit-content', marginLeft: 50}}><img src={card_icon}/> Pay the deposit</p>
                                    <div className='line'>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>
                <div className='dashboard-category' ref={this.ordersRef} style={{ filter: (this.state.requestingOffer == true || this.state.requestSent == true) ? 'blur(3px)' : '' }}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}><img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-6.png')} /> Orders (paid)</Card.Title>
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

                            {this.state.offer_requests.map((offer) =>
                                <div className='rows-rw-6'>
                                    <p>{offer.sorszam}</p>
                                    <p>{offer.projekt}</p>
                                    <p>{offer.munkanem}</p>
                                    <p>{offer.cegnev}</p>
                                    <p>{offer.datum}</p>
                                    <p className='outlined-btn-secondary' style={{width: 'fit-content', marginLeft: -50}}>Megtekintés</p>
                                    <div className='line'>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>
                <div className='dashboard-category' ref={this.processingRef} style={{ filter: (this.state.requestingOffer == true || this.state.requestSent == true) ? 'blur(3px)' : '' }}>
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

                            {this.state.offer_requests.map((offer) =>
                                <div className='rows-rw-7'>
                                    <p>{offer.sorszam}</p>
                                    <p>{offer.projekt}</p>
                                    <p>{offer.munkanem}</p>
                                    <p>{offer.cegnev}</p>
                                    <p>{offer.datum}</p>
                                    <p className='outlined-btn-secondary' style={{width: 'fit-content', marginLeft: -20}}>Sample</p>
                                    <p className='rounded-btn-primary' style={{width: 'fit-content', marginLeft: 40}}> <img src={card_icon}/>Pay remaining</p>
                                    <div className='line'>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>
                <div className='dashboard-category' ref={this.invoicedRef} style={{ filter: (this.state.requestingOffer == true || this.state.requestSent == true) ? 'blur(3px)' : '' }}>
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

                            {this.state.offer_requests.map((offer) =>
                                <div className='rows-rw-6'>
                                    <p>{offer.sorszam}</p>
                                    <p>{offer.projekt}</p>
                                    <p>{offer.munkanem}</p>
                                    <p>{offer.cegnev}</p>
                                    <p>{offer.datum}</p>
                                    <p className='rounded-btn-primary' style={{width: 'fit-content', marginLeft: -60, backgroundColor: 'lightgreen'}}><img src={download_icon}/>Download Job</p>
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
                                <button className='outlined-btn-secondary' style={{ height: 40 }} onClick={() => this.setState({ requestingOffer: false })}>Back</button>
                                <button className='rounded-btn-primary' style={{ width: '90%', position: 'relative', top: -40, left: 100, height: 40 }}
                                    onClick={() => this.sendOfferRequest()}>Send offer Request</button>
                            </div>
                        </div>
                    </div>}
                {this.state.requestSent &&
                    <div tyle={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}}>
                        <div className='request-sent'>
                            <div className='request-head'>
                                <Icon_close style={{position: 'relative', left: '58%', top: -30}} className='interactable' onClick={()=> this.setState({requestSent: false})}/>
                                <img src={logo} />
                                <p style={{ color: 'green' }}>We recieved your request with the following datas</p>
                                <p style={{ color: 'gray' }}>The expected time to recieve your offer is 5 working days</p>
                            </div>
                            <div className='request-data'>
                                <div className='column-headers'>
                                    <p>Ajánlatkérési sorszám</p>
                                    <p>Projekt</p>
                                    <p>Munkanem</p>
                                    <p>Rövid cégnév</p>
                                    <p>Ajánlatkérési dátum</p>
                                    <div className='line'></div>
                                </div>
                                <div className='rows'>
                                    <p>{this.state.request.sorszam}</p>
                                    <p>{this.state.request.projekt}</p>
                                    <p>{this.state.request.munkanem}</p>
                                    <p>{this.state.request.cegnev}</p>
                                    <p>{this.state.request.datum}</p>
                                </div>
                            </div>
                        </div>
                    </div>}

                <NavBar />
            </div>
        )
    }
}

export default CustomerDashboard;
