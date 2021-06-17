import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Content from "./components/Content";
import { makeStyles } from '@material-ui/core';
import Header from './components/Header';
import MenuSidebar from './components/MenuSidebar';
import { token } from './utils/ApiConfig';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    // overflow: 'auto',
    padding: theme.spacing(2)
  },
}));

function App() {
  const classes = useStyles();

  const [proyek, setProyek] = useState();
  const [menuSideBar, setMenuSideBar] = useState(false);

  return (
    <div className={classes.root}>
      <Router>
        {token && <Header setProyek={setProyek} setMenuSideBar={setMenuSideBar} />}
        {token && menuSideBar && <MenuSidebar proyek={proyek} />}
        <main className={classes.content}>
          <Content auth={Boolean(token)} proyek={proyek} setProyek={setProyek} setMenuSideBar={setMenuSideBar} />
        </main>
      </Router>
    </div>
  );
}

export default App;
