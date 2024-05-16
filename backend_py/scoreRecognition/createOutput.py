import subprocess

def convert_midi_to_wav(midi_path, wav_path):
    try:
        result = subprocess.run(['timidity', midi_path, '-Ow', '-o', wav_path], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print(f"Conversion successful: {result.stdout}")
    except subprocess.CalledProcessError as e:
        print(f"Error converting MIDI to WAV: {e.stderr}")

def midi_to_ly(midi_path, ly_path):
    try:
        subprocess.run(['midi2ly', midi_path, '-o', ly_path], check=True)
        print(f"MIDI to LilyPond conversion successful: {midi_path} -> {ly_path}")
        with open(ly_path, 'r+') as file:
            content = file.read()
            file.seek(0, 0)
        print(f"Added \\version declaration to: {ly_path}")
    except subprocess.CalledProcessError as e:
        print(f"Error converting MIDI to LilyPond: {e}") 

def ly_to_png(ly_path, output_base):
    try:
        subprocess.run(['lilypond', '--png', '-o', output_base, ly_path],  check=True, stderr=subprocess.PIPE)
        print(f"LilyPond to PNG conversion successful: {ly_path} -> {output_base}.png")
    except subprocess.CalledProcessError as e:
        if e.stderr:
            print(f"Error converting LilyPond to PNG: {e}\nSTDERR: {e.stderr.decode()}")
        else:
            print(f"Error converting LilyPond to PNG: {e}")

def createEmptyScore(output_base):
    empty_score = """
    \\version "2.14.0"

    \\relative c' {
    R1*4
    }
    """

    with open("empty_score.ly", "w") as f:
        f.write(empty_score)

    import subprocess
    subprocess.run(['lilypond', '--png', '-o', 'output', output_base], check=True)