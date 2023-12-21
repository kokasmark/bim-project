import './App.css';
import React, { Component } from 'react';
import NavBar from './NavBar';
import { Card } from 'react-bootstrap';
import { ReactComponent as Icon_arrow } from './assets/icon-arrow-up.svg';


class Dashboard extends Component {
    offer_requestsRef = React.createRef();
    sent_offersRef = React.createRef();
    ordersRef = React.createRef();
    processingRef = React.createRef();
    invoicedRef = React.createRef();

    state = {
        onTop: true,
        offer_requests: [{ sorszam: "A-BP123", projekt: "BNE", munkanem: "Ajzatbeton", cegnev: "WHB", datum: "2023/12/21" }]
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
    render() {
        return (
            <div style={{ backgroundColor: 'var(--darker-bg)' }}>
                {!this.state.onTop && <Icon_arrow className='interactable dashboard-up-btn' onClick={()=>this.scrollToTop()}/>}
                <h1 style={{ marginTop: 50, padding: '20px 0px 0px 0px', textAlign: 'center' }}>Admin Dashboard</h1>
                <div className='dashboard-header'>
                    <Card onClick={() => this.scrollToComponent(this.offer_requestsRef)}>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-5.png')} />
                            <div style={{ marginTop: -30}}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>{this.state.offer_requests.length}</Card.Text>
                                <Card.Text style={{ color: "#8492C4", marginTop: -30 }}>Offer requests</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card onClick={() =>this.scrollToComponent(this.sent_offersRef)}>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-1.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>0</Card.Text>
                                <Card.Text style={{ color: "#8492C4", marginTop: -30 }}>Sent offers</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card onClick={() =>this.scrollToComponent(this.ordersRef)}>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-2.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>0</Card.Text>
                                <Card.Text style={{ color: "#8492C4", marginTop: -30 }}>Orders(paid)</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card onClick={() =>this.scrollToComponent(this.processingRef)}>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-3.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>0</Card.Text>
                                <Card.Text style={{ color: "#8492C4", marginTop: -30 }}>Processing</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card onClick={() =>this.scrollToComponent(this.invoicedRef)}>
                        <Card.Body style={{ margin: 20 }}>
                            <img src={require('./assets/dashboard_icons/icon-4.png')} />
                            <div style={{ marginTop: -30 }}>
                                <Card.Text style={{ fontSize: 34, fontWeight: 'medium' }}>0</Card.Text>
                                <Card.Text style={{ color: "#8492C4", marginTop: -30 }}>Invoiced Jobs</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <div className='dashboard-category' ref={this.offer_requestsRef}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}><img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-5.png')} /> Offer Requests</Card.Title>
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
                <div className='dashboard-category' ref={this.sent_offersRef}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}><img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-1.png')} /> Sent Offers</Card.Title>
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
                <div className='dashboard-category' ref={this.ordersRef}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}><img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-2.png')} /> Orders (paid)</Card.Title>
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
                <div className='dashboard-category' ref={this.processingRef}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}><img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-3.png')} /> Processing</Card.Title>
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
                <div className='dashboard-category' ref={this.invoicedRef}>
                    <Card>
                        <Card.Title style={{ fontSize: 24 }}><img style={{ margin: 10, width: 50, height: 50, marginBottom: -15 }} src={require('./assets/dashboard_icons/icon-4.png')} /> Invoiced Jobs</Card.Title>
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
                <NavBar />
            </div>
        )
    }
}

export default Dashboard;
