
import { ICalendar } from 'datebook';

const listIsEmpty = list => !list.length;

const sanitizeCalendarEventName = sessionName =>
  sessionName
    .replace(/[^a-z0-9 \-_]+/gi, '')
    .replace(/[_ ]+/gi, '-')
    .toLowerCase();

const sanitizeCalendarEventDate = eventDate => {
  const year = ('0000' + eventDate.getFullYear().toString()).slice(-4);
  const month = ('00' + (eventDate.getMonth() + 1).toString()).slice(-2);
  const day = ('00' + eventDate.getDate().toString()).slice(-2);
  return `${year}_${month}_${day}`;
};

const getOutlookDateString = eventDate => new Date(eventDate).toISOString();

const getHTMLDescription = calendarEvent =>
  htmlEntitySanitizer(getSanitizedDescription(calendarEvent).replaceAll('\n', '<br>'));

const stripHTMLinDescription = calendarEvent => {
  const tmp = document.implementation.createHTMLDocument("New").body;
  tmp.innerHTML = calendarEvent;
  return tmp.textContent || tmp.innerText || '';
}

const getCalendarInviteFilename = calendarEvent => {
  let filename = 'New event.ics';
  if (calendarEvent.title) {
    filename = sanitizeCalendarEventName(calendarEvent.title) + '.ics';
  }
  if (calendarEvent.start) {
    filename = sanitizeCalendarEventDate(calendarEvent.start) + '_' + filename;
  }
  return filename;
};

const getSanitizedDescription = calendarEvent => {
  const link = calendarEvent.other?.link &&
  `<br><p><strong>Link to connect: </strong><a href=${calendarEvent.other.link}>${calendarEvent.other.link}</a></p>\n\n`;
  const authors = calendarEvent.other &&
  `<p><strong>Authors: </strong>${calendarEvent.other.authors}</p>\n`;
  const abstract = calendarEvent.other.abstract && calendarEvent.other.abstract.length &&
  `<p><strong>Abstract:</strong></p><p><em>${calendarEvent.other.abstract}</em></p>\n`;
  const tags = calendarEvent.other.tags && calendarEvent.other.tags.length &&
  `<p><strong>Tags: </strong>${calendarEvent.other.tags.join(', ')}</p>\n\n`;

  return [link, authors, abstract, tags].filter(a => a).join(' ');
};

const getCalendarInvite = calendarEvent => {
  const calendarInvite = new ICalendar({
    title: calendarEvent.title,
    location: 'MS Teams',
    description: stripHTMLinDescription(getSanitizedDescription(calendarEvent)),
    start: calendarEvent.start,
    end: calendarEvent.end
  });
  calendarInvite.addAlarm({
    action: 'DISPLAY',
    trigger: {
      minutes: 5
    }
  });
  return calendarInvite;
};

const openCalendarOutlook = (calendarEvent) => {
  const baseURL = "https://outlook.office.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent";
  const url = encodeURI(baseURL + "&startdt=" + getOutlookDateString(calendarEvent.start) +
              "&enddt=" + getOutlookDateString(calendarEvent.end) +
              "&subject=" + htmlEntitySanitizer(calendarEvent.title) +
              "&location=See link below" +
              "&body=" + getHTMLDescription(calendarEvent) +
              "&allday=");

  window.open(url, '_blank');  
}

const htmlEntitySanitizer = (text) => text.replace(/&/gim, '%26');

export const addCalendarEntry = (calendarEvent) => openCalendarOutlook(calendarEvent);
  
export const downloadCalendar = calendarEvent =>
  getCalendarInvite(calendarEvent).download(getCalendarInviteFilename(calendarEvent));

const listsOfElementsHaveOneInCommon = (listA, listB) =>
  listA.some(element => listB.includes(element));

const eventTagsMatchTagList = (calendarEvent, tagList) =>
  listIsEmpty(tagList) ||
  listsOfElementsHaveOneInCommon(calendarEvent.extendedProps.tags, tagList);

const eventTargetAudiencesMatchTargetAudienceList = (calendarEvent, targetAudienceList) =>
  listIsEmpty(targetAudienceList) ||
  listsOfElementsHaveOneInCommon(calendarEvent.extendedProps.track, targetAudienceList);

export const filterEvents = (calendarEvents, tagFilterValues, targetAudienceFilterValues) => {
  calendarEvents.forEach(calendarEvent => {
    let visibility = 'auto';
    if (
      !eventTagsMatchTagList(calendarEvent, tagFilterValues) ||
      !eventTargetAudiencesMatchTargetAudienceList(calendarEvent, targetAudienceFilterValues)
    ) {
      visibility = 'none';
    }
    calendarEvent.setProp('display', visibility);
  });
};
