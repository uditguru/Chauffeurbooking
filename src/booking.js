/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/react-hooks'

// import { Query } from "react-apollo";
import gql from "graphql-tag";
import StripeCheckout from 'react-stripe-checkout';
// eslint-disable-next-line no-undef
import Lottie from 'react-lottie';

// import logo from './logo.svg';
import { TextField, Grid, Button, Card, CardContent, Typography } from '@material-ui/core';
import './App.css';
import Login from './login';
import Success from './success.json';
// eslint-disable-next-line no-undef
// id

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: Success,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

const bookingData = gql`
    mutation createBooking($input:bookingInput){
        createBooking(input: $input){
            user{
                name
                email
            }
            driver{
                name
                car
            }
            pickup
            mobile
        }
    }
`;

const paymentQr = gql`
    query payment($id:Strinf){
        createBooking(id:$id){
            id
        }
    }
`;

function Booking(props) {
    console.log(props.location.query)
    // eslint-disable-next-line no-unused-vars
    const udata = JSON.parse(localStorage.getItem('user'));
    if (!props.location.query) {
        window.location.href = "/";
    }
    const [driver, setDriver] = useState(props.location.query.driver);
    const { distance, destination } = props.location.query;
    const [payData, setPayData] = useState(null);
    const [form, setForm] = useState('')
    const [pushBooking] = useMutation(bookingData);
    // const [makePayment,{loading,data}] = useLazyQuery(paymentQr,{
    //     variables : bookingData
    // });

    const { name, languages, rate, car } = props.location.query.driver;

    function change(event) {
        event.preventDefault();
        const { name, value } = event.target;
        setForm({
            ...form,
            [name]: value
        });
    }

    function onToken(res) {
        console.log(res)
        setPayData(res)
        addBooking(res)
    }

    function addBooking(res) {
        console.log(payData)
        let bookingData = {
            driver: {
                name: driver.name,
                car: driver.car,
                languages: driver.languages,
                rate: driver.rate
            },
            user: {
                name: udata.name,
                email: udata.email
            },
            pickup: form.pickup,
            mobile: form.mobile,
            transactionId: res.id,
            cardId: res.card.id
        }
        // console.log(bookingData)
        // console.log(loading,data)
        pushBooking({ variables: { input: bookingData } })
        window.scrollTop = 0
    }
    return (
        <div className="App input-head" >
            <Typography variant="h5">Booking Detais</Typography>

            <Card className="card-result">

                <CardContent className="card-content">
                    <Typography> From:  Bangalore,Karnatak </Typography>
                    <Typography> To: {destination} </Typography>

                </CardContent>
            </Card>

            <Card className="card-result">

                <CardContent className="card-content">
                    <Typography variant="h6">Booking For</Typography>
                    <br>
                    </br>
                    <Typography> {udata.name} </Typography>
                    <Typography> {udata.email} </Typography>

                </CardContent>
            </Card>
            {name &&
                <Card className="card-result">


                    <CardContent className="card-content">
                        <Typography variant="h6">Driver Details</Typography>
                        <br>
                        </br>
                        <Typography>Name: {name} </Typography>
                        <Typography>Vehicle: {car} </Typography>
                        <Typography>Driver Can Speak {languages.join(", ")} </Typography>
                        <Typography>Charges {rate}/Kms </Typography>
                        <Typography>Ride : {distance}/kms</Typography>
                        <Typography>Your will be Charged ₹ {distance < 300 ? driver.rate * 300 : distance * driver.rate}</Typography>
                    </CardContent>
                </Card>}
            <Card>
                <CardContent>

                    <Typography>Additional Details:</Typography>
                    <br></br>
                    <Grid container spacing={3} >
                        <Grid item xs={6}>
                            <TextField disabled={payData} onChange={change} name="pickup" fullWidth={true} id="filled-basic" label="Pick-up Location" variant="filled" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField disabled={payData} onChange={change} name="mobile" fullWidth={true} id="filled-basic" label="Mobile Number" variant="filled" />
                        </Grid>
                    </Grid>
                    {!payData ? (<div className="sButton">
                        <StripeCheckout
                            stripeKey="pk_test_Gn4qL2DuuoOnpn24p1EqElvA"
                            token={onToken}
                            currency="INR"
                            locale="in"
                            amount={distance < 300 ? driver.rate * 300 : distance * driver.rate}
                            panelLabel="Pay {{amount}}"
                        />
                    </div>) : (
                            <Lottie options={defaultOptions}
                                height={200}
                                width={200} />
                        )}
                </CardContent>

            </Card>
        </div>
    );
}

export default Booking;