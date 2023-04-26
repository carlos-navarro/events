<script>
  import { addCalendarEntry, downloadCalendar } from './utils/calendarEvent';

  export let allData;
  let title, sessionDate, start, end, abstract, authors, tags, track, recordingLink, sessionLink;

  $: {
    if (allData) {
      title = allData.title;
      sessionDate = allData.start.toLocaleDateString();
      start = allData.start.toLocaleTimeString().substring(0, 5);
      end = allData.end.toLocaleTimeString().substring(0, 5);
      if (allData.other) {
        ({ authors, tags, track, abstract, recordingLink, sessionLink } = allData.other);
      } else {
        authors = null;
        abstract = null;
        tags = [];
        track = [];
      }
    } else {
      title = null;
      sessionDate = null;
      start = null;
      end = null;
      authors = null;
      abstract = null;
      tags = [];
      track = [];
    }
  }
</script>

<article>
  <header>
    <div class="row">
      <p class="col date">
        <i class="far fa-calendar-alt" />
        <span>{sessionDate}</span>
        -
        <i class="far fa-clock" />
        from
        <span>{start}</span>
        to
        <span> {end}</span>
      </p>
    </div>
    <h2>{title}</h2>
    <div class="row">
      <div class="col authors">
        — {authors}
      </div>
    </div>
  </header>
  {#if abstract}
    <div class="row">
      <div class="col abstract">
        {@html abstract.replace(/(?:\r\n|\r|\n)/g, '<br/>')}
      </div>
    </div>
  {/if}
  <div class="row scope">
    <div class="col tags">
      <span class="title">Tags:</span>
      <span class="value"> {tags.join(', ')}</span>
    </div>
    {#if track}
      <div class="col audience">
        <span class="title">Track:</span>
        <span class="value"> {track.join(', ')}</span>
      </div>
    {/if}
  </div>
  <footer class="modal-footer">
    <div class="col">
      <button
        disabled={allData.other.recordingLink}
        type="button"
        class="btn btn-outline-primary"
        on:click={addCalendarEntry(allData)}
      >
        <i class="fa fa-calendar-day" />
        Import to your Outlook calendar</button
      >
      <button
        disabled={allData.other.recordingLink}
        type="button"
        class="btn btn-outline-primary"
        on:click={downloadCalendar(allData)}
      >
        <i class="fa fa-calendar-day" />
        Download .ics Outlook calendar file</button
      >
    </div>
    <p class="join">
      {#if allData.other.recordingLink != undefined}
        <a href={recordingLink} target="_blank" rel="noreferrer noopener">Link to recording</a>
      {/if}
      {#if allData.other.sessionLink != undefined}
        <a href={sessionLink} target="_blank"  rel="noreferrer noopener">Link to session</a>
      {/if}
    </p>
  </footer>
</article>

<style>
  article {
    padding: 1em;
  }
  .date {
    margin-bottom: 0.5em;
    color: var(--bs-gray-700);
  }
  .date span {
    font-weight: bold;
  }
  h2 {
    font-size: 1.4em;
    margin: 1em 0 0;
  }
  .authors {
    font-style: italic;
    margin-bottom: 1.5em;
    color: #333;
  }
  .abstract {
    font-weight: 300;
    margin-bottom: 3em;
    font-size: 0.9em;
  }
  .scope {
    font-size: 0.9em;
  }
  .audience .value,
  .tags .value {
    font-weight: bold;
  }
  .modal-footer {
    margin-top: 1em;
    padding: 1em 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .join {
    font-weight: bolder;
    font-size: 110%;
  }
</style>
