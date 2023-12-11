import React, { useState, useEffect } from "react";
import {
  addProker,
  getProker,
  deleteProker,
  updateProker,
} from "../../gateways/api/ProkerApi";
import { Autocomplete } from '@material-ui/lab';
import AlertDialog from "../../components/AlertDialog";
import { Grid, CircularProgress } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import ClearIcon from '@material-ui/icons/Clear';



import {
  DataGrid,
  useGridApiRef,
  GridToolbarContainer,
} from "@mui/x-data-grid";



const defData = {
          "id": 0,
          "TAHUNMULAI": "",
          "TAHUNSELESAI": "",
          "KODEMPTI": "",
          "KETMPTI": ""
          
      }
const defaultAlert = {
  openAlertDialog: false,
  messageAlertDialog: "",
  severity: "info",
};





function EditToolbar(props) {
   
  
  const handleClick =  () => {
   
    const {setFilteredProker,proker} = props
   props.clearSearch()
    setTimeout(() => {
      let newarray2 = [...proker]
      newarray2.unshift(defData)
    
       setFilteredProker(newarray2)
    }, 500);
    
    //setPorto(newarray)
   
  };


  return (
    
    <GridToolbarContainer>
    <Grid container justify="space-between">
    
    <Grid item justify="flex-start">
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
      </Grid>

    <Grid item justify="flex-end">
        <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search…"
        //className={classes.textField}
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? 'visible' : 'hidden' }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
      />
    </Grid>
  </Grid>
    </GridToolbarContainer>
  );
}



