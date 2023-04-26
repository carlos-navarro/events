import { getDatesToCalendarOptions } from '../utils';

export const getTimeGridOptions = (
  plugins,
  sessions,
  eventClickCallback,
  sessionsData,
  color = '#ffffff'
) => {
  const { earliestTime, latestTime, eventStart, eventEnd, sessionsDurationInDays } =
    getDatesToCalendarOptions(sessionsData);

  return {
    expandRows: true,
    headerToolbar: {
      start: 'title',
      center: 'timeGridDay,timeGridAllEvent',
      end: 'today prev,next'
    },
    plugins: plugins,
    initialView: 'timeGridAllEvent',
    views: {
      timeGridAllEvent: {
        type: 'timeGrid',
        duration: { days: sessionsDurationInDays },
        buttonText: 'full event'
      }
    },
    slotMinTime: earliestTime,
    slotMaxTime: latestTime,
    nowIndicator: true,
    allDaySlot: false,
    initialDate: eventStart,
    validRange: {
      start: eventStart,
      end: eventEnd
    },
    events: sessions,
    eventTextColor: color,
    eventOrder: 'track',
    eventClick: eventClickCallback,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      meridiem: true
    },
    displayEventEnd: false,
    themeSystem: 'bootstrap',
  };
};

export const getDayGridOptions = (
  plugins,
  sessions,
  eventClickCallback,
  sessionsData,
  color = '#ffffff'
) => {
  const { earliestTime, latestTime, eventStart, eventEnd, sessionsDurationInDays } =
    getDatesToCalendarOptions(sessionsData);

  return {
    headerToolbar: {
      start: 'title',
      center: 'listMonth,listYear', //dayGridMonth
      end: 'today prev,next'
    },
    plugins: plugins,
    initialView: 'listYear',
    views: {
      dayGridMonth: {
        buttonText: 'Month View'
      },
      listMonth: {
        buttonText: 'Month List'
      },
      listYear: {
        buttonText: 'Year List'
      }
    },
    events: sessions,
    eventTextColor: color,
    eventOrder: 'track',
    eventClick: eventClickCallback,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      meridiem: true
    },
    displayEventEnd: false,
    themeSystem: 'bootstrap',
  };
};
