invitation.m4a is the invitation's ambient track.

Extracted from a video the couple supplied, re-encoded to AAC at 96 kbps —
1.06 MB for 1:49. Kept as AAC rather than MP3 because the source was already
AAC, so this avoids a second lossy hop through a different codec.

It is loaded at runtime from /music/invitation.m4a and starts on the envelope
tap, which satisfies browser autoplay policies. If the file is absent the site
stays silent — nothing breaks. It loops, and guests can mute it with the
control in the corner.

To replace it: drop a new file here under the same name, or change MUSIC_SRC
in src/lib/music.ts.
