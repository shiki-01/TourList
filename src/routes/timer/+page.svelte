<script lang="ts">
  import { fly } from "svelte/transition";
  import Icon from "@iconify/svelte";
  import Dialog from "$lib/components/Dialog.svelte";

  let type: "pomodoro" | "timer" = $state("timer");
  let timerMode: "down" | "up" = $state("down");

  let settingDialogOpen: boolean = $state(false);

  let timer: {
    minutes: string;
    seconds: string;
    milliseconds: string;
  } = $state({
    minutes: "00",
    seconds: "00",
    milliseconds: "00",
  });

  let progress: number = $state(0);
  let timerStart: boolean = $state(false);
  let canReset: boolean = $state(false);
  let totalMilliSeconds: number = $state(0);
  let elapsedMilliSeconds: number = $state(0);
  let animationFrame: number | null = $state(null);
  let startTime: number | null = $state(null);

  const validateInput = (event: Event, value: string, isMin: boolean) => {
    const max = isMin ? 480 : 59;

    const target = event.target as HTMLInputElement;
    value = target.value.replace(/\D/g, "");

    let number = parseInt(value, 10);
    if (isNaN(number)) number = 0;
    if (number > max) number = max;

    if (isMin) {
      timer.minutes = number.toString().padStart(2, "0");
    } else {
      timer.seconds = number.toString().padStart(2, "0");
    }

    totalMilliSeconds =
      parseInt(timer.minutes) * 60 * 1000 + parseInt(timer.seconds) * 1000;
  };

  const updateTimer = (timestamp: number) => {
    if (!startTime) startTime = timestamp;

    const elapsed = timestamp - startTime + elapsedMilliSeconds;

    if (timerMode === "down") {
      const remainingMilliSeconds = Math.max(totalMilliSeconds - elapsed, 0);

      timer.minutes = Math.floor(remainingMilliSeconds / 60000)
        .toString()
        .padStart(2, "0");
      timer.seconds = Math.floor((remainingMilliSeconds % 60000) / 1000)
        .toString()
        .padStart(2, "0");
      timer.milliseconds = Math.floor(remainingMilliSeconds % 1000)
        .toString()
        .padStart(3, "0");

      progress =
        ((totalMilliSeconds - remainingMilliSeconds) / totalMilliSeconds) * 100;
      if (progress > 100) progress = 100;

      if (remainingMilliSeconds > 0 && timerStart) {
        animationFrame = requestAnimationFrame(updateTimer);
      } else {
        timerStart = false;
        animationFrame = null;
      }
    } else if (timerMode === "up") {
      const elapsedSeconds = Math.floor(elapsed / 1000);

      timer.minutes = Math.floor(elapsedSeconds / 60)
        .toString()
        .padStart(2, "0");
      timer.seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
      timer.milliseconds = Math.floor(elapsed % 1000)
        .toString()
        .padStart(3, "0");

      if (parseInt(timer.minutes) > 480) {
        timer.minutes = "480";
        timer.seconds = "00";
        timer.milliseconds = "000";
        timerStart = false;
        animationFrame = null;
      }

      if (timerStart) {
        animationFrame = requestAnimationFrame(updateTimer);
      }
    }
  };

  const startTimer = () => {
    console.log("startTimer", timerStart, totalMilliSeconds);
    if (timerMode === "down" && totalMilliSeconds === 0) return;

    timerStart = true;

    if (!startTime) {
      startTime = performance.now();
    } else {
      elapsedMilliSeconds = 0;
    }

    startTime = null;
    animationFrame = requestAnimationFrame(updateTimer);
  };

  const stopTimer = () => {
    timerStart = false;
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    if (startTime) {
      elapsedMilliSeconds += performance.now() - (startTime || 0);
      startTime = null;
    } else {
      elapsedMilliSeconds = 0;
    }
  };

  const resetTimer = () => {
    stopTimer();
    timer.minutes = "00";
    timer.seconds = "00";
    timer.milliseconds = "000";
    elapsedMilliSeconds = 0;
    totalMilliSeconds = 0;
    startTime = null;
    progress = 0;
  };

  $effect(() => {
    canReset =
      (timerMode === "down" && timer.minutes !== "00") ||
      timer.seconds !== "00" ||
      (timerMode === "up" && timer.minutes !== "00") ||
      timer.seconds !== "00";
  });
