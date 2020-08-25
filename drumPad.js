class DrumPad {
  constructor() {
    this.svg = document.querySelector('.drumpad svg');
    this.lamps = this.svg.querySelector('#Lamps');
    this.pads = this.svg.querySelectorAll('[data-pad="pad"]');
    this.tempoValue = document.querySelector('.tempo-nr');
    this.tempoSlider = document.querySelector('.tempo-slider');
    this.volumeSliders = document.querySelectorAll('.button-slider');
    this.soundNames = document.querySelectorAll('.sound');
    this.vol_0 = document.querySelector('.vol-0');
    this.vol_1 = document.querySelector('.vol-1');
    this.vol_2 = document.querySelector('.vol-2');
    this.vol_3 = document.querySelector('.vol-3');
    this.vol_0_volume = 1;
    this.vol_1_volume = 1;
    this.vol_2_volume = 1;
    this.vol_3_volume = 1;
    this.vol_0_state = 1;
    this.vol_1_state = 1;
    this.vol_2_state = 1;
    this.vol_3_state = 1;
    this.index = 0;
    this.bpm = 150;
    this.isPlaying = null;
    this.startBtn = this.svg.querySelector('#Play');
    this.stopBtn = this.svg.querySelector('#Stop');
    this.muteBtns = document.querySelectorAll('.mute');
  }

  init() {
    const lamps = this.lamps.querySelectorAll('[data-lamp="lamp"]');
    lamps.forEach(l => {
      l.addEventListener('animationend', () => {
        l.style.animation = '';
      });
    });
    document.querySelectorAll('audio').forEach((a, i) => {
      const name = a.src.split('/');
      this.soundNames[i].textContent = name[name.length - 1];
    });

    document.addEventListener('click', e => {
      if (e.target.dataset.pad) {
        this.togglePad(e);
      }
    });
    this.startBtn.addEventListener('click', () => {
      this.startBtn.classList.toggle('play-btn-active');
      this.start();
    });
    this.stopBtn.addEventListener('click', () => {
      this.stopBtn.classList.add('stop-btn-active');
      if (this.isPlaying) {
        this.startBtn.classList.remove('play-btn-active');
      }
      this.stop();
    });
    this.stopBtn.addEventListener('animationend', () => {
      this.stopBtn.classList.remove('stop-btn-active');
    });
    this.tempoSlider.addEventListener('input', (e) => {
      this.changeTempo(e);
    });
    this.tempoSlider.addEventListener('change', (e) => {
      this.updateTempo(e);
    });
    this.muteBtns.forEach(b => {
      b.addEventListener('click', e => {
        this.mute(e);
      })
    });
    this.volumeSliders.forEach(b => {
      b.addEventListener('click', e => {
        if (document.querySelector(`.volume-buttons [data-track="${b.getAttribute('data-track')}"]`).classList.contains('off')) {
          return;
        }
        const volume = b.querySelector('.volume');
        volume.classList.toggle('off');
        const slider = b.querySelector('.volume-slider');
        this[`${b.getAttribute('data-track')}_volume`] = +slider.value;
        this[`${b.getAttribute('data-track')}_state`] = +slider.value;
        const arrow = this.svg.querySelector(`[data-arrow="${b.getAttribute('data-track')}"]`);
        arrow.style.transform = `rotateZ(${180 * +slider.value - 180}deg)`;
      })
    });
  }
  togglePad(e) {
    e.target.classList.toggle('active');
  }
  repeat() {
    let step = this.index % 8;
    const activePads = document.querySelectorAll(`[data-p="p${step}"]`);
    let lamp = this.lamps.querySelector(`#l${step}`);
    lamp.style.animation = `playLamp 0.3s alternate ease-in-out 2`;
    activePads.forEach(pad => {
      if (pad.classList.contains('active')) {
        if (pad.classList.contains('pad-0')){
          this.vol_0.currentTime = 0;
          this.vol_0.volume = this.vol_0_volume;
          this.vol_0.play();
        }
        if (pad.classList.contains('pad-1')){
          this.vol_1.currentTime = 0;
          this.vol_1.volume = this.vol_1_volume;
          this.vol_1.play();
        }
        if (pad.classList.contains('pad-2')){
          this.vol_2.currentTime = 0;
          this.vol_2.volume = this.vol_2_volume;
          this.vol_2.play();
        }
        if (pad.classList.contains('pad-3')){
          this.vol_3.currentTime = 0;
          this.vol_3.volume = this.vol_3_volume;
          this.vol_3.play();
        }
      }
    });
    this.index++;
  }
  start() {
    const interval = (60/this.bpm) * 1000;
    if (!this.isPlaying) {
      this.isPlaying = setInterval(() => {
        this.repeat()
      }, interval);
    } else {
      clearInterval(this.isPlaying);
      this.isPlaying = null;
    }
  }
  stop() {
    clearInterval(this.isPlaying);
    this.isPlaying = null;
    this.index = 0;
  }
  changeTempo(e) {
    this.bpm = +(e.target.value);
    this.tempoValue.textContent = e.target.value;
  }
  updateTempo() {
    clearInterval(this.isPlaying);
    this.isPlaying = null;
    if (this.startBtn.classList.contains('play-btn-active')) {
      this.start();
    }
  }
  mute(e) {
    const muteEl = e.target.getAttribute('data-track');
    e.target.classList.toggle('off');
    if (e.target.classList.contains('off')) {
      this[`${muteEl}_volume`] = 0;
    } else {
      this[`${muteEl}_volume`] = this[`${muteEl}_state`];
    }
  }
}

const drumpad = new DrumPad();
drumpad.init();

