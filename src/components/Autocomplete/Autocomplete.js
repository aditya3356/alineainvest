import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import TableRow from '../Table/TableRow/TableRow';
import classes from './Autocomplete.css';

class Autocomplete extends Component{

    state = {
        inputValue: "",
        filteredCompanies: []
    }

    onChangeHandler = (event) => {
        let inputValue = event.target.value;

        const filteredCompanies = [];
        if (inputValue.length>=3)
        {
            this.props.companies.forEach(company => {
                if (company.name.toLowerCase().includes(inputValue.toLowerCase()))
                {
                    // console.log(company);
                    filteredCompanies.push(company);
                }
            });
        }

        console.log(filteredCompanies);

        this.setState({inputValue: inputValue, filteredCompanies: filteredCompanies});
    }

    onClickHandler = (row) => {
        let filteredCompanies = [...this.state.filteredCompanies];

        let updatedfilteredCompanies = [];
        filteredCompanies.forEach(company => {
            if (company.symbol != row.symbol)
                updatedfilteredCompanies.push(company);
        });
        this.setState({filteredCompanies: updatedfilteredCompanies});
        this.props.clicked(row);
    }

    render(){
        return(
            <div style={{margin: "auto", width: "1000px"}}>
                <TextField
                    id="outlined-secondary"
                    label="Search stocks to add to watchlist"
                    variant="outlined"
                    color="secondary"
                    value = {this.state.inputValue}
                    onChange = {this.onChangeHandler}
                    className = {classes.TextField}
                    inputProps={{
                        autocomplete: 'off',
                    }}
                />
                <TableRow rows = {this.state.filteredCompanies} className = {classes.TableRow} clicked = {this.onClickHandler} />
            </div>
        )
    }
}

export default Autocomplete;