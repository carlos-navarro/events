<script>
  import { getContext } from 'svelte';
  import Surprise from './Surprise.svelte';
  export let info, showModal;

  const { open } = getContext('simple-modal');

  $: {
    if (showModal) open(Surprise, { allData: info });
  }
</script>
