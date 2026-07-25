import type { ConditionData, HourEntry, IconKind, WeatherCondition } from '../components/WeatherModal';

/**
 * Live weather via Open-Meteo (free, no API key, CORS-enabled).
 * Maps WMO weather codes onto the four modal designs.
 */

// Which of the four visual designs a WMO code maps to.
function wmoVisual(code: number): WeatherCondition {
  if (code === 0 || code === 1) return 'sunny';
  if (code === 2) return 'clearing';                                   // partly cloudy
  if (code === 3 || code === 45 || code === 48) return 'cloudy';       // overcast / fog
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'cloudy'; // snow (rare here)
  if ((code >= 51 && code <= 82) || code >= 95) return 'thunderstorm'; // any rain/showers/storm -> flood-relevant
  return 'cloudy';
}

// Accurate, human label for the headline.
function wmoLabel(code: number): string {
  if (code === 0) return 'Sunny';
  if (code === 1) return 'Mainly Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Cloudy';
  if (code === 45 || code === 48) return 'Foggy';
  if (code >= 51 && code <= 57) return 'Drizzle';
  if (code >= 61 && code <= 67) return 'Rainy';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain Showers';
  if (code === 85 || code === 86) return 'Snow Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Cloudy';
}

// Small hourly glyph per code (rain/storm shown as blue clouds, matching the designs).
function wmoHourIcon(code: number): IconKind {
  if (code === 0 || code === 1) return 'sun';
  if (code === 2) return 'clearing';
  return 'cloud';
}

function mainIconFor(v: WeatherCondition): IconKind {
  switch (v) {
    case 'sunny': return 'sun';
    case 'clearing': return 'clearing';
    case 'cloudy': return 'cloud-light';
    case 'thunderstorm': return 'storm';
  }
}

const UPDATE: Record<WeatherCondition, { title: string; icon: 'info' | 'alert' | 'warning'; text: string }> = {
  sunny: {
    title: 'Weather Update', icon: 'info',
    text: 'Clear skies expected for the rest of the day. Flood risk is low right now.',
  },
  clearing: {
    title: 'Weather Update', icon: 'alert',
    text: "Skies are clearing up. If flooding remains nearby, tap Report to let others know it's still an issue.",
  },
  cloudy: {
    title: 'Weather Update', icon: 'alert',
    text: 'Cloudy conditions expected for the rest of the day. No rain expected. Flood risk is low.',
  },
  thunderstorm: {
    title: 'Special Weather Statement', icon: 'warning',
    text: 'Rain and storm conditions in the area. Flooding is likely on low-lying roads. Report what you see to help others nearby.',
  },
};

const round = (n: number) => Math.round(n);

function formatHour(iso: string): string {
  const d = new Date(iso);
  let h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}${ampm}`;
}

export async function fetchWeather(lat: number, lng: number): Promise<ConditionData> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&hourly=temperature_2m,weather_code,precipitation_probability` +
    `&daily=temperature_2m_max,temperature_2m_min` +
    `&wind_speed_unit=kmh&timezone=auto&forecast_days=1`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`weather fetch failed: ${res.status}`);
  const j = await res.json();

  const cur = j.current;
  const code: number = cur.weather_code;
  const visual = wmoVisual(code);
  const upd = UPDATE[visual];

  const hi = j.daily?.temperature_2m_max?.[0];
  const lo = j.daily?.temperature_2m_min?.[0];

  // Hourly: start at the first slot >= current time.
  const times: string[] = j.hourly?.time ?? [];
  let idx = times.findIndex((t) => t >= cur.time);
  if (idx < 0) idx = 0;

  const hourly: HourEntry[] = [];
  for (let k = 0; k < 5 && idx + k < times.length; k++) {
    const i = idx + k;
    hourly.push({
      label: k === 0 ? 'Now' : formatHour(times[i]),
      temp: `${round(j.hourly.temperature_2m[i])}°`,
      icon: wmoHourIcon(j.hourly.weather_code[i]),
    });
  }

  const rainProb: number | undefined = j.hourly?.precipitation_probability?.[idx];

  return {
    mainIcon: mainIconFor(visual),
    temp: `${round(cur.temperature_2m)}°`,
    label: wmoLabel(code),
    feelsLike:
      `Feels like ${round(cur.apparent_temperature)}°` +
      (hi != null && lo != null ? ` · H:${round(hi)}° L:${round(lo)}°` : ''),
    updateTitle: upd.title,
    updateIcon: upd.icon,
    updateText: upd.text,
    hourly,
    details: {
      rainChance: rainProb != null ? `${rainProb}%` : '—',
      wind: `${round(cur.wind_speed_10m)} km/h`,
      humidity: `${round(cur.relative_humidity_2m)}%`,
      updated: 'Just now',
    },
  };
}
