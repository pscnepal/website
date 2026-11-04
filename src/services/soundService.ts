const SOUND_URL = '/sounds/page-turn.wav?v=gentle2';
const MIN_TRIGGER_INTERVAL_MS = 140;

export type PageSoundIntensity = 'full' | 'soft';

class PageTurnSoundService {
  private audioCtx: AudioContext | null = null;
  private decodedBuffer: AudioBuffer | null = null;
  private isFetchingBuffer = false;
  private fetchFailed = false;
  private activeGain: GainNode | null = null;
  private activeSource: AudioBufferSourceNode | null = null;
  private lastPlayedAt = 0;
  private gestureListenersBound = false;

  constructor() {
    this.bindGlobalUnlockListeners();
  }

  private getOrCreateContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (this.audioCtx) return this.audioCtx;

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioCtx) return null;

    try {
      this.audioCtx = new AudioCtx();
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  private bindGlobalUnlockListeners(): void {
    if (typeof window === 'undefined' || this.gestureListenersBound) return;
    this.gestureListenersBound = true;

    const unlock = () => {
      const ctx = this.getOrCreateContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      if (!this.decodedBuffer && !this.isFetchingBuffer && !this.fetchFailed) {
        this.preload();
      }
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
  }

  public preload(): void {
    if (typeof window === 'undefined') return;
    const ctx = this.getOrCreateContext();
    if (!ctx || this.decodedBuffer || this.isFetchingBuffer || this.fetchFailed) {
      return;
    }

    this.isFetchingBuffer = true;
    fetch(SOUND_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Audio asset unavailable');
        return res.arrayBuffer();
      })
      .then((arrayBuf) => ctx.decodeAudioData(arrayBuf))
      .then((audioBuf) => {
        this.decodedBuffer = audioBuf;
        this.isFetchingBuffer = false;
      })
      .catch(() => {
        this.fetchFailed = true;
        this.isFetchingBuffer = false;
      });
  }

  private stopActiveNodeSmoothly(ctx: AudioContext): void {
    if (this.activeGain && this.activeSource) {
      try {
        const now = ctx.currentTime;
        this.activeGain.gain.cancelScheduledValues(now);
        this.activeGain.gain.setValueAtTime(
          Math.max(0.0005, this.activeGain.gain.value),
          now
        );
        this.activeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
        const oldSource = this.activeSource;
        window.setTimeout(() => {
          try {
            oldSource.stop();
            oldSource.disconnect();
          } catch {
            // Already stopped
          }
        }, 38);
      } catch {
        // Ignore fadeout errors
      }
      this.activeGain = null;
      this.activeSource = null;
    }
  }

  /**
   * Delicate fallback paper whisper if the local WAV file is still decoding.
   */
  private createFallbackPaperBuffer(ctx: AudioContext): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const duration = 0.155;
    const length = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    let pink1 = 0, pink2 = 0;
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    let lp = 0;

    for (let i = 0; i < length; i++) {
      const progress = i / length;
      const t = i / sampleRate;
      const white = Math.random() * 2 - 1;
      pink1 = 0.76 * pink1 + 0.24 * white;
      pink2 = 0.84 * pink2 + 0.16 * pink1;
      const src = pink1 * 0.65 + pink2 * 0.35;

      const freq = 1500 - 650 * Math.pow(progress, 0.75);
      const w = (2 * Math.PI * freq) / sampleRate;
      const alpha = Math.sin(w) / (2 * 1.45);
      const a0 = 1 + alpha;
      const band =
        (alpha / a0) * src -
        (alpha / a0) * x2 -
        ((-2 * Math.cos(w)) / a0) * y1 -
        ((1 - alpha) / a0) * y2;

      x2 = x1;
      x1 = src;
      y2 = y1;
      y1 = band;

      lp = 0.6 * lp + 0.4 * band;
      const fadeIn = Math.min(1, t / 0.014);
      const env = fadeIn * Math.pow(1 - progress, 1.6) * 0.34;
      data[i] = Math.max(-0.5, Math.min(0.5, lp * env));
    }

    return buffer;
  }

  /**
   * Plays a light, gentle paper-whisper sound with warm high/low frequency shaping.
   */
  public playPageTurn(intensity: PageSoundIntensity = 'full'): void {
    if (typeof window === 'undefined') return;

    const nowMs = performance.now();
    if (nowMs - this.lastPlayedAt < MIN_TRIGGER_INTERVAL_MS) {
      return;
    }
    this.lastPlayedAt = nowMs;

    const ctx = this.getOrCreateContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    if (!this.decodedBuffer && !this.isFetchingBuffer && !this.fetchFailed) {
      this.preload();
    }

    try {
      this.stopActiveNodeSmoothly(ctx);

      const buffer = this.decodedBuffer ?? this.createFallbackPaperBuffer(ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      // Subtle natural variation around thin book-paper pitch
      source.playbackRate.value =
        intensity === 'soft' ? 1.08 : 0.97 + Math.random() * 0.06;

      // Warm acoustic filters: strip low rumble (< 420Hz) and harsh treble (> 2900Hz)
      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 420;
      highpass.Q.value = 0.6;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 2900;
      lowpass.Q.value = 0.7;

      const gainNode = ctx.createGain();
      const targetVolume = intensity === 'soft' ? 0.14 : 0.26;
      const now = ctx.currentTime;
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(targetVolume, now + 0.012);

      source.connect(highpass);
      highpass.connect(lowpass);
      lowpass.connect(gainNode);
      gainNode.connect(ctx.destination);

      this.activeSource = source;
      this.activeGain = gainNode;

      source.onended = () => {
        if (this.activeSource === source) {
          this.activeSource = null;
          this.activeGain = null;
        }
      };

      source.start(0);
    } catch {
      // Remain resilient if browser restricts audio output
    }
  }
}

export const soundService = new PageTurnSoundService();
