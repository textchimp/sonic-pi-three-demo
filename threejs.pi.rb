use_osc 'localhost', 57121  # Node-websocket bridge

Z = 0.25
@bpm = 60

live_loop :metro do
  use_bpm @bpm
  cue :beat, tick
  sleep Z
end

live_loop :synth do
  t, *_ = sync :beat

  use_synth :pulse
  notes = scale(:c, :minor_pentatonic) + [:rest] * 10
  play notes.choose,
    attack: 0.2, #2
    release: 0.2,
    pan: rrand(-1, 1)
end # :synth

live_loop :drums do
  t, *_ = sync :beat

  if spread(6, 15).tick   # 4/9 is good
    sample :bd_klub, amp: 2
    osc '/bass', t
  end

end #:drums

live_loop :osc do
  type, val = sync "/osc/controls"
  # @c[type.to_s] = val
  case type
  when 'bpm'
    @bpm = val
  when 'play'
      play 60 if val
  end
end
