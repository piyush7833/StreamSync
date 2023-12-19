import * as React from 'react';
import Fab from '@material-ui/core/Fab';
import './ActionButtons.css';
import Grid from '@material-ui/core/Grid';
import VolumeDown from '@material-ui/icons/VolumeDown';
import FullscreenSharpIcon from '@material-ui/icons/FullscreenSharp';
import FullscreenExitSharpIcon from '@material-ui/icons/FullscreenExitSharp';
import CallEndSharpIcon from '@material-ui/icons/CallEndSharp';
import Slider from '@material-ui/core/Slider';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Tooltip from '@material-ui/core/Tooltip';
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import PictureInPictureIcon from '@mui/icons-material/PictureInPicture';
import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
const { useState, useEffect, useCallback } = React;

const useStyles = makeStyles({
  root: {
    width: 200,
  },
});

interface ActionProps {
  shareVideoRef: React.RefObject<HTMLVideoElement>,
  handleShareScreen: () => Promise<void>,
  handleRoomID: () => void,
  handleEndCall: () => void,
}

export const ActionButtons = (props: ActionProps) => {
  const {
    shareVideoRef,
    handleShareScreen,
    handleRoomID,
    handleEndCall
  } = props;
  const classes = useStyles();
  const [value, setValue] = useState<number>(process.env.NODE_ENV === 'development' ? 0 : 0.2);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [pipScreen, setPipScreen] = useState<boolean>(false);
  const fullScreenCallback = useCallback(() => {
    if (document.pictureInPictureElement) {
      setFullScreen(true);
    }
    else {
      setFullScreen(false);
    }
  }, [])
  const pipScreenCallback = useCallback(() => {
    if (document.fullscreenElement) {
      setPipScreen(true);
    }
    else {
      setPipScreen(false);
    }
  }, [])

  useEffect(() => {
    document.addEventListener('fullscreenchange', fullScreenCallback);

    return () => document.removeEventListener('fullscreenchange', fullScreenCallback);
  }, [fullScreenCallback]);

  useEffect(() => {
    document.addEventListener('pipscreenchange', pipScreenCallback);
    return () => document.removeEventListener('pipscreenchange', pipScreenCallback);
  }, [pipScreenCallback]);

  const handleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setFullScreen(false);
    }
    else {
      document.documentElement.requestFullscreen();
      console.log(document)
      setFullScreen(true);
    }
  }
  const handlePip=async()=>{
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
      console.log("first")
      setPipScreen(false);
    }
    else if (shareVideoRef.current!) {
      await shareVideoRef.current.requestPictureInPicture();
      console.log("second")
      setPipScreen(true);
    }
  }
  
  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number);
    if (shareVideoRef.current) {
      shareVideoRef.current.volume = newValue as number;
    }
  };

  return (
    <div id='actionContainer'>
      <Grid container spacing={2} justify='center' alignContent='center' alignItems='center'>
        <Grid item>
          <Tooltip title='End Call' placement='top'>
            <Fab aria-label='room_id' onClick={handleEndCall} color='secondary'><CallEndSharpIcon /></Fab>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title='Copy Call ID' placement='top'>
            <Fab aria-label='room_id' onClick={handleRoomID}><ContentCopyIcon/></Fab>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title='Share Screen' placement='top'>
            <Fab aria-label='share' onClick={handleShareScreen}><PresentToAllIcon /></Fab>
          </Tooltip>
        </Grid>
        {shareVideoRef.current?<Grid item>
          <Tooltip title='Pip screen' placement='top'>
            <Fab aria-label='pip' onClick={handlePip}>{pipScreen?<PictureInPictureIcon />:<PictureInPictureAltIcon/>}</Fab>
          </Tooltip>
        </Grid>:""}
        <Grid item id='fullScreenIcon'>
          <Tooltip title='' placement='top' >
            
            <Fab aria-label='pip' onClick={handleFullScreen}>{
              fullScreen
              ? <FullscreenExitSharpIcon />
              : <FullscreenSharpIcon />
            }</Fab>
          </Tooltip>
        </Grid>
        {shareVideoRef.current?<Grid item>
          <Tooltip title='Volume' placement='top'>
            <VolumeDown />
          </Tooltip>
        </Grid>:""}
        {shareVideoRef.current?<Grid item className={classes.root}>
          <Slider value={value} onChange={handleChange} aria-labelledby="continuous-slider" min={0} max={1} step={0.1}/>
        </Grid>:""}
      </Grid>
    </div>
  )
}