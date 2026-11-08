# Security review: mirroring (`6a68498`)

Reviewed at `fbfef5c` on `feat/roadmap-next-up`, against decision 88 and rows 68, 71, 73, 74 and AGENTS.md rule 5.
No file in a repo changed. Line numbers are at `fbfef5c`.

## Verdict

Mirroring can stay on the branch; nothing needs reverting.

- Critical: none. High: none.
- A follower or phone cannot forge a mirror op. No message string reaches markup. The receiver's memory stays bounded.
- Fix M1 and M2 before this reaches `main`. M2 is also an ordinary bug: an honest follower joining during a pen stroke triggers it.
- M3 predates this commit, and it now delays mirror frames as well.

## Findings

### M1. Medium: one hello per 2 s makes every follower's marks clear and redraw

`src/remote/host.ts:343`, `:271-279`; `src/annotate/mirrorFeed.ts:162-166`; `src/annotate/mirrorStore.ts:85`; `src/annotate/mirrorView.ts:158-161`, `:181`

**Attack.** Anyone with a follow link seals `{type:"hello",role:"follower",id}` under the view key every 2 s, about one small frame each time. The throttle holds: one resync per 2 s. But each resync is a broadcast that starts with `clear`, then resends every stroke of the current slide, and each frame is signed.

Cost of one resync, measured with real AES-GCM and ECDSA frames built from the feed's own ops:

