import {
  Bell,
  BellOff,
  Clock3,
  Moon,
  Wifi,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

const REMINDER_INTERVAL_MS =
  30 * 60 * 1000;

const REMINDER_MESSAGE =
  "I am your reminder. Come online. You were 30 minutes away on duty time.";

// =====================================================
// DRIVER AVAILABILITY
//
// Final UI rules
// -----------------------------------------------------
// 1. Compact single-line availability bar.
// 2. No separate reminder toggle.
// 3. No separate sound icon.
// 4. Reminder belongs only to AWAY.
// 5. Clicking AWAY starts the reminder timer.
// 6. Clicking COME ONLINE stops the reminder.
// 7. Reminder sound + voice are activated from the
//    driver's direct Go Online / Come Online action.
// 8. Active time and Away time are displayed.
// =====================================================

export default function DriverAvailabilityBar({
  isOnline = false,
  onToggleOnline,
  isApproved = true,
  canGoOnline = true,
}) {
  const STORAGE_KEY =
    "driver_availability_session_v1";

  const readSession = () => {
    try {
      const raw =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!raw) {
        return null;
      }

      const parsed =
        JSON.parse(raw);

      return parsed &&
        typeof parsed === "object"
        ? parsed
        : null;
    } catch {
      return null;
    }
  };

  const savedSession =
    readSession();

  const initialMode =
    savedSession?.mode ||
    (isOnline
      ? "ONLINE"
      : "OFFLINE");

  const [mode, setMode] =
    useState(initialMode);

  const [onlineStartedAt, setOnlineStartedAt] =
    useState(
      Number.isFinite(
        Number(
          savedSession?.onlineStartedAt
        )
      )
        ? Number(
            savedSession.onlineStartedAt
          )
        : (
            initialMode === "ONLINE"
              ? Date.now()
              : null
          )
    );

  const [awayStartedAt, setAwayStartedAt] =
    useState(
      Number.isFinite(
        Number(
          savedSession?.awayStartedAt
        )
      )
        ? Number(
            savedSession.awayStartedAt
          )
        : null
    );

  const [onlineSeconds, setOnlineSeconds] =
    useState(
      Number(
        savedSession?.onlineSeconds
      ) || 0
    );

  const [awaySeconds, setAwaySeconds] =
    useState(
      Number(
        savedSession?.awaySeconds
      ) || 0
    );

  const [audioEnabled, setAudioEnabled] =
    useState(false);

  const [lastReminderAt, setLastReminderAt] =
    useState(null);

  // ===================================================
  // SYNC WITH PARENT
  // ===================================================

  useEffect(() => {
    // Parent ONLINE confirms backend availability.
    // AWAY remains a local operational state while the
    // backend correctly remains unavailable for new rides.
    if (isOnline && mode !== "ONLINE") {
      const now = Date.now();

      setMode("ONLINE");

      setOnlineStartedAt(
        (current) =>
          current || now
      );

      setAwayStartedAt(null);
      setAwaySeconds(0);
      return;
    }

    if (
      !isOnline &&
      mode !== "AWAY" &&
      mode !== "OFFLINE"
    ) {
      setMode("OFFLINE");
      setOnlineStartedAt(null);
    }
  }, [isOnline, mode]);

  // ===================================================
  // CLOCK
  // ===================================================

  useEffect(() => {
    const timer =
      window.setInterval(() => {
        const now = Date.now();

        // Active clock runs only while ONLINE.
        if (
          mode === "ONLINE" &&
          onlineStartedAt
        ) {
          setOnlineSeconds(
            Math.max(
              0,
              Math.floor(
                (now - onlineStartedAt) /
                  1000
              )
            )
          );
        }

        // Away clock runs only while AWAY.
        if (
          mode === "AWAY" &&
          awayStartedAt
        ) {
          setAwaySeconds(
            Math.max(
              0,
              Math.floor(
                (now - awayStartedAt) /
                  1000
              )
            )
          );
        }
      }, 1000);

    return () =>
      window.clearInterval(timer);
  }, [
    mode,
    onlineStartedAt,
    awayStartedAt,
  ]);

  // Persist the session so timers do not reset on
  // component re-render/navigation.
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          mode,
          onlineStartedAt,
          awayStartedAt,
          onlineSeconds,
          awaySeconds,
        })
      );
    } catch {
      // In-memory timers continue if storage is unavailable.
    }
  }, [
    mode,
    onlineStartedAt,
    awayStartedAt,
    onlineSeconds,
    awaySeconds,
  ]);

  // ===================================================
  // AWAY REMINDER
  //
  // Reminder exists only during AWAY.
  // ===================================================

  useEffect(() => {
    if (
      mode !== "AWAY" ||
      !awayStartedAt
    ) {
      return undefined;
    }

    const timer =
      window.setInterval(() => {
        const now = Date.now();

        const awayDuration =
          now - awayStartedAt;

        if (
          awayDuration >=
            REMINDER_INTERVAL_MS &&
          (!lastReminderAt ||
            now - lastReminderAt >=
              REMINDER_INTERVAL_MS)
        ) {
          playReminder(audioEnabled);

          setLastReminderAt(now);
        }
      }, 15000);

    return () =>
      window.clearInterval(timer);
  }, [
    mode,
    awayStartedAt,
    lastReminderAt,
    audioEnabled,
  ]);

  // ===================================================
  // GO ONLINE
  // ===================================================

  const goOnline = () => {
    if (!isApproved || !canGoOnline) {
      return;
    }

    const now = Date.now();

    setMode("ONLINE");

    setOnlineStartedAt(
      (current) =>
        current || now
    );

    setAwayStartedAt(null);
    setAwaySeconds(0);
    setLastReminderAt(null);

    // Direct user interaction enables browser audio
    // for future Away reminders.
    setAudioEnabled(true);

    onToggleOnline?.(true);
  };

  // ===================================================
  // GO OFFLINE
  // ===================================================

  const goOffline = () => {
    setMode("OFFLINE");

    // Keep the accumulated Active/Away totals visible.
    // Only the currently running timestamps are cleared.
    setOnlineStartedAt(null);
    setAwayStartedAt(null);

    setLastReminderAt(null);
    setAudioEnabled(false);

    onToggleOnline?.(false);
  };

  // ===================================================
  // AWAY
  //
  // Away itself owns the reminder.
  // ===================================================

  const goAway = () => {
    if (mode !== "ONLINE") {
      return;
    }

    const now = Date.now();

    // Freeze Active at the exact moment the driver goes Away.
    if (onlineStartedAt) {
      setOnlineSeconds(
        Math.max(
          0,
          Math.floor(
            (now - onlineStartedAt) /
              1000
          )
        )
      );
    }

    setMode("AWAY");

    setAwayStartedAt(now);

    setAwaySeconds(0);
    setLastReminderAt(null);

    // AWAY means temporarily unavailable for new rides.
    // Persist that state as offline in the backend so the
    // passenger nearby-driver list removes this driver.
    onToggleOnline?.(false);
  };

  // ===================================================
  // COME ONLINE
  //
  // Stops Away reminder.
  // ===================================================

  const comeOnline = () => {
    if (
      !isApproved ||
      !canGoOnline
    ) {
      return;
    }

    const now = Date.now();

    // Resume a new Active segment; accumulated Active time
    // remains visible instead of resetting.
    setMode("ONLINE");

    setOnlineStartedAt(now);

    setAwayStartedAt(null);
    setAwaySeconds(0);
    setLastReminderAt(null);

    setAudioEnabled(true);

    onToggleOnline?.(true);
  };

  // ===================================================
  // STATUS
  // ===================================================

  const statusText =
    mode === "ONLINE"
      ? "You are online"
      : mode === "AWAY"
        ? "You are away"
        : "You are offline";

  const statusDescription =
    mode === "ONLINE"
      ? "Receiving eligible ride requests"
      : mode === "AWAY"
        ? "Temporarily unavailable for new rides"
        : "You are offline";

  return (
    <section className="w-full min-w-0">

      {/* =================================================
          SINGLE-LINE AVAILABILITY BAR
      ================================================= */}

      <div
        className="
          flex
          w-full
          min-w-0
          items-center
          gap-3
          rounded-2xl
          border
          border-slate-200
          bg-white
          px-4
          py-3
          shadow-sm
          xl:justify-between
        "
      >

        {/* =================================================
            STATUS
        ================================================= */}

        <div className="flex min-w-0 flex-1 items-center gap-2.5">

          <span
            className={[
              "h-2.5 w-2.5 shrink-0 rounded-full",
              mode === "ONLINE"
                ? "bg-emerald-500"
                : mode === "AWAY"
                  ? "bg-amber-500"
                  : "bg-slate-400",
            ].join(" ")}
          />

          <p className="hidden shrink-0 text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:block">
            Driver Availability
          </p>

          <span
            className={[
              "shrink-0 rounded-full px-2.5 py-1 text-[8px] font-bold uppercase",
              mode === "ONLINE"
                ? "bg-emerald-50 text-emerald-600"
                : mode === "AWAY"
                  ? "bg-amber-50 text-amber-600"
                  : "bg-slate-100 text-slate-500",
            ].join(" ")}
          >
            {mode}
          </span>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">
              {statusText}
            </p>

            <p className="hidden truncate text-[10px] text-slate-400 md:block">
              {statusDescription}
            </p>
          </div>

        </div>


        {/* =================================================
            ACTIVE / AWAY HOURS
        ================================================= */}

        <div className="flex shrink-0 items-center gap-2">

          <TimeStat
            icon={Clock3}
            label="Active"
            value={formatDuration(
              onlineSeconds
            )}
          />

          <TimeStat
            icon={Moon}
            label="Away"
            value={formatDuration(
              awaySeconds
            )}
          />

        </div>


        {/* =================================================
            CONTROLS
        ================================================= */}

        <div className="flex shrink-0 items-center gap-2">

          {mode === "OFFLINE" && (
            <button
              type="button"
              disabled={
                !isApproved ||
                !canGoOnline
              }
              onClick={goOnline}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-[11px] font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Wifi size={14} />
              Go Online
            </button>
          )}

          {mode === "ONLINE" && (
            <>
              <button
                type="button"
                onClick={goAway}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-amber-200 bg-white px-4 text-[11px] font-bold text-amber-700 transition hover:bg-amber-50"
              >
                <Bell size={14} />
                Away
              </button>

              <button
                type="button"
                onClick={goOffline}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50"
              >
                <Wifi size={14} />
                Offline
              </button>
            </>
          )}

          {mode === "AWAY" && (
            <>
              <button
                type="button"
                disabled={
                  !isApproved ||
                  !canGoOnline
                }
                onClick={comeOnline}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-[11px] font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <BellOff size={14} />
                Come Online
              </button>

              <button
                type="button"
                onClick={goOffline}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50"
              >
                <Wifi size={14} />
                Offline
              </button>
            </>
          )}

        </div>

      </div>


      {/* =================================================
          AWAY REMINDER
          Only shown while Away.
      ================================================= */}

      {mode === "AWAY" && (
        <div className="mt-2 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-2.5">

          <div className="flex min-w-0 items-center gap-2">

            <Bell
              size={13}
              className="shrink-0 text-amber-600"
            />

            <p className="min-w-0 text-[10px] leading-4 text-amber-700">

              <span className="font-semibold">
                Away reminder active.
              </span>{" "}

              Every 30 minutes:
              “I am your reminder. Come online.
              You were 30 minutes away on duty time.”

            </p>

          </div>

        </div>
      )}

    </section>
  );
}


