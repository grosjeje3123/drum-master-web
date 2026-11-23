// Détection des coups au micro, au plus près du son : ce code tourne dans le fil audio du navigateur.
// Un coup de baguette est une montée brutale du niveau. On le reconnaît quand le signal dépasse le seuil
// ET domine nettement le fond sonore des instants précédents (une peau qui résonne ne redéclenche pas).
// Ce fond suit le signal lentement (15 ms à la montée) : une attaque, même étalée sur quelques
// échantillons, le dépasse toujours ; une résonance qui dure le rattrape.
// L'instant renvoyé est celui de l'échantillon où le seuil est franchi, sur l'horloge du contexte audio :
// la même horloge que le clic, d'où une datation à une fraction de milliseconde près.
class OnsetProcessor extends AudioWorkletProcessor {
	constructor() {
		super();
		this.threshold = 0.08;
		this.bg = 0;           // fond sonore : monte en 15 ms, retombe en 60 ms
		this.hold = 0;         // échantillons pendant lesquels on ne redéclenche pas
		this.pending = null;   // coup détecté, dont on mesure encore la force
		this.meter = 0;
		this.meterLeft = 0;
		this.port.onmessage = (e) => { if (typeof e.data.threshold === 'number') this.threshold = e.data.threshold; };
	}

	process(inputs) {
		const x = inputs[0] && inputs[0][0];
		if (!x) return true;
		const up = 1 - Math.exp(-1 / (0.015 * sampleRate));
		const down = 1 - Math.exp(-1 / (0.06 * sampleRate));
		const refractory = Math.round(0.045 * sampleRate);
		const peakWindow = Math.round(0.006 * sampleRate);
		for (let i = 0; i < x.length; i++) {
			const a = Math.abs(x[i]);
			if (a > this.meter) this.meter = a;
			if (this.pending) {
				if (a > this.pending.peak) this.pending.peak = a;
				if (--this.pending.left <= 0) {
					this.port.postMessage({ type: 'hit', t: this.pending.t, peak: this.pending.peak });
					this.pending = null;
				}
			}
			if (this.hold > 0) this.hold--;
			else if (a >= this.threshold && a > this.bg * 3) {
				this.pending = { t: (currentFrame + i) / sampleRate, peak: a, left: peakWindow };
				this.hold = refractory;
			}
			this.bg += (a - this.bg) * (a > this.bg ? up : down);
		}
		// Niveau pour l'affichage, vingt fois par seconde.
		this.meterLeft -= x.length;
		if (this.meterLeft <= 0) {
			this.port.postMessage({ type: 'level', peak: this.meter });
			this.meter = 0;
			this.meterLeft = Math.round(0.05 * sampleRate);
		}
		return true;
	}
}
registerProcessor('onset', OnsetProcessor);
