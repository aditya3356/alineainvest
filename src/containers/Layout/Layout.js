import React, { Component } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Table from '../../components/Table/Table';
import axios from 'axios';
import config from '../../config.json';
import stockList from '../../data.json';
import Autocomplete from '../../components/Autocomplete/Autocomplete';
import logoList from '../../logos.json';
import Modal from '../../components/Modal/Modal';
import classes from './Layout.css';
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

firebase.initializeApp({
    apiKey: config.FIREBASE_API_KEY,
    authDomain: config.FIREBASE_AUTHDOMAIN
})
firebase.auth().signOut();
class Layout extends Component {
    
    uiConfig = {
        signInFlow: "popup",
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
          signInSuccess: () => false
        }
    }

    startingData = [];

    symbolToName = {};
    nameToSymbol = {};
    names = [];
    symbols = [];
    companies = this.startingData;

    state = {
        popularStocks: [],
        signedIn: false,
        user: null,
        uid: "",
        homeClicked: true,
        watchlistClicked: false,
        showModal: false,
        watchlistStocks: []
    }
    
    componentWillMount(){
        firebase.auth().onAuthStateChanged (user => {
            this.signInToggleHandler(user);
            console.log(user);
        })

        stockList.forEach(item => {
            let symbol = item["Holding Ticker"].trim();
            let name = item.Name.trim();
            // console.log(typeof symbol);
            this.symbolToName = {...this.symbolToName, [symbol]: name};
            this.symbols.push(symbol);
            this.names.push(name);
        })

        stockList.forEach(item => {
            let symbol = item["Holding Ticker"].trim();
            let name = item.Name.trim();
            // console.log(typeof symbol);
            this.nameToSymbol = {...this.nameToSymbol, [name]: symbol};
        })


        let yesterday = new Date(new Date().setDate(new Date().getDate()-3))
        axios.get(config.END_POINT+"bars/1D", {
            headers: {
                "APCA-API-KEY-ID": config.API_KEY,
                "APCA-API-SECRET-KEY": config.SECRET_KEY,
            },
            params: {
                "symbols": this.symbols.toString(),
                "start": yesterday.toISOString(),
                "end": (new Date()).toISOString()
            }
        })
        .then(response => {
            console.log(response);

            let updatedRows = [];
            let responseData = response.data;
            let updatedPopularStocks = [];

            for (let key in responseData)
            {
                let arr = responseData[key];
                let name = this.symbolToName[key];
                let marketPrice = arr[arr.length-1].c;
                let change = arr[arr.length-1].c - arr[arr.length-2].c;
                let percentageChange = ((100*change)/arr[arr.length-2].c);
                let logo = logoList[name]? logoList[name] : "https://i.pinimg.com/originals/b8/d4/a3/b8d4a3574c7b2a137f66bedbb8759cb6.png";
                let symbol = key;
                updatedRows.push({
                    name: name,
                    marketPrice: marketPrice,
                    change: change,
                    percentageChange: percentageChange,
                    logo: logo,
                    symbol: symbol
                })

                if (key=="MSFT" || key=="AMZN" || key=="GOOGL" || key=="FB" || key=="AAPL")
                    updatedPopularStocks.push({
                        name: name,
                        marketPrice: marketPrice,
                        change: change,
                        percentageChange: percentageChange,
                        logo: logo,
                        symbol: symbol
                    })
            }

            this.companies = updatedRows;
            this.setState({popularStocks: updatedPopularStocks});
            console.log(this.companies);
        })
        .catch(error => {
            console.log(error);
        })
    }

    signInToggleHandler = (user) => {
        console.log("SignIn Toggled");
        console.log(user);
        this.setState(prevState => {
            return({signedIn: !!user, user: user, showModal: false, homeClicked: true, watchlistClicked: false});
        });

        if (this.state.user)
        {
            this.getRequest();
        }
        else
        {
            this.setState({watchlistStocks: this.startingData, watchlistClicked: false, homeClicked: true, showModal: false});
        }
    }

    modalClosedHandler = () => {
        this.setState({watchlistClicked: false, showModal: false, homeClicked: true});
    }

    homeClickedHandler = () => {
        this.setState({homeClicked: true, watchlistClicked: false, showModal: false})
    }
    
    watchlistClickedHandler = () => {
        if (this.state.user)
            this.setState({homeClicked: false, watchlistClicked: true, showModal: false})
        else
            this.setState({homeClicked: false, watchlistClicked: true, showModal: true});
    }

    getRequest = () => {
        console.log("In Fetch From Database");
        axios.get(config.FIREBASE_END_POINT+"/users.json")
        .then(response => {
            console.log("Response from Database");
            // console.log(response);
            
            let arr = response.data;
            let watchlist = "";
            let uid = "";
            for (let key in arr)
            {
                // console.log(key);
                // console.log(arr[key]["email"]);
                if (arr[key]["email"]==this.state.user.email)
                {
                    uid = key;
                    watchlist = arr[key]["watchlist"];
                }
            }

            if (this.state.watchlistStocks == this.startingData)
            {        
                if (watchlist.length!=0)
                {
                    // console.log(watchlist);
                    const watchlistArray = watchlist.split(',');
                    console.log(watchlistArray);

                    const watchlistStocks = [];

                    this.companies.forEach(company => {
                        if (watchlistArray.includes(company.symbol))
                            watchlistStocks.push(company);
                    })

                    this.setState({watchlistStocks: watchlistStocks});
                }
            }

            this.setState({uid: uid});
        })
        .catch(error => {
            console.log(error);
        })
    }

    postRequest = (obj) => {
        axios.post(config.FIREBASE_END_POINT+"/users.json", obj)
        .then(response => {
            console.log(response);

            this.getRequest();
        })
        .catch(error => {
            console.log(error);
        })   
    }

    deleteRequest = (watchlistStocks) => {
        const finalWatchlist = [];
        
        watchlistStocks.forEach(stock => {
            finalWatchlist.push(stock.symbol);
        });

        console.log(finalWatchlist);

        let obj = {
            email: this.state.user.email,
            watchlist: finalWatchlist.toString()
        }

        if (this.state.uid != "")
        {
            axios.delete(config.FIREBASE_END_POINT+"/users/"+ this.state.uid + ".json")
                .then(response => {
                    console.log(response);
                    
                    if (obj.watchlist!="")
                        this.postRequest(obj);
                })
                .catch(error => {
                    console.log(error);
                })
        }  
        else 
        {
            this.postRequest(obj);
        }   
    }

    addStockHandler = (addedStock) => {
        console.log(addedStock);
        console.log(this.state.uid);

        let newAddedStock = null;

        this.companies.forEach(company => {
            if (company.symbol==addedStock.symbol)
                newAddedStock = {...company};
        });

        if (this.state.uid != "")
        {
            let watchlistStocks = [...this.state.watchlistStocks, newAddedStock];
            console.log(watchlistStocks);

            this.setState({watchlistStocks: watchlistStocks, watchlistClicked: true});
            this.deleteRequest(watchlistStocks);
        }
        else
        {
            let watchlistStocks = [newAddedStock];
            console.log(watchlistStocks);

            this.setState({watchlistStocks: watchlistStocks, watchlistClicked: true});
            this.deleteRequest(watchlistStocks);
        }
    }

    removeStockHandler = (removedStock) => {

        let newWatchlistStocks = [];
        this.state.watchlistStocks.forEach(stock => {
            if (stock.symbol!=removedStock.symbol)
                newWatchlistStocks.push(stock);
        });

        this.setState({watchlistStocks: newWatchlistStocks, watchlistClicked: true});

        this.deleteRequest(newWatchlistStocks);
    }

    render(){
        let watchlistElement = null;
        let heading = "Popular Stocks";
        let rows = this.state.popularStocks;

        if (this.state.watchlistClicked)
        {
            heading = "Watchlist";
            rows = this.state.watchlistStocks;

            if (this.state.user)
            {
                console.log(this.state.watchlistStocks);
                let newCompanies = [];

                this.companies.forEach(company => {
                    let found = false;
                    
                    this.state.watchlistStocks.forEach(stock => {
                        if (company.symbol==stock.symbol)
                            found = true;
                    })

                    if (!found)
                        newCompanies.push(company);
                });

                console.log(newCompanies);
                watchlistElement = (<Autocomplete 
                                        companies = {newCompanies} 
                                        clicked = {this.addStockHandler} />);
            }
            else
            {
                watchlistElement = (<Modal show = {this.state.showModal} modalClosed = {this.modalClosedHandler}>
                                        <div className={classes.FirstHalf}>Keep Track Of Your Stocks</div>
                                        <div className={classes.SecondHalf}>
                                            <img src="data:image/png;base64,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"/>
                                            <div>
                                                ALINEA INVEST
                                            </div>
                                            <StyledFirebaseAuth
                                                uiConfig={this.uiConfig}
                                                firebaseAuth={firebase.auth()}
                                            />
                                        </div>
                                    </Modal>);
            }
        }

        return(
            <div>
                
                {!this.state.showModal? 
                    <Navbar 
                        signInToggled = {this.signInToggleHandler} 
                        homeClicked = {this.homeClickedHandler} 
                        watchlistClicked = {this.watchlistClickedHandler} 
                    />: null
                }
                
                {watchlistElement}
                <Table heading = {heading} rows = {rows} clicked = {this.removeStockHandler} />

            </div>
        )
    }
}

export default Layout;