| Current slide | Frames | Bytes |
| --- | --- | --- |
| 20 strokes of 1500 points (the receiver's limit) | 242 | 496,244 |
| 10 strokes of 150 points | 22 | 28,488 |
| 5 strokes of 60 points | 7 | 6,549 |

**Effects**

- Worst case, the presenter uploads about 250 KB/s. With 40 followers the relay sends about 10 MB/s. The relay has no rate limit (`worker/room.ts:137-148`; no limit anywhere in `worker/`).
- The client never checks `bufferedAmount` (`src/remote/client.ts:357`). On an uplink under about 2 Mbit/s the backlog grows, and slide state queues behind it. The attacker cannot add marks, so the cost depends on what the presenter has drawn.
- `clear` empties the slide in the store at once, and the view redraws 16 ms later. A render that lands between `clear` and the last stroke removes those marks from the SVG until they arrive. Sealing 242 frames took 59 ms in Node, and a follower also decrypts and verifies each one, so a large resync spans several renders. Expect the marks to blink. I inferred this from the code and did not observe it in a browser.

Decision 88's claim that "followers that already have the marks lose nothing" is false (see also M2).

**Suggested fix** (needs a decision row refining 88)

1. Make the resync non-destructive. Send the strokes first with `from` 0, which already replaces by id, then a closing op such as `{op:"keep", slide, ids}` in place of the leading `clear`. At most 200 ids fit a frame.
2. Scale the gap to what was sent: `max(2 s, bytes / 64 KB/s)`, so the worst case above recurs about every 8 s.

A smaller option with no schema change: have the view hold off rendering for about 100 ms after a `clear`. That reduces the blink but not the traffic.

### M2. Medium: a resync during a pen stroke truncates that stroke on every follower

`src/annotate/mirrorFeed.ts:165`, with `:250-252`, `:264` and `src/annotate/mirrorStore.ts:125`

**Attack or accident.** Any hello while the presenter is drawing does it, including an honest late joiner. `resync` sends the live stroke from 0 up to all its current points but does not move `live.sent`. Whenever points were recorded since the last 80 ms flush, receivers now hold more numbers than `sent`. Every later chunk then has `from = sent`, which does not equal what they hold, so `mirrorStore.ts:125` drops it. The commit chunk is dropped the same way. The `marks` report does not repair it, because the id is already in `known`.

**Confirmed by probe**, running the real `MirrorFeed` and `MirrorStore`:

- With a resync at 60 of 200 numbers, the receiver ended with 60 of 200, even after the commit and the marks report.
- The control run with no resync ended with 200 of 200.

The stroke stays cut until the next resync or until the presenter comes back to that slide. So a follower can remove part of what the audience sees, without forging anything. The shared `sent` also means a resync to the presenter window alone (`bridge.ts:122`) cuts the stroke there, but not for followers.

**Related ghost mark, also confirmed.** If a resync lands before the first flush and the stroke is then cancelled, the id is not in `known`, so `cancel` sends no `drop` (`mirrorFeed.ts:276-277`). Receivers keep a stroke that the presenter abandoned.

**Why the tests miss it.** The model check at `mirrorFeed.test.ts:379-464` only uses committed strokes, and the test at `:279` only inspects the resync's own ops.

**Suggested fix.** Resync only what every sink has already been sent; the next flush sends the rest from `sent`:

```ts
for (const [id, live] of this.live) {
  if (live.slide !== slide) continue;
  const points = live.points.slice(0, live.sent);
  if (points.length > 0) this.sendChunks(emit, slide, { id, ...live, points }, 0, false);
}
```

This also removes the ghost, since nothing unsent goes out. Add in-progress strokes, cancels and resyncs to the model check.

### M3. Medium, predates this commit: hello-triggered states have no throttle

`src/remote/host.ts:342`. This copy leaves out the attack text: the same code is on `emindeniz99/docwalk`'s `main`, and `SECURITY.md` there asks for private reports. The fork owner keeps the full text.

**Suggested fix.** Coalesce hello-triggered states: one at once, then at most one trailing state per 250 ms. Slide changes keep sending immediately.

### L1. Low: the bridge resync has no throttle

`src/presenter/bridge.ts:122`

**Attack.** A hostile same-origin script loops `{type:"hello",resync:true}` on `docwalk-presenter`. Each message costs the audience tab up to 242 posts (the frame count measured in M1) plus the full `state` post. Decision 88 says the window asks "once", but only the honest window behaves that way; nothing enforces it. This needs script on the origin, which already has much worse options. Plain hellos already forced the full-document post.

**Suggested fix.** Apply the same 2 s gap, moving `RESYNC_MIN_GAP_MS` to `mirrorTypes.ts`.

### L2. Low: frames from an earlier presenter session can be replayed for longer than documented

`src/remote/client.ts:213`, `src/remote/replay.ts:23-25`; wording in decision 88 (5) and `SECURITY.md:67-69`

**Attack.** A follower records signed frames. The presenter reloads its tab, which creates a new sender id. Any follower that never saw the old sender accepts those frames, re-sealed under the view key, at any later time, because the guard is per sender. The joiner's own resync does not protect it, since the replay can come after that resync.

- A replayed stroke stays until that slide's next `clear` or a resync. The presenter's next stroke does not remove it, so "until the presenter's next one" is too short for marks.
- A replayed `focus-open` holds the view open until Escape or the next resync.
- Within one session the high-water guard limits this: once the joiner has a live frame, older ones are dropped, and its resync wipes anything that came first.

This is the class decision 88 accepts, but it is wider than the text says. I confirmed it by reading the code; I did not run it end to end.

**Suggested fix.** Make the presenter's counter monotonic across reloads, for example by keeping the sender and counter with the room in `sessionStorage`. Followers then keep one high-water mark for all signed frames, not one per sender. Update the wording either way.

## Claims in decision 88 that are false or imprecise

| Claim | What the code does |
| --- | --- |
| "followers that already have the marks lose nothing" | False. See M1 (marks removed until they arrive again) and M2 (the stroke in progress is cut). |
| "Receivers keep at most 16 slides ... anything above is ignored" (also `mirrorTypes.ts:28`) | For slides, false. The 17th slide evicts the least recently touched one (`mirrorStore.ts:137-140`). Stroke and point limits do ignore. Harmless; the text should say so. |
| "until the presenter's next one" (also `SECURITY.md:67-69`) | Too short for marks. See L2. |
| "a late joiner" | Also applies to a follower that missed frames while reconnecting. A relay can do the same replay without any key, because frames above a receiver's high-water mark pass. Row 68 partly covers this. |
| "about 1.5 KB each" | A full 128-point chunk measured about 2.1 KB as a frame. No consequence. |
| "a follower can neither send nor sign one" (`SECURITY.md:56`) | It can re-send one the presenter signed, as the known limits lower in that file say. |

## Checked and held

**Forgery**

- A follower takes `mirror` only with a verified signature (`client.ts:318-323`).
- The presenter takes only a follower's hello under the view key (`client.ts:313`) and ignores `mirror` under the control key (`host.ts:377`).
- Phones and agents hold no view key. A phone-sealed `mirror` under the control key reaches other phones and agents and is ignored there (`RemoteView.tsx:70`, `mcp/src/room.ts:197`).
- The signature covers a label, room, sender, counter and the raw message (`crypto.ts:369-371`), and `type` keeps state and mirror apart.
- An unsigned or wrong-key frame does not move the guard, so it cannot suppress the presenter's frames.

**Phone laser.** It reaches followers only as the presenter's own signed op, with validated 0..1 numbers, throttled twice.

**Schemas (`mirrorSchema.ts`)**

- Every op is a strict object.
- `Unit`, `Pan` and the scale check finiteness; `Coord`, `StrokeId`, `from` and `diagram` are integers with bounds, which rejects NaN and Infinity.
- Points are at most 256 numbers in pairs, `from` is even, ids are at most 64, addresses are 1 to 2048 characters.

**DOM**

- No message string reaches markup. `slide` is only compared (`RemoteFollower.tsx:26`, `mirrorView.ts:137`) or used in a local key.
- `dataset` gets a number and two picklist values.
- `d` and the arrow attributes are built from numbers.
- The laser's style values are validated numbers.
- Colours map to tokens in `mirror.css`.
- The focus view clones the receiver's own sanitized SVG.

**Receiver bounds**

- Probe: 192,000 hostile ops across 40 slides kept 16 slides. One slide held 30,000 points, and its longest stroke held 1500.
- The 200-stroke check is at `mirrorStore.ts:121`, read but not exercised by my probe, which hit the points limit first.
- Upper bound is about 7.7 MB of numbers in total.
- Per-op work is linear in what the slide holds, and redraws are coalesced on a timer.

**Chunks.** A wrong `from`, a changed colour or tool, or an unknown id with `from` above 0 are all ignored (probe).

**Frame size.** The largest valid frame measured 10,303 bytes (2048 three-byte address characters plus a full chunk), and the largest `drop` 9,431, against the 16,384 cap. An oversized `mirror` cannot be split (`parts.ts:35`, `:50`).

**BroadcastChannel as a hostile source.** Audience windows accept only `hello`, `goto` and `step`. Presenter windows parse `mirror` strictly into a bounded store. Nothing flows back into the room.

**View key's reach.** It gains marks and laser to read, and the hello-triggered resync (M1). It gains nothing else: no way to steer the deck or reach agent traffic.

**Rule 8.** No sink exists without a room or a presenter window, so no new outbound call appears.

**Not new, not listed as findings.** The reviewer also noted two older items that predate this commit and are on `emindeniz99/docwalk`'s `main`. This copy leaves them out for the reason given under M3, and decision 71 already records that it does not cover frame rate. The fork owner keeps the full text.

**Not security, noted in passing.** The redraw signature in `mirrorView.ts:142` omits the points, so a same-id, same-length replacement inside one 16 ms window keeps the old path. This is rare, for example after a presenter reload resets ids.

## Not checked

- Nothing ran in a browser, and I ran no test suite, e2e spec or gate. The M1 blink and all follower CPU and network costs on real devices are inferred or measured in Node only.
- The probe ran `mirrorFeed.ts` and `mirrorStore.ts` from memory in Node (scenarios above). It did not cover `client.ts`, `host.ts` or `mirrorView.ts`.
- Cloudflare's platform limits or billing under the M1 burst.
- The internals of valibot, perfect-freehand, drauu and Panzoom. I assumed `getStroke` is linear and did not test it with hostile input, and I did not test Panzoom's `force: true` at extreme values.
- `mcp/dist/docwalk-mcp.js` against its source, and `src/presenter/window.ts`.
- The focus view outside the mirrored path.