export default function Proker(props) {
  const {mpti} = props
  const [proker, setProker] = useState([]);
  const [alertDialog, setAlertDialog] = useState(defaultAlert);
  const [loading, setLoading] = useState(true);
  const [sortModel, setSortModel] = React.useState([
    {
      field: 'no',
      sort: 'asc',
    },
  ]);
  const [filteredProker,setFilteredProker] = useState([])
  const [searchText, setSearchText] = React.useState('');
  const [pageSize, setPageSize] = React.useState(5);
  const apiRef = useGridApiRef();


  const handleChangeSort = (newmodel) =>{
    if(JSON.stringify(newmodel) !== JSON.stringify(sortModel)){
      setSortModel(newmodel)
    }
  }
  function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
   
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = proker.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field]?.toString());
      });
    });
    
    setFilteredProker(filteredRows);
  };


  function AutoEditInputCell(props) {
    const { id, value, api, field } = props;
    
 
    const handleChange = (event) => {
     
      api.setEditCellValue({ id, field, value: Number(event?.id) });
      // Check if the event is not from the keyboard
      // https://github.com/facebook/react/issues/7407
     // if (event.nativeEvent.clientX !== 0 && event.nativeEvent.clientY !== 0) {
       // api.commitCellChange({ id, field });
        //api.setCellMode(id, field, 'view');
     // }
    };
  
  
  
    return (
      <div >
        <Autocomplete 
                      options={mpti||""}
                      value={mpti.find(x=>x.id===value)||null}
                      getOptionLabel={option => option.KODEMPTI +" / "+ option.KETMPTI}
                      onChange={(e, v) => handleChange(v)}
                      //inputValue={d.nik + " / " + d.nama || ""}
                      style={{ width: 330 }}
                      getOptionSelected={
                        (option,value)=>option.id === value?.id
                        }
                      renderOption={(option) => (
                        <React.Fragment>
                          {option.KODEMPTI + " / " + option.KETMPTI }
                        </React.Fragment>
                      )}
                      renderInput={params => (
                        <TextField
                          {...params}
                          fullWidth
                          variant={"outlined"}
                          size="small"
                          required
                        // error={error[i].error}
                        // helperText={error[i].text}
                        />
                      )}
                     
                    />
      </div>
    );
  }
  
  
  function TextEditInputCell(props) {
    const { id, value, api, field } = props;
   
    let l = 0
    switch (field) {
      case "TAHUNPROKER":
          l = 38
        break;
      case "KODEPROKER":
          l = 5
        break;
      case "KETPROKER":
          l = 100
        break;
     
        
      default:
        break;
    }
    const handleChange = (event) => {
     
      api.setEditCellValue({ id, field, value: event.target.value });
      // Check if the event is not from the keyboard
      // https://github.com/facebook/react/issues/7407
     // if (event.nativeEvent.clientX !== 0 && event.nativeEvent.clientY !== 0) {
       // api.commitCellChange({ id, field });
        //api.setCellMode(id, field, 'view');
     // }
    };
  
  
  
    return (
      <div >
        
        <TextField size="small" value={value} inputProps={{maxLength:l}} onChange={handleChange}/>
        
      </div>
    );
  }

  function renderAutoEditInputCell(params) {
    return <AutoEditInputCell {...params} />;
  }
  
  
  function inputText7(params) {
    return <TextEditInputCell {...params} />;
  }





  function RowMenuCell(props) {
    const { api, id } = props;
   
    const isInEditMode = api.getRowMode(id) === "edit";
  
    const handleEditClick = (event) => {
      console.log(api);
      event.stopPropagation();
      api.setRowMode(id, "edit");
    };
  
    const handleSaveClick = async (event) => {
      event.stopPropagation();
      api.commitRowChange(id);
      api.setRowMode(id, "view");
  
      const row = api.getRow(id);
      
      if(id===0){
         const rest = await addProker(row)
         const data = rest.data
         
         
         setFilteredProker(data)
         setProker(data)
         
      }else{
     const rest =  await updateProker(row)
      //.then(api.updateRows([{ ...row, isNew: false }]));
      const data = rest.data
      setFilteredProker(data)
      setProker(data)
      }
    };
  
    const handleDeleteClick = async (event) => {
      event.stopPropagation();
      if(window.confirm("hapus data")){
      if(id===0){
        let newarray = [...filteredProker]
        console.log(filteredProker);
        newarray.shift()
        setFilteredProker(newarray)
        
      }else{
     const rest =  await deleteProker({ id: id })
     const data = rest.data
     setFilteredProker(data)
     setProker(data)

      }
    }
    };
  
    const handleCancelClick = (event) => {
      event.stopPropagation();
      api.setRowMode(id, "view");
  
      const row = api.getRow(id);
      if (row.isNew) {
        api.updateRows([{ id, _action: "delete" }]);
      }
    };
  
    if (isInEditMode) {
      return (
        <div >
          <IconButton
            color="primary"
            size="small"
            aria-label="save"
            onClick={handleSaveClick}
          >
            <SaveIcon fontSize="small" />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            aria-label="cancel"
           
            onClick={handleCancelClick}
          >
            <CancelIcon fontSize="small" />
          </IconButton>
        </div>
      );
    }
    return (
      <div>
        <IconButton
          color="inherit"
         
          size="small"
          aria-label="edit"
          onClick={handleEditClick}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          color="inherit"
          size="small"
          aria-label="delete"
          onClick={handleDeleteClick}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
    );
  }

  const columns = [
    {
      field: 'no' , 
      headerName: 'NO', 
      width: 100,
      filterable: false,
      renderCell:(index) => index.api.getRowIndex(index.row.id)+1
  },
    
    {
      headerName: "ID",
      width: 95,
      field: "id",
      hide:true
    },
    {
      headerName: "Tahun Proker",
      width: 170,
      editable: true,
      field: "TAHUNPROKER",
      renderEditCell: inputText7,
    },
    {
      headerName: "Kode Proker",
      width: 160,
      editable: true,
      field: "KODEPROKER",
      renderEditCell: inputText7,
    },
    {
      headerName: "Keterangan",
      width: 340,
      editable: true,
      field: "KETPROKER",
      renderEditCell: inputText7,
    },
    {
      headerName: "MPTI",
      width: 340,
      editable: true,
      renderEditCell: renderAutoEditInputCell,
      field: "IDMPTI",
      valueFormatter: ({value}) =>value?mpti.find(x=>x.id===value)?.KODEMPTI + ' / ' + mpti.find(x=>x.id===value)?.KETMPTI:""
      //mpti.find(x=>x.id === `${params.getValue(params.id, 'IDMPTI')} `)?.KODEMPTI +' / '+
      //mpti.find(x=>x.id === `${params.getValue(params.id, 'IDMPTI')} `)?.KETMPTI,
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: RowMenuCell,
      sortable: false,
      width: 120,
      headerAlign: "center",
      filterable: false,
      align: "center",
      disableColumnMenu: true,
      disableReorder: true,
    },
  ];
  


  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    console.log(event);
    event.defaultMuiPrevented = true;
  };

  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };
  useEffect(() => {
    getProker()
      .then((res) => {
        setProker(res.data);
        setFilteredProker(res.data)
        //columns.map((x,i)=>Object.assign(x,{field:Object.keys(res[0])[i]}))
        setLoading(false);
      })
      .catch((error) => {
        if (error.response)
          setAlertDialog({
            openAlertDialog: true,
            messageAlertDialog: error.response.data.message,
            severity: "error",
          });
        else
          setAlertDialog({
            openAlertDialog: true,
            messageAlertDialog: error.message,
            severity: "error",
          });
      });
  }, []);

  return (
    <Grid container direction="column" spacing={3}>
      <AlertDialog
        open={alertDialog.openAlertDialog}
        id="alert-dialog"
        onClose={handleCloseAlertDialog}
        message={alertDialog.messageAlertDialog}
        severity={alertDialog.severity}
      />
      <Grid item xs container direction="column">
        <Grid item xs>
          {loading ? (
            <Grid container justify="center">
              <CircularProgress />
            </Grid>
          ) : (
            <Grid  container  justifyContent="center" alignItems="center">
             
               <div style={{ height: 450, width: "100%"}}>
                <DataGrid
                  rows={filteredProker}
                  columns={columns}
                  pageSize={pageSize}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  apiRef={apiRef}
                  editMode="row"
                  onRowEditStart={handleRowEditStart}
                  onRowEditStop={handleRowEditStop}
                  components={{
                    Toolbar: EditToolbar
                  }}
                  componentsProps={{
                    toolbar: { 
                      apiRef,
                      filteredProker,
                      proker,
                      setFilteredProker,
                      value: searchText,
                      onChange: (event) => requestSearch(event.target.value),
                      clearSearch: () => requestSearch('')
                      },
                  }}
                sortModel={sortModel}
                onSortModelChange={(model)=>handleChangeSort(model)}
                 rowsPerPageOptions={[5,10,20]}
                />
              </div> 
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
