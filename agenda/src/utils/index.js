import { addDays, differenceInDays, differenceInMinutes, format } from 'date-fns';

const END_TIME = true;
let firstDay = null;
let lastDay = null;
let earliestTime = null;
let latestTime = null;

export const getAllTags = sessions => {
  let uniqueDictTags = {};
  sessions.forEach(session => session.tags.forEach(tag => (uniqueDictTags[tag] = 1)));
  return Object.keys(uniqueDictTags).sort();
};

export const getAllTracks = sessions => {
  let uniqueDictTrack = {};
  sessions.forEach(session => {
    if (session.track) {
      session.track.forEach(ta => (uniqueDictTrack[ta] = 1));
    }
  });
  return Object.keys(uniqueDictTrack);
};

const getFirstDay = sessions => {
  if (!sessions?.length) return null;
  if (!firstDay) {
    firstDay = sessions.reduce((currentDay, session) => {
      const sessionStart = new Date(session.start);
      return sessionStart < currentDay ? sessionStart : currentDay;
    }, new Date(sessions[0].start));
  }
  return firstDay;
};

const getLastDay = sessions => {
  if (!sessions?.length) return null;
  if (!lastDay) {
    lastDay = sessions.reduce((currentDay, session) => {
      const sessionEnd = new Date(session.end);
      return sessionEnd > currentDay ? sessionEnd : currentDay;
    }, new Date(sessions[0].end));
  }
  return lastDay;
};

const getEarliestTime = sessions => {
  if (!sessions.length) return '00:00:00';
  if (!earliestTime) {
    let currentTime = '23:59:59';
    sessions.forEach(session => {
      const sessionStartTime = getSessionTime(new Date(session.start));
      if (sessionStartTime === '00:00:00') {
        currentTime = sessionStartTime;
        return false;
      }
      if (differenceInMinutesBetweenTimes(currentTime, sessionStartTime) > 0) {
        currentTime = sessionStartTime;
      }
    });
    earliestTime = currentTime;
  }
  return earliestTime;
};

const getLatestTime = sessions => {
  if (!sessions.length) return '24:00:00';
  if (!latestTime) {
    let currentTime = '00:00:00';
    sessions.forEach(session => {
      const sessionEndTime = getSessionTime(new Date(session.end), END_TIME);
      if (sessionEndTime === '24:00:00') {
        currentTime = sessionEndTime;
        return false;
      }
      if (differenceInMinutesBetweenTimes(currentTime, sessionEndTime) < 0) {
        currentTime = sessionEndTime;
      }
    });
    latestTime = currentTime;
  }
  return latestTime;
};

export const getYearEvent = sessions => getFirstDay(sessions).getFullYear().toString();

const getOnlyDate = sessionDate => format(sessionDate, 'yyyy-MM-dd');

export const getDatesToCalendarOptions = sessions => {
  const eventStart = getOnlyDate(getFirstDay(sessions));
  const dayAfterLastDay = addDays(getLastDay(sessions), 1);
  const eventEnd = getOnlyDate(dayAfterLastDay);
  const sessionsDurationInDays = differenceInDays(new Date(eventEnd), new Date(eventStart));
  const earliestTime = getEarliestTime(sessions);
  const latestTime = getLatestTime(sessions);

  return {
    eventStart,
    eventEnd,
    sessionsDurationInDays,
    earliestTime,
    latestTime
  };
};

const getSessionTime = (sessionDate, isEndTime = false) => {
  let sessionTime = format(sessionDate, 'HH:mm:ss');
  if (isEndTime && sessionTime === '00:00:00') {
    sessionTime = '24:00:00';
  }
  return sessionTime;
};

const differenceInMinutesBetweenTimes = (timeOne, timeTwo) =>
  timeOne === timeTwo
    ? 0
    : differenceInMinutes(new Date('1980-03-04T' + timeOne), new Date('1980-03-04T' + timeTwo));

export const getCurrentSummit = summits => {
  let summit = summits.find(element => {
    return window.location.pathname.includes(`/${element.path}/`);
  });
  return summit;
};
