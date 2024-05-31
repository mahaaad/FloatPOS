import './App.scss';
import Header from './components/Header';
import Nav from './components/Nav';
import Icon from './components/Icon';
import TableManagement from './components/TableManagement';
import Menu from './components/Menu';
import { useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Tables from './components/Tables';

import './style/main.scss';
import Reservation from './components/Reservations';

function App() {
  const [activeTab, setActiveTab] = useState('tables');

  // Memoize the components to keep their state across tab switches
  const tableManagement = useMemo(() => <TableManagement />, []);
  const reservations = useMemo(() => <Reservation/>, []);
  const menu = useMemo(() => <Menu />, []);

  return (
    <div className="App">
      <Nav />
      <section>
        <Header 
          title="Mahad's Cuisine & Bar"
        />
        <div className="tabs">
          <button 
            className={`tab-button ${activeTab === 'tables' ? 'active' : ''}`} 
            onClick={() => setActiveTab('tables')}
          >
            <Icon 
              img="/assets/icons/tables/round-table.svg"
              width="2rem"
              padding="0"
            />
            Tables
          </button>
          <button 
            className={`tab-button ${activeTab === 'reservations' ? 'active' : ''}`} 
            onClick={() => setActiveTab('reservations')}
          >
            <Icon 
              img="/assets/icons/reservation-icon.svg"
              width="2rem"
              padding="0"
            />
            Reservations
          </button>
          <button 
            className={`tab-button ${activeTab === 'menu' ? 'active' : ''}`} 
            onClick={() => setActiveTab('menu')}
          >
            <Icon 
              img="/assets/icons/hotdish-icon-blue.svg"
              width="2rem"
              padding="0"
            />
            Menu
          </button>
        </div>

        <div style={{ display: activeTab === 'tables' ? 'block' : 'none' }}>
          {tableManagement}
        </div>
        <div style={{ display: activeTab === 'reservations' ? 'block' : 'none' }}>
          {reservations}
        </div>
        <div style={{ display: activeTab === 'menu' ? 'block' : 'none' }}>
          {menu}
        </div>
      </section>
    </div>
  );
}

export default App;
