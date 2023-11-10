import React, { useState, useEffect, useContext } from "react";
import { getPorto } from '../../gateways/api/PortoApi';
import AlertDialog from '../../components/AlertDialog';
import {Grid,CircularProgress} from "@material-ui/core";

import { AgGridReact } from "ag-grid-react";

import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';

const defaultAlert = { openAlertDialog: false, messageAlertDialog: "", severity: "info" };


	const columnDefs =  [
		{ headerName: 'Make', field: 'make' },
		{ headerName: 'Model', field: 'model' },
		{ headerName: 'Price', field: 'price' }
	]
	const rowData = [
		{ make: 'Toyota', model: 'Celica', price: 35000 },
		{ make: 'Ford', model: 'Mondeo', price: 32000 },
		{ make: 'Porsche', model: 'Boxster', price: 72000 }
	]


export default function Porto(){

    const[porto,setPorto] = useState()
    const [alertDialog, setAlertDialog] = useState(defaultAlert);
    const [loading, setLoading] = useState(true);

    const handleCloseAlertDialog = () => {
        setAlertDialog({ ...alertDialog, openAlertDialog: false });
      };
    useEffect(() => {
        getPorto()
            .then(res=>{
                setPorto(res)
                setLoading(false)
            }).catch((error) => {
                if (error.response)
                  setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data.message, severity: "error" });
                else
                  setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
              });
            })



    return(
        <Grid container direction="column" spacing={3}>
        <AlertDialog open={alertDialog.openAlertDialog}
          id="alert-dialog"
          onClose={handleCloseAlertDialog}
          message={alertDialog.messageAlertDialog}
          severity={alertDialog.severity}
        />
        <Grid item xs container direction="column" >
        <Grid item xs>
          {loading ? <Grid container justify="center"><CircularProgress /></Grid>
            :
            <Grid item xs>
        <div id="myGrid" style={{height: window.innerHeight, width: window.innerWidth}} class="ag-theme-alpine">
        
      <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
   
        </div>
        </Grid>
          }
        </Grid>
        </Grid>
        </Grid>
    )
}