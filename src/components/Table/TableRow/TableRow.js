import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import classes from './TableRow.css';

const tableRow = (props) => {
    return(
        <div>
            {props.rows.map((row) => (
                <TableRow key={row.name}>
                    <TableCell component="th" scope="row" className={classes.ListItem}>
                        <span style={{display: "flex", alignItems: "center", marginLeft: "0px"}}>
                            <img 
                            src = {row.logo} 
                            alt="image"
                            />
                            {row.name}
                        </span>
                    </TableCell>
                    <TableCell align="right" style={{display: "flex", alignItems: "center"}} className={classes.ListItem}>
                    {props.heading? (props.heading=="Watchlist"? <CancelIcon style={{marginLeft: "20px"}} onClick = {() => props.clicked(row)} />: null) : <AddCircleIcon style={{marginLeft: "20px"}} onClick = {() => props.clicked(row)} />}
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
        </div>
    )
}

export default tableRow;