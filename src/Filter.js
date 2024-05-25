import './App.css';
import React, { Component } from 'react';

class Filter extends Component {
    state={
        by: 'Sorszám',
        value: ''
    }
    filter(){
        this.props.parent.setFilter({by: this.state.by, value: this.state.value});
        this.setState({by: null, value: ''})
    }
    render() {
        return (
            <div style={{display: 'inline-block'}}>
                <select onChange={(e)=>this.setState({by: e.target.selectedOptions[0].value})}>
                    <option>Sorszám</option>
                    <option>Projekt</option>
                    <option>Munkanem</option>
                    <option>Megrendelő</option>
                </select>
                <input onChange={(e)=>this.setState({value: e.target.value})}></input>
                <p className='rounded-btn-primary' style={{ width: 100, textAlign: 'center', display: 'inline-block' }} onClick={()=>this.filter()}>Szűrés</p>
            </div>
        )
    }
}

export default Filter;