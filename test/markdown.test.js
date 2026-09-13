import test from 'node:test';import assert from 'node:assert/strict';import { renderMarkdown, extractLinks, slugify } from '../public/markdown.js';
test('gera headings e sumário',()=>{const r=renderMarkdown('# Olá Mundo\n## Parte 1');assert.match(r.html,/id="ola-mundo"/);assert.equal(r.toc.length,2);});
test('escapa HTML bruto',()=>{const r=renderMarkdown('<script>alert(1)</script>');assert.doesNotMatch(r.html,/<script>/);assert.match(r.html,/&lt;script&gt;/);});
test('bloqueia protocolos perigosos',()=>{const r=renderMarkdown('[x](javascript:alert(1))');assert.match(r.html,/#blocked-link/);});
test('renderiza listas e code fences',()=>{const r=renderMarkdown('- um\n- dois\n```js\nconst x=1;\n```');assert.match(r.html,/<ul>/);assert.match(r.html,/language-js/);});
test('extrai links markdown',()=>assert.deepEqual(extractLinks('[A](https://a.com) e [B](#b)'),[{label:'A',href:'https://a.com'},{label:'B',href:'#b'}]));
test('slug remove acentos',()=>assert.equal(slugify('Seção Útil'),'secao-util'));
