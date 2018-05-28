
var midi = {};

const MIDI_INPUTS = [
  'Launchkey MK2 49 Launchkey MIDI',
  'Launchpad Mini',
  'Scarlett 2i4 USB',
  'TouchOSC Bridge',
  // 'IAC Driver Bus 1'  // can cause feedback
];

const MIDI_OUTPUT = "IAC Driver Bus 1";

var mstate = {
  notes: {},
  sliders: {}, // defaults
  buttons: {}
};

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
    .then(midiAccess => {
      midi.inputs = midiAccess.inputs;
      midi.outputs = midiAccess.outputs;

      for (var input of midiAccess.inputs.values()){
        if( MIDI_INPUTS.includes(input.name) ){
          input.onmidimessage = gotMIDI;
          console.log('input:', input.name);
        }
      }

      for (var output of midiAccess.outputs.values()){
        if( output.name === MIDI_OUTPUT ){
          midi.out = output;
          console.log('output', output);
        }
      }

    },
    fail => console.log('midi connection failure', fail)
    );
  } else {
    console.log('WebMIDI is not supported in this browser.');
  }


function gotMIDI(m){
  let [cmd, note, vel] = m.data;

  if(DEBUG) console.log('MIDI', {cmd, note, vel});

  // check type of MIDI message, and store normalised value in mstate object
  switch(cmd){
    case 144:
    case 128:
    case 153:
    case 137:
    // note ON/OFF
      mstate.notes[note] = vel/127.0;
      // midi.out.send([144, note, vel]);  // TO SEND A NOTE
      break;
    case 176:
    // slider/buttons
      mstate.sliders[note] = vel/127.0;
      break;
  }
  // console.log(mstate.notes, mstate.sliders, mstate.buttons);
}
