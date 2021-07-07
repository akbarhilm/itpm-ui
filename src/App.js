import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ContentRoute from "./components/ContentRoute";
import { makeStyles } from '@material-ui/core';
import Header from './components/Header';
import MenuSidebar from './components/MenuSidebar';
// import { token } from './utils/ApiConfig';
import { UserContext, useFindUser } from './utils/UserContext';

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

  const { user, setUser, isLoading } = useFindUser();
  const [proyek, setProyek] = useState();
  const [menuSideBar, setMenuSideBar] = useState(false);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      <div className={classes.root}>
        <Router>
          {user && <Header setProyek={setProyek} setMenuSideBar={setMenuSideBar} />}
          {user && menuSideBar && <MenuSidebar proyek={proyek} />}
          <main className={classes.content}>
            <ContentRoute proyek={proyek} setProyek={setProyek} setMenuSideBar={setMenuSideBar} />
          </main>
        </Router>
      </div>
    </UserContext.Provider>
  );
}

export default App;
