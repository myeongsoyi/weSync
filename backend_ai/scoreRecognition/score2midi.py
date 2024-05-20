from pydub import AudioSegment
from pydub.generators import Sine
from mido import  Message
import scoreRecognition.Enums.note as note
import scoreRecognition.Enums.tick as tick
import scoreRecognition.Enums.frequency as frequency

def word2midi(mid, track, words, melody):

    time_since_last_event = 0
    velocity = 64

    for word in words:
        component_type = word.split('-')
        if component_type[0] == 'note':
            note_type = component_type[1].split('_')
            dur = ''
            for i in range(len(note_type)):
                if i==0: pass
                if i==1: dur = note_type[i]
                else: dur += '_' + note_type[i]
            track.append(Message('note_on', note=getattr(note.notes,note_type[0]).value, velocity=velocity, time=int(time_since_last_event)))
            track.append(Message('note_off', note=getattr(note.notes,note_type[0]).value, velocity=velocity, time=int(mid.ticks_per_beat*getattr(tick.ticks, dur).value)))
            time_since_last_event = 0
            
            # tone = Sine(getattr(frequency.frequency,note_type[0]).value * 10).to_audio_segment(duration=int(mid.ticks_per_beat*getattr(tick.ticks, dur).value)).fade_in(10).fade_out(100)
            # melody = melody + tone
        if component_type[0] == 'rest':
            time_since_last_event += int(getattr(tick.ticks,component_type[1]).value)
            
            # rest = AudioSegment.silent(duration=int(getattr(tick.ticks,component_type[1]).value))
            # melody = melody + rest
        
    return melody

