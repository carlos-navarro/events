# AXA GO Engineering Events Agenda

Testing filters

List of sessions available during our Summits and other initiatives.

Now 5 pages are published:

- [Index page](https://pages.github.axa.com/axa-go-engineering/events-agenda/) with links to the available agendas

- [Data Science Summit 2022 Agenda](https://pages.github.axa.com/axa-go-engineering/events-agenda/data-science-summit-2022/)

- [Engineering Summit 2022 Agenda)](https://pages.github.axa.com/axa-go-engineering/events-agenda/engineering-summit-2022/) 

- [Engineering Summit Agenda (Current: 2023)](https://pages.github.axa.com/axa-go-engineering/events-agenda/engineering-summit/) 

- [Learning Thursdays Agenda](https://pages.github.axa.com/axa-go-engineering/events-agenda/learning-thursdays/)

## Getting started

Clone the repository, then go to the main directory `events-agenda` and install the dependencies.

```bash
cd events-agenda
npm install
```

To start the development:

```bash
npm run dev
```

Navigate to [localhost:8080](http://localhost:8080/). 
You should see the content of `events-agenda/public/index.html` in your browser. 
Just click in any of the links to go to the specific agenda.

This project is build using Svelte as a framework for the client and Rollup for bundling the files. We recommend you to install the official exensions in your IDE to foster your development.

If you're using [Visual Studio Code](https://code.visualstudio.com/) we recommend you installing [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode). If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

## Updating the session list

Sessions are listed in `src/config/summits.js`.
There is one file per summit (`<summit>-summit-<year>.js`) or other events (e.g. `learning-thursdays.js`)

```js
{
    "header_id": "1",
    "color": "#2F57F5",
    "start": "2021-11-16T09:30:00+01:00",
    "end": "2021-11-16T10:00:00+01:00",
    "title": "Opening - Data-Science Summit'21",
    "authors": "Marcin Detyniecki + Summit team",
    "other": {
        "abstract": ""
    },
    "tags": [
        "Keynote"
    ],
    "target_audience": [
        "All"
    ],
    "link":"https://tbc+day1"
},
```

A bit of explaination:

* `header_id`: Identifier for the day of the event. "1" for day one, etc.
* `start`: Date and time when the event starts (ISO8601). Don't miss the timezone!
* `end`: Date and time when the event ends (ISO8601). Don't miss the timezone!
* `title`: Title of the session
* `authors`: list of authors, entity in parenthesis.
* `abstract`: Abstract of the session (optional)
* `tags`: array of tags for the session
* `track`: array with the literal of the track. i.e. track: ["Track A"]
* `link`: link to Teams invite for the day (optionnal)

More info: <https://fullcalendar.io/docs/events-json-feed>

If you modify this file, make sure you will run `npm run dev` to publish locally the change before publish in gh-pages.

## Deploying to the GitHub page

Once you are happy with the content of the agenda, just run:

```bash
npm run build
git commit add docs
git commit -m "chore: publish a new version with...."
git push
```

We use conventional commits to add code to our projects.

## Contributions

If you want to contribute with some improvement, fix or addition, just, open a Pull Request with it. If you consider the change needs some explanation attach it to an issue to explain the reasons please.

## Note

This is a project template for [Svelte](https://svelte.dev) apps. It lives at <https://github.com/sveltejs/template>.

This project has been created using [degit](https://github.com/Rich-Harris/degit)
