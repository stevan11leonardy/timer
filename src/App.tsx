import React, { useState, useEffect, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import FullScreenExitIcon from '@material-ui/icons/FullscreenExit';
import './App.css';
import IOSSwitch from './tools/switch';

const { remote } = window.require('electron');

(function checkMouseStop(mouseStopDelay: number): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let timeout: any;
  document.addEventListener('mousemove', (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (e !== null && e.target !== null) {
        const event = new CustomEvent('mousestop', {
          detail: {
            clientX: e.clientX,
            clientY: e.clientY,
          },
          bubbles: true,
          cancelable: true,
        });
        e.target.dispatchEvent(event);
      }
    }, mouseStopDelay);
  });
}(3000));

interface Data {
  hours?: number;
  minutes?: number;
  seconds?: number;
  playSound: boolean;
  loopSound: number;
}

type CustomTextFieldProps = {
  name: string;
  type: string;
  placeholder?: string;
  value?: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomTextField: React.SFC<CustomTextFieldProps> = (props) => {
  const {
    name, type, placeholder, value, onChange,
  } = props;
  if (value !== undefined) {
    return (
      <TextField
        type={type}
        name={name}
        label={placeholder}
        placeholder={placeholder}
        variant="outlined"
        margin="dense"
        value={value}
        onChange={onChange}
        defaultValue={0}
      />
    );
  }
  return null;
};

type SettingsProps = {
  open: boolean;
  handleSettingClick: () => void;
  data: Data;
  setData: (value: Data) => void;
}

const Settings: React.SFC<SettingsProps> = (props) => {
  const {
    open, handleSettingClick, data, setData,
  } = props;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  function handleChangeInput(event: React.ChangeEvent<HTMLInputElement>): void {
    const { currentTarget, target } = event;
    const name: string = currentTarget.getAttribute('name') || '';
    const value: number = parseFloat(target.value);
    let temp: Data = { ...data };
    if (name === 'hours') {
      if (value < 0) {
        temp = { ...data };
      } else {
        temp = {
          ...data,
          [name]: value,
        };
      }
    } else if (name !== 'hours') {
      if (value > 59 || value < 0) {
        temp = { ...data };
      } else {
        temp = {
          ...data,
          [name]: value,
        };
      }
    } if (name === 'loopSound') {
      if (value > 59 || value < 1) {
        temp = { ...data };
      } else {
        temp = {
          ...data,
          [name]: value,
        };
      }
    }
    setData(temp);
    window.localStorage.setItem('data', JSON.stringify(temp));
  }

  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, [window.innerWidth]);

  function handleSwitchChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { target } = event;
    const { value, checked } = target;
    const temp: Data = { ...data, [value]: checked };
    setData(temp);
    window.localStorage.setItem('data', JSON.stringify(temp));
  }


  return (
    <div
      className="setting-container"
      style={{
        visibility: (open) ? 'visible' : 'hidden',
      }}
    >
      <div
        className="settings-overlay"
        onClick={handleSettingClick}
        style={{
          transform: (!open) ? `translateX(${windowWidth}px)` : 'translate(0)',
          transition: '0.5s ease',
        }}
      >
        &nbsp;
      </div>
      <div
        className="settings-container"
        style={{
          transform: (!open) ? `translateX(${windowWidth / 2}px)` : 'translate(0)',
          transition: '0.5s ease',
        }}
      >
        <div
          className="settings-header"
          style={{
            opacity: (open) ? 1 : 0,
            visibility: (open) ? 'visible' : 'hidden',
            transition: 'visibility 0.2s linear, opacity 0.5s ease-in',
          }}
        >
          <Typography className="settings-title">Settings</Typography>
          <Divider/>
        </div>
        <div
          className="settings-content"
          style={{
            opacity: (open) ? 1 : 0,
            visibility: (open) ? 'visible' : 'hidden',
            transition: 'visibility 0.2s linear, opacity 0.5s ease-in',
          }}
        >
          <Typography className="settings-content-text">Set Timer</Typography>
           <Grid container style={{ marginBottom: 10, padding: 16 }}>
            <Grid item xs={3} md={3} lg={3} style={{ margin: '0 5px' }}>
              <CustomTextField
                name="hours"
                placeholder="Hours"
                type="number"
                value={data.hours}
                onChange={handleChangeInput}
              />
            </Grid>
            <Grid item xs={3} md={3} lg={3} style={{ margin: '0 5px' }}>
              <CustomTextField
                name="minutes"
                placeholder="Minutes"
                type="number"
                value={data.minutes}
                onChange={handleChangeInput}
              />
            </Grid>
            <Grid item xs={3} md={3} lg={3} style={{ margin: '0 5px' }}>
              <CustomTextField
                name="seconds"
                placeholder="Seconds"
                type="number"
                value={data.seconds}
                onChange={handleChangeInput}
              />
            </Grid>
          </Grid>
          <Typography className="settings-content-text">
            Sound
          </Typography>
          <Grid container style={{ marginBottom: 10, padding: 16 }}>
            <Grid container>
              <Grid item xs={6} md={6} lg={6} style={{ display: 'flex', alignItems: 'center' }}>
                <Typography className="settings-content-text">
                  Play Sound
                </Typography>
              </Grid>
              <Grid item xs={6} md={6} lg={6} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <IOSSwitch
                  checked={data.playSound === true}
                  onChange={handleSwitchChange}
                  value="playSound"
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography className="settings-content-text">
                  Play Every
                </Typography>
                <div style={{ width: 65, margin: '0 10px' }}>
                  <CustomTextField
                    name="loopSound"
                    type="number"
                    value={data.loopSound}
                    onChange={handleChangeInput}
                  />
                </div>
                <Typography className="settings-content-text">
                  minutes
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const currentWindow = remote.getCurrentWindow();
  const [data, setData] = useState({ playSound: true, loopSound: 10 });
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(hours * 3600 + minutes * 60 + seconds);
  const [timeRemainingToBell, setTimeRemainingToBell] = useState(data.loopSound * 60);
  const [currentFocus, setCurrentFocus] = useState('play');
  const [fullscreen, setFullScreen] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const [mouseHoverActionButton, setMouseHoverActionButton] = useState(false);

  const intervalId: any = useRef();

  const savedData = window.localStorage.getItem('data') || null;

  useEffect(() => {
    currentWindow.setBackgroundColor('#000');
  }, []);

  function handleHideButtonAndCursor(target: Element, params: boolean): void {
    if (params) {
      setHideButton(true);
      target.classList.add('hide-cursor');
    } else {
      target.classList.remove('hide-cursor');
      setHideButton(false);
    }
  }

  useEffect(() => {
    const container: any = document.querySelector('.container');
    function hide(): void { handleHideButtonAndCursor(container, true); }
    function unHide(): void { handleHideButtonAndCursor(container, false); }
    if (!openSettings && !mouseHoverActionButton) {
      container.addEventListener('mousestop', hide, true);
      container.addEventListener('mousemove', unHide, true);
    }
    return ((): void => {
      container.removeEventListener('mousestop', hide, true);
      container.removeEventListener('mousemove', unHide, true);
    });
  }, [openSettings, mouseHoverActionButton]);

  useEffect(() => {
    if (savedData !== null) {
      const hour = JSON.parse(savedData).hours;
      const minute = JSON.parse(savedData).minutes;
      const second = JSON.parse(savedData).seconds;
      const { loopSound } = JSON.parse(savedData);
      setData({ ...data, ...JSON.parse(savedData) });
      setHours(hour);
      setMinutes(minute);
      setSeconds(second);
      setTimeRemainingToBell(loopSound * 60);
      setTimeRemaining(hour * 3600 + minute * 60 + second);
    } else {
      const temp: Data = {
        ...data, hours: 0, minutes: 0, seconds: 0,
      };
      setData(temp);
      window.localStorage.setItem('data', JSON.stringify(temp));
    }
  }, [savedData]);

  function stopTimer(): void {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      setCurrentFocus('play');
    }
  }

  function ringTheBell(params: string, to?: number): void {
    const target = document.getElementById(params);
    if (target !== null) {
      if (to) {
        (target as HTMLAudioElement).currentTime = to;
      } else {
        (target as HTMLAudioElement).currentTime = 0;
      }
      (target as HTMLAudioElement).play();
    }
  }

  function startTimer(): void{
    let time = timeRemaining;
    let timeToBell = timeRemainingToBell;
    let hour = Math.floor(timeRemaining / 3600);
    let minute = hour * 60 - Math.floor(timeRemaining / 60);
    let second = timeRemaining - hour * 3600 - minute * 60;
    const i = 10;

    intervalId.current = setInterval(() => {
      time -= 1;
      timeToBell -= 1;
      hour = Math.floor(time / 3600);
      minute = Math.floor(time / 60) - hour * 60;
      second = time - hour * 3600 - minute * 60;
      setTimeRemaining(time);
      setTimeRemainingToBell(timeToBell);
      setSeconds(second);
      setMinutes(minute);
      setHours(hour);
      ringTheBell('tick');
      if (time === 0) {
        stopTimer();
        ringTheBell('end-bell');
      } else if (time <= 10) {
        ringTheBell('countdown', i - time);
        ringTheBell('alert');
      }

      if (time === 22) {
        ringTheBell('continuos-tick');
      }

      if (timeToBell === 0) {
        ringTheBell('bell');
        if (time !== 0) {
          timeToBell = timeRemainingToBell;
        }
      }
    }, 1000);
  }

  function handlePlayButton(): void {
    if (currentFocus === 'play') {
      startTimer();
      setCurrentFocus('pause');
      ringTheBell('bell');
    } else {
      stopTimer();
      setCurrentFocus('play');
      const audioArr = document.getElementsByTagName('audio');
      for (let i = 0; i < audioArr.length; i += 1) {
        const target = document.getElementById(audioArr[i].id);
        (target as HTMLAudioElement).currentTime = 0;
      }
    }
  }

  function handleStopButtonClick(): void {
    stopTimer();
    setCurrentFocus('play');
    if (savedData !== null) {
      const hour = JSON.parse(savedData).hours;
      const minute = JSON.parse(savedData).minutes;
      const second = JSON.parse(savedData).seconds;
      const { loopSound } = JSON.parse(savedData);
      setHours(hour);
      setMinutes(minute);
      setSeconds(second);
      setTimeRemainingToBell(loopSound * 60);
      setTimeRemaining(hour * 3600 + minute * 60 + second);
    }
  }

  function handleFullscreenButtonClick(): void {
    setFullScreen(!fullscreen);
    currentWindow.setFullScreen(fullscreen);
  }

  function handleSettingClick(): void {
    const timerElement = document.querySelector('.timer-container');
    const buttonElement = document.querySelector('.action-button');
    setOpenSettings(!openSettings);
    if (timerElement !== null && buttonElement !== null) {
      if (!openSettings) {
        timerElement.className += ' blurry';
        buttonElement.className += ' blurry';
      } else {
        timerElement.className += 'timer-container';
        buttonElement.className += 'action-button';
      }
    }
  }

  return (
    <>
      <audio
        src="audio/bell.mp3"
        id="bell"
        muted={!data.playSound}
        hidden
      />
      <audio
        src="audio/countdown.mp3"
        id="countdown"
        muted={!data.playSound || currentFocus === 'play'}
        hidden
      />
      <audio
        src="audio/continuos-tick.mp3"
        id="continuos-tick"
        muted={!data.playSound || currentFocus === 'play'}
        hidden
      />
      <audio
        src="audio/tick.wav"
        id="tick"
        muted={!data.playSound || currentFocus === 'play'}
        hidden
      />
      <audio
        src="audio/alert.mp3"
        id="alert"
        muted={!data.playSound || currentFocus === 'play'}
        hidden
      />
      <audio
        src="audio/end-bell.mp3"
        id="end-bell"
        muted={!data.playSound || currentFocus === 'pause'}
        hidden
      />
      <Settings
        open={openSettings}
        handleSettingClick={handleSettingClick}
        data={data}
        setData={setData}
      />
      <Grid
        container
        className="container"
      >
        <IconButton
          className="settings-btn"
          title="Settings"
          style={{
            border: 'none',
            opacity: (currentFocus !== 'play' || hideButton) ? 0 : 1,
            transform: (openSettings) ? 'rotate(1turn)' : 'rotate(0.5turn)',
            transition: '0.5s',
            color: (openSettings) ? 'black' : 'white',
          }}
          onClick={handleSettingClick}
        >
          {(!openSettings)
            ? <SettingsIcon style={{ fontSize: 20 }}/>
            : <ArrowBackIcon style={{ fontSize: 20 }}/>
          }
        </IconButton>
        <div className='timer-container'>
          <Typography
            align="center"
            className="timer-text"
          >
            {`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
          </Typography>
        </div>
        <div
          className='action-button'
          onMouseEnter={(): void => setMouseHoverActionButton(true)}
          onMouseLeave={(): void => setMouseHoverActionButton(false)}
          style={{
            transform: (hideButton) ? 'translateY(130px)' : 'translateY(0px)',
            transition: '0.5s ease',
          }}
        >
          <IconButton
            className="icon-btn"
            onClick={handleStopButtonClick}
            title="Stop"
          >
            <StopIcon style={{ fontSize: 30, color: 'white' }}/>
          </IconButton>
          <IconButton
            disabled={hours === 0 && minutes === 0 && seconds === 0}
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
    </>
  );
};

export default App;
