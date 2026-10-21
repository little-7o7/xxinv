"""Original upbeat instrumental loop, 116 BPM: piano, bass and light percussion."""
import math, random, wave, array
from pathlib import Path
random.seed(60)
sr=22050
beat=60/116
length=64*beat
samples=[0.0]*round(length*sr)
def note(midi, start, duration, volume, kind='piano'):
    freq=440*2**((midi-69)/12)
    for i in range(round(duration*sr)):
        t=i/sr
        envelope=min(1,t/.008)*math.exp(-t*(4 if kind=='piano' else 7))*min(1,(duration-t)/.04)
        x=math.sin(2*math.pi*freq*t)+.3*math.sin(4*math.pi*freq*t)*math.exp(-t*5)+.12*math.sin(6*math.pi*freq*t)
        index=(round(start*sr)+i)%len(samples)
        samples[index]+=volume*envelope*x
# C major, A minor, F major, G major; light syncopated accompaniment.
chords=[(48,[60,64,67]),(45,[60,64,69]),(41,[60,65,69]),(43,[59,62,67])]
melodies=[[76,79,79,81,79,76,74,72],[76,76,79,81,84,81,79,76],[77,81,81,79,77,76,74,72],[74,79,79,81,79,77,76,74]]
for bar in range(16):
    root,chord=chords[bar%4]
    for b in range(4):
        start=(bar*4+b)*beat
        note(root+(12 if b%2 else 0),start,beat*.85,.14,'bass')
        for pitch in chord: note(pitch,start+beat*.5,beat*.42,.065)
        # Soft kick on every beat, snare on 2/4, shaker eighth notes.
        for i in range(round(.22*sr)):
            t=i/sr
            samples[(round(start*sr)+i)%len(samples)]+=.2*math.sin(2*math.pi*(58*t+2*(1-math.exp(-t*25))))*math.exp(-t*23)
        if b%2:
            for i in range(round(.13*sr)):
                t=i/sr
                samples[(round(start*sr)+i)%len(samples)]+=.09*random.uniform(-1,1)*math.exp(-t*30)
        for half in [0,.5]:
            for i in range(round(.055*sr)):
                t=i/sr
                samples[(round((bar*4+b+half)*beat*sr)+i)%len(samples)]+=.035*random.uniform(-1,1)*math.exp(-t*65)
    for n,pitch in enumerate(melodies[bar%4]):
        note(pitch,(bar*4+n*.5)*beat,beat*(.75 if n==7 else .43),.13)
# Circular subtle echo preserves seamless looping.
dry=samples[:]
for delay,gain in [(round(beat*.75*sr),.16),(round(beat*1.5*sr),.07)]:
    for i,x in enumerate(dry): samples[(i+delay)%len(samples)]+=x*gain
peak=max(map(abs,samples))
output=array.array('h',(round(x/peak*28000) for x in samples))
path=Path(__file__).resolve().parents[1]/'public/audio/birthday-dance.wav'
with wave.open(str(path),'wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(sr); f.writeframes(output.tobytes())
print(f'{path.name}: {length:.1f}s, 116 BPM')
