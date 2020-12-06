import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const tableRow = (props) => {

    return(
        <div>
            {props.rows.map((row) => (
                <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                        <span style={{display: "flex", alignItems: "center", marginLeft: "0px"}}>
                            <img 
                            src = {row.logo} 
                            alt="image" 
                            width="60px"
                            height="60px"
                            />
                            {row.name}
                        </span>
                    </TableCell>
                    <TableCell align="right" style={{display: "flex", alignItems: "center"}}>
                        <AddCircleIcon style={{marginLeft: "20px"}} onClick = {() => props.clicked(row)} />
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