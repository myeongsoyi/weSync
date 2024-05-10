import mido
from mido import MidiFile, MidiTrack, Message, MetaMessage
import scoreRecognition.Enums.note as note
import scoreRecognition.Enums.tick as tick

def word2midi(mid, track, words):

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
        if component_type[0] == 'rest':
            time_since_last_event += int(getattr(tick.ticks,component_type[1]).value)
            print("rest =>",time_since_last_event)
