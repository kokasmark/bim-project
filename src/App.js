import './App.css';
import React, { Component } from 'react';
import NavBar from './NavBar';

import hero_img from './assets/home-hero-img.png';
import yellow_icon from './assets/yellow-card-icon.png';
import blue_icon from './assets/blue-card-icon.png';
import orange_icon from './assets/orange-card-icon.png';
import { ReactComponent as Icon_arrow } from './assets/icon-arrow-up.svg';
import AuthRedirect from './authRedirect';



class App extends Component {
  moreInfoRef = React.createRef();
  heroRef = React.createRef();
  render() {
    return (
      <div>

        <div ref={this.heroRef}>
          <div style={{ display: 'inline-block', position: 'relative', left: 300, top: 0}}>
            <h1 style={{ fontSize: 56, width: 600 }}>
              Digitális Műszaki előkészítés
            </h1>
            <p style={{ fontSize: 18, width: 450 }}>
              A Digitálisan előkészített anyag használható az ajánlatadástól az átadásig.
            </p>
            <b className='interactable'
                style={{color: "var(--lighter-bg)", fontSize: 30}}
                onClick={() =>
              window.scrollTo({
                top: this.moreInfoRef.current.offsetTop,
                behavior: "smooth"
              })
            }>More Info</b>
          </div>
          <img src={hero_img} style={{ position: 'relative', top: 200, left: '20%', width: 1000, height: '100%',filter:'drop-shadow(-10px 5px 2px #202227)' }} />
          
        </div>
        <div style={{ position: 'relative', top: 500, marginLeft: '15%', height: 800 }} ref={this.moreInfoRef}>
          <Icon_arrow className='interactable' style={{ position: 'relative', left: '39%', width: 50, height: 50 }} onClick={() =>
            window.scrollTo({
              top: this.heroRef.current.offsetTop,
              behavior: "smooth"
            })
          } />
          <h1 style={{ fontSize: 34, width: 420, textAlign: 'center', marginLeft: '28%' }}>Solution for thriving product communities</h1>
          <div className='home-card'>
            <img src={yellow_icon} style={{ margin: 10 }} />
            <div style={{ margin: 20 }}>
              <p style={{ fontSize: 24, width: '80%' }}>Papíralapu tervek helyett, Váltson Digitálisra</p>
              <p style={{ fontSize: 14 }}>Váltson papíralapú tervekről digitális formátumra, és élvezze a megnövekedett hatékonyságot és hozzáférhetőséget. A digitálisra váltással nem csak a fákat kíméli, de a műszaki tervek frissítése és megosztása is azonnal elvégezhető.</p>
            </div>
          </div>
          <div className='home-card' style={{ position: 'relative', top: -5 }}>
            <img src={blue_icon} style={{ margin: 10 }} />
            <div style={{ margin: 20 }}>
              <p style={{ fontSize: 22 }}>Műszaki szakembereket mentesítse az előkészítési folymatoktól</p>
              <p style={{ fontSize: 14 }}>Automatizálja a rutinszerű feladatokat, és ezzel mentse fel a műszaki szakembereit az előkészítési folyamatoktól. Így ők a specializált munkára tudnak koncentrálni, ami növeli az általános termelékenységet és a projekt minőségét.</p>
            </div>
          </div>
          <div className='home-card'>
            <img src={orange_icon} style={{ margin: 10 }}/>
            <div style={{ margin: 20 }}>
              <p style={{ fontSize: 24, width: '80%' }}>Fokuszáljon mostantól csak a szakmai részre</p>
              <p style={{ fontSize: 14 }}>A digitális előkészítésnek köszönhetően a műszaki szakemberek teljes mértékben a szakmai feladatokra koncentrálhatnak. Így több időt és erőforrást tudnak a projekten belüli kritikus pontokra és problémamegoldásra fordítani.</p>
            </div>
          </div>

        </div>
        <NavBar />
      </div>
    )
  }
}

export default App;