</script>

<div
  class="w:100% h:100% p:40px rel flex flex:column justify-content:center align-items:center"
>
  <button
    class="w:200px h:52px p:6px r:100px bg:#fff fg:#fff b:2px|primary|solid flex ~color|.2s|ease-in-out cursor:pointer"
    onclick={() => {
      type = type === "pomodoro" ? "timer" : "pomodoro";
      timerStart = false;
    }}
  >
    <div
      class="rel w:100% h:100% justify-content:center align-items:center flex gap:6px"
    >
      <div
        class="w:142px h:100% pl:6px pr:30px abs top:50% left:0 translate(0,-50%) flex justify-content:center align-items:center"
      >
        <p
          class="{type === 'pomodoro'
            ? 'opacity:100'
            : 'opacity:0'} ~opacity|.4s|ease-in-out"
        >
          Pomodoro
        </p>
      </div>
      <div
        class="w:142px h:100% pl:30px pr:6px abs top:50% right:0 translate(0,-50%) flex justify-content:center align-items:center"
      >
        <p
          class="{type === 'pomodoro'
            ? 'opacity:0'
            : 'opacity:100'} ~opacity|.4s|ease-in-out"
        >
          Timer
        </p>
      </div>
      <div
        class="{type === 'pomodoro'
          ? 'w:142px'
          : 'w:36px'} ~width|.4s|ease-in-out h:36px bg:primary r:20px p:6px flex justify-content:end align-items:center"
      >
        <Icon icon="icon-park-outline:tomato" class="w:24px h:24px" />
      </div>
      <div
        class="{type === 'pomodoro'
          ? 'w:36px'
          : 'w:142px'} ~width|.4s|ease-in-out h:36px bg:primary r:20px p:6px flex justify-content:start align-items:center"
      >
        <Icon icon="icon-park-outline:alarm-clock" class="w:24px h:24px" />
      </div>
    </div>
  </button>
  <div
    class="w:100% h:100% rel flex flex:column justify-content:center align-items:center"
  >
    <div
      class="w:calc(200%+80px) h:100% abs grid grid-cols:2 gap:80px top:0 ~left|.4s|ease-in-out {type ===
      'pomodoro'
        ? 'left:0'
        : 'left:calc(-100%-80px)'}"
    >
      <div class="w:100%">hello!</div>
      <div
        class="w:100% flex flex:column gap:24px justify-content:end align-items:center"
      >
        <!--TODO: ここのアスペクト比を維持しつつ要素の最大にするようにするところが未実装だよ -->
        <div
          class="w:auto h:min(72vmin,100%) max-h:100% mb:24px mt:48px square rel r:full flex justify-content:center align-items:center"
        >
          <div
            class="w:100% h:100% z:-1 pointer-events:none abs flex justify-content:center align-items:center"
          >
            <div
              class="$primary01:primary/0.1 $primary02:primary/0.6 r:full w:100% h:100% flex justify-content:center align-items:center"
              style="
                clip-path: circle(50% at 50% 50%);
                background: conic-gradient(
                  var(--primary02) {progress}%,
                  var(--primary01) 0
                );
              }"
            >
              <div
                class="w:calc(100%-20px) h:calc(100%-20px) z:4 bg:#f6f6f6 r:full"
              ></div>
            </div>
          </div>
          <div class="abs top:0 left:0 w:100% h:100% pointer-events:none">
            {#each Array.from({ length: 60 }) as _, index}
              <span
                class="abs top:0 left:0 w:100% h:100% flex justify-content:start align-items:center rotate({index *
                  6}deg)"
              >
                <span
                  class="{index % 5 === 0
                    ? 'w:25px'
                    : 'w:10px'} h:2px translateY(-50%) bg:primary"
                ></span>
              </span>
            {/each}
          </div>
          <form
            class="w:100% h:100% text:80px font-weight:100 flex flex:row gap:12px justify-content:center align-items:center"
          >
            <input
              class="w:128px pointer-events:auto font-weight:100 bg:transparent::selection outline:none:focus text-align:end"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              defaultValue="00"
              disabled={timerStart || timerMode === "up"}
              bind:value={timer.minutes}
              oninput={(event) => {
                validateInput(event, timer.minutes, true);
              }}
            />
            <p class="pb:16px user-select:none">:</p>
            <input
              class="{timer.minutes.length === 3
                ? 'w:84px'
                : 'w:126px'} pointer-events:auto font-weight:100 bg:transparent::selection outline:none:focus text-align:start"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              defaultValue="00"
              disabled={timerStart || timerMode === "up"}
              bind:value={timer.seconds}
              oninput={(event) => {
                validateInput(event, timer.seconds, false);
              }}
            />
          </form>
        </div>
        <div
          class="flex flex:column gap:12px justify-content:center align-items:center"
        >
          <button
            class="w:180px h:52px p:6px r:100px bg:#fff fg:#fff b:2px|primary|solid flex ~color|.2s|ease-in-out cursor:pointer"
            onclick={() => {
              timerStart ? stopTimer() : startTimer();
            }}
          >
            <div
              class="rel w:100% h:100% flex justify-content:center align-items:center fg:primary gap:6px"
            >
              <Icon
                icon="icon-park-outline:{timerStart ? 'pause' : 'play-one'}"
                class="w:24px h:24px"
              />
              <p class="text:16px font-weight:400">
                {timerStart ? "Pause" : "Start"}
              </p>
            </div>
          </button>
        </div>
        <div
          class="w:100% h:64px grid grid-columns:3 justify-content:space-between align-items:center"
        >
          <div
            class="w:100% h:100% flex justify-content:start align-items:center"
          >
            <button
              class="w:64px h:64px flex justify-content:center align-items:center cursor:pointer"
            >
              <Icon
                icon="icon-park-outline:music"
                class="w:24px h:24px fg:primary"
              />
            </button>
          </div>
          <div
            class="w:100% h:100% flex justify-content:center align-items:center"
          >
            <button
              class="w:180px h:52px p:6px r:100px {canReset
                ? 'cursor:pointer'
                : 'cursor:default'}"
              onclick={() => {
                resetTimer();
              }}
            >
              {#if !timerStart && canReset}
                <div
                  transition:fly={{ duration: 200, y: 20 }}
                  class="rel w:100% h:100% flex justify-content:center align-items:center fg:primary gap:8px"
                >
                  <Icon icon="icon-park-outline:redo" class="w:20px h:20px" />
                  <p class="text:16px font-weight:400">Reset</p>
                </div>
              {/if}
            </button>
          </div>
          <div
            class="w:100% h:100% flex justify-content:end align-items:center"
          >
            <button
              class="w:64px h:64px flex justify-content:center align-items:center cursor:pointer"
              onclick={() => {
                settingDialogOpen = true;
              }}
            >
              <Icon
                icon="icon-park-outline:setting"
                class="w:24px h:24px fg:primary"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<Dialog bind:open={settingDialogOpen}>
  <div
    class="w:240px f:1.2em flex flex:column justify-content:center align-items:center"
  >
    <fieldset class="w:100% h:100% flex flex:column gap:12px">
      <p class="font:bold">Timer Mode</p>
      <div
        class="flex flex:row justify-content:space-between align-items:center"
      >
        <label for="timerMode">30:00 -> 00:00</label>
        <input
          bind:group={timerMode}
          onchange={() => {
            resetTimer();
          }}
          class=""
          type="radio"
          value="down"
          name="timerMode"
          id="down"
        />
      </div>
      <div
        class="flex flex:row justify-content:space-between align-items:center"
      >
        <label for="timerMode">00:00 -> ∞</label>
        <input
          bind:group={timerMode}
          onchange={() => {
            resetTimer();
          }}
          class=""
          type="radio"
          value="up"
          name="timerMode"
          id="up"
        />
      </div>
    </fieldset>
  </div>
</Dialog>
