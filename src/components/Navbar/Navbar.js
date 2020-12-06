import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import classes from './Navbar.css';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import '../../components/firebaseui-styling.global.css';

class Navbar extends Component {
    uiConfig = {
        signInFlow: "popup",
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
          signInSuccess: () => false
        }
      }
  
    componentDidMount = () => {
        firebase.auth().onAuthStateChanged (user => {
            this.props.signInToggled(user);
            console.log(user);
        })
    }

    render(){
        return(
            <AppBar 
                className={classes.AppBar} 
                position="sticky"
            >
                {/* <Container maxWidth="md"> */}
                    <Toolbar>
                        <img src="data:image/png;base64,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"/>
                        <div className = {classes.TabItem}>
                            ALINEA INVEST
                        </div>
                        <Tabs indicatorColor = "primary">
                            <Tab label="Home" className = {classes.TabItem} onClick = {() => this.props.homeClicked()} />
                            <Tab label="Watchlist" className = {classes.TabItem} onClick = {() => this.props.watchlistClicked()} />
                        </Tabs>

                        
                        {firebase.auth().currentUser ?
                            <div style={{marginLeft: "auto", display: "flex", alignItems: "center"}}>
                                <img style={{width: "40px", height: "40px", borderRadius: "50%"}} src={firebase.auth().currentUser.photoURL} alt="Profile Picture"/>
                                <ExitToAppIcon style={{marginLeft: "20px"}} onClick={() => firebase.auth().signOut()} />
                            </div>
                                :
                            <div style={{marginLeft: "auto"}}>
                                <StyledFirebaseAuth
                                    uiConfig={this.uiConfig}
                                    firebaseAuth={firebase.auth()}
                                />
                            </div>
                        }
                    
                    </Toolbar>
                {/* </Container> */}
            </AppBar>
        )
    }
}

export default Navbar;

