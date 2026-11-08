import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Sparkles, Send, RotateCcw, Copy, Check, Hand, ArrowRight } from 'lucide-react';
import DiyaScene from './components/DiyaScene.jsx';
import Fireworks from './components/Fireworks.jsx';

export default function App() {
  const [step, setStep] = useState(0);
  const [music, setMusic] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    document.title = 'Diwali — A Little Light, A Lot of Love';
    return () => stopMusic();
  }, []);

  const stopMusic = () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.oscillators.forEach(o => o.stop());
      audioRef.current.ctx.close();
    } catch {}
    audioRef.current = null;
  };

  const toggleMusic = async () => {
    if (music) {
      stopMusic();
      setMusic(false);
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    await ctx.resume();
    const master = ctx.createGain();
    master.gain.value = 0.028;
    master.connect(ctx.destination);
    const oscillators = [];
    // Original synthesized ambient tones; playback begins only after a user tap.
    [174.61, 261.63, 349.23, 523.25].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      gain.gain.value = i === 0 ? 0.42 : 0.11;
      osc.connect(gain);
      gain.connect(master);
      osc.start();
      oscillators.push(osc);
    });
    audioRef.current = { ctx, oscillators };
    setMusic(true);
  };

  const shareWhatsApp = () => {
    const message = `🪔 शुभ दीपावली! ✨\n\nइस दीपावली आपके जीवन में खुशियों की रोशनी हो, हर सपना नई उड़ान भरे और हर दिन उम्मीदों से जगमगाता रहे। आपको और आपके परिवार को दीपावली की हार्दिक शुभकामनाएँ!\n\nइस खास Diwali experience को यहाँ देखें: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt('Copy this website link:', window.location.href);
    }
  };

  const reset = () => setStep(0);

  return (
    <main className={`app step-${step}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="grid-overlay" />
      <Fireworks active={step >= 2} />

      <header className="topbar">
        <a className="brand" href="#" aria-label="Diwali home">
          <span className="brand-mark">✺</span>
          <span>DEEP<span className="brand-gold">AWALI</span></span>
        </a>
        <div className="top-actions">
          <span className="edition"><span className="live-dot" /> FESTIVE EDITION</span>
          <button className="icon-button" onClick={toggleMusic} aria-label={music ? 'Mute ambient sound' : 'Play ambient sound'}>
            {music ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={13} /> A FESTIVAL OF LIGHT & WONDER</div>
          <h1>Light up<br />the <span>extraordinary.</span></h1>
          <p className="intro">A little moment of magic, made to bring more light, joy and wonder to your Diwali.</p>
          <div className="hero-meta"><span className="meta-line" /> A LITTLE LIGHT. A LOT OF LOVE. <span className="meta-line" /></div>
        </div>

        <div className="scene-wrap">
          <div className="scene-ring ring-one" />
          <div className="scene-ring ring-two" />
          <div className="scene-label">THE LIGHT WITHIN <span>0{step + 1} / 03</span></div>
          <button
            className={`diya-hit-area ${step === 0 ? 'is-tappable' : ''}`}
            onClick={() => step === 0 && setStep(1)}
            aria-label="Tap the diya to light it"
            disabled={step !== 0}
          >
            <DiyaScene />
            {step === 0 && <span className="tap-hint"><Hand size={15} /> TAP THE DIYA</span>}
          </button>
          <div className="scene-caption"><span className="caption-dot" /> ONE LIGHT. INFINITE POSSIBILITIES.</div>
        </div>
      </section>

      <section className="guided-panel" aria-live="polite">
        <div className="step-progress">
          {[0, 1, 2].map(n => <span key={n} className={step >= n ? 'progress-active' : ''} />)}
        </div>

        {step === 0 && (
          <div className="step-content">
            <div className="step-kicker"><span className="step-number">01</span> YOUR DIWALI BEGINS HERE</div>
            <h2>Ready to light up <i>the night?</i></h2>
            <p className="instruction">पहला कदम: ऊपर दिख रहे सुनहरे दीये पर टैप करें और इस छोटी-सी Diwali journey की शुरुआत करें।</p>
            <button className="primary-button" onClick={() => setStep(1)}>
              <Hand size={16} /> <span>Tap to light the diya</span> <ArrowRight size={16} />
            </button>
            <p className="micro-note">STEP 1 OF 3 · LIGHT THE DIYA</p>
          </div>
        )}

        {step === 1 && (
          <div className="step-content">
            <div className="step-kicker"><span className="step-number">02</span> THE LIGHT IS ALIVE</div>
            <h2>A light for every <i>beautiful hope.</i></h2>
            <p className="instruction">वाह! आपका दीया रोशन हो गया। अब नीचे दिए गए बटन पर टैप करें और आसमान को रोशनी से भरते देखें।</p>
            <button className="primary-button" onClick={() => setStep(2)}>
              <Sparkles size={16} /> <span>Let the sky sparkle</span> <ArrowRight size={16} />
            </button>
            <p className="micro-note">STEP 2 OF 3 · UNLEASH THE FIREWORKS</p>
          </div>
        )}

        {step === 2 && (
          <div className="step-content final-content">
            <div className="step-kicker"><span className="step-number">03</span> A WISH FROM THE HEART</div>
            <div className="wish-symbol">✺</div>
            <p className="hindi-greeting">शुभ दीपावली</p>
            <h2>May your world <i>shine brighter.</i></h2>
            <p className="wish-message">इस दीपावली आपके जीवन में खुशियों की रोशनी हो, हर सपना नई उड़ान भरे और हर दिन उम्मीदों से जगमगाता रहे। आपको और आपके परिवार को दीपावली की हार्दिक शुभकामनाएँ!</p>
            <p className="english-wish">May every diya bring new hope, every sparkle a beautiful memory, and every moment a reason to smile.</p>
            <div className="share-actions">
              <button className="primary-button share-button" onClick={shareWhatsApp}><Send size={17} /> Share this wish on WhatsApp</button>
              <button className="secondary-button" onClick={copyLink}>{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Link copied!' : 'Copy website link'}</button>
              <button className="restart-button" onClick={reset}><RotateCcw size={14} /> Experience again</button>
            </div>
            <p className="micro-note">A LITTLE LIGHT. A LOT OF LOVE.</p>
          </div>
        )}
      </section>

      <footer>
        <span>✺ MADE WITH LIGHT</span>
        <span className="footer-center">A FESTIVAL THAT BRINGS US CLOSER</span>
        <span>HAPPY DIWALI <Sparkles size={11} /></span>
      </footer>
    </main>
  );
}