import test from 'node:test';import assert from 'node:assert/strict';import { isPrivateIp, assertPublicUrl, checkLink } from '../src/link-checker.js';
test('identifica IPs privados',()=>{assert.equal(isPrivateIp('127.0.0.1'),true);assert.equal(isPrivateIp('192.168.1.8'),true);assert.equal(isPrivateIp('8.8.8.8'),false);});
test('bloqueia resolução privada',async()=>{await assert.rejects(assertPublicUrl('https://internal.test',async()=>[{address:'10.0.0.2',family:4}]),/privado/);});
test('retorna status de link público',async()=>{const r=await checkLink('https://example.com',{lookup:async()=>[{address:'93.184.216.34',family:4}],fetchImpl:async()=>({status:204})});assert.equal(r.ok,true);assert.equal(r.status,204);});
