import React from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import classes from './Table.css';
import CancelIcon from '@material-ui/icons/Cancel';

const table = (props) => {
    return(
        <div>
            <Typography variant="h2" className={classes.Typography}>{props.heading}</Typography>        
            <TableContainer component={Paper}>
            
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.ColumnHeader}><span><strong>COMPANY</strong></span></TableCell>
                            {props.heading=="Watchlist"? 
                            <TableCell align="right" className={classes.ColumnHeader}><span style={{marginRight:"30px"}}><strong>MARKET PRICE</strong></span></TableCell>:
                            <TableCell align="right" className={classes.ColumnHeader}><span><strong>MARKET PRICE</strong></span></TableCell>}
                        </TableRow>
                    </TableHead>
                    
                    <TableBody>
                    {props.rows.map((row) => (
                        <TableRow key={row.name}>
                            <TableCell component="th" scope="row" className={classes.ListItem}>
                                <span style={{display: "flex", alignItems: "center", marginLeft: "0px"}}>
                                    <img 
                                    src = {row.logo} 
                                    alt="image" 
                                    className={classes.ListImage}
                                    />
                                    {row.name}
                                </span>
                            </TableCell>
                            <TableCell align="right" style={{display: "flex", alignItems: "center"}} className={classes.ListItem}>
                                {props.heading=="Watchlist"? <CancelIcon style={{marginLeft: "20px"}} onClick = {() => props.clicked(row)} />: null}
                                <div>
                                    <p><span><strong>${row.marketPrice}</strong></span> USD</p>
                                    {row.change<0 ? 
                                        <p style={{color: "red"}}>-${-row.change.toFixed(2)} USD ({-row.percentageChange.toFixed(2)}%)</p> :
                                        <p style={{color: "green"}}>+${row.change.toFixed(2)} USD ({row.percentageChange.toFixed(2)}%)</p>
                                    }
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                
                </Table>

            </TableContainer>
        </div>
)}

export default table;