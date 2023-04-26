<script>
  import FullCalendar from 'svelte-fullcalendar';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import listPlugin from '@fullcalendar/list';
  import Modal from 'svelte-simple-modal';

  import Content from './Content.svelte';
  import Filter from './Filter.svelte';

  import { getTimeGridOptions, getDayGridOptions } from './config/config.fullcalendar';
  import { summitData, summitCfg } from './config/summits';

  import {
    getAllTracks,
    getAllTags,
    getYearEvent,
    getCurrentSummit
  } from './utils';
  import { filterEvents } from './utils/calendarEvent';

  const summit = getCurrentSummit(summitCfg);

  let calendarRef;
  let infoModal = {};
  let showModal = false;
  let tagFilterValues = [];
  let targetAudienceFilterValues = [];

  const calendarApi = () => calendarRef.getAPI();

  // Hex colors from env file (converted to hex from bootstrap palette)
  const colors = summit.color.split(',') || ['#dc3545', '#fd7e14', '#ffc107'];

  const summitGradient = `background: linear-gradient(
      90deg,
      ${colors[0]},
      ${colors[1]},
      ${colors[2]}
    );
    color: ${summit.textColor}`;

  const sessionsWithColor = summitData[summit.summit].map(session => ({
    ...session,
    color: colors[Number(session.header_id) - 1]
  }));

  const sessions = sessionsWithColor;

  const yearSummit = getYearEvent(sessions);

  const allTracks = getAllTracks(sessions);
  const allTags = getAllTags(sessions);

  const eventClick = info => {
    infoModal = {
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      other: info.event.extendedProps
    };
    showModal = true;
  };

  const options = (() => {
    switch (summit.calendar) {
      case 'day-grid': return getDayGridOptions(
        [dayGridPlugin, listPlugin],
        sessions,
        eventClick,
        sessions,
        summit.textColor
      );
      default: return getTimeGridOptions(
        [timeGridPlugin],
        sessions,
        eventClick,
        sessions,
        summit.textColor
      );
    }
  })();

  const handleChange = () => {
    calendarApi().batchRendering(function () {
      filterEvents(calendarApi().getEvents(), tagFilterValues, targetAudienceFilterValues);
    });
  };
</script>

<main class="container-fluid">
  <header class="title">
    <h1 style={summitGradient}>
      <span>Agenda: {summit.title}</span>
    </h1>
  </header>
  <section class="row content">
    <aside class="col-sm-auto filters">
      <h3>Filter by:</h3>
      <form>
        <Filter title="Tags" elements={allTags} bind:values={tagFilterValues} {handleChange} />
        {#if allTracks.length}
          <Filter
            title="Track"
            elements={allTracks}
            bind:values={targetAudienceFilterValues}
            {handleChange}
          />
        {/if}
      </form>
    </aside>
    <article class="col">
      <FullCalendar bind:this={calendarRef} {options} />
      <Modal>
        <Content bind:info={infoModal} {showModal} />
      </Modal>
    </article>
  </section>
</main>

<style>
  main {
    display: flex;
    flex-flow: column;
    height: 100%;
  }
  .title {
    flex: 0 1 auto;
  }
  h1 {
    margin: 0.3em 0 0.5em 0;
    padding: 0.5em;
    color: var(--bs-white);
    background: linear-gradient(90deg, var(--bs-indigo), var(--bs-blue), var(--bs-pink));
    border-radius: 12px;
  }
  .title h1 span {
    text-transform: capitalize;
  }

  .content {
    flex: 1 1 auto;
  }
  h3 {
    font-size: 1.4em;
  }
  .filters {
    margin-left: 12px;
    background-color: var(--bs-gray-200);
    padding: 1em;
    border-radius: 12px;
    box-shadow: 6px 6px 5px 0 rgb(0 0 0 / 25%);
  }
</style>
