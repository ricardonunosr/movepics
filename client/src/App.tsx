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
} from './AppStyles';
const { ipcRenderer } = window.require('electron');
const { app, dialog, BrowserWindow } = window.require('electron').remote;

function App() {
  const [directoryPath, setDirectoryPath] = useState<string>();
  const [saveDirectory, setSaveDirectory] = useState<string>();
  const [isMove, setIsMove] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  ipcRenderer.on('FINISH_SCRIPT', () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
    setDirectoryPath(undefined);
    setSaveDirectory(undefined);
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

        <Button onClick={handleInicialClick}>
          {directoryPath === undefined
            ? 'Path to inicial folder'
            : directoryPath}
        </Button>
        <Button onClick={handleOrganizedClick}>
          {saveDirectory === undefined
            ? 'Path to organized folder'
            : saveDirectory}
        </Button>
        <Button>Organize by Year</Button>
        {!loading && <StartButton onClick={handleStart}>Start</StartButton>}
        {loading && <Spinner />}
      </Main>
    </>
  );
}

export default App;
