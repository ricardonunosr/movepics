import React, { useState } from 'react';
import {
  Main,
  Button,
  StartButton,
  Minimize,
  Close,
  WindowControls,
  Spinner,
  ToogleContainer,
  ToogleWrapper,
  ToogleLabel,
  Toogle,
  ErrorMessage,
} from './AppStyles';
const { ipcRenderer } = window.require('electron');
const { app, dialog, BrowserWindow } = window.require('electron').remote;

function App() {
  const [directoryPath, setDirectoryPath] = useState<string>();
  const [saveDirectory, setSaveDirectory] = useState<string>();
  const [directoryPathError, setDirectoryPathError] = useState<boolean>(false);
  const [saveDirectoryError, setSaveDirectoryErrors] = useState<boolean>(false);
  const [isMove, setIsMove] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  ipcRenderer.on('FINISH_SCRIPT', () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
    setDirectoryPath(undefined);
    setSaveDirectory(undefined);
    setDirectoryPathError(false);
    setSaveDirectoryErrors(false);
  });

  const handleInicialClick = async () => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
    setDirectoryPath(filePaths[0]);
  };

  const handleOrganizedClick = async () => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
    setSaveDirectory(filePaths[0]);
  };

  const handleStart = () => {
    let flag = false;
    if (directoryPath === undefined) {
      setDirectoryPathError(true);
      flag = true;
    }
    if (saveDirectory === undefined) {
      setSaveDirectoryErrors(true);
      flag = true;
    }
    if (flag) return;
    ipcRenderer.send('START_SCRIPT', {
      directoryPath,
      saveDirectory,
      isMove,
    });
  };
  const handleQuit = () => {
    app.exit();
  };

  const handleMinimize = () => {
    BrowserWindow.getFocusedWindow().minimize();
  };

  const handleToogle = () => {
    setIsMove(!isMove);
  };

  return (
    <>
      <WindowControls>
        <Minimize onClick={handleMinimize} />
        <Close onClick={handleQuit} />
      </WindowControls>
      <Main>
        <ToogleContainer>
          Copy
          <ToogleWrapper>
            <Toogle id="checkbox" type="checkbox" onClick={handleToogle} />
            <ToogleLabel htmlFor="checkbox" />
          </ToogleWrapper>
          Move
        </ToogleContainer>
        <>
          <Button onClick={handleInicialClick}>
            {directoryPath === undefined
              ? 'Path to inicial folder'
              : directoryPath}
          </Button>

          {directoryPathError ? <ErrorMessage>Select Path</ErrorMessage> : ''}
        </>
        <>
          <Button onClick={handleOrganizedClick}>
            {saveDirectory === undefined
              ? 'Path to organized folder'
              : saveDirectory}
          </Button>
          {saveDirectoryError ? <ErrorMessage>Select Path</ErrorMessage> : ''}
        </>
        <Button>Organize by Year</Button>
        {!loading && <StartButton onClick={handleStart}>Start</StartButton>}
        {loading && <Spinner />}
      </Main>
    </>
  );
}

export default App;
