import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import SettingsIcon from '@material-ui/icons/Settings';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import FullScreenExitIcon from '@material-ui/icons/FullscreenExit';
import './App.css';

const { remote } = window.require('electron');

const App: React.FC = () => {
  const window = remote.getCurrentWindow();
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(hours * 3600 + minutes * 60 + seconds);
  const [intervalId, setIntervalId] = useState();
  const [currentFocus, setCurrentFocus] = useState('play');
  const [fullscreen, setFullScreen] = useState(true);

  useEffect(() => {
    window.setBackgroundColor('#000');
  }, []);

  function stopTimer(): void {
    clearInterval(intervalId);
  }

  function startTimer(): void{
    let time = timeRemaining;
    let hour = Math.floor(timeRemaining / 3600);
    let minute = hour * 60 - Math.floor(timeRemaining / 60);
    let second = timeRemaining - hour * 3600 - minute * 60;

    const interval = setInterval(() => {
      time -= 1;
      hour = Math.floor(time / 3600);
      minute = Math.floor(time / 60) - hour * 60;
      second = time - hour * 3600 - minute * 60;
      setSeconds(second);
      setMinutes(minute);
      setHours(hour);
      if (second === 0 && minute === 0 && hour === 0) {
        stopTimer();
      }
    }, 1000);
    setIntervalId(interval);
  }


  function handlePlayButton(): void {
    if (currentFocus === 'play') {
      startTimer();
      setCurrentFocus('pause');
    } else {
      stopTimer();
      setCurrentFocus('play');
    }
  }

  function handleStopButtonClick(): void {
    stopTimer();
    setCurrentFocus('play');
    const time = timeRemaining;
    const hour = Math.floor(time / 3600);
    const minute = hour * 60 - Math.floor(time / 60);
    const second = time - hour * 3600 - minute * 60;
    setHours(hour);
    setMinutes(minute);
    setSeconds(second);
  }

  function handleFullscreenButtonClick(): void {
    setFullScreen(!fullscreen);
    window.setFullScreen(fullscreen);
  }

  function handleSettingClick(): void {
    console.log('settings');
  }

  return (
    <Grid container className="container">
      <IconButton
        className="settings-btn"
        title="Settings"
        style={{ border: 'none', opacity: (currentFocus !== 'play') ? 0 : 1 }}
        onClick={handleSettingClick}
      >
        <SettingsIcon style={{ fontSize: 20, color: 'white' }}/>
      </IconButton>
      <div className='timer-container'>
        <Typography
          align="center"
          className="timer-text"
        >
          {`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
        </Typography>
      </div>
      <div className='action-button'>
        <IconButton
          className="icon-btn"
          onClick={handleStopButtonClick}
          title="Stop"
        >
          <StopIcon style={{ fontSize: 30, color: 'white' }}/>
        </IconButton>
        <IconButton
          className="icon-btn"
          onClick={handlePlayButton}
          title={(currentFocus === 'play') ? 'Play' : 'Pause'}
        >
          {currentFocus === 'play'
            ? <PlayIcon style={{ fontSize: 50, color: 'white' }}/>
            : <PauseIcon style={{ fontSize: 50, color: 'white' }}/>
          }
        </IconButton>
        <IconButton
          className="icon-btn"
          title="Fullscreen"
          onClick={handleFullscreenButtonClick}
        >
          {(fullscreen)
            ? <FullScreenIcon style={{ fontSize: 30, color: 'white' }}/>
            : <FullScreenExitIcon style={{ fontSize: 30, color: 'white' }}/>
          }
        </IconButton>
      </div>
    </Grid>
  );
};

export default App;
