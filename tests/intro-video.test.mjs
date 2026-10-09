import test from 'node:test';
import assert from 'node:assert/strict';
import { introVideoReady, youtubeVideoId } from '../src/intro-video.mjs';

test('YouTube links accept unlisted share URLs and reject unrelated or malformed hosts', () => {
  const id = 'AbC_123-xyz';
  for (const value of [`https://youtu.be/${id}?si=share`, `https://www.youtube.com/watch?v=${id}&feature=share`, `https://youtube.com/embed/${id}`, `https://m.youtube.com/shorts/${id}`, `https://www.youtube-nocookie.com/embed/${id}`]) assert.equal(youtubeVideoId(value), id);
  for (const value of ['http://youtu.be/AbC_123-xyz', 'https://youtube.com.evil.test/watch?v=AbC_123-xyz', 'https://evil.test/watch?v=AbC_123-xyz', 'https://user:secret@youtube.com/watch?v=AbC_123-xyz', 'https://youtube.com:8443/watch?v=AbC_123-xyz', 'https://youtu.be/short', 'javascript:alert(1)']) assert.equal(youtubeVideoId(value), '');
});
test('Intro placeholder remains until an approved, accessible video is ready', () => {
  const youtube = { approved: true, video: 'https://youtu.be/AbC_123-xyz', transcript: 'Approved transcript', captions: '' };
  assert.equal(introVideoReady(youtube), true);
  assert.equal(introVideoReady({ ...youtube, approved: false }), false);
  assert.equal(introVideoReady({ ...youtube, video: '' }), false);
  assert.equal(introVideoReady({ ...youtube, transcript: '' }), false);
  assert.equal(introVideoReady({ ...youtube, video: 'https://youtube.com/watch?v=invalid', captions: '/captions.vtt' }), false);
  const file = { ...youtube, video: '/video/intro.mp4' };
  assert.equal(introVideoReady(file), false);
  assert.equal(introVideoReady({ ...file, captions: '/captions.vtt' }), true);
});
