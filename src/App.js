/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
// import { Query } from "react-apollo";
import gql from "graphql-tag";
import { useLazyQuery } from '@apollo/react-hooks'
// import logo from './logo.svg';
import { TextField, Grid, Button, Card, CardContent, Typography, Chip } from '@material-ui/core';
import './App.css';
import Login from './login';

const getDrivers = gql`
  query drivers($languages:String){
    drivers(languages:$languages){
      name
      car
      languages
      rate
    }
  }
`;

function App() {
  const [distance, setDistance] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState(null)
  const [user, setUser] = useState(null)
  const [destination, setDestination] = useState('')
  const [runSearch, { loading, data }] = useLazyQuery(getDrivers,{
    variables : filter && filter
  })

  function findDistance() {
    if (destination === '') {
      alert('no destination provided')
      return null;
    }
    let data = {
      locations: [
        "Bangalore",
        destination,
      ]
    }

    fetch('http://www.mapquestapi.com/directions/v2/routematrix?key=pOXWepeYLEiuwIP3E5PHwze7ZADa2JRS', {
      method: "POST",
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(result => {
        console.log(result)
        setDistance(result.distance[1])
      });
    runSearch();

  }

  function changeLogin() {
    setIsOpen(true);
  }

  function closeLogin() {
    setIsOpen(false);
    let user = localStorage.getItem('user');
    if (user) {
      setUser(user)
      window.location.reload();
    }
  }

  function handleChange(event) {
    setDestination(event.target.value)
  }

  function handleFilter(data){
    console.log(data)
    setFilter({
      languages : data
    });
  }


  useEffect(() => {
    let user = localStorage.getItem('user');
    if (user) {
      setUser(user)
    }
  }, []);

  return (
    <div className="App input-head" >
      <Grid container spacing={3} >
        <Grid item xs={6}>
          <TextField fullWidth={true} id="filled-basic" label="Filled" disabled value={"Bangalore,Karnataka"} variant="filled" />
        </Grid>
        <Grid item xs={6}>
          <TextField onChange={handleChange} fullWidth={true} id="filled-basic" label="Destination" variant="filled" />
        </Grid>
      </Grid>
      <div className="sButton">
        <Button onClick={findDistance} variant="contained" color="primary" size="large" >Search</Button>
      </div>
      {
        !loading && (
          <div>
          <Chip color={filter && filter.languages === 'English' ? "primary" : "default"} name="English" label="English" onClick={()=>handleFilter('English')} />
            <Chip color={filter && filter.languages === 'Hindi' ? "primary" : "default"} name="Hindi" label="Hindi" onClick={()=>handleFilter('Hindi')} />
            <Chip color={filter && filter.languages === 'Kannada' ? "primary" : "default"} name="Kannada" label="Kannada" onClick={()=>handleFilter('Kannada')} />
            </div>
        )
      }
      { 
        !loading ? (
          data && data.drivers.map((driver, index) => (  
            <Card className="card-result" key={index} >
              <img className="search-media" alt="" src="https://4.imimg.com/data4/OD/QD/ANDROID-9742911/product-500x500.jpeg" />
              <CardContent className="card-content">
                <Typography variant="h6">{driver.name}</Typography>
                <Typography>{driver.car}</Typography>
                <Typography>₹{driver.rate}/KM</Typography>
                <Typography>can speak: {driver.languages.join(", ")} </Typography>
                <Typography>₹{Math.round(distance < 300 ? driver.rate * 300 : driver.rate * distance)} for {distance}Kms</Typography>
              </CardContent>
              <div className="sButton">
                {user ? (<Link to={{ pathname: `/booking`, query: {driver : driver, distance: distance, destination: destination } }}>
                  <Button variant="contained" color="primary" >Book</Button>
                </Link>) : (
                    <Button onClick={changeLogin} variant="contained" color="primary" >Book</Button>
                  )}
              </div>
            </Card>
          ))
        ) : (
            <div>Search will appear here</div>
          )
      }
      <Login close={closeLogin} open={isOpen} />
    </div>
      );
    }
    
export default App;