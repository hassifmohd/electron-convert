const electron = require("electron");
const {
  app,
  BrowserWindow,
  ipcMain
} = electron;
const ffmpeg = require('fluent-ffmpeg');
const _ = require('lodash');

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      backgroundThrottling: false
    }
  });

  mainWindow.loadURL(`file://${__dirname}/src/index.html`);
});

//GET LIST OF VIDEOS, CONVERT THEM ACCORDING TO FORMAT REQUESTED
ipcMain.on('conversion:start', (event, videos) => {

  //example convert single file only
  console.log('SOMETHING HAPPEN');
  // const video = videos[0];
  // console.log(video.path);
  // console.log(video.name);
  // console.log(video.path.split(video.name)[0]);

  // ffmpeg(video.path)
  //   .output(() => {
  //
  //   });
});

//GET LIST OF VIDEOS, RETURN VIDEO DURATION AND WHAT TYPE OF FORMAT YOU WANT TO CONVERT
ipcMain.on('videos:added', (event, videos) => {

  // console.log(videos); //check out the videos data

  //example using single promise and single video
  //we are using promise to handle async process
  // const promise = new Promise((resolve, reject) => {
  //   ffmpeg.ffprobe(videos[0].path, (err, metaData) => {
  //     resolve(metaData);
  //   });
  // });
  // promise.then((metaData) => {
  //   console.log(metaData); //check out the metadata
  // });

  //example using lodash.map for promise and videos
  const promises = _.map(videos, video => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(video.path, (err, metaData) => {

        // resolve(metaData);

        //to take data that only use
        video.duration = metaData.format.duration;
        video.format = 'avi';
        resolve(video);
      });
    });
  });

  //for multiple promises we use Promise.all.then
  Promise.all(promises).then((results => {
    // console.log(results); //checkout the data
    mainWindow.webContents.send('metadata:complete', results);
  }));
});
