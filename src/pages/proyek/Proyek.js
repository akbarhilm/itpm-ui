import React, { useState, useEffect, useContext } from "react";
import { Grid, Typography, IconButton, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, Divider, CircularProgress } from "@material-ui/core";
import { AddBoxOutlined, EditOutlined } from '@material-ui/icons';
import Pagination from "@material-ui/lab/Pagination";
import { getListProyek } from '../../gateways/api/ProyekAPI';
import { useHistory } from "react-router-dom";
import { useCallback } from "react";
// import { token } from '../../utils/ApiConfig'
import AlertDialog from '../../components/AlertDialog';
import { UserContext } from "../../utils/UserContext";

const itemsPerPage = 10;

const defaultAlert = { openAlertDialog: false, messageAlertDialog: "", severity: "info" };

export default function Proyek(props) {
  const { setProyek, setMenuSideBar } = props;
  const { user } = useContext(UserContext);
  const history = useHistory();

  const [refresh, setRefresh] = useState(Boolean(user));
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [listProyek, setListProyek] = useState([]);
  const [authPMO, setAuthPMO] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertDialog, setAlertDialog] = useState(defaultAlert);

  const handleCloseAlertDialog = () => {
    setAlertDialog({ ...alertDialog, openAlertDialog: false });
  };

  useEffect(() => {
    setTotalPages(
      Math.ceil(listProyek.length / itemsPerPage)
    );
  }, [listProyek]);

  const getProyek = useCallback(() => {
    setLoading(true);
    getListProyek()
      .then((response) => {
        setAuthPMO(response.data.otoritas.PMO);
        setListProyek(response.data.list);
        setLoading(false);
        // console.log(response.data)
      });
    // .catch((error) => {
    //   // console.log("error", error.message)
    //   setLoading(false);
    //   if (error.response)
    //     setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.response.data, severity: "error" });
    //   else
    //     setAlertDialog({ openAlertDialog: true, messageAlertDialog: error.message, severity: "error" });
    // });
  }, []);

  useEffect(() => {
    if (refresh) {
      history.push("/");
      setRefresh(false);
    }
  }, [refresh, history]);

  useEffect(() => {
    if (!refresh) {
      getProyek();
    }
  }, [refresh, getProyek]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleAdd = () => {
    setMenuSideBar(false);
    history.push("/proyek/tambah");
  };

  const handleEdit = (project) => {
    setProyek(project);
    setMenuSideBar(false);
    history.push("/proyek/ubah");
  };

  const handleDetail = (project) => {
    setProyek(project);
    setMenuSideBar(true);
    history.push("/" + project.NAMAURI);
  };

  return (
    <Grid container direction="column" spacing={3}>
      <AlertDialog
        open={alertDialog.openAlertDialog}
        id="alert-dialog"
        onClose={handleCloseAlertDialog}
        message={alertDialog.messageAlertDialog}
        severity={alertDialog.severity}
      />
      <Grid item xs container direction="row" justify="space-between" >
        <Typography variant="h5" gutterBottom>List Proyek</Typography>
        {authPMO && <IconButton aria-label="add project" component="span" onClick={handleAdd}>
          <AddBoxOutlined />
        </IconButton>}
      </Grid>
      <Grid item xs>
        {loading ? <Grid container justify="center"><CircularProgress /></Grid>
          : listProyek.length > 0 ?
            <List>
              {listProyek
                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map((d, i) => (
                  <ListItem button key={"list-item-" + i} divider onClick={() => handleDetail(d)}>
                    <ListItemAvatar key={"list-item-avatar-" + i}>
                      <Avatar key={"avatar-" + i} alt={d.NAMAPROYEK ? d.NAMAPROYEK.toUpperCase() : "N"} src="#" />
                    </ListItemAvatar>
                    <ListItemText key={"list-item-text-" + i} primary={d.NAMAPROYEK} secondary={d.KETPROYEK} />
                    {authPMO && d.STATUSPROYEK === "BARU" && <ListItemSecondaryAction key={"list-item-secondary-action-" + i}>
                      <IconButton key={"secondary-action" + i} edge="end" aria-label="edit" onClick={() => handleEdit(d)}>
                        <EditOutlined key={"secondary-action-icon-" + i} />
                      </IconButton>
                    </ListItemSecondaryAction>}
                  </ListItem>
                ))
              }
            </List>
            : <><Divider style={{ marginTop: 8, marginBottom: 18 }} />
              <Grid container justify="center">
                <Typography>Tidak ada data.</Typography>
              </Grid></>
        }
      </Grid>
      {totalPages > 0 && <Grid item xs container justify="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChange}
          defaultPage={1}
          color="primary"
          size="small"
        />
      </Grid>}
    </Grid>
  );
}