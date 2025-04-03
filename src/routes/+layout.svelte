<script lang="ts">
  import { CSSRuntimeProvider } from "@master/css.svelte";
  import config from "$lib/styles/master.css";
  import Header from "$lib/components/Header.svelte";
  import "@master/normal.css";
  import "@fontsource-variable/noto-sans-jp";
  import { onMount } from "svelte";

  let { children } = $props();
  let isVertical = $state(false);

  onMount(() => {
    isVertical = window.innerWidth < window.innerHeight;

    const handleResize = () => {
        window.addEventListener("resize", () => {
          isVertical = window.innerWidth < window.innerHeight;
        });
    };

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
</script>

<CSSRuntimeProvider {config}>
  <main class="w:100dvw h:100dvh rel flex {isVertical ? 'flex:column' : 'flex:row'}">
    <Header {isVertical} />
    <div class="w:100% h:100% flex {isVertical ? 'order:0' : 'order:1'}">
      {@render children?.()}
    </div>
  </main>
</CSSRuntimeProvider>

<style>
  :root {
    font-family: "Noto Sans JP Variable", sans-serif;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;

    color: #0f0f0f;
    background-color: #f6f6f6;

    margin: 0;
    padding: 0;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }
</style>
