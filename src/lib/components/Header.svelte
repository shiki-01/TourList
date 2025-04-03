<script lang="ts">
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";

  let { isVertical } = $props();
  let link = $state("/");
  let activeTab: string[] = $state([]);

  const tabs: {
    icon: string;
    link: string;
  }[] = [
    {
      icon: "home",
      link: "/",
    },
    {
      icon: "check-correct",
      link: "/task",
    },
    {
      icon: "alarm-clock",
      link: "/timer",
    },
  ];

  const handleClick = (tabLink: string) => {
    if (typeof window === "undefined") return;
    window.history.pushState({}, "", tabLink);
    link = tabLink;

    if (activeTab.includes(link)) return;

    activeTab.push(link);

    setTimeout(() => {
      activeTab = activeTab.filter((item) => item !== tabLink);
    }, 500);
  };

  onMount(() => {
    link = window.location.pathname;
  });
</script>

<header
  class="z:50 bg:#fff flex align-items:center justify-content:center {isVertical
    ? 'w:100dvw h:68px order:1'
    : 'w:68px h:100dvh order:0'}"
>
  <div
    class=" flex align-items:center justify-content:space-between {isVertical
      ? 'w:80dvw min-w:calc(68px*3) h:100% flex:row'
      : 'w:100% h:60dvh min-h:calc(68px*3) flex:column'}"
  >
    {#each tabs as tab}
      <a
        href={tab.link}
        class="w:68px h:68px p:20px rel flex flex:column justify-content:center align-items:center ~color|.2s|ease-in-out {link ===
        tab.link
          ? 'fg:primary'
          : ''}"
        onclick={() => {
          handleClick(tab.link);
        }}
      >
        <span
          class="abs bg:primary z:-1 {isVertical
            ? `w:100% h:2px top:0 left:50% translateX(-50%) ~width|.1s|ease-in-out ${tab.link === link ? '' : 'w:0!'}`
            : `w:2px h:100% top:50% right:0 translateY(-50%) ~height|.1s|ease-in-out ${tab.link === link ? '' : 'h:0!'}`}"
        ></span>
        <Icon
          icon="icon-park-outline:{tab.icon}"
          class="w:100% h:100% {activeTab.includes(tab.link)
            ? '@onActive|.5s|ease-in-out'
            : ''}"
        />
      </a>
    {/each}
  </div>
</header>
