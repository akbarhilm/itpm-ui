import React, { useState, useEffect } from "react";
import {
  addPorto,
  getPorto,
  deletePorto,
  updatePorto,
} from "../../gateways/api/PortoApi";
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
import { createTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

const defaultTheme = createTheme();
const defData = {
          "id": 0,
          "KODEBISNIS": "",
          "NAMAAPLIKASI": "",
          "NAMAMODUL": "",
          "KETAPLIKASI": "",
          "KODESTATUS": "",
          "NAMAURL": ""
      }
const defaultAlert = {
  openAlertDialog: false,
  messageAlertDialog: "",
  severity: "info",
};



const useStyles = makeStyles(
  (theme) => ({
    root: {
      display: "inline-flex",
      alignItems: "center",
      gap: theme.spacing(1),
      color: theme.palette.text.secondary,
    },
    textPrimary: {
      color: theme.palette.text.primary,
    },
    textField: {
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      }
    }
  }),
  { defaultTheme }
);


function EditToolbar(props) {
   
  
  const handleClick =  () => {
   
    const {setFilteredPorto,porto} = props
   props.clearSearch()
    setTimeout(() => {
      let newarray2 = [...porto]
      newarray2.unshift(defData)
    
       setFilteredPorto(newarray2)
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



export default function Portofolio() {
  const [porto, setPorto] = useState([]);
  const [alertDialog, setAlertDialog] = useState(defaultAlert);
  const [loading, setLoading] = useState(true);
  const [sortModel, setSortModel] = React.useState([
    {
      field: 'no',
      sort: 'asc',
    },
  ]);
  const [filteredPorto,setFilteredPorto] = useState([])
  const [searchText, setSearchText] = React.useState('');
  const [pageSize, setPageSize] = React.useState(5);
  const apiRef = useGridApiRef();
  console.log(apiRef);

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
    const filteredRows = porto.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field].toString());
      });
    });
    
    setFilteredPorto(filteredRows);
  };


  function AutoEditInputCell(props) {
    const { id, value, api, field } = props;
    const classes = useStyles();
    let l = 0
    switch (field) {
      case "KODEBISNIS":
          l = 10
        break;
      case "NAMAAPLIKASI":
          l = 100
        break;
      case "NAMAMODUL":
          l = 100
        break;
      case "KETAPLIKASI":
          l = 250
          break;
      case "KODESTATUS":
          l = 35
        break;
      case "NAMAURL":
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
      <div className={classes.root}>
        
        <TextField size="small" value={value} inputProps={{maxLength:l}} onChange={handleChange}/>
        
      </div>
    );
  }


  function inputText7(params) {
    return <AutoEditInputCell {...params} />;
  }
  


  function RowMenuCell(props) {
    const { api, id } = props;
    const classes = useStyles();
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
         const rest = await addPorto(row)
         const data = rest.data
         
         
         setFilteredPorto(data)
         //api.updateRows([{ ...row,id:rest.data.idporto, isNew: false }]);
         
      }else{
     const rest =  await updatePorto(row)
      //.then(api.updateRows([{ ...row, isNew: false }]));
      const data = rest.data
      setFilteredPorto(data)
      }
    };
  
    const handleDeleteClick = async (event) => {
      event.stopPropagation();
      if(window.confirm("hapus data")){
      if(id===0){
        let newarray = [...filteredPorto]
        console.log(filteredPorto);
        newarray.shift()
        console.log(newarray);
        setFilteredPorto(newarray)
      }else{
     const rest =  await deletePorto({ id: id })
     const data = rest.data
     setFilteredPorto(data)
      
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
        <div className={classes.root}>
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
            className={classes.textPrimary}
            onClick={handleCancelClick}
          >
            <CancelIcon fontSize="small" />
          </IconButton>
        </div>
      );
    }
    return (
      <div className={classes.root}>
        <IconButton
          color="inherit"
          className={classes.textPrimary}
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
      headerName: "Bussiness Type",
      width: 150,
      editable: true,
      field: "KODEBISNIS",
      renderEditCell: inputText7,
    },
    {
      headerName: "Nama Applikasi",
      width: 180,
      editable: true,
      field: "NAMAAPLIKASI",
      renderEditCell: inputText7,
    },
    {
      headerName: "Nama Modul",
      width: 180,
      editable: true,
      field: "NAMAMODUL",
      renderEditCell: inputText7,
    },
    {
      headerName: "Keterangan",
      width: 200,
      editable: true,
      field: "KETAPLIKASI",
      renderEditCell: inputText7,
    },
    {
      headerName: "Status",
      width: 120,
      editable: true,
      field: "KODESTATUS",
      renderEditCell: inputText7,
    },
    {
      headerName: "URL",
      width: 150,
      editable: true,
      field: "NAMAURL",
      renderEditCell: inputText7,
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: RowMenuCell,
      sortable: false,
      width: 100,
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
    getPorto()
      .then((res) => {
        setPorto(res.data);
        setFilteredPorto(res.data)
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
            <Grid item xs>
              {/* <div id="myGrid" style={{height: window, width: hw}} class="ag-theme-alpine">
        
      <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
   
        </div> */}
             
              <div style={{ height: 450, width: "100%" }}>
                <DataGrid
                  rows={filteredPorto}
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
                      filteredPorto,
                      porto,
                      setFilteredPorto,
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