// =====================================================
// TIME STAT
// =====================================================

function TimeStat({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">

      <Icon
        size={12}
        className="text-slate-400"
      />

      <span className="hidden text-[8px] font-semibold uppercase tracking-wide text-slate-400 sm:inline">
        {label}
      </span>

      <span className="text-xs font-bold text-slate-900">
        {value}
      </span>

    </div>
  );
}


// =====================================================
// DURATION
// =====================================================

function formatDuration(totalSeconds) {
  const hours =
    Math.floor(
      totalSeconds / 3600
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) / 60
    );

  const seconds =
    totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(
      minutes
    ).padStart(2, "0")}m`;
  }

  return `${minutes}m ${String(
    seconds
  ).padStart(2, "0")}s`;
}


// =====================================================
// REMINDER SOUND + VOICE
// =====================================================

function playReminder(withSound) {
  if (withSound) {
    try {
      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (AudioContext) {
        const context =
          new AudioContext();

        const oscillator =
          context.createOscillator();

        const gain =
          context.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value =
          880;

        gain.gain.setValueAtTime(
          0.0001,
          context.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
          0.12,
          context.currentTime + 0.02
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          context.currentTime + 0.6
        );

        oscillator.connect(gain);
        gain.connect(
          context.destination
        );

        oscillator.start();

        oscillator.stop(
          context.currentTime + 0.6
        );

        oscillator.onended = () => {
          context.close();
        };
      }
    } catch (error) {
      console.error(
        "REMINDER SOUND ERROR:",
        error
      );
    }
  }

  if (
    "speechSynthesis" in window
  ) {
    try {
      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(
          REMINDER_MESSAGE
        );

      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      window.speechSynthesis.speak(
        utterance
      );
    } catch (error) {
      console.error(
        "REMINDER VOICE ERROR:",
        error
      );
    }
  }
}
