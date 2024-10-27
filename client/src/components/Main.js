import React, { useState, useEffect, useMemo } from 'react';
import Header from './Header';
import Nav from './Nav';
import Icon from './Icon';
import TableManagement from './TableManagement';
import Menu from './Menu';
import Reservation from './Reservations';
import '../style/main.scss';

const Main = ({user, profileData}) => {
  // console.log('Profile data in Main component:', profileData);
  // console.log(profileData['ownerName']);
  // console.log(profileData['profilePicture']);
  // console.log(profileData['restaurantName']);

  const [activeTab, setActiveTab] = useState('tables');

  const tableManagement = useMemo(() => <TableManagement />, []);
  const reservations = useMemo(() => <Reservation />, []);
  const menu = useMemo(() => <Menu />, []);

  useEffect(() => {
    console.log('User state in Main component:', user);
  }, [user]);

  useEffect(() => {
    // console.log('Profile data in Main component:', profileData);
    // console.log(profileData['ownerName']);
    // console.log(profileData['profilePicture']);
    // console.log(profileData['restaurantName']);

  }, [profileData]);

  // if (!user) {
  //   return <div>User data not found</div>;
  // }

  //const profilePictureUrl = URL.createObjectURL(profileData.profilePicture);
  const profilePictureUrl = ""

  return (
    <div className="App">
      <Nav />
      <section>
        <Header 
          // title={profileData.restaurantName || ''}
          // userName={profileData.ownerName || ''}
          // image={profilePictureUrl || ''}
          title={"atif's" || ''}
          userName={"mahad" || ''}
          image={"" || ''}
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
};

export default Main;
