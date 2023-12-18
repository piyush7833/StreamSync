import { config } from '../shared';

const logger = (msg: any) => {
  if (config.DEV || config.TEST) {
    console.log("message",msg);
  }
  else{
    console.log("message 2",msg);
  }
}

export default logger;