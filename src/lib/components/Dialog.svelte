<script lang="ts">
  import Icon from "@iconify/svelte";
  import { fly } from "svelte/transition";

  let { children, open = $bindable() } = $props();
</script>

<div
  class="fixed top:0 left:0 w:100dvw h:100dvh {open
    ? 'pointer-events:auto'
    : 'pointer-events:none'}"
>
  {#if open}
    <div
      class="abs top:50% left:50% translate(-50%,-50%) w:fit h:fit min-w:200px min-h:150px p:8px z:2 flex flex:column bg:#fff r:8px b:2px|#eee|solid shadow:0|0|20px|rgba(0,0,0,0.2) ~opacity|.2s|ease-in-out {open
        ? 'opacity:1 pointer-events:auto'
        : 'opacity:0'}"
    >
      <button
        class="w:100% h:28px flex justify-content:end cursor:pointer pointer-events:auto"
        onclick={() => (open = false)}
      >
        <Icon icon="material-symbols:close" class="w:28px h:28px" />
      </button>
      <div class="w:100% h:100% p:12px flex flex:column">
        {@render children?.()}
      </div>
    </div>
  {/if}
  <button
    aria-label="Close"
    class="w:100% h:100% flex justify-content:center align-items:center ~background|.2s|ease-in-out {open
      ? 'bg:rgba(0,0,0,.2)'
      : 'bg:rgba(0,0,0,0)'}"
    onclick={() => (open = false)}
  >
  </button>
</div>
