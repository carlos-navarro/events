<script>
  export let title;
  export let elements;
  export let values;
  export let handleChange;
</script>

<h4 class="filter-title">{title}</h4>
<fieldset>
  {#each elements as filter}
    <div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        id={filter}
        value={filter}
        bind:group={values}
        on:change={handleChange}
      />
      <label class="form-check-label" for={filter}>{filter}</label>
    </div>
  {/each}
</fieldset>

<style>
  .filter-title {
    margin-top: 1em;
    font-size: 1.2em;
  }
  fieldset {
    padding: 5px 5px 2px;
    border: 1px dashed var(--bs-pink);
    border-radius: 15px;
    margin-left: -2px;
    background: var(--bs-gray-100);
  }
  .form-check-label {
    text-transform: capitalize;
  }
</style>
