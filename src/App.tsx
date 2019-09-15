import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PlayIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import './App.css';

const App: React.FC = () => {
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState();

  function startTimer(): void{
    const timeRemaining = minutes * 60 + seconds;
    let minute = Math.floor(timeRemaining / 60);
    let second = timeRemaining;

    const interval = setInterval(() => {
      if (minute !== 0) {
        setMinutes(minute -= 1);
      }
      if (second !== 0) {
        setSeconds(second -= 1);
      }
    }, 1000);
    setIntervalId(interval);
  }

  function stopTimer(): void {
    clearInterval(intervalId);
  }

  function handlePlayButton() {
    startTimer();
  }

  return (
    <Grid container className="container">
      <Grid item md={12}>
        <Typography
          variant="h1"
          align="center"
          className="timer-text"
        >
          {`${minutes}:${seconds}`}
        </Typography>
      </Grid>
      <IconButton
        className="icon-btn"
        onClick={handlePlayButton}
      >
        <PlayIcon style={{ fontSize: 60, color: 'black' }}/>
      </IconButton>
      <IconButton
        className="icon-btn"
        onClick={stopTimer}
      >
        <StopIcon style={{ fontSize: 60, color: 'black' }}/>
      </IconButton>
    </Grid>
  );
};

export default App;
