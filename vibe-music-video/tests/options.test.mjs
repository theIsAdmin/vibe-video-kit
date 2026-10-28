import test from 'node:test';
import assert from 'node:assert/strict';
import {clipRange,loadProject,parse} from '../scripts/options.mjs';
test('Full example retains all 1278 frames; excerpt keeps its global offset',()=>{
 const {project,timing}=loadProject();
 const full=clipRange('render',timing,project),clip=clipRange('preview',timing,project);
 assert.equal(full.last-full.first+1,1278);assert.equal(clip.first,258);assert.equal(clip.last-clip.first+1,125);
 assert.equal(clip.start,8.6);assert.equal(clip.duration,125/30);
});
test('Invalid clip requests fail before rendering',()=>{
 const {project,timing}=loadProject();
 for(const opts of [{start:'-1'},{duration:'0'},{start:'50'},{duration:'NaN'},{start:'42.59',duration:'.001'}])assert.throws(()=>clipRange('render',timing,project,opts));
});
test('Missing CLI values are errors, including paths with spaces as one argument',()=>{
 assert.deepEqual(parse(['--out','outputs/my preview']),{out:'outputs/my preview'});
 assert.throws(()=>parse(['--project']));assert.throws(()=>parse(['--out','--project','demo']));
});
